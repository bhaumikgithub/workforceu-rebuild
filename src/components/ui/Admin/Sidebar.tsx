"use client";

import Link from "next/link";
import { Home, Users, FileText, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                <Home size={18} /> Dashboard
            </Link>
            <Link href="/admin/publicUsers" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                <Users size={18} /> Users
            </Link>
        </nav>
    </aside>
  );
}
