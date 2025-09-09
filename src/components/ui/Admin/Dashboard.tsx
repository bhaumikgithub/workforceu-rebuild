"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardProps {
  user: { email: string; avatar?: string } | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar onNavigate={(route) => console.log("Navigate to", route)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header pageTitle="Dashboard" user={user} onLogout={onLogout} />

        {/* Page content */}
        <main className="p-6">
          <h2 className="text-xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-700">
            {user?.email ? `Logged in as ${user.email}` : "You are logged in."}
          </p>
        </main>
      </div>
    </div>
  );
}
