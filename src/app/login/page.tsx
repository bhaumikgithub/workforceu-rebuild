"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/ui/Auth/LoginPage";

interface LoginResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: any;
}

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        setError("");

        try {
        const res = await axios.post<LoginResponse>("/api/auth/login", data);

        if (!res.data.status) {
            throw new Error(res.data.message || "Invalid credentials");
        }

        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
        }

        router.push("/dashboard");
        } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Login failed");
        }
    };

    return (
        <div>
        <LoginForm onSubmit={handleLogin} />
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </div>
    );
}
