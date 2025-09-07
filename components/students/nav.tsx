"use client";
import React, { useState } from "react";
import { Menu, X, Home, Globe2, CalendarCheck2, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    name: "Home",
    href: "/students",
    icon: <Home className="w-5 h-5 mr-2" />,
  },
  {
    name: "Explore",
    href: "/students/explore",
    icon: <Globe2 className="w-5 h-5 mr-2" />,
  },
  {
    name: "Bookings",
    href: "/students/bookings",
    icon: <CalendarCheck2 className="w-5 h-5 mr-2" />,
  },
  {
    name: "Settings",
    href: "/students/settings",
    icon: <Settings className="w-5 h-5 mr-2" />,
  },
];

export default function StudentsNav({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);

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
        className={`
          fixed top-0 left-0 h-screen w-64 z-50
          bg-gradient-to-b from-green-50 via-white to-blue-100
          shadow-2xl border-r border-blue-100
          transform transition-transform duration-300
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:block
          rounded-tr-3xl rounded-br-3xl
          flex flex-col
        `}
        aria-label="Sidebar navigation"
      >
        {/* Logo/Title (desktop) */}
        <div className="hidden md:flex items-center px-8 pt-10 pb-6 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">C</span>
            <span className="font-extrabold text-2xl tracking-tight text-green-800">CribPal</span>
          </div>
        </div>
        {/* Close button on mobile */}
        <div className="flex items-center justify-between md:hidden p-4 border-b">
          <span className="font-bold text-xl tracking-tight">CribPal</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-2 mt-8 md:mt-8 px-4 md:px-6">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-green-100 hover:text-green-900 transition group focus:bg-green-200 focus:outline-none active:bg-green-200"
                onClick={() => setOpen(false)}
                style={{ marginBottom: 2 }}
              >
                <span className="group-hover:text-green-700 mr-2">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        {/* Bottom label, always at bottom */}
        <div className="w-full px-8 pb-6 pt-4 mt-auto hidden md:block">
          <div className="text-xs text-green-400 text-center tracking-wide font-semibold opacity-90">Student Dashboard</div>
        </div>
        {/* Mobile label at bottom */}
        <div className="w-full px-4 pb-4 pt-2 mt-auto md:hidden">
          <div className="text-xs text-green-400 text-center tracking-wide font-semibold opacity-90">Student Dashboard</div>
        </div>
      </nav>
    </>
  );
}
