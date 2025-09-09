"use client";

import { Home, Users, FileText, Settings } from "lucide-react";

interface SidebarProps {
  onNavigate?: (route: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, route: "/dashboard" },
    { name: "Users", icon: <Users size={18} />, route: "/public_users" },
  ];

  return (
    <aside className="w-60 bg-gray-800 text-white h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onNavigate?.(item.route)}
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
