"use client";

import { useState } from "react";
import LoginForm from "@/components/ui/Auth/LoginPage";

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // 👉 Redirect or handle session
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}
    </div>
  );
}