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
                        <p className="mt-2 text-lg/8 text-gray-600">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleChange}
                        />
                        Show all posts { isChecked ? 'checked' : 'unchecked' }
                        </p>
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