"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/ui/Auth/LoginPage";
import { useToast } from "@/context/ToastContext";

interface LoginResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: any;
}

export default function LoginPage() {
    const [loading, setLoading] = useState(true);
     const { showToast } = useToast();
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        setLoading(true);
        try {
            const domain = window.location.hostname.split(".")[0]; // simple subdomain

            const res = await axios.post<LoginResponse>("/api/auth/login", {
                ...data,
                domain,
            });

            if (!res.data.status) throw new Error(res.data.message || "Invalid credentials");

            // Save token
            if (res.data.token) localStorage.setItem("token", res.data.token);

            showToast("Login successful!", "success");

            router.push("/dashboard");
        } catch (err: any) {
            showToast(err?.response?.data?.message || err?.message || "Login failed", "error");
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
