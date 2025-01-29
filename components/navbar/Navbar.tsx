'use client';

import { Button } from '@/components/ui/button';
import { UserButton, SignInButton, useUser, SignOutButton } from '@clerk/clerk-react';
import { Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or Brand Name */}
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            <span className="text-indigo-600">Target</span>
            <span className="text-purple-500">Trail</span>
            <span className="text-pink-500">Mailer</span>
          </Link>

          {/* Auth Buttons and Navigation */}
          <div className="flex items-center space-x-2">
            {isSignedIn ? (
              <>
                {/* Navigation Links for Signed In Users */}
                <Link
                  href="/manage"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Manage
                </Link>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Link>

                  {/* Sign Out Button */}
                  <SignOutButton redirectUrl='/'>
                    <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-full transition-colors">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              // Sign In Button for Non-authenticated Users
              <SignInButton mode="modal" forceRedirectUrl={"/manage"}>
                <Button
                  variant="outline"
                  className="px-6 py-2 text-sm font-medium border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;