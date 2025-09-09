"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Dashboard from "@/components/ui/Admin/Dashboard";

interface JWTPayload {
  id: string;
  email: string;
  exp: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setUser({ email: decoded.email });
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
