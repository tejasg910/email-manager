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

        // Add event listeners (only added once due to singleton)
        emailQueue.on('completed', (job) => {
            console.log(`✓ Email ${job.data.emailId} sent successfully`);
        });

        emailQueue.on('failed', (job, error) => {
            console.error(`⨯ Email ${job.data.emailId} failed:`, error);
        });

        emailQueue.on('error', (error) => {

            console.error('Email queue error:', error);
        })

        // Process jobs
        emailQueue.process(async (job) => {
            const { email, templateHtml, subject, emailId, from, password } = job.data;

            try {
                console.log('Creating transporter with:', { from, passwordLength: password.length });
                console.log('Attempting to send email:', { to: email, from, password });
                const transporter = await createTransporter(from, password);
                console.log('Attempting to send email:', { to: email, from, password, emailId });

                // Update status to sending
                await supabase
                    .from('emails')
                    .update({ status: 'sending' })
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
                console.error('Detailed email send error:', {
                    emailId,
                    error: error instanceof Error ? error.message : error,
                    stack: error instanceof Error ? error.stack : 'No stack trace'
                });
                await supabase
                    .from('emails')
                    .update({
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Send failed'
                    })
                    .eq('id', emailId);

                throw error;
            }
        });
    }

    return emailQueue;
}