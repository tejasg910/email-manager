
// hooks/useProfile.ts
'use client'


const BASE_URL = "/api/add-email"

export const useAddEmail = () => {
    return async (emails: string[]) => {
        try {
            const response = await fetch(`${BASE_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({emails}),
            });


            return await response.json();
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    };
};