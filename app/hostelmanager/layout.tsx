import React from "react";
import HostelManagerNav from "@/components/hostelmanager/nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HostelManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <HostelManagerNav user={user} />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
