"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Users, FileText, Settings, ChevronDown } from "lucide-react";

export default function Sidebar() {
    const [usersOpen, setUsersOpen] = useState(false);

    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-4">
            <nav className="space-y-2">
                <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <Home size={18} /> Dashboard
                </Link>

                {/* Users Main Menu */}
                <div
                    onClick={() => setUsersOpen(!usersOpen)}
                    className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Users size={18} /> Users
                    </div>
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${usersOpen ? "rotate-180" : ""}`}
                    />
                </div>

                {/* Users Submenu */}
                {usersOpen && (
                    <div className="ml-6 flex flex-col gap-1 mt-1">
                        <Link
                            href="/admin/adminUsers"
                            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
                        >
                            Admin Users
                        </Link>
                        <Link
                            href="/admin/publicUsers"
                            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
                        >
                            Public Users
                        </Link>
                    </div>
                )}
            </nav>
        </aside>
    );
}
