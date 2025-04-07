//import Image from 'next/image'

export default function Home() {
    return (
        <center>
            <div className="px-5 relative">
                <h2 className="text-2xl py-5 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-3xl">
                    Welcome to the Overcast
                </h2>
                <h3>Start by voting or by making a post on our platform</h3>
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img src="/cloud.png" width={1000} height="auto" alt="" />
            </div>
        </center>
    )
}
