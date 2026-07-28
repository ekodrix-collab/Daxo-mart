"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    User,
    ShoppingBag,
    ChevronDown,
} from "lucide-react";


interface NavItem {
    id: number;
    title: string;
    path: string;
    hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        id: 1,
        title: "Home",
        path: "/",
    },
    {
        id: 2,
        title: "Products",
        path: "/products",
    },
    {
        id: 6,
        title: "1:32",
        path: "/1-32",
    },
    {
        id: 6,
        title: "1:24",
        path: "/1-24",
    },

    {
        id: 6,
        title: "1:18",
        path: "/1-18",
    },
    {
        id: 6,
        title: "RC TOYS",
        path: "/rc-toys",
    },
    {
        id: 6,
        title: "CONTACT",
        path: "/contact",
    },

];

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="font-pally sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left Side */}
                <div className="flex items-center gap-10">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-pally text-2xl font-bold tracking-wide text-black"
                    >
                        DAXO MART
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.id} className="group relative">
                                {item.hasDropdown ? (
                                    <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-black transition hover:text-black">
                                        {item.title}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className="text-sm font-medium uppercase tracking-wide text-gray-700 transition hover:text-black"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-5">

                    {/* Search */}
                    <div className="hidden w-72 items-center rounded-full border border-gray-200 px-4 py-2 lg:flex">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ml-2 w-full bg-transparent text-sm outline-none"
                        />
                    </div>

                    {/* Account */}
                    <Link
                        href="/account"
                        className="rounded-full p-2 transition hover:bg-gray-100"
                    >
                        <User className="h-5 w-5" />
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative rounded-full p-2 transition hover:bg-gray-100"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                            0
                        </span>
                    </Link>
                </div>

            </div>
        </header>
    );
}