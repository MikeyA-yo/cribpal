"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, CheckCircle, Eye, ArrowLeft, Image as ImageIcon, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  features: string[];
  images?: string[];
  other?: string;
  views: number;
}

export default function HostelDetails({ hostel }: { hostel: Hostel }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const formatPrice = (price: number) => `₦${price.toLocaleString()}/year`;

  const handleBook = () => {
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      setBooked(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Explore
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-2">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gray-100 mb-4">
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
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-sm font-bold text-gray-700">
                  <Eye className="w-4 h-4 text-blue-500" /> {hostel.views} Views
                </div>
              </div>

              {/* Thumbnails */}
              {hostel.images && hostel.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 px-2 custom-scrollbar">
                  {hostel.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-darkBlue mb-4 leading-tight">{hostel.name}</h1>
              <div className="flex items-center text-gray-500 mb-6 font-medium">
                <MapPin className="w-5 h-5 text-skyBlue mr-2 flex-shrink-0" />
                <span>{hostel.address}, {hostel.location}</span>
              </div>
              
              <div className="text-4xl font-black text-primary mb-8 pb-8 border-b border-gray-100">
                {formatPrice(hostel.price)}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-darkBlue mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                  {hostel.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <CheckCircle className="w-4 h-4 text-green-500" /> 
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hostel.other && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-darkBlue mb-3">About this space</h3>
                  <p className="text-gray-600 leading-relaxed bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    {hostel.other}
                  </p>
                </div>
              )}

              <div className="mt-auto pt-6">
                {booked ? (
                  <div className="w-full py-4 bg-green-500 text-white text-center rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
                    <Check className="w-6 h-6" /> Booking Request Sent!
                  </div>
                ) : (
                  <button 
                    onClick={handleBook}
                    disabled={booking}
                    className="w-full py-4 bg-darkBlue hover:bg-primary text-white rounded-xl font-bold text-lg transition-all shadow-[0_8px_30px_rgb(0,123,255,0.3)] hover:shadow-[0_8px_30px_rgb(0,123,255,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                  >
                    {booking ? "Processing..." : "Book This Hostel"}
                  </button>
                )}
                <p className="text-center text-sm text-gray-400 mt-4 font-medium">No credit card required for reservation request.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
