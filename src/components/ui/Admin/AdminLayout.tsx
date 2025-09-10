'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
  user: { name: string; avatar?: string } | null;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Call your API logout endpoint
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/publicUsers" className="block px-3 py-2 rounded hover:bg-gray-700">
            Users
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashoard</h1>
          <div className="flex items-center space-x-4">
            <span>{user?.name ?? 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
