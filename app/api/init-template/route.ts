import { supabase } from '@/lib/supabse'
import { emailTemplates } from '@/lib/templateParser'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: NextApiRequest) {

    console.log(req.method, "this is method")
    if (req.method !== 'POST') return NextResponse.json({ error: 'Method not allowed' }, { status: 500 })

    try {

        const { data, error } = await supabase
            .from('email_templates')
            .insert(emailTemplates)
            .select()

        if (error) throw error
        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to initialize templates' }, { status: 500 })
    }
}