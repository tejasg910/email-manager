// hooks/useProfile.ts
'use client'

import { useFetcher } from '@/hooks/useFetcher'
import { useState } from 'react'
import useSWR from 'swr'
import { mutate } from 'swr'
const BASE_URL = "/api/user"

const GET_PROFILE = `${BASE_URL}/get-profile`;
const UPDATE_PROFILE = `${BASE_URL}/update-profile`;
export type ProfileData = {
    firstName: string
    lastName: string
    smtpPassword: string
}

export const useProfile = () => {
    const { fetcher } = useFetcher()
    const { data, error, isLoading } = useSWR<{
        user: {
            first_name: string
            last_name: string
            smtp_password: string
        }
    }>(GET_PROFILE, fetcher)

    return {
        profile: data ? {
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            smtpPassword: data.user.smtp_password,
        } : null,
        isLoading,
        error
    }
}

export const useUpdateProfile = () => {
    return async (template: ProfileData) => {
        try {
            const response = await fetch(`${UPDATE_PROFILE}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template),
            });

            mutate(GET_PROFILE);
            return await response.json();
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    };
};