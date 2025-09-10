"use client";
import { useRouter } from "next/navigation";
import { Users, Home, FileText, Settings } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <Home size={18} />, route: "/dashboard" },
    { name: "Users", icon: <Users size={18} />, route: "/admin/publicUsers" },
    // { name: "Reports", icon: <FileText size={18} />, route: "/reports" },
    // { name: "Settings", icon: <Settings size={18} />, route: "/settings" },
  ];

  return (
    <aside className="w-60 bg-gray-800 text-white h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => router.push(item.route)}
                className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-700"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
