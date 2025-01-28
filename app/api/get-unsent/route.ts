import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils'
import { calculateRange } from '@/lib/pagination'
import { supabase } from '@/lib/supabse'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

    if (req.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    try {


        const user = await getAuthenticatedUser(req);


        if (!user) {
            handleUnauthorized()
            return NextResponse.json(
                { error: 'Unauthorized: User not authenticated or not found in Supabase' },
                { status: 401 }
            );
        }


        // Get paginated data
        const { data, error } = await supabase
            .from('emails')
            .select('*')
            .eq('sent', false)
            .eq('user_id', user.id)

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