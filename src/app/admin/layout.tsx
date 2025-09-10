//src\app\admin\layout.tsx

"use client";

import AdminLayout from "@/components/ui/Admin/AdminLayout";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout pageTitle="Admin">{children}</AdminLayout>;
}

