"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Building2,
  ArrowLeft
} from "lucide-react";
import { loginLocalStudent, setLocalReservedHostel } from "@/lib/student-session";
import Navbar from "@/components/Navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams?.get("redirect") || "/students";
  const hostelId = searchParams?.get("hostelId");
  const hostelName = searchParams?.get("hostelName");
  const hostelPrice = searchParams?.get("price");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const completeStudentLogin = (studentName?: string, studentEmail?: string) => {
    loginLocalStudent({
      name: studentName || "Tunde Bakare",
      email: studentEmail || (email.trim() ? email : "tunde.bakare@student.unilag.edu.ng"),
      university: "University of Lagos (UNILAG)",
      level: "300L • Pharmacy",
    });

    if (hostelId) {
      setLocalReservedHostel({
        id: hostelId,
        name: hostelName || "Emerald Court Luxury Suites",
        price: hostelPrice ? parseInt(hostelPrice) : 380000,
        status: "Pending Physical Inspection",
      });
    }

    router.push(redirectUrl);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      completeStudentLogin(undefined, email);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF] text-[#1E1E2F] font-sans selection:bg-[#007BFF]/20 relative">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          
          {/* Back button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#007BFF] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore Hostels
          </Link>

          {/* Reserved Hostel Header Notice (if coming from clicking Buy) */}
          {hostelName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#007BFF]/10 border border-[#007BFF]/25 mb-6 flex items-start gap-3"
            >
              <Building2 className="w-5 h-5 text-[#007BFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-[#0B1E3F]">
                  Reservation in Progress:
                </p>
                <p className="text-sm font-bold text-[#007BFF]">
                  {hostelName} {hostelPrice ? `(₦${parseInt(hostelPrice).toLocaleString()}/yr)` : ""}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Sign in or create your student account to finalize your booking and schedule physical inspection.
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E8EC] shadow-xl shadow-[#0B1E3F]/5">
            
            {/* Logo & Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#007BFF]/10 text-[#007BFF] mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3F]">
                Student Sign In
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Access your verified hostel bookings and inspection schedule
              </p>
            </div>

            {/* Instant Demo Access Button (Highlighted for paused MongoDB) */}
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>MongoDB Cluster Paused (Demo Mode Active)</span>
              </div>
              <p className="text-[11px] text-amber-700 mb-3 leading-relaxed">
                Test the complete flow without database errors. Click below to sign in instantly as a verified student:
              </p>
              <button
                type="button"
                onClick={() => completeStudentLogin("Tunde Bakare (UNILAG)", "tunde@student.unilag.edu.ng")}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ 1-Click Demo Student Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase">
                Or enter details
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tunde@student.unilag.edu.ng"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-sm shadow-md shadow-[#007BFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                New to CribPal?{" "}
                <Link
                  href={`/signup${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`}
                  className="font-bold text-[#007BFF] hover:underline"
                >
                  Create Student Account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center font-bold">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
