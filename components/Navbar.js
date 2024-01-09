"use client";

import Link from "next/link";
import Searchbar from "./Searchbar";

export default function Navbar() {
    return (
        <nav className="flex sticky top-0 bg-finch-300 dark:bg-finch-950 w-[100vw] p-3 shadow-lg z-50">
            <div id="NavbarHeader" className="flex flex-col">
                <p className="text-2xl font-semibold">REST 2.0</p>
                <p className="text-xs font-light italic">Repair, Escalate, Service, Troubleshoot</p>
            </div>
            <div className="mx-4 grid grid-cols-6 w-3/6 bg-finch-300 dark:bg-finch-950" id="NavbarOptions">
                <Link href="/" className="flex justify-center col-span-1 text-center 
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Home</p></Link>
                <Link href="/formbuilder" className="flex justify-center col-span-1 text-center 
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Formbuilder</p></Link>
                <Link href="/datacenter" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Datacenter</p></Link>
                <Link href="/diagrams" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Diagrams</p></Link>
                <Link href="/dictionary" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Dictionary</p></Link>
                <Link href="/forms" className="flex justify-center col-span-1 text-center
                dark:hover:bg-finch-800 hover:bg-finch-500 transition duration-200 ease-out"><p className="m-auto">Forms</p></Link>
            </div>
            <Searchbar className="my-auto flex justify-start border rounded-md border-finch-950 dark:border-finch-600 grow relative z-50"/>
        </nav>
    )
}