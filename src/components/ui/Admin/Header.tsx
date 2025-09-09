"use client";

import { useState } from "react";
import { Menu, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  user: { email: string; avatar?: string } | null;
  onLogout: () => void;
}

export default function Header({ pageTitle, user, onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-6 py-4">
      {/* Page title */}
      <h1 className="text-lg font-semibold">{pageTitle}</h1>

      {/* Profile + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
         <img
            src={user?.avatar || "/profile-image.svg"}
            alt="Profile"
            className="w-8 h-8 rounded-full border"
            />
          <span className="hidden sm:block">{user?.email}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
              <Settings size={16} className="mr-2" /> Settings
            </button>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
