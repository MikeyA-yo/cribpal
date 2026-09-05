"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Eye, Filter, X, Zap, Wifi, Shield, DollarSign, Bed } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  features: string[];
  images?: string[];
  other: string;
  views: number;
}

export default function Explore() {
  const searchParams = useSearchParams();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({ minPrice: "", maxPrice: "", features: [] as string[] });
  
  const allFeatures = ["WiFi", "Electricity", "Water", "Security", "AC", "Gym", "Study Room", "Parking"];

  const fetchHostels = async (filters: any = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.features && filters.features.length) params.append('features', filters.features.join(','));

      const res = await fetch(`/api/hostels/explore?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHostels(data.hostels);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams?.get('search') || '';
    const max = searchParams?.get('maxPrice') || '';
    const min = searchParams?.get('minPrice') || '';
    if (q || max || min) {
      setSearchTerm(q);
      setTempFilters(prev => ({ ...prev, maxPrice: max, minPrice: min }));
      fetchHostels({ search: q, maxPrice: max, minPrice: min });
    } else {
      fetchHostels();
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHostels({ search: searchTerm, ...tempFilters });
  };

  const applyFilters = () => {
    fetchHostels({ search: searchTerm, ...tempFilters });
    setShowFilters(false);
  };

  const toggleFeature = (feature: string) => {
    setTempFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
    }));
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString()}/year`;

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-skyBlue/20 blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-darkBlue mb-4 tracking-tight">
            Discover Your Perfect Space
          </h1>
          <p className="text-lg text-graphite/80 max-w-2xl mx-auto">
            Browse through premium, verified student accommodations tailored just for you.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-full p-2 max-w-3xl mx-auto flex items-center mb-12 transform hover:scale-[1.01] transition-transform duration-300">
          <form onSubmit={handleSearch} className="flex-1 flex items-center pl-4">
            <Search className="w-5 h-5 text-primary" />
            <input 
              type="text" 
              placeholder="Search by name, address, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 outline-none px-4 py-3 text-darkBlue placeholder-gray-400 font-medium"
            />
          </form>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-darkBlue font-semibold transition"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button 
            onClick={handleSearch}
            className="ml-2 bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            Search
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 mb-12 max-w-3xl mx-auto border border-white/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-darkBlue text-xl">Advanced Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-graphite mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" /> Price Range
                  </label>
                  <div className="flex gap-4">
                    <input type="number" placeholder="Min" value={tempFilters.minPrice} onChange={e => setTempFilters({...tempFilters, minPrice: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none" />
                    <input type="number" placeholder="Max" value={tempFilters.maxPrice} onChange={e => setTempFilters({...tempFilters, maxPrice: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-graphite mb-3">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {allFeatures.map(f => (
                      <button 
                        key={f}
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${tempFilters.features.includes(f) ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button onClick={() => { setTempFilters({minPrice: "", maxPrice: "", features: []}); fetchHostels(); setShowFilters(false); }} className="px-6 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition">Clear All</button>
                <button onClick={applyFilters} className="px-6 py-2 bg-darkBlue text-white font-bold rounded-lg shadow-md hover:bg-blue-900 transition">Apply Filters</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hostels Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-graphite font-medium">Fetching premium spaces...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
            <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-darkBlue mb-2">No Hostels Found</h3>
            <p className="text-gray-500">We couldn't find any hostels matching your criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostels.map((hostel, index) => (
              <motion.div
                key={hostel._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 overflow-hidden group cursor-pointer flex flex-col transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  {hostel.images && hostel.images.length > 0 ? (
                    <img 
                      src={hostel.images[0]} 
                      alt={hostel.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                  )}
                  {/* Floating Price Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                    <span className="font-extrabold text-primary">{formatPrice(hostel.price)}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-darkBlue mb-2 line-clamp-1 group-hover:text-primary transition-colors">{hostel.name}</h3>
                    <div className="flex items-start gap-1 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-skyBlue" />
                      <span className="line-clamp-2">{hostel.address}, {hostel.location}</span>
                    </div>
                  </div>

                  {/* Features Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6 h-[52px] overflow-hidden">
                    {hostel.features.slice(0, 3).map(f => (
                      <span key={f} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cloud text-graphite text-xs font-semibold">
                        {f === 'Electricity' ? <Zap className="w-3 h-3 text-orange-500" /> : 
                         f === 'WiFi' ? <Wifi className="w-3 h-3 text-blue-500" /> : 
                         f === 'Security' ? <Shield className="w-3 h-3 text-green-500" /> : null}
                        {f}
                      </span>
                    ))}
                    {hostel.features.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-medium border border-gray-100">
                        +{hostel.features.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm font-medium">
                      <Eye className="w-4 h-4 mr-1.5" /> {hostel.views || 0} views
                    </div>
                    <Link 
                      href={`/students/${hostel._id}`} 
                      className="px-5 py-2 bg-darkBlue text-white text-sm font-bold rounded-full hover:bg-primary hover:shadow-lg transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}