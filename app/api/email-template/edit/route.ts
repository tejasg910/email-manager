import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabse';

export async function PUT(request: Request) {
  try {
    const { id, html, subject, name } = await request.json();

    if (!id || !html || !subject || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('email_templates')
      .update({ html, name, subject })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    );
  }
}