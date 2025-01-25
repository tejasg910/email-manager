


// hooks/useEmailTemplates.ts
import { DashboardData } from '@/app/api/dashboard/route';
import { useFetcher } from '@/hooks/useFetcher';
import { Email, EmailTemplate } from '@/lib/type';
import useSWR from 'swr';

const API_BASE = '/api/get-sent';

const GET_DASHBOARD = '/api/dashboard'



// GET Templates
export const useGetSentEmails = () => {
    const { fetcher } = useFetcher()

    const { data, error, isLoading, mutate } = useSWR<{ data: Email[] }>(
        API_BASE,
        fetcher,
    );

    return {
        emails: data?.data || [],
        isLoading,
        error,
        mutate
    };
};



export const useGetDashboard = () => {
    const { fetcher } = useFetcher()

    const { data, error, isLoading, mutate } = useSWR<{ data: DashboardData }>(
        GET_DASHBOARD,
        fetcher,
    );

    return {
        emails: data?.data || [],
        isLoading,
        error,
        mutate
    };
};