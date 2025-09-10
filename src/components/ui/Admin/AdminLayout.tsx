"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
  pageTitle = "Welcome to Our site",
}: {
  children: React.ReactNode;
  pageTitle?: string;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header pageTitle={pageTitle} user={user} onLogout={handleLogout} />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
