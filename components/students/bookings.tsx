"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, MapPin, CreditCard, Eye } from "lucide-react";

// Price formatting function
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}/year`;
}

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  images: string[];
  features: string[];
  other?: string;
  views?: number;
}

export default function Bookings() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedHostels();
  }, []);

  const fetchSavedHostels = async () => {
    try {
      setLoading(true);
      setError('');

      // First get the user's saved hostel IDs
      const savedResponse = await fetch('/api/user/saved-hostels');
      const savedResult = await savedResponse.json();

      if (!savedResult.success) {
        throw new Error(savedResult.error || 'Failed to fetch saved hostels');
      }

      const lovedHostelIds = savedResult.lovedHostels || [];

      if (lovedHostelIds.length === 0) {
        setHostels([]);
        return;
      }

      // Then fetch the actual hostel details for those IDs
      const hostelsResponse = await fetch('/api/hostels/by-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostelIds: lovedHostelIds })
      });

      const hostelsResult = await hostelsResponse.json();

      if (hostelsResult.success) {
        setHostels(hostelsResult.hostels || []);
      } else {
        throw new Error(hostelsResult.error || 'Failed to fetch hostel details');
      }

    } catch (error) {
      console.error('Error fetching saved hostels:', error);
      setError('Failed to load your saved hostels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (hostel: Hostel) => {
    if (hostel.images && hostel.images.length > 0) {
      return hostel.images[0];
    }
    // Fallback to random room image
    return `/room${Math.floor(Math.random() * 8) + 1}.jpg`;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-8">Your Bookings & Saved Hostels</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <div className="text-lg font-semibold mb-2">Loading your saved hostels...</div>
          <div className="text-sm">Please wait while we fetch your bookings.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-8">Your Bookings & Saved Hostels</h2>
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <span className="text-5xl mb-4">⚠️</span>
          <div className="text-lg font-semibold mb-2">Error loading hostels</div>
          <div className="text-sm mb-4">{error}</div>
          <button 
            onClick={fetchSavedHostels}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <img src={getImageUrl(hostel)} alt={hostel.name} className="w-full h-44 object-cover" />
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
                <div className="text-green-700 font-semibold mb-2">{formatPrice(hostel.price)}</div>
                
                {hostel.other && (
                  <div className="text-green-600 text-sm font-medium mb-2">{hostel.other}</div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {hostel.features.map((f) => (
                    <span key={f} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-green-100">
                      <CheckCircle className="w-3 h-3" /> {f}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition font-semibold text-sm"
                  >
                    <Eye className="w-3 h-3" /> Inspection
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition font-semibold text-sm"
                  >
                    <CreditCard className="w-3 h-3" /> Payment
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
