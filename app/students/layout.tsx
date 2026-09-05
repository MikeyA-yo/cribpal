import React from "react";
import StudentsNav from "@/components/students/nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function StudentsLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    user = session?.user as any;
  } catch (err) {
    console.warn("MongoDB cluster paused or unavailable, using fallback student session:", err);
  }

  return (
    <div className="min-h-screen flex bg-blue-50">
      <StudentsNav user={user} />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
