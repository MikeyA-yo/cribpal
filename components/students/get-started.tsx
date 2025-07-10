import React from "react";
import { Home, CalendarCheck2, Settings } from "lucide-react";
import Link from "next/link";

export default function StudentsGetStarted() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-900">Welcome to your Student Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-lg">
        Here you can easily manage your hostel journey. Use the quick links below to get started.
      </p>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-xl justify-center">
        <Link
          href="/students"
          className="flex-1 flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 shadow transition group"
        >
          <Home className="w-10 h-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-green-800 text-lg mb-1">Home</span>
          <span className="text-gray-600 text-sm text-center">Dashboard overview and latest updates.</span>
        </Link>
        <Link
          href="/students/bookings"
          className="flex-1 flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 shadow transition group"
        >
          <CalendarCheck2 className="w-10 h-10 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-green-800 text-lg mb-1">Bookings</span>
          <span className="text-gray-600 text-sm text-center">View and manage your hostel bookings.</span>
        </Link>
        <Link
          href="/students/settings"
          className="flex-1 flex flex-col items-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 shadow transition group"
        >
          <Settings className="w-10 h-10 text-green-600 mb-2 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-green-800 text-lg mb-1">Settings</span>
          <span className="text-gray-600 text-sm text-center">Update your profile and preferences.</span>
        </Link>
      </div>
    </div>
  );
}
