import { useFetcher } from '@/hooks/useFetcher';
import { EmailTemplate } from '@/lib/type';
import useSWR from 'swr';
import { mutate } from 'swr';

const API_BASE = '/api/add-email-blacklist';


export const useGetBlackList = () => {
    const { fetcher } = useFetcher()

    const { data, error, isLoading , mutate} = useSWR<{ data: EmailTemplate[] }>(
        API_BASE,
        fetcher,
    );

    return {
        data: data?.data || [],
        isLoading,
        error, 
        mutate
    };
};

export const useCreateBlackList = () => {
    return async (email: string) => {
        try {


            const response = await fetch(`${API_BASE}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            mutate(API_BASE);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};