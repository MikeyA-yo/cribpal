"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  Eye,
  Plus,
  AlertTriangle,
  Video,
  Mic,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Loader2
} from "lucide-react";
import AddHostelForm from "./AddHostelForm";
import Link from "next/link";

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
  isActive?: boolean;
  views?: number;
  createdAt?: string;
}

export default function AdminHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const response = await fetch(`/api/admin/hostels?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch hostels');

      setHostels(data.hostels || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from CribPal?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/hostels?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete hostel");
      }

      setHostels(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting hostel");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}/year`;
  };

  useEffect(() => {
    fetchHostels();
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-8 bg-[#F9FBFF] min-h-screen text-[#1E1E2F]">
      
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Listings Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1E3F]">
            Campus Hostels & Media Listings
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Manage verified listings, video tours, audio walkthroughs, and student reservations.
          </p>
        </div>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold rounded-2xl shadow-md shadow-[#007BFF]/25 hover:shadow-lg transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Hostel</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AddHostelForm 
              onSuccess={() => {
                setIsAdding(false);
                fetchHostels();
              }}
              onCancel={() => setIsAdding(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search & Stats Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#E5E8EC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-96 relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, address, or campus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-[#F9FBFF] rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-gray-500 self-end sm:self-auto">
                <span>Total Listed: <strong className="text-[#0B1E3F]">{hostels.length}</strong></span>
                <span>•</span>
                <span className="text-purple-600 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  {hostels.filter(h => h.video).length} with Video
                </span>
                <span>•</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" />
                  {hostels.filter(h => h.audio).length} with Audio
                </span>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="animate-spin text-[#007BFF] w-8 h-8 mb-3" />
                <div className="text-sm font-bold text-[#0B1E3F]">Fetching database listings...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : hostels.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-[#E5E8EC] flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-2xl flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0B1E3F] mb-1">No hostels found</h3>
                <p className="text-gray-500 text-xs mb-6 max-w-sm">
                  {searchTerm ? 'Try a different search query or clear your filter.' : 'You have not added any hostels yet. Click below to publish the first verified student accommodation.'}
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-2.5 bg-[#007BFF] text-white font-bold text-xs rounded-xl hover:bg-[#0062cc] transition shadow-md cursor-pointer"
                >
                  List New Hostel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel, index) => (
                  <motion.div
                    key={hostel._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-[#E5E8EC] overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail & Badges */}
                      <div className="h-48 bg-gray-100 relative overflow-hidden">
                        {hostel.images && hostel.images.length > 0 ? (
                          <img 
                            src={hostel.images[0]} 
                            alt={hostel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 text-xs font-bold gap-1">
                            <ImageIcon className="w-6 h-6 opacity-40" />
                            <span>No Image</span>
                          </div>
                        )}

                        {/* Price Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-[#007BFF] shadow-sm">
                          {formatPrice(hostel.price)}
                        </div>

                        {/* Campus Tag */}
                        {hostel.campusTag && (
                          <div className="absolute top-3 left-3 bg-[#0B1E3F]/85 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm">
                            {hostel.campusTag}
                          </div>
                        )}

                        {/* Media Badges overlay */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          {hostel.images && hostel.images.length > 0 && (
                            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {hostel.images.length}
                            </span>
                          )}
                          {hostel.video && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600/90 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Video
                            </span>
                          )}
                          {hostel.audio && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1">
                              <Mic className="w-3 h-3" />
                              Audio
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-base font-extrabold text-[#0B1E3F] mb-1 truncate" title={hostel.name}>
                          {hostel.name}
                        </h3>

                        <div className="flex items-center text-gray-500 text-xs mb-3 truncate">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-[#007BFF] shrink-0" />
                          <span className="truncate">{hostel.address}</span>
                        </div>

                        {hostel.distance && (
                          <p className="text-[11px] text-gray-500 mb-3 bg-[#F9FBFF] px-2.5 py-1 rounded-lg inline-block border border-gray-100 font-medium">
                            🚶 {hostel.distance}
                          </p>
                        )}
                        
                        {/* Features chips */}
                        <div className="flex flex-wrap gap-1.5 mb-4 max-h-12 overflow-hidden">
                          {hostel.features && hostel.features.slice(0, 4).map((f) => (
                            <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">
                              {f}
                            </span>
                          ))}
                          {hostel.features && hostel.features.length > 4 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-md">
                              +{hostel.features.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold">{hostel.views || 0} views</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/students/${hostel._id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#007BFF] hover:bg-blue-50 transition"
                          title="View live student page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(hostel._id, hostel.name)}
                          disabled={deletingId === hostel._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete listing"
                        >
                          {deletingId === hostel._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}