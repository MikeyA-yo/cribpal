"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarCheck2,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Compass,
  Phone,
  MessageCircle,
  CreditCard,
  Eye,
  LogOut,
  FileCheck,
  ChevronRight
} from "lucide-react";
import {
  getLocalStudent,
  getLocalReservedHostel,
  logoutLocalStudent,
  setLocalReservedHostel,
  StudentUser,
  ReservedHostel
} from "@/lib/student-session";

function StudentsDashboardContent() {
  const searchParams = useSearchParams();
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [reservedHostel, setReservedHostel] = useState<ReservedHostel | null>(null);
  const [inspectionBooked, setInspectionBooked] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  useEffect(() => {
    // Load student session or initialize default student profile
    let currentStudent = getLocalStudent();
    if (!currentStudent) {
      currentStudent = {
        id: "student-active-01",
        name: "Tunde Bakare",
        email: "tunde.bakare@student.unilag.edu.ng",
        university: "University of Lagos (UNILAG)",
        level: "300L • Pharmacy",
        userType: "student",
      };
    }
    setStudent(currentStudent);

    // Check if a hostel was reserved from explore
    const storedHostel = getLocalReservedHostel();
    if (storedHostel) {
      setReservedHostel(storedHostel);
    } else {
      setReservedHostel({
        id: "crib-1",
        name: "Emerald Court Luxury Suites",
        price: 380000,
        location: "Akoka, Yaba • UNILAG",
        image: "/room1.jpg",
        reservedAt: "Today",
        status: "Pending Physical Inspection",
      });
    }
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B1E3F] via-[#0D2550] to-[#007BFF] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#0B1E3F]/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#50C9F2]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#50C9F2] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {student?.name || "Student"}! 🎓
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              {student?.university || "University of Lagos"} • {student?.level || "Undergraduate"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="px-5 py-3 rounded-2xl bg-white text-[#0B1E3F] font-bold text-sm hover:bg-[#F9FBFF] hover:scale-105 transition-all shadow-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#007BFF]" />
              <span>Explore More Hostels</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Reservations", value: reservedHostel ? "1 Space" : "0 Spaces", icon: <Building2 className="w-5 h-5 text-[#007BFF]" /> },
          { label: "Physical Inspections", value: inspectionBooked ? "Scheduled" : "Pending", icon: <CalendarCheck2 className="w-5 h-5 text-[#10B981]" /> },
          { label: "Agent Fees Paid", value: "₦0 (Saved 100%)", icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" /> },
          { label: "Account Status", value: "Verified Student", icon: <FileCheck className="w-5 h-5 text-[#50C9F2]" /> },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              {m.icon}
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-semibold block">{m.label}</span>
              <span className="text-sm sm:text-base font-bold text-[#0B1E3F]">{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Hostel Reservation Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-gray-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Active Space Reservation
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3F]">
              Your Reserved Accommodation
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review your reserved room, schedule free physical verification, or finalize rent payment.
            </p>
          </div>

          <span className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start sm:self-auto">
            {inspectionBooked ? "Inspection Scheduled" : "Action Required: Schedule Inspection"}
          </span>
        </div>

        {reservedHostel ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Preview */}
            <div className="lg:col-span-4 relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={reservedHostel.image || "/room1.jpg"}
                alt={reservedHostel.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#10B981] text-white text-xs font-bold">
                Reserved for You
              </div>
            </div>

            {/* Details & Actions */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-5">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1E3F]">
                    {reservedHostel.name}
                  </h3>
                  <div className="text-xl font-black text-[#007BFF]">
                    ₦{reservedHostel.price.toLocaleString()} <span className="text-xs text-gray-500 font-semibold">/year</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-4 h-4 text-[#007BFF]" />
                  {reservedHostel.location}
                </p>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 bg-[#F9FBFF] p-3 rounded-2xl border border-gray-100 mb-4 text-center">
                  <div className="p-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-[#0B1E3F] block">1. Space Held</span>
                    <span className="text-[10px] text-gray-400">Completed</span>
                  </div>
                  <div className={`p-2 rounded-xl ${inspectionBooked ? "bg-green-50" : "bg-blue-50"}`}>
                    <CalendarCheck2 className="w-5 h-5 text-[#007BFF] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-[#0B1E3F] block">2. Inspection</span>
                    <span className="text-[10px] text-[#007BFF] font-semibold">{inspectionBooked ? "Confirmed" : "Pending"}</span>
                  </div>
                  <div className="p-2">
                    <CreditCard className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-gray-600 block">3. Move In</span>
                    <span className="text-[10px] text-gray-400">Key Handover</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setInspectionBooked(true)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    inspectionBooked
                      ? "bg-green-600 text-white"
                      : "bg-[#007BFF] hover:bg-[#0062cc] text-white shadow-md shadow-[#007BFF]/25"
                  }`}
                >
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>{inspectionBooked ? "Inspection Booked for Tomorrow (10:00 AM)" : "Schedule Free Physical Inspection"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentInitiated(true)}
                  className="px-5 py-3 rounded-xl bg-[#0B1E3F] hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#50C9F2]" />
                  <span>{paymentInitiated ? "Direct Bank Transfer Details Sent" : "Pay Annual Rent (Zero Commission)"}</span>
                </button>
              </div>

              {/* Verified Landlord Contact */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Verified Hostel Admin Assigned • Desk Tel: +234 812 345 6789
                </span>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/2348123456789"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold hover:bg-green-100"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Desk
                  </a>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold text-gray-700">You haven't selected a hostel yet.</p>
            <p className="text-xs text-gray-500 mb-6">Browse our verified campus listings to pick your room.</p>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-[#007BFF] text-white font-bold text-sm"
            >
              Browse Verified Hostels
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Nearby Accommodations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0B1E3F]">
            Other Verified Spaces Near Your Campus
          </h3>
          <Link href="/explore" className="text-xs font-bold text-[#007BFF] hover:underline flex items-center gap-1">
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Campus View Premier Hall", price: 260000, img: "/room2.jpg", tag: "UI Agbowo" },
            { name: "Silver Crest Studio", price: 550000, img: "/room3.jpg", tag: "UNILAG Sabo" },
            { name: "Harmony Student Villa", price: 220000, img: "/room4.jpg", tag: "OAU Ife" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-3 flex gap-3 items-center group">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-[#007BFF] font-bold block uppercase">{item.tag}</span>
                <h4 className="text-xs font-bold text-[#0B1E3F] truncate">{item.name}</h4>
                <p className="text-xs font-black text-gray-900 mt-1">₦{item.price.toLocaleString()}/yr</p>
                <Link
                  href="/explore"
                  className="text-[11px] font-semibold text-[#007BFF] hover:underline inline-flex items-center gap-0.5 mt-1"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-[#0B1E3F]">Loading Student Portal...</div>}>
      <StudentsDashboardContent />
    </Suspense>
  );
}