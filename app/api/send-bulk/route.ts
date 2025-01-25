import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { getQueue } from '@/lib/que';
import { supabase } from '@/lib/supabse';
import { parseTemplate } from '@/lib/templateParser';
import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'dompurify'; // Install using: npm install dompurify
import sanitizeHtml from 'sanitize-html';
import { createTransporter, verifySmtpCredentials } from '@/lib/nodemailer';
import CryptoJS from 'crypto-js';

export async function POST(request: NextRequest) {
  try {
    const { emailId, templateId, resumeUrl, githubUrl } = await request.json();
    const campaignId = crypto.randomUUID();
 


    const user = await getAuthenticatedUser(request)
    if (!user) {
      handleUnauthorized()
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated or not found in Supabase' },
        { status: 401 }
      );
    }
    if (!user.smtp_password) {
      return NextResponse.json(
        { error: 'Please add smtp pasword' },
        { status: 400 }
      );
    }


    const decryptedSmtpPassword = CryptoJS.AES.decrypt(
      user.smtp_password,
      process.env.ENCRYPTION_KEY!
    ).toString(CryptoJS.enc.Utf8);

    const isSmtpValid = await verifySmtpCredentials(user.email, decryptedSmtpPassword);
    if (!isSmtpValid) {
      return NextResponse.json(
        { error: 'Invalid SMTP credentials' },
        { status: 400 }
      );
    }


    // Get template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('html, subject')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Get emails
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('*')
      .in('id', emailId);

    if (emailsError) throw emailsError;
    if (!emails?.length) throw new Error('No emails found');

    // Mark emails as queued
    await supabase
      .from('emails')
      .update({
        status: 'queued',
        campaign_id: campaignId,
        queued_at: new Date().toISOString()
      })
      .in('id', emailId);




    const sanitizedHtml = sanitizeHtml(template.html);

    const queue = getQueue(createTransporter);




    const jobs = emails.map(email => {

      return queue.add({
        from: user.email,
        email: email.email,
        password: decryptedSmtpPassword,
        emailId: email.id,
        templateHtml: sanitizedHtml,
        subject: template?.subject ? template?.subject : 'Application for Software Engineer',
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000
        }
      });
    });

    await Promise.all(jobs);

    return NextResponse.json({
      success: true,
      campaignId,
      queuedCount: emails.length
    });

  } catch (error) {
    console.error('Error queuing emails:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to queue emails' },
      { status: 500 }
    );
  }
}