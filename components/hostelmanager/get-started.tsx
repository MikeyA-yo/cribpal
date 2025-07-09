import React from "react";
import { PlusCircle, Settings } from "lucide-react";
import Link from "next/link";

export default function GetStarted() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Welcome to your Hostel Manager Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-lg">
        To get started, you can:
      </p>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-xl justify-center">
        <Link
          href="/hostelmanager/add-hostel"
          className="flex-1 flex flex-col items-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-6 shadow transition group"
        >
          <PlusCircle className="w-10 h-10 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-blue-800 text-lg mb-1">Add a New Hostel Listing</span>
          <span className="text-gray-600 text-sm text-center">Let students discover your hostel. Start by adding your first listing.</span>
        </Link>
        <Link
          href="/hostelmanager/settings"
          className="flex-1 flex flex-col items-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-6 shadow transition group"
        >
          <Settings className="w-10 h-10 text-blue-600 mb-2 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-blue-800 text-lg mb-1">Edit Your Settings</span>
          <span className="text-gray-600 text-sm text-center">Update your profile, contact info, or password anytime.</span>
        </Link>
      </div>
    </div>
  );
}
