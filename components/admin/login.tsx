"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ShieldCheck, Lock, Mail, Sparkles, Building2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "ayomide@cribpal.admin",
    password: "admin123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Redirect directly to admin hostels management
      router.push("/admin/hostels");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setQuickAccount = (email: string) => {
    setFormData({
      email,
      password: "admin123",
    });
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9FBFF] p-4 text-[#1E1E2F]">
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#007BFF]/10 to-[#50C9F2]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-white rounded-3xl shadow-xl shadow-[#0B1E3F]/8 p-8 md:p-10 w-full max-w-md border border-[#E5E8EC] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0B1E3F] to-[#007BFF] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#007BFF]/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-2">
            <span>CribPal Administration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1E3F] tracking-tight">Admin Portal</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Sign in to manage verified hostels, video & audio tours
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-xs font-semibold"
          >
            {error}
          </motion.div>
        )}

        {/* Quick Select Admin Credentials */}
        <div className="mb-6 p-3.5 bg-[#F9FBFF] rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Quick Admin Select</span>
            <span className="text-[10px] text-[#007BFF] font-semibold">Pass: admin123</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Ayomide (Admin)", email: "ayomide@cribpal.admin" },
              { label: "Admin Default", email: "admin@cribpal.com" },
              { label: "Mikey (Admin)", email: "mikey@cribpal.admin" },
            ].map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => setQuickAccount(acc.email)}
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  formData.email === acc.email
                    ? "bg-[#007BFF] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F9FBFF] border border-[#E5E8EC] rounded-xl text-sm text-[#0B1E3F] font-medium focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] outline-none transition"
                placeholder="admin@cribpal.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-11 py-3 bg-[#F9FBFF] border border-[#E5E8EC] rounded-xl text-sm text-[#0B1E3F] font-medium focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007BFF] hover:bg-[#0062cc] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-[#007BFF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Access Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Explore link */}
        <div className="text-center mt-6 pt-5 border-t border-gray-100">
          <Link
            href="/explore"
            className="text-xs font-bold text-gray-500 hover:text-[#007BFF] transition inline-flex items-center gap-1"
          >
            <span>Return to Explore Hostels</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
