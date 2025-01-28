'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-react-toast';
import { ProfileData, useProfile, useUpdateProfile } from '../api/useUser';
import Image from 'next/image';

export default function ProfilePage() {
    const { profile, isLoading, error: fetchError } = useProfile()
    const updateProfile = useUpdateProfile()
    const { user } = useUser();
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [smtpPassword, setSmtpPassword] = useState('');
    // const [OAuthClient, setOAuthClient] = useState('');
    // const [OAuthSecret, setOAuthSecret] = useState('');
    // const [OAuthRefreshToken, setOAuthRefreshToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { success, error } = useToast();
    const initialized = useRef(false);

    const [formState, setFormState] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        smtpPassword: ''
    });

    useEffect(() => {
        if (profile && !initialized.current) {
            setFormState({
                firstName: profile?.firstName || "",
                lastName: profile?.lastName || "",
                smtpPassword: profile?.smtpPassword || ""
            });
            initialized.current = true;
        }
    }, [profile]); // Only run when profile changes



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log(formState, "this is from")



            if (!formState.smtpPassword) {
                error("SMTP Password is required");
                return;
            }
            setIsSubmitting(true)



            await updateProfile(formState)
            success("updated successfully")
        } catch (err) {

            error('An error occurred while updating the profile.');
        }
        finally {
            setIsSubmitting(false)

        }
    };

    if (isLoading) {
        return (
            <div className="flex  items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20">
            <div className="flex items-center gap-6 mb-8 space-x-4">


                <Image
                    src={user?.imageUrl!}
                    alt="Profile"
                    width={50} height={50}
                    className=" rounded-full object-cover border-4 border-white shadow-lg"
                />

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your personal information and email settings
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    value={formState.firstName}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        firstName: e.target.value
                                    }))}
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    value={formState.lastName}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        lastName: e.target.value
                                    }))}
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Email Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="smtpPassword">
                                Gmail SMTP App Password
                            </label>
                            <Input
                                id="smtpPassword"
                                type="password"
                                value={formState.smtpPassword}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    smtpPassword: e.target.value
                                }))}
                                placeholder="Enter your Gmail SMTP app password"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                This password is used for sending emails via Gmail SMTP.
                                We store it securely using AES-256 encryption.
                            </p>
                            <p className='text-sm text-gray-500 mt-2'>If you are facing issue while creating this, check this <Link className='text-blue-600' href="/guide/create-smtp" >guide</Link></p>
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="smtpPassword">
                                OAuth Client Id                            </label>
                            <Input
                                id="oauthclientid"
                                type="text"
                                value={OAuthClient}
                                onChange={(e) => setOAuthClient(e.target.value)}
                                placeholder="Enter your OAuth Client id"
                            />

                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="smtpPassword">
                                OAuth Client Secret
                            </label>
                            <Input
                                id="oauthclientsecret"
                                type="password"
                                value={OAuthSecret}
                                onChange={(e) => setOAuthSecret(e.target.value)}
                                placeholder="Enter your OAuth Client Secret"
                            />

                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="smtpPassword">
                                OAuth Refresh Token
                            </label>
                            <Input
                                id="oauthrefreshtoken"
                                type="password"
                                value={OAuthRefreshToken}
                                onChange={(e) => setOAuthRefreshToken(e.target.value)}
                                placeholder="Enter your OAuth Refresh token"
                            />

                        </div> */}

                        {/* <p className="text-sm text-gray-500 mt-2">
                            This password is used for sending emails via Gmail SMTP.
                            We store it securely using AES-256 encryption.
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>If you are facing issue while creating this, check this <Link className='text-blue-600' href="/guide/create-smtp" >guide</Link></p> */}
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className='bg-indigo-600 hover:bg-indigo-700'
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}