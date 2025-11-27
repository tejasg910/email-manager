// lib/queue.ts
import Bull from 'bull';
import { supabase } from './supabse';
import nodemailer from "nodemailer"
// Make sure queue is singleton across hot reloads
let emailQueue: Bull.Queue;

export function getQueue(createTransporter: (smtpUser: string, smtpPass: string) => nodemailer.Transporter) {
    if (!emailQueue) {
        emailQueue = new Bull('email-queue', {
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT!),
                password: process.env.REDIS_PASSWORD
            },
            limiter: {
                max: 15, // Max jobs per time window
                duration: 60000 // Time window in ms (1 minute)
            }
        });


        emailQueue.getJobCounts().then(counts => {
            console.log('Current queue status:', counts);
        });

        // Log when jobs are added
        emailQueue.on('waiting', (jobId) => {
            console.log(`Job ${jobId} has been added to the queue`);
        });

        // Log job lifecycle
        emailQueue.on('active', (job) => {
            console.log(`⚡ Processing job ${job.id} for email ${job.data.emailId}`);
        });

        emailQueue.on('progress', (job, progress) => {
            console.log(`📈 Job ${job.id} is ${progress}% complete`);
        });

        emailQueue.on('completed', (job) => {
            console.log(`✓ Job ${job.id} completed successfully`);
        });

        emailQueue.on('failed', (job, error) => {
            console.error(`⨯ Job ${job.id} failed:`, error);
        });


        console.log('Registering queue processor...');

        // Process jobs
        emailQueue.process(async (job) => {
            const { email, templateHtml, subject, emailId, from, password } = job.data;

            try {
                console.log('Creating transporter with:', { from, passwordLength: password.length });
                console.log('Attempting to send email:', { to: email, from, password });
                const transporter = await createTransporter(from, password);
                console.log('Attempting to send email:', { to: email, from, password, emailId });

                await supabase
                    .from('emails')
                    .update({
                        status: 'sending',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', emailId);


                // Send email
                await transporter.sendMail({
                    from: from,
                    to: email,
                    subject,
                    html: templateHtml
                });
                console.log(emailId, "this is email id")
                // Update success status
                await supabase
                    .from('emails')
                    .update({
                        sent: true,
                        status: 'sent',
                        sent_at: new Date().toISOString()
                    })
                    .eq('id', emailId);

                return { success: true, emailId };
            } catch (error) {
                // Update failed status
                console.log(error, "This is error")
                await supabase
                    .from('emails')
                    .update({

                        status: 'failed',
                    })
                    .eq('id', emailId);




            }
        });


        console.log('Queue processor registered');

    }

    return emailQueue;
}
