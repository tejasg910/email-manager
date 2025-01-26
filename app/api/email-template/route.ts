import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { calculateRange } from '@/lib/pagination';
import { supabase } from '@/lib/supabse';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // Force dynamic route behavior

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const { start, end } = calculateRange(page, limit);
    const user = await getAuthenticatedUser(request)
    if (!user) {

      handleUnauthorized()
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get total count for the specific user
    const { count } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id); // Filter by user_id

    // Get paginated data for the specific user
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}