"use client";
import React, { useState } from "react";
import { Menu, X, Shield, Users, Building, UserCog, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <Home className="w-5 h-5 mr-2" />,
  },
  {
    name: "Hostel Applications",
    href: "/admin/hostels",
    icon: <Building className="w-5 h-5 mr-2" />,
  },
  {
    name: "Student Accounts",
    href: "/admin/students", 
    icon: <Users className="w-5 h-5 mr-2" />,
  },
  {
    name: "Admin Management",
    href: "/admin/admins",
    icon: <UserCog className="w-5 h-5 mr-2" />,
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-7 h-7 text-gray-700" />
      </button>
      
      {/* Overlay when menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-red-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-800">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-300 mr-2" />
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
          <button
            className="md:hidden p-1 rounded hover:bg-red-800 transition"
            onClick={() => setOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-red-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name || "Admin"}</p>
              <p className="text-red-300 text-xs">{user?.email || "admin@cribpal.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-red-800 text-white shadow-md"
                        : "text-red-100 hover:bg-red-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-100 hover:bg-red-800 hover:text-white rounded-lg transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
