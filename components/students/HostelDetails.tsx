"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  Video,
  Mic,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location?: string;
  campusTag?: string;
  roomType?: string;
  distance?: string;
  features: string[];
  images?: string[];
  video?: string | null;
  audio?: string | null;
  other?: string;
  views: number;
  contactPhone?: string;
}

export default function HostelDetails({ hostel }: { hostel: Hostel }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [mediaTab, setMediaTab] = useState<"photos" | "video" | "audio">("photos");

  const formatPrice = (price: number) => `₦${price.toLocaleString()}/year`;

  const handleReserve = () => {
    const params = new URLSearchParams({
      redirect: "/students",
      hostelId: hostel._id,
      hostelName: hostel.name,
      price: hostel.price.toString(),
    });
    router.push(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FBFF] text-[#1E1E2F]">
      <Navbar />

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#007BFF] transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore Hostels
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media (Photos, Video, Audio) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Media Selector Tabs (if video or audio exists) */}
            {(hostel.video || hostel.audio) && (
              <div className="bg-[#0B1E3F] p-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-white shadow-md">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider px-2">Media View:</span>
                
                <button
                  type="button"
                  onClick={() => setMediaTab("photos")}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    mediaTab === "photos" ? "bg-white text-[#0B1E3F] shadow-sm" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Photos ({hostel.images?.length || 1})
                </button>

                {hostel.video && (
                  <button
                    type="button"
                    onClick={() => setMediaTab("video")}
                    className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === "video" ? "bg-purple-600 text-white shadow-sm" : "text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Tour</span>
                  </button>
                )}

                {hostel.audio && (
                  <button
                    type="button"
                    onClick={() => setMediaTab("audio")}
                    className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                      mediaTab === "audio" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-300 hover:bg-white/10"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Audio Tour</span>
                  </button>
                )}
              </div>
            )}

            {/* Main Stage */}
            <div className="bg-white rounded-3xl shadow-xl shadow-[#0B1E3F]/5 overflow-hidden border border-[#E5E8EC] p-3">
              {mediaTab === "video" && hostel.video ? (
                <div className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    src={hostel.video}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : mediaTab === "audio" && hostel.audio ? (
                <div className="h-[420px] md:h-[480px] rounded-2xl bg-gradient-to-br from-[#0B1E3F] to-[#007BFF] text-white flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mb-4 shadow-xl">
                    <Mic className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Hostel Audio Walkthrough</h3>
                  <p className="text-xs text-white/80 max-w-md mb-6 leading-relaxed">
                    Listen to verified commentary about quiet study hours, light reliability, borehole water quality, and general security.
                  </p>
                  <audio src={hostel.audio} controls autoPlay className="w-full max-w-md" />
                </div>
              ) : (
                <>
                  <div className="relative h-[400px] md:h-[460px] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    {hostel.images && hostel.images.length > 0 ? (
                      <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={hostel.images[activeImage]} 
                        alt={hostel.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                        <span>No Images Available</span>
                      </div>
                    )}
                    
                    {/* Floating Views Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold text-[#0B1E3F]">
                      <Eye className="w-3.5 h-3.5 text-[#007BFF]" /> {hostel.views || 1} Views
                    </div>

                    <div className="absolute top-4 right-4 bg-[#10B981] text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Physically Verified
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {hostel.images && hostel.images.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 px-1">
                      {hostel.images.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeImage === idx ? 'border-[#007BFF] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Audio Voice Note Widget (always available if hostel has audio) */}
            {hostel.audio && mediaTab !== "audio" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs text-[#0B1E3F]">Landlord Voice Note Commentary Available</strong>
                    <span className="text-[11px] text-gray-500">Tap below to listen while reviewing the room</span>
                  </div>
                </div>
                <audio src={hostel.audio} controls className="w-full sm:w-64 h-9" />
              </div>
            )}

            {/* Video Tour Banner (if hostel has video) */}
            {hostel.video && mediaTab !== "video" && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs text-[#0B1E3F]">Video Tour Walkthrough Available</strong>
                    <span className="text-[11px] text-gray-500">Full 360° video walk of room and compound</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaTab("video")}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
                >
                  Watch Tour
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Details, Price, Amenities, Reserve */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-[#0B1E3F]/5 border border-[#E5E8EC] p-6 sm:p-8">
              
              {/* Hostel Title & Campus Tag */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold">
                    {hostel.campusTag || "Campus Area"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                    {hostel.roomType || "Studio"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E3F] leading-snug">
                  {hostel.name}
                </h1>
                <div className="flex items-center text-gray-500 text-xs mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-[#007BFF] mr-1 shrink-0" />
                  <span>{hostel.address}</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-[#F9FBFF] p-4 rounded-2xl border border-[#E5E8EC] mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Annual Rent</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0B1E3F]">
                    {formatPrice(hostel.price)}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Zero Agent Fees
                </span>
              </div>

              {/* Proximity Pill */}
              <div className="p-3.5 rounded-2xl bg-[#F9FBFF] border border-[#E5E8EC] flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-[#007BFF] shrink-0" />
                <div className="text-xs">
                  <strong className="block text-[#0B1E3F]">Proximity to Campus Gate</strong>
                  <span className="text-gray-600">{hostel.distance || "3-5 mins walk to campus"}</span>
                </div>
              </div>

              {/* Amenities List */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">
                  Verified Amenities & Utilities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {hostel.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-[#0B1E3F] font-semibold bg-[#F9FBFF] p-2.5 rounded-xl border border-[#E5E8EC]">
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" /> 
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {hostel.other && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-2">
                    About This Accommodation
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#F9FBFF] p-4 rounded-2xl border border-[#E5E8EC]">
                    {hostel.other}
                  </p>
                </div>
              )}

              {/* Reserve CTA Button */}
              <div className="pt-2">
                <button 
                  onClick={handleReserve}
                  className="w-full py-4 px-6 bg-[#007BFF] hover:bg-[#0062cc] text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#007BFF]/25 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Reserve Space & Schedule Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2.5 font-medium">
                  Direct landlord booking • Free physical verification before payment
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
