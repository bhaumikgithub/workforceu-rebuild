"use client";

import Image from "next/image";
import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  disabled?: boolean; // ✅ add this
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string).trim();
        const password = (formData.get("password") as string).trim();

        let tempErrors: { email?: string; password?: string } = {};

        if (!email) {
            tempErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            tempErrors.email = "Invalid email format";
        }

        if (!password) {
            tempErrors.password = "Password is required";
        } else if (password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        setErrors({});
        onSubmit({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6">
            <div className="flex justify-center">
            <Image src="/oahub_logo.png" alt="Office Automated Hub Logo" width={500} height={100} priority/>
            </div>

            <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
                Log in to your account
            </h2>
            <p className="mt-1 text-sm text-gray-500">
                Welcome back! Please enter your details.
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email"  name="email" placeholder="Enter your email" className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none sm:text-sm border-gray-300 focus:ring-emerald-500`}/>
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" placeholder="Enter your password" className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none sm:text-sm border-gray-300 focus:ring-emerald-500`}/>
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                <button type="submit" className="w-full rounded-full bg-emerald-500 px-4 py-2 text-white font-medium shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                    Sign in
                </button>
            </form>

            <div className="text-center text-sm text-gray-600">
            {/* <p>
                Don’t have an account?{" "}
                <a href="/auth/signup" className="text-emerald-600 font-medium hover:underline">
                Sign up
                </a>
            </p> */}
            <p className="mt-1">
                <a href="/auth/forgot-password" className="text-emerald-600 font-medium hover:underline">
                Forgot password
                </a>
            </p>
            </div>
        </div>
        </div>
    );
}
