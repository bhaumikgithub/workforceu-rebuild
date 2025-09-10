// src/app/admin/layout.tsx
"use client";

import AdminLayout from "@/components/ui/Admin/AdminLayout";

interface AdminRootLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminRootLayout({ children, pageTitle }: AdminRootLayoutProps) {
  return <AdminLayout pageTitle={pageTitle}>{children}</AdminLayout>;
}
