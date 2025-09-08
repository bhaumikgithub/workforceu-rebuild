"use client";

interface DashboardProps {
  user: { email: string } | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-900 text-white px-6 py-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6">
        <h2 className="text-xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-700">
          {user?.email ? `Logged in as ${user.email}` : "You are logged in."}
        </p>
      </main>
    </div>
  );
}
