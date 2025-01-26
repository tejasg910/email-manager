'use client'
import React from 'react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import EmailTemplates from '@/features/email-template/components/EmailTemplate'
import AddEmails from '@/features/add-email/components/AddEmails'
import SentEmails from '@/features/sent/components/SentEmails'
import PendingEmails from '@/features/pending/components/PendingEmails'
const Client = () => {
    const [activeTab, setActiveTab] = useState("pending")

    return (
        <div className="mt-20  p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="add">Add Emails</TabsTrigger>
                    <TabsTrigger value="templates">Email Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <PendingEmails />
                </TabsContent>
                <TabsContent value="sent">
                    <SentEmails />
                </TabsContent>
                <TabsContent value="add">
                    <AddEmails />
                </TabsContent>
                <TabsContent value="templates">
                    <EmailTemplates />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Client