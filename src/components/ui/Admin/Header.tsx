"use client";

import React, { useState } from "react";
import { LogOut, Settings } from "lucide-react";

interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  [k: string]: any;
}

interface Props {
  pageTitle?: string;
  user: User | null;
  onLogout: () => void;
}

export default function Header({ pageTitle = "Admin", user, onLogout }: Props) {
  const [open, setOpen] = useState(false);

  const fullName =
    user && (user.first_name || user.last_name)
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : user?.email ?? "User";

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-6 py-4">
      <h1 className="text-lg font-semibold">{pageTitle}</h1>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-3 cursor-pointer">
          <img
            src={user?.avatar || "/profile-image.svg"}
            alt="Profile"
            className="w-8 h-8 rounded-full border"
          />
          <span className="hidden sm:block">Welcome, {fullName}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
            <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
              <Settings size={16} className="mr-2" /> Settings
            </button>
            <button onClick={onLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
