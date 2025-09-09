import React from "react";
import AdminNav from "@/components/admin/nav";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Default user for navigation (will be used if no session for login page)
  const user = session || {
    name: "Admin User",
    email: "admin@cribpal.com",
    userType: "admin"
  };

  return (
    <div className="min-h-screen flex bg-red-50">
      <AdminNav user={user} />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
