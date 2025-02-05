const API_BASE_URL = "/api/send-email"
const DELETE_EMAIL = "/api/delete-email"
const STOP_QUEUE = "/api/queue"
const GET_EMAIL = "/api/get-unsent"
const SEND_BULK = "/api/send-bulk"
import { useFetcher } from '@/hooks/useFetcher';
import { Email } from '@/lib/type';
import useSWR, { mutate } from 'swr';


export const useSendEmail = () => {
    return async (data: {
        emailId: string,
        templateId: string,
       
    }) => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data }),
            });

            mutate(GET_EMAIL);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};

export const useDeleteEmail = () => {
    return async (id: string) => {
        try {
            const response = await fetch(`${DELETE_EMAIL}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },

            });

            mutate(GET_EMAIL);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};



export const useStopQueue = () => {
    return async (action: string) => {
        try {
            const response = await fetch(`${STOP_QUEUE}?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

            });

            mutate(GET_EMAIL);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};


export const useSendBulkEmail = () => {
    return async (ids: {
        emailId: string[],
        templateId: string,
      
    }) => {
        try {
            const response = await fetch(`${SEND_BULK}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ids }),
            });

        

            mutate(GET_EMAIL);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};




// GET Templates
export const useGetPendingEmails = () => {
    const { fetcher } = useFetcher()

    const { data, error, isLoading, mutate } = useSWR<{ data: Email[] }>(
        GET_EMAIL,
        fetcher,
    );

    return {
        emails: data?.data || [],
        isLoading,
        error,
        mutate
    };
};
