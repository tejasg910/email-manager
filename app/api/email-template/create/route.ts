import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabse';
import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils';
import { v4 as uuidv4 } from 'uuid';
export async function POST(request: Request) {
    try {
        // Get authenticated user ID from Clerk
        const user = await getAuthenticatedUser(request);

        if (!user) {
            handleUnauthorized()
            return NextResponse.json(
                { error: 'Unauthorized: User not authenticated or not found in Supabase' },
                { status: 401 }
            );
        }



        const { name, html, subject } = await request.json();

        if (!name || !html || !subject) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create template with user_id from your database

        const id = uuidv4();
        const { data, error } = await supabase
            .from('email_templates')
            .insert([{
                user_id: user.id,
                subject,
                name,
                html,
                id
            }])
            .select();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Failed to create email template' },
            { status: 500 }
        );
    }
}