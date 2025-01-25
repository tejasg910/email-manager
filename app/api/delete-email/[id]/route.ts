import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabse'
import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
   

        const user = await getAuthenticatedUser(request)

        if (!user) {
            handleUnauthorized()
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('emails')
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