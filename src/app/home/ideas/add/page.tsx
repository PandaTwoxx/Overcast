import { addPost } from '@/actions'
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { auth } from "@/auth";
import {redirect} from "next/navigation";
import {getUserId} from "@/api/users";

export default async function addingPost(){
    const user = (await auth())?.user;
    if (!user){
        redirect('/login');
    }
    const userId = Number(user.id || await getUserId(user.name || ""))
      return (
          <>
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                          Add a post <ArrowDownIcon className="ml-auto mx-auto text-gray-50 h-20 w-20" />
                      </h2>
                  </div>
              </div>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-8">
                  <form action={addPost} className="space-y-6">
                      <div>
                          <label htmlFor="topic" className="block text-sm/6 font-medium dark:text-white text-gray-800">
                              Topic
                          </label>
                          <div className="mt-2">
                              <input
                                  id="topic"
                                  name="topic"
                                  type="topic"
                                  required
                                  autoComplete="topic"
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                          </div>
                      </div>

                      <div>
                          <label htmlFor="description"
                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                              description</label>
                          <textarea id="description" rows={4}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Write your thoughts here..."></textarea>
                      </div>
                      <div>
                          <input type="hidden" value={userId}/>
                          <button
                              type="submit"
                              className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                              Add <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50"/>
                          </button>
                      </div>
                  </form>
              </div>
          </>
)
}