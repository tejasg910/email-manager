// import { getQueue } from "@/lib/que";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//       const queue = getQueue();
//       const [waiting, active, completed, failed] = await Promise.all([
//         queue.getWaitingCount(),
//         queue.getActiveCount(),
//         queue.getCompletedCount(),
//         queue.getFailedCount()
//       ]);
  
//       return NextResponse.json({
//         waiting,
//         active,
//         completed,
//         failed,
//         total: waiting + active + completed + failed
//       });
//     } catch (error) {
//       return NextResponse.json(
//         { error: error instanceof Error ? error.message : 'Failed to get queue status' },
//         { status: 500 }
//       );
//     }
//   }