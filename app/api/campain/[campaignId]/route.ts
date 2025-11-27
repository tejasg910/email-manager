import { supabase } from "@/lib/supabse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { campaignId: string } }
  ) {
    try {
      const { campaignId } = params;
  
      const { data: stats, error: statsError } = await supabase
        .from('emails')
        .select('status')
        .eq('campaign_id', campaignId);
  
      if (statsError) throw statsError;
  
      const summary = stats.reduce((acc: Record<string, number>, curr: { status: string }) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const total = stats.length;
      const completed = (summary.sent || 0) + (summary.failed || 0) + (summary.cancelled || 0);
  
      return NextResponse.json({
        isComplete: completed === total,
        total,
        stats: {
          queued: summary.queued || 0,
          sending: summary.sending || 0,
          sent: summary.sent || 0,
          failed: summary.failed || 0,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      });
  
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get campaign status' },
        { status: 500 }
      );
    }
  }
