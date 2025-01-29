import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { getQueue } from '@/lib/que';
import { supabase } from '@/lib/supabse';
import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import { createTransporter, verifySmtpCredentials } from '@/lib/nodemailer';
import CryptoJS from 'crypto-js';

// Cache SMTP verification results
const smtpVerificationCache = new Map<string, { isValid: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function verifySMTPWithTimeout(email: string, password: string): Promise<boolean> {
  // Check cache first
  const cacheKey = `${email}:${password}`;
  const cachedResult = smtpVerificationCache.get(cacheKey);

  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
    return cachedResult.isValid;
  }

  try {
    // Set a timeout for SMTP verification
    const verificationPromise = verifySmtpCredentials(email, password);
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('SMTP verification timeout')), 10000); // 10 second timeout
    });

    const isValid = await Promise.race([verificationPromise, timeoutPromise]);

    // Cache the result
    smtpVerificationCache.set(cacheKey, {
      isValid: isValid,
      timestamp: Date.now()
    });

    return isValid;
  } catch (error) {
    // Cache the failed result too
    smtpVerificationCache.set(cacheKey, {
      isValid: false,
      timestamp: Date.now()
    });
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { emailId, templateId } = await request.json();
    const campaignId = crypto.randomUUID();
    console.log("came in api ")
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template is not selected' },
        { status: 400 }
      );
    }
    console.log("came after template id  ")

    // Run authentication and data fetching in parallel
    const [user, templateData, emailsData] = await Promise.all([
      getAuthenticatedUser(request),
      supabase
        .from('email_templates')
        .select('html, subject')
        .eq('id', templateId)
        .single(),
      supabase
        .from('emails')
        .select('*')
        .in('id', emailId)
    ]);
    console.log("got data user templatedata emails data ", user, templateData, emailsData)

    // Handle authentication
    if (!user) {
      handleUnauthorized();
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      );
    }
    if (!user.smtp_password) {
      return NextResponse.json(
        { error: 'Please add smtp password' },
        { status: 400 }
      );
    }


    console.log("checked user creetainsl")

    // Handle data fetching errors
    if (templateData.error) throw templateData.error;
    if (emailsData.error) throw emailsData.error;
    if (!emailsData.data?.length) throw new Error('No emails found');
    console.log("valided all teh template and email data")

    const template = templateData.data;
    const emails = emailsData.data;

    // Decrypt SMTP password
    const decryptedSmtpPassword = CryptoJS.AES.decrypt(
      user.smtp_password,
      process.env.ENCRYPTION_KEY!
    ).toString(CryptoJS.enc.Utf8);
    console.log("descriptioned the password", decryptedSmtpPassword)

    // Verify SMTP with timeout and caching
    const isSmtpValid = await verifySMTPWithTimeout(user.email, decryptedSmtpPassword);
    if (!isSmtpValid) {
      return NextResponse.json(
        { error: 'Invalid SMTP credentials. Please check your email and password.' },
        { status: 400 }
      );
    }
    console.log("verified the smpt valid", isSmtpValid)

    // Initialize queue and prepare email content
    const queue = getQueue(createTransporter);
    console.log("get the que")

    const sanitized = sanitizeHtml(template.html);
    console.log("before the the performaing promise")

    // Update status and queue emails in parallel
    await Promise.all([
      // Update status
      supabase
        .from('emails')
        .update({
          status: 'queued',
          campaign_id: campaignId,
          queued_at: new Date().toISOString()
        })
        .in('id', emailId),

      // Queue emails
      ...emails.map(email =>
        queue.add({
          from: user.email,
          email: email.email,
          password: decryptedSmtpPassword,
          emailId: email.id,
          templateHtml: sanitized,
          subject: template?.subject || 'Application for Software Engineer',
        }, {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 60000
          },
          timeout: 30000 // 30 seconds
        })
      )
    ]);

    console.log("compelted teh promise")



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