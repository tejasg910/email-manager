import { supabase } from '@/lib/supabse'
import { emailTemplates } from '@/lib/templateParser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {

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
