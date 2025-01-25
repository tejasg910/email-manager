// hooks/useEmailTemplates.ts
import { useFetcher } from '@/hooks/useFetcher';
import { EmailTemplate } from '@/lib/type';
import useSWR from 'swr';
import { mutate } from 'swr';

const API_BASE = '/api/email-template';



// GET Templates
export const useGetTemplates = () => {
    const { fetcher } = useFetcher()

    const { data, error, isLoading , mutate} = useSWR<{ data: EmailTemplate[] }>(
        API_BASE,
        fetcher,
    );

    return {
        templates: data?.data || [],
        isLoading,
        error, 
        mutate
    };
};

// CREATE Template
export const useCreateTemplate = () => {
    return async (name: string, subject: string, html: string) => {
        try {
            const response = await fetch(`${API_BASE}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, html, subject }),
            });

            mutate(API_BASE);
            return await response.json();
        } catch (error) {
            console.error('Create failed:', error);
            throw error;
        }
    };
};

// UPDATE Template
export const useUpdateTemplate = () => {
    return async (template: EmailTemplate) => {
        try {
            const response = await fetch(`${API_BASE}/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template),
            });

            mutate(API_BASE);
            return await response.json();
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    };
};

// DELETE Template
export const useDeleteTemplate = () => {
    return async (templateId: string) => {
        try {
            const response = await fetch(`${API_BASE}/delete/${templateId}`, {
                method: 'DELETE'
            });

            mutate(API_BASE);
            return await response.json();
        } catch (error) {
            console.error('Delete failed:', error);
            throw error;
        }
    };
};