"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BlueParticlesBg from "@/components/BlueParticlesBg";
import { getLocalStudent, setLocalReservedHostel } from "@/lib/student-session";
import {
  Search,
  MapPin,
  ShieldCheck,
  Zap,
  Wifi,
  DollarSign,
  Star,
  Filter,
  X,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Flame,
  Clock,
  Sparkles
} from "lucide-react";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  campusTag?: string;
  roomType?: string;
  features: string[];
  images: string[];
  other?: string;
  views?: number;
  rating?: number;
  distance?: string;
}

const DEFAULT_EXPLORE_HOSTELS: Hostel[] = [
  {
    _id: "crib-1",
    name: "Emerald Court Luxury Suites",
    address: "St. Finbarr's College Road, Akoka",
    location: "UNILAG (Akoka, Lagos)",
    campusTag: "UNILAG",
    roomType: "Self-Con Studio",
    price: 380000,
    features: ["24/7 Power", "WiFi", "Treated Water", "Uniformed Security", "AC"],
    images: ["/room1.jpg", "/room2.jpg", "/room3.jpg"],
    other: "3 mins walk to UNILAG Main Gate. 24/7 solar backup, modern kitchenette, fitted wardrobes.",
    views: 184,
    rating: 4.9,
    distance: "3 mins walk to Main Gate",
  },
  {
    _id: "crib-2",
    name: "Campus View Premier Hall",
    address: "Agbowo University Gate Area",
    location: "University of Ibadan (UI)",
    campusTag: "UI",
    roomType: "2-Man Shared",
    price: 260000,
    features: ["Backup Solar", "WiFi", "Water", "Security", "Study Room"],
    images: ["/room2.jpg", "/room1.jpg", "/room4.jpg"],
    other: "5 mins to UI SUB Gate. En-suite bathrooms, serene environment tailored for quiet study.",
    views: 122,
    rating: 4.8,
    distance: "5 mins to UI SUB Gate",
  },
  {
    _id: "crib-3",
    name: "Silver Crest Studio Apartments",
    address: "Commercial Avenue, Sabo",
    location: "Yaba Tech & UNILAG",
    campusTag: "UNILAG",
    roomType: "Executive Studio",
    price: 550000,
    features: ["Generator Backup", "WiFi", "Water", "Security", "AC", "Gym", "Parking"],
    images: ["/room3.jpg", "/room5.jpg", "/room6.jpg"],
    other: "Luxury serviced studio apartment with private balcony, fitted kitchen, and elevator access.",
    views: 290,
    rating: 5.0,
    distance: "6 mins drive to Campus",
  },
  {
    _id: "crib-4",
    name: "Harmony Student Villa",
    address: "Ilesa Road, Opposite Campus Gate",
    location: "OAU (Ile-Ife)",
    campusTag: "OAU",
    roomType: "Single Room",
    price: 220000,
    features: ["Electricity", "Borehole Water", "Security", "Study Desk"],
    images: ["/room4.jpg", "/room1.jpg", "/room2.jpg"],
    other: "Prepaid individual meter, fenced compound, serene environment with great campus shuttle access.",
    views: 95,
    rating: 4.7,
    distance: "7 mins shuttle to Gate",
  },
  {
    _id: "crib-5",
    name: "Royal Palms Student Suites",
    address: "University Road, Akoka",
    location: "UNILAG (Akoka, Lagos)",
    campusTag: "UNILAG",
    roomType: "Deluxe Self-Con",
    price: 450000,
    features: ["Inverter System", "WiFi", "Water", "Security", "Kitchenette"],
    images: ["/room5.jpg", "/room3.jpg", "/room7.jpg"],
    other: "4 mins to Education gate. Very popular with senior students and postgrads.",
    views: 210,
    rating: 4.9,
    distance: "4 mins walk to Campus",
  },
  {
    _id: "crib-6",
    name: "Apex Heights Accommodation",
    address: "South Gate Junction, FUTA Road",
    location: "FUTA (Akure)",
    campusTag: "FUTA",
    roomType: "2-Man Ensuite Flat",
    price: 290000,
    features: ["Solar Light", "Clean Water", "Security", "Parking"],
    images: ["/room6.jpg", "/room4.jpg", "/room8.jpg"],
    other: "4 mins walk to FUTA South Gate. Clean borehole water, fully interlocked compound.",
    views: 140,
    rating: 4.8,
    distance: "4 mins walk to South Gate",
  },
  {
    _id: "crib-7",
    name: "Oasis Student Residences",
    address: "LASU-Isheri Expressway, Ojo",
    location: "LASU (Ojo, Lagos)",
    campusTag: "LASU",
    roomType: "Self-Con Studio",
    price: 320000,
    features: ["24/7 Power", "Water", "Security", "WiFi"],
    images: ["/room7.jpg", "/room1.jpg"],
    other: "Modern self-con apartment with constant solar power and gated security guards.",
    views: 115,
    rating: 4.8,
    distance: "5 mins to LASU Main Gate",
  },
  {
    _id: "crib-8",
    name: "University Lodge Annex",
    address: "Bodija Extension, Ibadan",
    location: "University of Ibadan (UI)",
    campusTag: "UI",
    roomType: "Single Room",
    price: 200000,
    features: ["Electricity", "Water", "Security"],
    images: ["/room8.jpg", "/room2.jpg"],
    other: "Budget friendly, highly secure student lodge with clean shared kitchen and reading hall.",
    views: 88,
    rating: 4.6,
    distance: "8 mins to UI Second Gate",
  },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hostels, setHostels] = useState<Hostel[]>(DEFAULT_EXPLORE_HOSTELS);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(searchParams?.get("maxPrice") || "all");
  const [selectedFeature, setSelectedFeature] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [activeModalImage, setActiveModalImage] = useState(0);

  // Fetch from API with fallback
  useEffect(() => {
    async function loadHostels() {
      try {
        const res = await fetch("/api/hostels/explore");
        const data = await res.json();
        if (data.success && data.hostels && data.hostels.length > 0) {
          // Merge API hostels with fallback demo hostels
          const apiHostels = data.hostels.map((h: any, i: number) => ({
            ...h,
            images: h.images && h.images.length > 0 ? h.images : [`/room${(i % 8) + 1}.jpg`],
            distance: h.distance || "Walking distance to campus",
            rating: h.rating || 4.8,
            views: h.views || 120,
          }));
          setHostels(apiHostels);
        }
      } catch (err) {
        console.warn("API fallback to static curated list:", err);
      }
    }
    loadHostels();
  }, []);

  // Sync URL search params
  useEffect(() => {
    const q = searchParams?.get("search");
    if (q) setSearchTerm(q);
    const maxP = searchParams?.get("maxPrice");
    if (maxP) setSelectedMaxPrice(maxP);
  }, [searchParams]);

  // Filtering Logic
  const filtered = hostels.filter((hostel) => {
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = hostel.name.toLowerCase().includes(q);
      const matchLocation = hostel.location?.toLowerCase().includes(q);
      const matchAddress = hostel.address?.toLowerCase().includes(q);
      if (!matchName && !matchLocation && !matchAddress) return false;
    }

    // Campus filter
    if (selectedCampus !== "all") {
      const matchCampus =
        hostel.campusTag?.toLowerCase() === selectedCampus.toLowerCase() ||
        hostel.location?.toLowerCase().includes(selectedCampus.toLowerCase());
      if (!matchCampus) return false;
    }

    // Room Type filter
    if (selectedRoomType !== "all") {
      const matchType = hostel.roomType?.toLowerCase().includes(selectedRoomType.toLowerCase());
      if (!matchType) return false;
    }

    // Price filter
    if (selectedMaxPrice !== "all") {
      const max = parseInt(selectedMaxPrice);
      if (hostel.price > max) return false;
    }

    // Features filter
    if (selectedFeature.length > 0) {
      const hasAll = selectedFeature.every((f) =>
        hostel.features?.some((hf) => hf.toLowerCase().includes(f.toLowerCase()))
      );
      if (!hasAll) return false;
    }

    return true;
  });

  // Sorting
  const sortedHostels = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 4.8) - (a.rating || 4.8);
    return (b.views || 0) - (a.views || 0); // recommended/popular
  });

  // Action: Buy / Reserve Room
  const handleBuyHostel = (hostel: Hostel) => {
    // Save hostel in local session for dashboard display
    setLocalReservedHostel({
      id: hostel._id,
      name: hostel.name,
      price: hostel.price,
      location: hostel.location,
      image: hostel.images?.[0] || "/room1.jpg",
      status: "Pending Physical Inspection",
    });

    const student = getLocalStudent();
    if (!student) {
      // Not logged in -> Take to login/signup page before /students
      const params = new URLSearchParams({
        redirect: "/students",
        hostelId: hostel._id,
        hostelName: hostel.name,
        price: hostel.price.toString(),
        location: hostel.location,
      });
      router.push(`/login?${params.toString()}`);
    } else {
      // Logged in -> Proceed directly to student dashboard
      router.push(`/students?booked=${hostel._id}`);
    }
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeature((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF] text-[#1E1E2F] font-sans selection:bg-[#007BFF]/20 relative">
      <BlueParticlesBg />
      <Navbar />

      {/* Hero Search & Filter Header */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#E5E8EC] bg-white/70 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> 100% Physically Verified Campus Living
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0B1E3F] tracking-tight">
                Explore Available Hostels
              </h1>
              <p className="text-sm sm:text-base text-[#1E1E2F]/70 mt-1">
                Browse verified rooms, filter by distance to lecture halls, and secure your space with zero agent fees.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-[#F9FBFF] border border-[#E5E8EC] text-right">
                <span className="text-xs text-[#1E1E2F]/60 font-semibold block">Available Spaces</span>
                <span className="text-lg font-black text-[#0B1E3F]">{sortedHostels.length} Verified Cribs</span>
              </div>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="bg-white rounded-2xl p-2 sm:p-3 border border-[#E5E8EC] shadow-md shadow-[#0B1E3F]/5 flex flex-col sm:flex-row gap-3 items-center mb-6">
            <div className="flex-1 flex items-center gap-2 pl-3 w-full">
              <Search className="w-5 h-5 text-[#007BFF] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hostel name, campus, or street (e.g. UNILAG, Agbowo, Akoka)..."
                className="w-full bg-transparent text-sm sm:text-base text-[#0B1E3F] font-medium placeholder-[#1E1E2F]/40 focus:outline-none py-1"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Quick Dropdown */}
            <div className="w-full sm:w-auto flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#E5E8EC] pt-2 sm:pt-0 sm:pl-3">
              <select
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
                className="bg-[#F9FBFF] border border-[#E5E8EC] rounded-xl px-3 py-2 text-xs font-bold text-[#0B1E3F] focus:outline-none focus:border-[#007BFF]"
              >
                <option value="all">Any Price</option>
                <option value="250000">Under ₦250,000</option>
                <option value="400000">Under ₦400,000</option>
                <option value="600000">Under ₦600,000</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F9FBFF] border border-[#E5E8EC] rounded-xl px-3 py-2 text-xs font-bold text-[#0B1E3F] focus:outline-none focus:border-[#007BFF]"
              >
                <option value="recommended">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Campus Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-[#0B1E3F] whitespace-nowrap mr-1">Campuses:</span>
            {[
              { label: "All Campuses", key: "all" },
              { label: "UNILAG (Lagos)", key: "UNILAG" },
              { label: "UI (Ibadan)", key: "UI" },
              { label: "OAU (Ife)", key: "OAU" },
              { label: "FUTA (Akure)", key: "FUTA" },
              { label: "LASU (Ojo)", key: "LASU" },
            ].map((camp) => (
              <button
                key={camp.key}
                onClick={() => setSelectedCampus(camp.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCampus === camp.key
                    ? "bg-[#0B1E3F] text-white shadow-sm"
                    : "bg-white border border-[#E5E8EC] text-[#0B1E3F] hover:border-[#007BFF]"
                }`}
              >
                {camp.label}
              </button>
            ))}
          </div>

          {/* Amenity Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
            <span className="text-xs font-bold text-[#0B1E3F] whitespace-nowrap mr-1">Amenities:</span>
            {["24/7 Power", "WiFi", "Water", "Security", "AC", "Gym", "Study Room"].map((feat) => {
              const active = selectedFeature.includes(feat);
              return (
                <button
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#007BFF] text-white"
                      : "bg-[#F9FBFF] border border-[#E5E8EC] text-[#1E1E2F]/70 hover:border-[#007BFF]"
                  }`}
                >
                  {feat}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Hostels Grid Section */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {sortedHostels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E8EC] p-8 max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0B1E3F] mb-2">No hostels match your filter</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search terms, changing the campus, or clearing amenity filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCampus("all");
                setSelectedMaxPrice("all");
                setSelectedFeature([]);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#007BFF] text-white font-bold text-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedHostels.map((hostel, i) => (
              <motion.div
                key={hostel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#E5E8EC] hover:border-[#007BFF]/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Top Badges */}
                <div 
                  className="relative h-60 w-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedHostel(hostel);
                    setActiveModalImage(0);
                  }}
                >
                  <Image
                    src={hostel.images?.[0] || "/room1.jpg"}
                    alt={hostel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10B981] text-white text-[11px] font-bold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[11px] font-medium">
                      {hostel.roomType || "Studio"}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[#0B1E3F] text-xs font-bold shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#F39C12] fill-[#F39C12]" />
                    {hostel.rating || 4.8}
                  </div>

                  {/* Distance to Campus Badge */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-[#50C9F2] shrink-0" />
                    <span className="truncate">{hostel.distance || hostel.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => {
                        setSelectedHostel(hostel);
                        setActiveModalImage(0);
                      }}
                      className="text-lg font-bold text-[#0B1E3F] group-hover:text-[#007BFF] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {hostel.name}
                    </h3>
                    <p className="text-xs text-[#1E1E2F]/60 font-medium mt-0.5">
                      {hostel.location}
                    </p>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 my-3.5">
                      {hostel.features?.slice(0, 4).map((f, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold bg-[#F9FBFF] border border-[#E5E8EC] text-[#0B1E3F] px-2 py-0.5 rounded-md"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-[#E5E8EC] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#1E1E2F]/60 font-bold block">
                        Annual Rent
                      </span>
                      <div className="text-lg sm:text-xl font-black text-[#0B1E3F]">
                        ₦{hostel.price.toLocaleString()}
                        <span className="text-xs font-semibold text-[#1E1E2F]/60"> /yr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHostel(hostel);
                          setActiveModalImage(0);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-[#F9FBFF] hover:bg-[#E5E8EC] text-[#0B1E3F] text-xs font-bold border border-[#E5E8EC] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Main Buy / Reserve Action Button */}
                      <button
                        type="button"
                        onClick={() => handleBuyHostel(hostel)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#007BFF] hover:bg-[#0062cc] text-white text-xs font-bold transition-all shadow-md shadow-[#007BFF]/20 cursor-pointer"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Hostel Details Modal */}
      <AnimatePresence>
        {selectedHostel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 my-8 relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedHostel(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Carousel */}
              <div className="relative h-72 sm:h-80 w-full shrink-0 overflow-hidden bg-gray-900">
                <Image
                  src={selectedHostel.images?.[activeModalImage] || "/room1.jpg"}
                  alt={selectedHostel.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Thumbnails */}
                {selectedHostel.images && selectedHostel.images.length > 1 && (
                  <div className="absolute bottom-3 left-4 flex gap-2 z-10">
                    {selectedHostel.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImage(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                          activeModalImage === idx ? "border-[#007BFF] scale-105" : "border-white/50 opacity-70"
                        }`}
                      >
                        <Image src={img} alt="thumb" width={48} height={48} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#10B981] text-white text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" /> 100% Physically Verified
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E3F]">
                      {selectedHostel.name}
                    </h2>
                    <p className="text-sm text-[#1E1E2F]/70 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-[#007BFF]" />
                      {selectedHostel.address}, {selectedHostel.location}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#1E1E2F]/60 font-semibold block uppercase">Rent Per Year</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#0B1E3F]">
                      ₦{selectedHostel.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Proximity & Trust Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#F9FBFF] border border-[#E5E8EC] flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#007BFF]" />
                    <div className="text-xs">
                      <strong className="block text-[#0B1E3F]">Proximity to Campus</strong>
                      <span className="text-gray-600">{selectedHostel.distance || "3 mins walk to Main Gate"}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F9FBFF] border border-[#E5E8EC] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <div className="text-xs">
                      <strong className="block text-[#0B1E3F]">Zero Agent Extortion</strong>
                      <span className="text-gray-600">₦0 inspection & booking charges</span>
                    </div>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">
                    Verified Amenities
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedHostel.features?.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#0B1E3F] bg-[#F9FBFF] p-2.5 rounded-xl border border-[#E5E8EC]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedHostel.other && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-[#0B1E3F] uppercase tracking-wider mb-2">
                      Property Details
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-[#F9FBFF] p-4 rounded-2xl border border-[#E5E8EC]">
                      {selectedHostel.other}
                    </p>
                  </div>
                )}

                {/* Primary Buy / Reserve Modal CTA */}
                <div className="pt-4 border-t border-[#E5E8EC] flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleBuyHostel(selectedHostel)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-base shadow-xl shadow-[#007BFF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Buy / Reserve This Space (₦{selectedHostel.price.toLocaleString()})</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHostel(null)}
                    className="py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#0B1E3F] font-bold text-sm transition-colors cursor-pointer"
                  >
                    Keep Browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9FBFF] flex items-center justify-center text-[#0B1E3F] font-bold">Loading Cribs...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
