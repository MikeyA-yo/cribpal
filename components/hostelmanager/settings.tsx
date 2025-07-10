"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, Trash2 } from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState({
    name: "Jane Hostel Manager",
    email: "jane.manager@email.com",
    mobile: "+234 812 345 6789",
    contact: "You can reach me on WhatsApp or call during business hours.",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1200); // fake loading
    // Here you would send the data to your backend
  }

  function handleSignOut() {
    alert("Signed out (dummy)");
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      alert("Account deleted (dummy)");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Settings</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-5 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Info</label>
          <textarea
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[60px]"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition font-semibold w-full md:w-auto justify-center"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-lg shadow hover:bg-red-100 transition font-semibold w-full md:w-auto justify-center"
        >
          <Trash2 className="w-5 h-5" /> Delete Account
        </button>
      </div>
    </motion.div>
  );
}
