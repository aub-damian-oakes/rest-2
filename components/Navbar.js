import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex sticky top-0 bg-finch-300 dark:bg-finch-950 w-[100vw] p-3">
            <div id="NavbarHeader" className="flex flex-col grow">
                <p className="text-2xl font-semibold">REST 2.0</p>
                <p className="text-xs font-light italic">Repair, Escalate, Service, Troubleshoot</p>
            </div>
            <div className="mx-4 grid grid-cols-8 w-4/6 bg-finch-300 dark:bg-finch-950" id="NavbarOptions">
                <Link href="/tools" className="flex justify-center col-span-1 text-center 
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Tools</p></Link>
                <Link href="/flowcharts" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Flowcharts</p></Link>
                <Link href="/flowcharts" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Diagrams</p></Link>
                <Link href="/flowcharts" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Dictionary</p></Link>
            </div>
            <div className="my-auto flex justify-start" id="search">
                <p className="mx-2 p-1">Search</p>
                <input className="rounded-md w-full p-1 text-finch-950" placeholder="Enter a search term here"></input>
            </div>
        </nav>
    )
}