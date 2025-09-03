"use client";

import { useState } from "react";
import axios from "axios"; // ✅ Import axios
import LoginForm from "@/components/ui/Auth/LoginPage";

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");

    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.status !== 200) {
        throw new Error("Invalid credentials");
      }

      // 👉 Redirect or handle session
      window.location.href = "/dashboard";
    } catch (err: any) {
      // Axios gives a structured error object
      if (err.response) {
        setError(err.response.data?.message || "Invalid credentials");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}
    </div>
  );
}
