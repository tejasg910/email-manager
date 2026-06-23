import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabse'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'clear': {
        await supabase
          .from('emails')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .in('status', ['sending', 'queued'])
        return NextResponse.json({ message: 'Queue cleared' }, { status: 200 })
      }
      case 'reset': {
        await supabase
          .from('emails')
          .update({ status: 'queued' })
          .in('status', ['sending', 'failed'])
        return NextResponse.json({ message: 'Queue reset' }, { status: 200 })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Queue management failed' },
      { status: 500 }
    )
  }
}
