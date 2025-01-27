'use client';

import { Button } from '@/components/ui/button';
import { UserButton, SignInButton, useUser, SignOutButton } from '@clerk/clerk-react';
import { User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const { isSignedIn } = useUser(); // Hook to check if the user is signed in

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or Brand Name */}
          <Link href="/" className="text-xl font-bold">
            <span className="text-indigo-600">Target</span>
            <span className="text-purple-500">Trail</span>
            <span className="text-pink-500">Mailer</span>
          </Link>



          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {
              isSignedIn && <Link href="/manage" > Mangage</Link>

            }
            {isSignedIn ? (
              // Show User Button if logged in
              <Link href="/profile" > <User className='text-indigo-500' /></Link>
            ) : (
              // Show Sign-In Button if not logged in
              <SignInButton mode="modal">
                <Button variant="outline" className="text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>
            )}


            {isSignedIn && <SignOutButton redirectUrl='/' />

            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;