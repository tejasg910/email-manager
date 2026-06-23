import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { qstashClient } from '@/lib/qstash';
import { supabase } from '@/lib/supabse';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import sanitizeHtml from 'sanitize-html';

export const runtime = 'nodejs';

type BulkPayload = { emailId: string[]; templateId: string };

export async function POST(request: NextRequest) {
  try {
    const { emailId, templateId }: BulkPayload = await request.json();
    const campaignId = randomUUID();

    if (!templateId) {
      return NextResponse.json({ error: 'Template is not selected' }, { status: 400 });
    }

    const user = await getAuthenticatedUser(request);
    if (!user) {
      handleUnauthorized();
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.smtp_password) {
      return NextResponse.json({ error: 'Please add smtp password' }, { status: 400 });
    }

    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('html, subject')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('*')
      .in('id', emailId);

    if (emailsError) throw emailsError;
    if (!emails?.length) throw new Error('No emails found');

    await supabase
      .from('emails')
      .update({ status: 'queued', campaign_id: campaignId, queued_at: new Date().toISOString() })
      .in('id', emailId);

    const sanitized = sanitizeHtml(template?.html ?? '');
    const workerUrl = `${process.env.APP_URL}/api/worker/send-email`;

    await qstashClient.batch(
      emails.map((email: { id: string; email: string }) => ({
        url: workerUrl,
        body: JSON.stringify({
          from: user.email,
          email: email.email,
          encryptedPassword: user.smtp_password,
          emailId: email.id,
          campaignId,
          templateHtml: sanitized,
          subject: template?.subject ?? 'Application for Software Engineer',
        }),
        headers: { 'Content-Type': 'application/json' },
        retries: 3,
      }))
    );

    return NextResponse.json({ success: true, campaignId, queuedCount: emails.length });

  } catch (error) {
    console.error('Error queuing emails:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to queue emails' },
      { status: 500 }
    );
  }
}
