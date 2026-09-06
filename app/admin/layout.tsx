import React from "react";
import AdminNav from "@/components/admin/nav";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    return <div className="min-h-screen bg-[#F9FBFF]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-[#F9FBFF]">
      <AdminNav user={session} />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
