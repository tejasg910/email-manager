import { calculateRange } from '@/lib/pagination'
import { supabase } from '@/lib/supabse'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequest) {

    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    try {



        // Get paginated data
        const { data, error } = await supabase
            .from('emails')
            .select('*')
            .eq('sent', false)

            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({
            success: true,
            data,

        }, { status: 200 })
    } catch (error) {

        console.log(error, "this is error")
        return NextResponse.json({ error: 'Failed to fetch unsent emails' }, { status: 500 })
    }
}