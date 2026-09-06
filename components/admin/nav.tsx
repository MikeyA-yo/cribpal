"use client";

import React, { useState } from "react";
import { Menu, X, ShieldCheck, Building, LayoutDashboard, LogOut, Compass, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    name: "Hostels & Listings",
    href: "/admin/hostels",
    icon: <Building className="w-5 h-5 mr-3 text-[#50C9F2]" />,
  },
  {
    name: "Dashboard Overview",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5 mr-3 text-[#007BFF]" />,
  },
  {
    name: "Explore Live Site",
    href: "/explore",
    icon: <Compass className="w-5 h-5 mr-3 text-emerald-400" />,
    external: true,
  },
];

export default function AdminNav({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-2xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6 text-[#0B1E3F]" />
      </button>
      
      {/* Overlay when menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0B1E3F] text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-2xl`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007BFF] to-[#50C9F2] text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight">CribPal Admin</h1>
                <span className="text-[10px] text-[#50C9F2] font-bold uppercase tracking-wider">Control Center</span>
              </div>
            </div>
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mr-3 text-sm font-black text-[#50C9F2]">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs truncate text-white">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email || "admin@cribpal.com"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#007BFF] text-white shadow-md shadow-[#007BFF]/30 font-extrabold"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.external && <ExternalLink className="w-3.5 h-3.5 text-gray-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
