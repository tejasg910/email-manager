import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabse';
import { createTransporter } from '@/lib/nodemailer';
import CryptoJS from 'crypto-js';

export const runtime = 'nodejs';

interface JobPayload {
  from: string;
  email: string;
  encryptedPassword: string;
  emailId: string;
  campaignId: string;
  templateHtml: string;
  subject: string;
}

async function handler(request: NextRequest) {
  const body: JobPayload = await request.json();
  const { from, email, encryptedPassword, emailId, templateHtml, subject } = body;

  await supabase
    .from('emails')
    .update({ status: 'sending', updated_at: new Date().toISOString() })
    .eq('id', emailId);

  try {
    const password = CryptoJS.AES.decrypt(encryptedPassword, process.env.ENCRYPTION_KEY!).toString(CryptoJS.enc.Utf8);
    const transporter = createTransporter(from, password);

    await transporter.sendMail({ from, to: email, subject, html: templateHtml });

    await supabase
      .from('emails')
      .update({ sent: true, status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', emailId);

    return NextResponse.json({ success: true, emailId });
  } catch (error) {
    await supabase
      .from('emails')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', emailId);

    // Return 500 so QStash retries
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
