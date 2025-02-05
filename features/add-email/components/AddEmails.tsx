"use client"
import React from 'react';
import { useState } from 'react';
import { FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";
import Link from 'next/link';
import { useAddEmail } from '../api/useAddEmail';

export default function AddEmails() {
  const [emailList, setEmailList] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState({ added: [], skipped: [] });
  const [loading, setLoading] = useState(false);
  const addEmails = useAddEmail()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    // Split by newlines or spaces and remove duplicates using Set
    const emails = [...new Set(
      emailList.split(/[\n\s]+/)
        .filter(Boolean)
        .map(email => email.trim().toLowerCase()) // Normalize emails to prevent case-sensitive duplicates
    )];

    try {
      const response = await addEmails(emails);
      setSummary({
        added: response.addedEmails || [],
        skipped: response.skippedEmails || []
      });
      setShowModal(true);
      setEmailList('');
    } catch (error) {
      console.error('Error adding emails:', error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <p className='text-xs text-yellow-600 my-2'>For geting emails, we recommned you follow this  <Link className='text-blue-600' href="/guide/get-email" >guide</Link></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={emailList}
          onChange={(e) => setEmailList(e.target.value)}
          placeholder="Paste email addresses here, separated by new lines or spaces"
          className="mb-4 "
          rows={10}
        />
        <Button type="submit" className='bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50' disabled={loading}>{loading ? "Adding..." : "Add Emails"} </Button>
      </form>


      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Email Processing Summary</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium">Successfully Added</p>
                <p className="text-gray-500">{summary.added.length} emails</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-medium">Skipped</p>
                <p className="text-gray-500">{summary.skipped.length} emails</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setShowModal(false)}
              className="bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}