// app/api/dashboard/route.ts
export const dynamic = 'force-dynamic';

import { getAuthenticatedUser, handleUnauthorized } from '@/lib/authUtils'
import { supabase } from '@/lib/supabse'
import { auth } from '@clerk/nextjs/server'
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin'
import { NextResponse } from 'next/server'

export interface DashboardData {
    totalSent: number
    sentPercentageChange: string
    totalPending: number
    weeklyActivity: Array<{
        day: string
        emails: number
    }>
}

// Helper function remains the same
const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) {
        return current === 0 ? '0%' : `+100%`
    }
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
}

export async function GET(req: Request) {
    try {


        const user = await getAuthenticatedUser(req);


        if (!user) {
            handleUnauthorized()
            return NextResponse.json(
                { error: 'Unauthorized: User not authenticated or not found in Supabase' },
                { status: 401 }
            );
        }

        // Date calculations remain the same
        const now = new Date()
        const currentWeekStart = new Date(now)
        currentWeekStart.setDate(now.getDate() - 7)

        const previousWeekStart = new Date(now)
        previousWeekStart.setDate(now.getDate() - 14)

        // Current/previous week sent emails queries remain the same
        const { count: currentWeekSent } = await supabase
            .from('emails')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('sent', true)
            .gte('created_at', currentWeekStart.toISOString());



        const { count: previousWeekSent } = await supabase
            .from('emails')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('sent', true)
            .gte('created_at', previousWeekStart.toISOString())
            .lt('created_at', currentWeekStart.toISOString())

        // Sent percentage change calculation remains the same
        const sentPercentageChange = calculatePercentageChange(
            currentWeekSent || 0,
            previousWeekSent || 0
        )

        // Total pending emails query remains the same
        const { count: totalPending } = await supabase
            .from('emails')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('sent', false)

        // Corrected weekly activity query
        // Corrected weekly activity query
        const { data: weeklyActivity } = await supabase
            .from('emails')
            .select(`created_at, status`) // Select raw columns first
            .eq('user_id', user.id)
            .eq('sent', true)
            .gte('created_at', currentWeekStart.toISOString())
            .order('created_at', { ascending: true })


        // Process weekly activity data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyActivityData = Array(7).fill(0).map((_, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + index);
            return {
                day: days[date.getDay()],
                emails: 0
            };
        });

        weeklyActivity?.forEach(entry => {
            const day = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' });
            const index = weeklyActivityData.findIndex(d => d.day === day);
            if (index !== -1) {
                weeklyActivityData[index].emails++;
            }
        });

        return NextResponse.json({
            totalSent: currentWeekSent || 0,
            totalPending: totalPending || 0,
            sentPercentageChange,
            weeklyActivity: weeklyActivityData
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        )
    }
}