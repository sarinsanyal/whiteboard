"use client"

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center text-sm align-middle p-6 pb-3 border-t-1 bg-background/50 backdrop-blur-2xl font-[family-name:var(--font-geist-sans)]">
            <div className="">
                Created by Sarin Sanyal
            </div>
            <div className="mt-2">
                <Link className="hover:underline p-1" href = "/about">About</Link>
                <Link className="hover:underline p-1" target="_blank" href = "https://www.linkedin.com/in/sarinsanyal">Contact</Link>
                <Link className="hover:underline p-1" href = "/privacy-policy">Privacy Policy</Link>
            </div>
        </footer>
    )
}