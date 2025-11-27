import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { getQueue } from '@/lib/que';
import { supabase } from '@/lib/supabse';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import sanitizeHtml from 'sanitize-html';
import { createTransporter, verifySmtpCredentials } from '@/lib/nodemailer';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';
type BulkPayload = { emailId: string[]; templateId: string };

export async function POST(request: NextRequest) {
  try {
    const { emailId, templateId }: BulkPayload = await request.json();
    const campaignId = randomUUID();
console.log(emailId, "this is email id")


    if (!templateId) {
      return NextResponse.json(
        { error: 'Template is not selected' },
        { status: 400 }
      );
    }
console.log("before user")

    const user = await getAuthenticatedUser(request)
    if (!user) {
      handleUnauthorized()
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated or not found in Supabase' },
        { status: 401 }
      );
    }

    console.log("before smtp password")
    if (!user.smtp_password) {
      return NextResponse.json(
        { error: 'Please add smtp pasword' },
        { status: 400 }
      );
    }
    console.log("before decrypted smtp password")

    const decryptedSmtpPassword = CryptoJS.AES.decrypt(
      user.smtp_password,
      process.env.ENCRYPTION_KEY!
    ).toString(CryptoJS.enc.Utf8);
    console.log("before is smtp valid")
    const isSmtpValid = await verifySmtpCredentials(user.email, decryptedSmtpPassword);
    if (!isSmtpValid) {
      return NextResponse.json(
        { error: 'Invalid SMTP credentials' },
        { status: 400 }
      );
    }
    console.log("before getting emails")

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('html, subject')
      .eq('id', templateId)
      .single();
    console.log(templateError, "this is template error ")
    if (templateError) throw templateError;
    console.log(template, "this is template")
    // Get emails
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('*')
      .in('id', emailId);

    if (emailsError) throw emailsError;
    if (!emails?.length) throw new Error('No emails found');
    console.log(
      "before update"
    )
    // Mark emails as queued
    await supabase
      .from('emails')
      .update({
        status: 'queued',
        campaign_id: campaignId,
        queued_at: new Date().toISOString()
      })
      .in('id', emailId);


    console.log("before que")


    const queue = getQueue(createTransporter);


    const sanitized = sanitizeHtml(template?.html ?? '')
    const jobs = emails.map((email: { id: string; email: string }) => ({
      name: 'send-email',
      data: {
        from: user.email,
        email: email.email,
        password: decryptedSmtpPassword,
        emailId: email.id,
        campaignId: campaignId,
        templateHtml: sanitized,
        subject: template?.subject ? template?.subject : 'Application for Software Engineer',
      },
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000
        }
      }
    }));

    console.log(jobs.length, "this is jobs")
 
    if (jobs.length > 0) {
      for (const j of jobs) {
        (queue as any).add(j.name, j.data, j.opts).catch(console.error);
      }
    }

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
