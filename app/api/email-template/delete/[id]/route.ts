import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabse'
import { auth } from '@clerk/nextjs/server'
import { handleUnauthorized } from '@/lib/authUtils'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) {
            handleUnauthorized()
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', clerkId)
            .single()

        const { error } = await supabase
            .from('email_templates')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user?.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete template' },
            { status: 500 }
        )
    }
}