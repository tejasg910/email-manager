// // pages/api/queue/[action].ts
// import { createTransporter } from '@/lib/nodemailer';
// import { getQueue } from '@/lib/que';
// import { supabase } from '@/lib/supabse';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextResponse, type NextRequest } from 'next/server'

// export async function POST(
//     request: NextRequest,
//     res: NextApiResponse
// ) {
//     const searchParams = request.nextUrl.searchParams

//     const action = searchParams.get('action')
//     const emailQueue = getQueue(createTransporter);


//     try {
//         switch (action) {
//             case 'pause':
//                 await emailQueue.pause();
//                 await supabase
//                     .from('emails')
//                     .update({ status: 'queued' })
//                     .in('status', ['sending', 'queued']);
//                 return NextResponse.json({ message: 'Queue paused' }, { status: 200 });
//                 break;


//             case 'resume':
//                 await emailQueue.resume();
//                 return NextResponse.json({ message: 'Queue resumed' }, { status: 200 });
//                 break;


//             case 'clear':
//                 // Pause queue first to prevent new jobs from starting
//                 await emailQueue.pause();

//                 // Clean all job types from the queue
//                 await emailQueue.clean(0, 'wait');
//                 await emailQueue.clean(0, 'active');
//                 await emailQueue.clean(0, 'delayed');
//                 await emailQueue.clean(0, 'completed');
//                 await emailQueue.clean(0, 'failed');

//                 // Update database to mark cleared emails as 'cancelled'
//                 const { error } = await supabase
//                     .from('emails')
//                     .update({
//                         status: 'cancelled',
//                         updated_at: new Date().toISOString()
//                     })
//                     .in('status', ['sending', 'queued'])

//                 if (error) {
//                     throw new Error(`Supabase update failed: ${error.message}`);
//                 }

//                 // Optionally empty the queue completely
//                 await emailQueue.empty();

//                 return NextResponse.json({ message: 'Queue cleared successfully' }, { status: 200 });

//             case 'reset':
//                 await emailQueue.pause();
//                 await emailQueue.clean(0, 'wait');
//                 await emailQueue.clean(0, 'active');
//                 await supabase
//                     .from('emails')
//                     .update({ status: 'queued' })
//                     .in('status', ['sending', 'queued']);
//                 return NextResponse.json({ message: 'Queue reset' }, { status: 200 });
//                 break;


//             default:
//                 return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//         }

//     } catch (error) {
//         console.error('Queue management error:', error);
//         return NextResponse.json({
//             error: error instanceof Error ? error.message : 'Queue management failed'
//         }, { status: 500 });

//     }
// }