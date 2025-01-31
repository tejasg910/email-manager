'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Verify from "@/assets/verfication.png"
import CreateApp from "@/assets/createapp.png"
import CopyApp from "@/assets/copycode.png"
import Link from 'next/link';
export default function SMTPGuidePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mt-20">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Gmail SMTP Setup Guide</h1>
        <p className="text-gray-600">Follow these steps to create your app-specific password</p>
      </header>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> You must use the same Google account you registered with our service.
              The SMTP password will only work with the email address associated with your account.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="space-y-4">
          <div className="bg-blue-50 w-fit p-3 rounded-lg">
            <span className="text-blue-600 font-bold text-xl">1</span>
          </div>
          <h3 className="text-xl font-semibold">Enable 2-Step Verification</h3>
          <p className="text-gray-600">
            Go to your Google Account → Security →
            <strong>2-Step Verification</strong> and enable it
          </p>
          <figure className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={Verify}
              alt="2-Step Verification"
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </figure>
        </div>

        {/* Step 2 */}
        <div className="space-y-4">
          <div className="bg-blue-50 w-fit p-3 rounded-lg">
            <span className="text-blue-600 font-bold text-xl">2</span>
          </div>
          <h3 className="text-xl font-semibold">Create App Password</h3>
          <p className="text-gray-600">
            Under "App passwords", select <strong>Mail</strong> as the app and
            <strong>Other</strong> as the device. Enter "Email Client" as the name.
          </p>
          <figure className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={CreateApp}
              alt="Create App Password"
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </figure>
        </div>

        {/* Step 3 */}
        <div className="space-y-4">
          <div className="bg-blue-50 w-fit p-3 rounded-lg">
            <span className="text-blue-600 font-bold text-xl">3</span>
          </div>
          <h3 className="text-xl font-semibold">Copy & Save Password</h3>
          <p className="text-gray-600">
            Copy the generated 16-digit password and store it securely.
            You'll need this for SMTP configuration.
          </p>
          <figure className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={CopyApp}
              alt="Copy App Password"
              fill
              className="object-fill hover:scale-105 transition-transform"
            />
          </figure>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link href="/manage" className=" bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-white hover:text-black border border-indigo-600">
          I've Saved My Password - Continue to Dashboard
        </Link>
        <p className="text-sm text-gray-500">
          Need help? Contact our
          <Link href="/contact" className="text-blue-600 hover:underline ml-1">
            support team
          </Link>
        </p>
      </div>
    </div>
  );
}