'use client';

import Image from 'next/image';
import {Suspense, useActionState} from 'react';
import { authenticate } from '@/actions';
import { useSearchParams } from 'next/navigation';
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
      authenticate,
      undefined,
  );

  return (
      <>
        {/*
          This example requires updating your template:

          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              alt="Vercel logo"
              src="/vercel.svg"
              width={20}
              height={20}
              className="mx-auto h-10 w-auto invert dark:invert-0"
              priority
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action={formAction} method="POST" className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm/6 font-medium dark:text-white text-gray-800">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    autoComplete="username"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium dark:text-white text-gray-800">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold dark:text-white hover:text-gray-600 text-gray-800">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <input type="hidden" name="redirectTo" value={callbackUrl} />
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  aria-disabled={isPending}
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <a href="/signup" className="font-semibold dark:text-white hover:text-gray-500 text-gray-800">
                Sign up now
              </a>
            </p>
            {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
            )}
          </div>
        </div>
      </>
    )
  }

export default function Login(){
  return (
      <Suspense>
        <LoginPage />
      </Suspense>
  )
}