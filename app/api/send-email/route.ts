import { getAuthenticatedUser, handleUnauthorized } from "@/lib/authUtils"
import { createTransporter, verifySmtpCredentials } from "@/lib/nodemailer"
import { supabase } from "@/lib/supabse"
import { parseTemplate } from "@/lib/templateParser"
import { EmailTemplate } from "@/lib/type"
import { NextRequest, NextResponse } from "next/server"
import CryptoJS from 'crypto-js';
import sanitizeHtml from 'sanitize-html';
import { getBlackListByEmail } from "@/lib/blackList"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { emailId, templateId } = body;


        const user = await getAuthenticatedUser(request);


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
        console.log(body, "This is email id")
        // Fetch the email address using emailId
        const { data: emailData, error: emailError } = await supabase
            .from('emails')
            .select('email, sent')
            .eq('id', emailId)
            .eq('sent', false)  // Ensure you only get emails where 'sent' is false
            .single()

        const blackList = await getBlackListByEmail(emailData?.email, user.id);

        console.log(blackList, "This is black list")
        if (blackList) {
            return NextResponse.json({ error: 'Email is in blacklist' }, { status: 400 })
        }



        if (emailError) throw emailError
        if (!emailData?.email) throw new Error('Email not found')
        console.log(emailData, "this is emila data")
        // Fetch the email template
        const { data: template, error: templateError } = await supabase
            .from('email_templates')
            .select('html, subject')
            .eq('id', templateId)

            .single<EmailTemplate>()

        if (templateError) throw templateError
        console.log(template, "Thisis template")




        const transporter = createTransporter(user.email, decryptedSmtpPassword);
        const sanitized = sanitizeHtml(template.html)

        // Send email
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: emailData.email,
            subject: template?.subject,
            html: sanitized,

        })

        // Update email status
        await supabase
            .from('emails')
            .update({ sent: true, status: "sent" })
            .eq('id', emailId)

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Email sending error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send email' },
            { status: 500 }
        )
    }
}