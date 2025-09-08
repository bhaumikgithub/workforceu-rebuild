"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/ui/Auth/LoginPage";
import { toast } from "react-hot-toast";

interface LoginResponse {
  success?: boolean;
  status?: boolean;
  message: string;
  token?: string;
  user?: any;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const domain = window.location.hostname.includes("localhost")
      ? "admin" // fallback domain for local dev
      : window.location.hostname.split(".")[0];

    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await axios.post<LoginResponse>("/api/auth/login", {
        ...data,
        domain,
      });

      const isSuccess = res.data.success ?? res.data.status; // ✅ unified check

      if (!isSuccess) {
        toast.error(res.data.message || "Invalid credentials", { id: toastId });
        return;
      }

      if (res.data.token) localStorage.setItem("token", res.data.token);

      toast.success(res.data.message || "Login successful!", { id: toastId });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Login failed",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} disabled={loading} />
    </div>
  );
}
