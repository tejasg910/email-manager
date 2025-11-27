// lib/queue.ts
import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import { supabase } from './supabse';
import nodemailer from "nodemailer"
// Make sure queue is singleton across hot reloads
let emailQueue: Queue;
let queueEvents: QueueEvents;
let worker: Worker | undefined;

export function getQueue(createTransporter: (smtpUser: string, smtpPass: string) => nodemailer.Transporter) {
    if (!emailQueue) {
        emailQueue = new Queue('email-queue', {
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
                password: process.env.REDIS_PASSWORD
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 60000
                },
                removeOnComplete: true,
                removeOnFail: false
            }
        });


        emailQueue.getJobCounts().then(counts => {
            console.log('Current queue status:', counts);
        });

        queueEvents = new QueueEvents('email-queue', {
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
                password: process.env.REDIS_PASSWORD
            }
        });
        queueEvents.on('waiting', ({ jobId }) => {
            console.log(`Job ${jobId} has been added to the queue`);
        });
        queueEvents.on('active', ({ jobId }) => {
            console.log(`⚡ Processing job ${jobId}`);
        });
        queueEvents.on('completed', ({ jobId }) => {
            console.log(`✓ Job ${jobId} completed successfully`);
        });
        queueEvents.on('failed', ({ jobId, failedReason }) => {
            console.error(`⨯ Job ${jobId} failed:`, failedReason);
        });


        if (process.env.NODE_ENV !== 'production') {
            worker = new Worker('email-queue', async (job) => {
                const { email, templateHtml, subject, emailId, from, password } = job.data as {
                    email: string; templateHtml: string; subject: string; emailId: string; from: string; password: string;
                };
                try {
                    const transporter = await createTransporter(from, password);

                    await supabase
                        .from('emails')
                        .update({ status: 'sending', updated_at: new Date().toISOString() })
                        .eq('id', emailId);

                    await transporter.sendMail({ from, to: email, subject, html: templateHtml });

                    await supabase
                        .from('emails')
                        .update({ sent: true, status: 'sent', sent_at: new Date().toISOString() })
                        .eq('id', emailId);

                    return { success: true, emailId };
                } catch (error) {
                    await supabase
                        .from('emails')
                        .update({ status: 'failed' })
                        .eq('id', emailId);
                }
            }, {
                connection: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || '6379', 10),
                    password: process.env.REDIS_PASSWORD
                },
                concurrency: 10
            });
        }

    }

    return emailQueue;
}
