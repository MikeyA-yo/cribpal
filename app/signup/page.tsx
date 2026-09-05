"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { loginLocalStudent, setLocalReservedHostel } from "@/lib/student-session";
import Navbar from "@/components/Navbar";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams?.get("redirect") || "/students";
  const hostelId = searchParams?.get("hostelId");
  const hostelName = searchParams?.get("hostelName");
  const hostelPrice = searchParams?.get("price");

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("UNILAG");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const completeSignUp = (studentName?: string, studentEmail?: string) => {
    loginLocalStudent({
      name: studentName || (name.trim() ? name : "Student"),
      email: studentEmail || (email.trim() ? email : "student@university.edu.ng"),
      university: university === "UNILAG" ? "University of Lagos" : university,
      level: "Student",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      completeSignUp();
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF] text-[#1E1E2F] font-sans selection:bg-[#007BFF]/20 relative">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#007BFF] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore Hostels
          </Link>

          <div className="bg-white rounded-3xl p-8 border border-[#E5E8EC] shadow-xl shadow-[#0B1E3F]/5">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#007BFF]/10 text-[#007BFF] mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3F]">
                Create Student Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Zero agent fees • 100% physically inspected hostels
              </p>
            </div>

            {/* Quick Demo Access (for paused MongoDB) */}
            <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>MongoDB Cluster Paused (Demo Mode Active)</span>
              </div>
              <button
                type="button"
                onClick={() => completeSignUp("Aisha Mohammed (UI)", "aisha@student.ui.edu.ng")}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <span>⚡ 1-Click Instant Demo Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tunde Bakare"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1">
                  University / Campus
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] font-medium cursor-pointer"
                >
                  <option value="UNILAG">University of Lagos (UNILAG)</option>
                  <option value="UI">University of Ibadan (UI)</option>
                  <option value="OAU">Obafemi Awolowo University (OAU)</option>
                  <option value="FUTA">Federal University of Technology Akure (FUTA)</option>
                  <option value="LASU">Lagos State University (LASU)</option>
                  <option value="OTHER">Other Campus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1">
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
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider block mb-1">
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
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E8EC] bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{loading ? "Creating Account..." : "Create Account & Proceed"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href={`/login${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`}
                  className="font-bold text-[#007BFF] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center font-bold">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
