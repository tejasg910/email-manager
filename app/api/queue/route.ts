import { NextResponse, type NextRequest } from 'next/server'
import { createTransporter } from '@/lib/nodemailer'
import { getQueue } from '@/lib/que'
import { supabase } from '@/lib/supabse'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')
  const queue = getQueue(createTransporter)

  try {
    switch (action) {
      case 'pause': {
        await queue.pause()
        await supabase
          .from('emails')
          .update({ status: 'queued' })
          .in('status', ['sending', 'queued'])
        return NextResponse.json({ message: 'Queue paused' }, { status: 200 })
      }
      case 'resume': {
        await queue.resume()
        return NextResponse.json({ message: 'Queue resumed' }, { status: 200 })
      }
      case 'clear': {
        await queue.pause()
        await supabase
          .from('emails')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .in('status', ['sending', 'queued'])
        await queue.drain(true)
        return NextResponse.json({ message: 'Queue cleared successfully' }, { status: 200 })
      }
      case 'reset': {
        await queue.pause()
        await queue.drain(true)
        await supabase
          .from('emails')
          .update({ status: 'queued' })
          .in('status', ['sending', 'queued'])
        return NextResponse.json({ message: 'Queue reset' }, { status: 200 })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Queue management failed' }, { status: 500 })
  }
}
