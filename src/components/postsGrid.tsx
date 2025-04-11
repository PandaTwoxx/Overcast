'use client';

import Item from '@/components/modal'
import { Post } from '@/lib/models'
import { useState } from 'react';

interface GridProps {
    unvotedPosts: Post[],
    allPosts: Post[],
    userId: number
}

const PostGrid: React.FC<GridProps> = ({ unvotedPosts, allPosts, userId }) => {
    const [isChecked, setIsChecked] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked); // Update the state based on the checkbox's checked status
      };
    return (
        <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl">
                            From the post
                        </h2>
                        <p className="mt-2 text-lg/8 text-gray-600">
                            Posts sourced from the community but handpicked for
                            you.
                        </p>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked={isChecked} onChange={handleChange}/>
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show all posts</span>
                        </label>
                    </div>
                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {isChecked ? (
                            allPosts.map((post) => (
                                <Item key={post.id} post={post} id={userId} />
                            ))
                        ) : (
                            unvotedPosts.map((post) => (
                                <Item key={post.id} post={post} id={userId} />
                            ))
                            )
                        }
                    </div>
                </div>
            </div>
    )
}

export default PostGrid;