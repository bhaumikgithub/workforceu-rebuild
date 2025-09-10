"use client";

import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/ui/Admin/Dashboard";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">Not authorized. Please log in.</p>;

  return <Dashboard user={user} onLogout={logout} />;
}
