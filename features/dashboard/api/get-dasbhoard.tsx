// hooks/useDashboard.ts
import useSWR from 'swr';
import { DashboardData } from '@/app/api/dashboard/route';
import { useFetcher } from '@/hooks/useFetcher';


export const useDashboard = () => {
    const {fetcher} = useFetcher()
  const { data, isLoading, error } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || {
      totalSent: 0,
      sentPercentageChange: '0%',
      totalPending: 0,
      weeklyActivity: [],
    },
    isLoading,
    error,
  };
};