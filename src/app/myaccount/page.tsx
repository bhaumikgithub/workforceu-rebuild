'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Welcome to the User Dashboard!</h2>
            <p>Here is your myaccount content.</p>
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
                Logout
            </button>
        </div>
    );
}
