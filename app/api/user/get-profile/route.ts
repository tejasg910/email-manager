import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabse';
import { auth } from '@clerk/nextjs/server'
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { userId } = await auth();
        console.log(userId, "this i user")
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('first_name, last_name, smtp_password')
            .eq('clerk_id', userId.toString())
            .single();


        console.log(user, "this iuser")

        if (error || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                smtp_password: user.smtp_password ? "******" : ""
            }
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}