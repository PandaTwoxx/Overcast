import React from "react";
import Image from "next/image";
import { signOut } from '@/auth';

export default function Footer() {
  return (
      <footer className="dark:bg-black text-gray-400 py-8 bg-orange-100">
        <div className="container mx-auto px-4">
          {/* Centered Content */}
          <div className="flex flex-col items-center space-y-4">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-8">
              <a href="#" className="hover:text-gray-200">
                About
              </a>
              <a href="#" className="hover:text-gray-200">
                Blog
              </a>
              <a href="#" className="hover:text-gray-200">
                Jobs
              </a>
              <a href="#" className="hover:text-gray-200">
                Press
              </a>
              <a href="#" className="hover:text-gray-200">
                Accessibility
              </a>
              <a href="#" className="hover:text-gray-200">
                Partners
              </a>
              <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
              >
                <button className="hover:text-gray-200">
                  <div className="hidden md:block">Sign Out</div>
                </button>
              </form>
            </div>

            {/* Logo and Copyright */}
            <div className="flex items-center space-x-2">
              <Image
                src="/vercel.svg" // Replace with your actual logo path
                alt="Company Logo"
                className="invert dark:invert-0"
                width={24}
                height={24}
              />
              <p className="text-gray-500 text-sm text-center">
                © 2025 Overcast, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
}
