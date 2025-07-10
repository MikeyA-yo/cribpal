import React from "react";
import StudentsNav from "@/components/students/nav";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-blue-50">
      {/* Sidebar Navigation */}
      <StudentsNav />
      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
