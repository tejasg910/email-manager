import { calculateRange } from '@/lib/pagination'
import { supabase } from '@/lib/supabse'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Get search params from the URL
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const { start, end } = calculateRange(page, limit)

        // Get total count
        const { count } = await supabase
            .from('emails')
            .select('*', { count: 'exact', head: true })
            .eq('sent', true)

        // Get paginated data
        const { data, error } = await supabase
            .from('emails')
            .select('*')
            .eq('sent', true)
            .range(start, end)
            .order('created_at', { ascending: false })

        if (error) {
            console.log(error)
            throw error
        }

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil((count || 0) / limit)
            }
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching emails:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch sent emails'
            },
            { status: 500 }
        )
    }
}