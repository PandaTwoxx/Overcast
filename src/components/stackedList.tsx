import React from 'react';
import Image from 'next/image';

interface PostData {
    topic: string;
    description: string;
    username: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
}

interface StackedListProps {
    posts: (PostData)[];
}

const StackedList: React.FC<StackedListProps> = ({ posts }) => {
    return (
        <ul role="list" className="divide-y divide-gray-100">
            {posts.map((post, index) => (
                <li key={post.description}
                    className={`flex py-5 gap-x-6 sm:gap-x-8 flex-wrap ${index !== posts.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex min-w-0 gap-x-4 flex-1">
                        <Image
                            alt=""
                            src={post.imageUrl}
                            width={48}
                            height={48}
                            className="rounded-full bg-gray-50 flex-none"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                &#34;{post.topic}&#34; by {post.username}
                            </h3>
                            <p className="mt-1 text-xs/5 text-gray-500">{post.description}</p>
                        </div>
                    </div>
                    <div className="shrink-0 sm:flex sm:flex-col sm:items-end mt-2 sm:mt-0">
                        <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div className="size-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs/5 text-gray-500">Up Votes {post.upvotes}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-red-500/20 p-1">
                                <div className="size-1.5 rounded-full bg-red-500" />
                            </div>
                            <p className="text-xs/5 text-gray-500">Down Votes {post.downvotes}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default StackedList;