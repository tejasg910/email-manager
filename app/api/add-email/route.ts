// pages/api/add-emails.ts
import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { supabase } from '@/lib/supabse'
import { Console } from 'console';
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }
    const user = await getAuthenticatedUser(req)
    if (!user) {
        handleUnauthorized()
        return NextResponse.json(
            { error: 'Unauthorized: User not authenticated or not found in Supabase' },
            { status: 401 }
        );
    }
    const data = await req.json();


    const { emails } = data

    console.log(emails.length)
    try {
        const { data: existingEmails } = await supabase
            .from('emails')
            .select('email')
            .in('email', emails)

        // Filter out existing emails
        const existingEmailSet = new Set(existingEmails?.map(e => e.email))
        const newEmails = emails.filter((email: string) => !existingEmailSet.has(email))

        if (newEmails.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'All emails already exist',
                addedEmails: [],
                skippedEmails: emails
            }, { status: 400 })
        }

        const emailRecords = newEmails.map((email: string) => ({
            email,
            sent: false,
            user_id: user.id
        }))

        const { data, error } = await supabase
            .from('emails')
            .insert(emailRecords)
            .select()

        if (error) throw error

        return NextResponse.json({
            success: true,
            data,
            addedEmails: newEmails,
            skippedEmails: emails.filter((email: string) => existingEmailSet.has(email))
        }, { status: 200 })
    } catch (error) {

        console.log(error)
        return NextResponse.json({ error: 'Failed to add emails' }, { status: 500 })
    }
}