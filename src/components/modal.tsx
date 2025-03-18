'use client'

import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import Image from "next/image";
import { Post } from "@/lib/models";
import { addVote } from "@/api/votes"

interface Props{
    post: Post;
}

const Modal: React.FC<Props> = (props: Props) => {
    const [open, setOpen] = useState(false);
    const post = props.post;

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <>
        <article key={post.id} className="flex max-w-xl flex-col items-start justify-between" onClick={() => {setOpen(true)}}>
            {/*<div className="flex items-center gap-x-4 text-xs">*/}
            {/*    <time dateTime={post.datetime} className="text-gray-500">*/}
            {/*        {post.date}*/}
            {/*    </time>*/}
            {/*    <a*/}
            {/*        href={post.category.href}*/}
            {/*        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"*/}
            {/*    >*/}
            {/*        {post.category.title}*/}
            {/*    </a>*/}
            {/*</div>*/}
            <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 dark:text-white dark:group-hover:text-gray-300 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    {post.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
                <Image alt="" src={post.author.imageUrl} className="size-10 rounded-full bg-gray-50" width={40} height={40}/>
                <div className="text-sm/6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                        <span className="absolute inset-0" />
                        {post.author.name}
                    </p>
                    <p className="text-gray-600">{'Up: ' + String(post.author.upvotes) + ' / Down: ' + String(post.author.downvotes)}</p>
                </div>
            </div>
        </article>
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 dark:bg-gray-700/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <PencilIcon aria-hidden="true" className="size-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                                        {post.title}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {post.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() => {addVote(post.id, post.author.userid, true).then(() => {handleRefresh();}); setOpen(false);}}
                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-700 sm:ml-3 sm:w-auto"
                            >
                                Upvote
                            </button>
                            <button
                                type="button"
                                data-autofocus="true"
                                onClick={() => {addVote(post.id, post.author.userid, false).then(() => {handleRefresh();}); setOpen(false);}}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Downvote
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
        </>
    )
}

export default Modal;