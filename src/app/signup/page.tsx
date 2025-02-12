"use client";

import Image from "next/image"
import { useActionState } from 'react';
import { signUp } from '@/actions';
import { useSearchParams } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
      signUp,
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
                  Create an account
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action={formAction} className="space-y-6">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-800 dark:text-white">
                            First name
                          </label>
                          <div className="mt-2">
                            <input
                              id="first-name"
                              name="first-name"
                              type="text"
                              autoComplete="given-name"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-800 dark:text-white">
                            Last name
                          </label>
                          <div className="mt-2">
                            <input
                              id="last-name"
                              name="last-name"
                              type="text"
                              autoComplete="family-name"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                    </div>
                  <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium dark:text-white text-gray-800">
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

                  <div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      aria-disabled={isPending}
                    >
                      Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </button>
                  </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                  Already have an account?{' '}
                  <a href="/login" className="font-semibold dark:text-white hover:text-gray-500 text-gray-800">
                    Sign in
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