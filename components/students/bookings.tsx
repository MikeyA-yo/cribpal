"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, MapPin, CreditCard, Eye } from "lucide-react";

const savedHostels = [
  {
    name: "Sunrise Hostel",
    address: "12, University Road, Yaba, Lagos",
    price: "₦350,000/year",
    location: "https://maps.google.com/maps?q=6.5175,3.3841&z=15&output=embed",
    image: "/room1.jpg",
    features: ["Electricity", "Water", "Female Only", "WiFi"],
  },
  {
    name: "Palm Court",
    address: "5, Herbert Macaulay Way, Yaba, Lagos",
    price: "₦320,000/year",
    location: "https://maps.google.com/maps?q=6.5095,3.3757&z=15&output=embed",
    image: "/room2.jpg",
    features: ["Electricity", "Water", "Male Only", "Parking"],
  },
];

export default function Bookings() {
  const [hostels] = useState(savedHostels);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-8">Your Bookings & Saved Hostels</h2>
      {hostels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4">🏠</span>
          <div className="text-lg font-semibold mb-2">No hostels saved yet</div>
          <div className="text-sm">Start exploring and bookmark hostels you want to book or inspect.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hostels.map((hostel, idx) => (
            <motion.div
              key={hostel.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <img src={hostel.image} alt={hostel.name} className="w-full h-44 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-green-800 flex-1">{hostel.name}</h3>
                  <span className="text-green-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{(() => {
                      const segs = hostel.address.split(',');
                      return segs[1]?.trim() || hostel.address;
                    })()}</span>
                  </span>
                </div>
                <div className="text-green-700 font-semibold mb-2">{hostel.price}</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hostel.features.map((f) => (
                    <span key={f} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-green-100">
                      <CheckCircle className="w-3 h-3" /> {f}
                    </span>
                  ))}
                </div>
                {/* Map link */}
                <div className="w-full mb-3">
                  <a
                    href={hostel.location.replace('output=embed', '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    View Location on Maps
                  </a>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
                  >
                    <Eye className="w-4 h-4" /> Book Inspection
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                  >
                    <CreditCard className="w-4 h-4" /> Make Payment
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
