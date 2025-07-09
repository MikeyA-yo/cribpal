import React from "react";
import HostelManagerNav from "@/components/hostelmanager/nav";

export default function HostelManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <HostelManagerNav />
      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
