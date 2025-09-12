"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/ui/Auth/LoginPage";

interface LoginResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: any;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    const domain =
      window.location.hostname.includes("localhost")
        ? "admin"
        : window.location.hostname.split(".")[0];

    try {
      const res = await axios.post<LoginResponse>("/api/auth", {
        ...data,
        domain,
      });

      if (!res.data.status || !res.data.token || !res.data.user) {
        toast.error(res.data.message || "Invalid credentials", { id: toastId });
        return;
      }

      login(res.data.user,res.data.token);
      toast.success("Login successful!", { id: toastId });
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Login failed",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} disabled={loading} />;
}
