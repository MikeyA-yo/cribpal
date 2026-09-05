"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MapPin, 
  Eye,
  Plus,
  AlertTriangle
} from "lucide-react";
import AddHostelForm from "./AddHostelForm";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  features: string[];
  images?: string[];
  other: string;
  isActive: boolean;
  views: number;
  createdAt: string;
}

export default function AdminHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      // Admin sees everything, we removed manager check

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

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}/year`;
  };

  useEffect(() => {
    fetchHostels();
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Hostels Management
          </h1>
          <p className="text-gray-600">
            List and manage all student hostels on the platform.
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Hostel
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
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hostels by name, address, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-lg font-semibold mb-2">Loading hostels...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {error}
              </div>
            ) : hostels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No hostels yet</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {searchTerm ? 'Try adjusting your search query.' : 'Get started by listing the first student hostel on CribPal.'}
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full hover:bg-blue-200 transition"
                >
                  List a Hostel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel, index) => (
                  <motion.div
                    key={hostel._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {hostel.images && hostel.images.length > 0 ? (
                        <img 
                          src={hostel.images[0]} 
                          alt={hostel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                        {formatPrice(hostel.price)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{hostel.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{hostel.address}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4 h-14 overflow-hidden">
                        {hostel.features.map(f => (
                          <span key={f} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {hostel.views || 0}
                        </span>
                        <span>
                          Added {new Date(hostel.createdAt).toLocaleDateString()}
                        </span>
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