"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import BlueParticlesBg from "../components/BlueParticlesBg";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Zap,
  Wifi,
  DollarSign,
  Star,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Clock,
  Building2,
  Users,
  XCircle,
  Flame,
  GraduationCap,
  Heart,
  Eye,
  Check
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Quick Search Form State
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRoomType, setSearchRoomType] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  // Featured Hostels Filter Tab
  const [activeCategory, setActiveCategory] = useState("all");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.append("search", searchLocation);
    if (searchMaxPrice) params.append("maxPrice", searchMaxPrice);
    router.push(`/explore?${params.toString()}`);
  };

  const handleQuickCampus = (campusName: string) => {
    setSearchLocation(campusName);
    router.push(`/explore?search=${encodeURIComponent(campusName)}`);
  };

  const featuredHostels = [
    {
      id: "1",
      name: "Emerald Court Luxury Suites",
      campus: "UNILAG (Akoka, Lagos)",
      distance: "3 mins walk to Main Gate",
      price: 380000,
      image: "/room1.jpg",
      rating: 4.9,
      reviews: 42,
      category: "unilag",
      type: "Self-Con Studio",
      amenities: ["24/7 Power", "High-speed WiFi", "Treated Water", "CCTV & Security"],
      popular: true,
    },
    {
      id: "2",
      name: "Campus View Premier Hall",
      campus: "University of Ibadan (Agbowo)",
      distance: "5 mins to UI SUB Gate",
      price: 260000,
      image: "/room2.jpg",
      rating: 4.8,
      reviews: 35,
      category: "ui",
      type: "Executive 2-Man Shared",
      amenities: ["Backup Solar", "En-suite Bath", "Reading Lounge", "Water Supply"],
      popular: false,
    },
    {
      id: "3",
      name: "Silver Crest Residence",
      campus: "Yaba Tech & UNILAG",
      distance: "6 mins drive / bus stop opposite",
      price: 550000,
      image: "/room3.jpg",
      rating: 5.0,
      reviews: 64,
      category: "unilag",
      type: "Modern Serviced Studio",
      amenities: ["Generator Backup", "Air Conditioning", "Private Balcony", "Gym Area"],
      popular: true,
    },
    {
      id: "4",
      name: "Harmony Student Villa",
      campus: "OAU (Ilesa Road, Ile-Ife)",
      distance: "7 mins shuttle to Campus",
      price: 220000,
      image: "/room4.jpg",
      rating: 4.7,
      reviews: 28,
      category: "oau",
      type: "Standard Single Room",
      amenities: ["Prepaid Meter", "Fenced & Gated", "Borehole Water", "Quiet Zone"],
      popular: false,
    },
    {
      id: "5",
      name: "Royal Palms Student Suites",
      campus: "UNILAG (St. Finbarrs, Akoka)",
      distance: "4 mins walk to Education gate",
      price: 450000,
      image: "/room5.jpg",
      rating: 4.9,
      reviews: 51,
      category: "unilag",
      type: "Deluxe Self-Con",
      amenities: ["Inverter System", "Kitchenette", "Wardrobe", "Security Guard"],
      popular: true,
    },
    {
      id: "6",
      name: "Apex Heights Accommodation",
      campus: "FUTA (South Gate, Akure)",
      distance: "4 mins walk to South Gate",
      price: 290000,
      image: "/room6.jpg",
      rating: 4.8,
      reviews: 39,
      category: "futa",
      type: "2-Man Ensuite Flat",
      amenities: ["Solar Light", "Paved Compound", "Clean Water", "Reading Room"],
      popular: false,
    },
  ];

  const filteredHostels =
    activeCategory === "all"
      ? featuredHostels
      : featuredHostels.filter((h) => h.category === activeCategory);

  const faqs = [
    {
      q: "Is CribPal really 100% free of agent and inspection fees?",
      a: "Yes, absolutely! On CribPal, students never pay ₦5,000 or ₦10,000 inspection fees, nor do you pay 10-20% commission to any street agent. You browse, book, and inspect verified accommodations completely free of extortionate middleman charges.",
    },
    {
      q: "How does CribPal verify each hostel listing?",
      a: "Every single hostel listed on CribPal is physically visited and inspected by our verified campus field reps. We verify running water, electricity/generator schedules, perimeter security, room dimensions, and lock safety before giving a property our 'Verified by CribPal' badge.",
    },
    {
      q: "Can I inspect the hostel in person before paying rent?",
      a: "Yes! While our listings feature verified room galleries and detailed videos, you can easily schedule a free physical visit with the verified hostel administrator to view the property in person before paying.",
    },
    {
      q: "What essential utilities are guaranteed in verified hostels?",
      a: "All verified listings must disclose verified water availability (borehole/treatment), power backup (solar, inverter, or generator operating hours), and security measures (gated compound, security guards, or CCTV).",
    },
    {
      q: "How do I secure my room and make payment safely?",
      a: "Once you find your desired hostel, you can reserve your space directly through the platform or connect with the verified hostel administrator. You receive a verified digital receipt and your official tenancy tenancy agreement.",
    },
    {
      q: "I manage or own a student hostel. How do I list on CribPal?",
      a: "Property administrators and verified hostel managers can contact our admin team directly through the platform. Our inspection officers will schedule a site visit to verify your property and list it on CribPal.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF] text-[#1E1E2F] font-sans selection:bg-[#007BFF]/20 overflow-x-hidden relative">
      <BlueParticlesBg />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#50C9F2]/15 via-[#007BFF]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#50C9F2]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Messaging & Interactive Quick-Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-[#007BFF]/20 shadow-sm backdrop-blur-md mb-6 hover:border-[#007BFF]/40 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-[#0B1E3F] tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#007BFF]" />
                  100% Physically Verified Hostels • 0% Agent Fees
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1E3F] leading-[1.12] mb-6">
                Find Your Ideal <br className="hidden sm:inline" />
                Student Crib,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] via-[#0052cc] to-[#50C9F2]">
                  Zero Agent Drama.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-[#1E1E2F]/80 leading-relaxed mb-8 max-w-2xl">
                Say goodbye to fake photos, endless walking, and extortionate 20% agent fees. 
                Discover verified student accommodations near your campus with guaranteed power, water, and direct admin booking.
              </p>

              {/* Interactive Quick Search Widget Card */}
              <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#0B1E3F]/5 border border-[#E5E8EC] mb-6">
                <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Campus / Location Input */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#007BFF]" /> Campus or Area
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. UNILAG, Yaba, UI..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full bg-[#F9FBFF] border border-[#E5E8EC] rounded-2xl px-3.5 py-3 text-sm text-[#0B1E3F] font-medium placeholder-[#1E1E2F]/40 focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Room Type Selector */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#007BFF]" /> Room Type
                    </label>
                    <select
                      value={searchRoomType}
                      onChange={(e) => setSearchRoomType(e.target.value)}
                      className="w-full bg-[#F9FBFF] border border-[#E5E8EC] rounded-2xl px-3.5 py-3 text-sm text-[#0B1E3F] font-medium focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10 transition-all cursor-pointer"
                    >
                      <option value="">Any Room Type</option>
                      <option value="single">Single Room</option>
                      <option value="self-con">Self-Con / Studio</option>
                      <option value="shared">2-Man Shared</option>
                      <option value="flat">3+ Bedroom Flat</option>
                    </select>
                  </div>

                  {/* Max Budget Selector */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#007BFF]" /> Max Budget
                    </label>
                    <select
                      value={searchMaxPrice}
                      onChange={(e) => setSearchMaxPrice(e.target.value)}
                      className="w-full bg-[#F9FBFF] border border-[#E5E8EC] rounded-2xl px-3.5 py-3 text-sm text-[#0B1E3F] font-medium focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10 transition-all cursor-pointer"
                    >
                      <option value="">Any Budget</option>
                      <option value="250000">Under ₦250k / yr</option>
                      <option value="400000">Under ₦400k / yr</option>
                      <option value="600000">Under ₦600k / yr</option>
                      <option value="1000000">Under ₦1.0M / yr</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-base shadow-lg shadow-[#007BFF]/25 hover:shadow-xl hover:shadow-[#007BFF]/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Search className="w-5 h-5" />
                      <span>Search Verified Hostels</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Popular Campus Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1E1E2F]/70">
                <span className="font-semibold text-[#0B1E3F]">Popular Campuses:</span>
                {["UNILAG", "UI Ibadan", "OAU Ife", "FUTA", "LASU"].map((camp) => (
                  <button
                    key={camp}
                    type="button"
                    onClick={() => handleQuickCampus(camp)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E8EC] text-[#0B1E3F] font-medium hover:border-[#007BFF] hover:text-[#007BFF] hover:bg-[#007BFF]/5 transition-colors cursor-pointer shadow-2xs"
                  >
                    {camp}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Layered Interactive PropTech Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              {/* Outer decorative card shadow */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-[#0B1E3F]/10 border border-[#E5E8EC] relative z-10 group">
                  {/* Photo with badges */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src="/room1.jpg"
                      alt="Verified Student Hostel"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Top verified badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981] text-white text-xs font-bold shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                      Verified by CribPal
                    </div>

                    {/* Top rating badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0B1E3F] text-xs font-bold shadow-md">
                      <Star className="w-3.5 h-3.5 text-[#F39C12] fill-[#F39C12]" />
                      4.9 (42)
                    </div>

                    {/* Campus distance overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-xs font-medium mb-1.5">
                        <MapPin className="w-3 h-3 text-[#50C9F2]" />
                        3 mins walk to UNILAG Main Gate
                      </span>
                      <h3 className="text-xl font-bold text-white drop-shadow-sm">
                        Emerald Court Luxury Suites
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs text-[#1E1E2F]/60 font-semibold block uppercase tracking-wider">
                          Annual Rent
                        </span>
                        <div className="text-2xl font-black text-[#0B1E3F]">
                          ₦380,000 <span className="text-sm font-semibold text-[#1E1E2F]/60">/ year</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
                        ₦0 Agent Fee
                      </span>
                    </div>

                    {/* Verified Amenities */}
                    <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs text-[#0B1E3F] font-semibold">
                      <div className="flex items-center gap-2 bg-[#F9FBFF] p-2 rounded-xl border border-[#E5E8EC]">
                        <Zap className="w-4 h-4 text-[#007BFF]" /> 24/7 Power Backup
                      </div>
                      <div className="flex items-center gap-2 bg-[#F9FBFF] p-2 rounded-xl border border-[#E5E8EC]">
                        <Wifi className="w-4 h-4 text-[#007BFF]" /> Free High-Speed WiFi
                      </div>
                      <div className="flex items-center gap-2 bg-[#F9FBFF] p-2 rounded-xl border border-[#E5E8EC]">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Uniformed Security
                      </div>
                      <div className="flex items-center gap-2 bg-[#F9FBFF] p-2 rounded-xl border border-[#E5E8EC]">
                        <CheckCircle2 className="w-4 h-4 text-[#007BFF]" /> Treated Water Supply
                      </div>
                    </div>

                    {/* Direct CTA */}
                    <Link
                      href="/explore"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0B1E3F] hover:bg-[#007BFF] text-white font-bold text-sm transition-colors"
                    >
                      <span>Explore Accommodations</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Floating Social Proof Pill (Left) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="hidden sm:flex absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-xl border border-[#E5E8EC] p-3.5 rounded-2xl shadow-xl items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0B1E3F]">Zero Inspection Fee</div>
                    <div className="text-[11px] text-[#1E1E2F]/70">No agent extortion ever</div>
                  </div>
                </motion.div>

                {/* Floating Students Count Pill (Right) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="hidden sm:flex absolute -top-6 -right-4 z-20 bg-white/95 backdrop-blur-xl border border-[#E5E8EC] p-3 rounded-2xl shadow-xl items-center gap-2.5"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    <Image src="/cgstd.jpg" alt="Student" width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" />
                    <Image src="/collegestudent.jpg" alt="Student" width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" />
                    <Image src="/cgstds.jpg" alt="Student" width={28} height={28} className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" />
                  </div>
                  <div className="text-xs font-bold text-[#0B1E3F]">
                    10k+ <span className="font-medium text-[#1E1E2F]/70">Students Housed</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust & Performance Metrics Bar */}
      <section className="relative z-10 border-y border-[#E5E8EC] bg-white/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E8EC]">
            {[
              { label: "Verified Hostels", value: "500+", desc: "Physically inspected" },
              { label: "Agent Commission", value: "₦0", desc: "100% Free for students" },
              { label: "Campuses Covered", value: "25+", desc: "Across Nigeria" },
              { label: "Student Rating", value: "4.9/5", desc: "Based on 3,500+ reviews" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center pt-4 sm:pt-0"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#0B1E3F] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[#007BFF] mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-[#1E1E2F]/60 mt-0.5">
                  {stat.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "How It Works" 3-Step Interactive Visual Guide */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-3 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Simple 3-Step Journey
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1E3F] tracking-tight mb-4">
              How CribPal Works
            </h2>
            <p className="text-base sm:text-lg text-[#1E1E2F]/70">
              We took the painful Nigerian student housing search and re-engineered it to be simple, verified, and completely stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-[#E5E8EC] shadow-lg shadow-[#0B1E3F]/5 relative flex flex-col hover:border-[#007BFF]/40 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#007BFF]/10 text-[#007BFF] flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#007BFF] group-hover:text-white transition-colors duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-[#0B1E3F] mb-3">
                Search & Filter
              </h3>
              <p className="text-sm text-[#1E1E2F]/70 leading-relaxed mb-6">
                Filter verified hostels by campus proximity, budget, and specific amenities like 24/7 power, WiFi, and en-suite bathrooms.
              </p>
              <div className="mt-auto pt-4 border-t border-[#E5E8EC] flex items-center gap-2 text-xs font-semibold text-[#007BFF]">
                <Search className="w-4 h-4" /> Instant Campus Matching
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-[#E5E8EC] shadow-lg shadow-[#0B1E3F]/5 relative flex flex-col hover:border-[#007BFF]/40 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#50C9F2]/15 text-[#007BFF] flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#007BFF] group-hover:text-white transition-colors duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-[#0B1E3F] mb-3">
                Inspect Free & Connect
              </h3>
              <p className="text-sm text-[#1E1E2F]/70 leading-relaxed mb-6">
                View verified high-res galleries and 360° videos. Schedule an in-person viewing with zero inspection charges or middlemen.
              </p>
              <div className="mt-auto pt-4 border-t border-[#E5E8EC] flex items-center gap-2 text-xs font-semibold text-[#10B981]">
                <ShieldCheck className="w-4 h-4" /> 100% Free Verification
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-[#E5E8EC] shadow-lg shadow-[#0B1E3F]/5 relative flex flex-col hover:border-[#007BFF]/40 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-[#0B1E3F] mb-3">
                Reserve & Move In
              </h3>
              <p className="text-sm text-[#1E1E2F]/70 leading-relaxed mb-6">
                Lock in your room directly with verified hostel managers. Collect your keys, unpack your bags, and start your semester feeling at home.
              </p>
              <div className="mt-auto pt-4 border-t border-[#E5E8EC] flex items-center gap-2 text-xs font-semibold text-[#0B1E3F]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Direct Official Keys
              </div>
            </motion.div>

          </div>

          <div className="mt-12 text-center">
            <Link
              href="/students"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-base shadow-md shadow-[#007BFF]/20 hover:scale-105 transition-all"
            >
              <span>Explore All Hostels Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Hostels Showcase (Real photos, ₦ prices, campus distance, amenities) */}
      <section className="py-20 bg-white relative border-y border-[#E5E8EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-3 tracking-wide uppercase">
                <Building2 className="w-3.5 h-3.5" /> Handpicked Campus Listings
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1E3F] tracking-tight mb-2">
                Featured Student Spaces
              </h2>
              <p className="text-base text-[#1E1E2F]/70">
                Directly managed, physically inspected spaces ready for the upcoming semester.
              </p>
            </div>

            {/* Campus Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Spaces", key: "all" },
                { label: "UNILAG (Lagos)", key: "unilag" },
                { label: "UI (Ibadan)", key: "ui" },
                { label: "OAU (Ife)", key: "oau" },
                { label: "FUTA (Akure)", key: "futa" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeCategory === tab.key
                      ? "bg-[#0B1E3F] text-white shadow-sm"
                      : "bg-[#F9FBFF] border border-[#E5E8EC] text-[#0B1E3F] hover:border-[#007BFF]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hostels Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHostels.map((hostel, i) => (
              <motion.div
                key={hostel.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[#F9FBFF] rounded-3xl overflow-hidden border border-[#E5E8EC] hover:border-[#007BFF]/40 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={hostel.image}
                    alt={hostel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  {/* Verified & Popular Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10B981] text-white text-[11px] font-bold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                    {hostel.popular && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#007BFF] text-white text-[11px] font-bold shadow-sm">
                        <Flame className="w-3.5 h-3.5" /> High Demand
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[#0B1E3F] text-xs font-bold shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#F39C12] fill-[#F39C12]" />
                    {hostel.rating}
                  </div>

                  {/* Distance to Campus */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-[#50C9F2]" />
                    <span>{hostel.distance}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1E3F] group-hover:text-[#007BFF] transition-colors line-clamp-1">
                        {hostel.name}
                      </h3>
                      <p className="text-xs text-[#1E1E2F]/60 font-medium">
                        {hostel.campus} • {hostel.type}
                      </p>
                    </div>
                  </div>

                  {/* Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {hostel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-white border border-[#E5E8EC] text-[#0B1E3F] px-2.5 py-1 rounded-lg"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="mt-auto pt-4 border-t border-[#E5E8EC] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#1E1E2F]/60 font-bold block">
                        Price Per Year
                      </span>
                      <div className="text-xl font-black text-[#0B1E3F]">
                        ₦{hostel.price.toLocaleString()}
                      </div>
                    </div>
                    <Link
                      href={`/explore?search=${encodeURIComponent(hostel.name)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#007BFF] hover:bg-[#0062cc] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-14 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0B1E3F] hover:bg-[#007BFF] text-white font-bold text-base transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Explore All Verified Hostels in Nigeria</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* "Why CribPal vs Traditional Agents" Comparison Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F9FBFF]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-3 tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> The Agent Drama Destroyer
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1E3F] tracking-tight mb-4">
              CribPal vs. Traditional Street Agents
            </h2>
            <p className="text-base sm:text-lg text-[#1E1E2F]/70">
              Why thousands of university students refuse to use street agents ever again.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Traditional Agents (Pain Points) */}
            <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-200/70 shadow-sm relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-950">Traditional Street Agents</h3>
                  <p className="text-xs text-red-700 font-medium">The stressful, expensive old way</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-red-950/80">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>₦5,000 - ₦10,000 Inspection Fees</strong> charged just to walk you to dilapidated rooms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>15% - 20% Agent Commission</strong> added directly on top of your annual rent.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Fake / Outdated Photos</strong> sent on WhatsApp that look nothing like the actual building.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>No Utility Guarantees:</strong> "NEPA will bring light" promises that turn out to be false.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Vanishing Support:</strong> Once payment is pocketed, the agent disappears forever.</span>
                </li>
              </ul>
            </div>

            {/* CribPal (The Solution) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#007BFF] shadow-xl shadow-[#007BFF]/10 relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#007BFF] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                The CribPal Standard
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#007BFF]/10 text-[#007BFF] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6 text-[#007BFF]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0B1E3F]">CribPal Platform</h3>
                  <p className="text-xs text-[#007BFF] font-semibold">Transparent, verified & verified</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-[#0B1E3F]">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                  <span><strong>₦0 Inspection Fees:</strong> Browse all galleries and inspect in-person without paying a dime.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                  <span><strong>0% Middleman Extortion:</strong> You pay the direct landlord rate with zero agent markups.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                  <span><strong>100% Physically Inspected:</strong> Live, authentic photos taken by campus reps on-site.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                  <span><strong>Verified Power & Water:</strong> Documented generator schedules and clean borehole records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 font-bold" />
                  <span><strong>Dedicated Campus Support:</strong> We stand by you from inspection to key handover.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Student Testimonials (Social Proof) */}
      <section className="py-20 md:py-24 bg-white border-y border-[#E5E8EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-3 tracking-wide uppercase">
              <Users className="w-3.5 h-3.5" /> Real Student Voices
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1E3F] tracking-tight mb-4">
              Loved by Students Across Nigeria
            </h2>
            <p className="text-base sm:text-lg text-[#1E1E2F]/70">
              Hear how students secured verified accommodations without stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "/cgstd.jpg",
                name: "Tunde Bakare",
                dept: "Pharmacy, UNILAG (300L)",
                text: "Last year I paid ₦20,000 in 'inspection fees' to street agents and ended up in a room with leaking roof. This year on CribPal, I found Emerald Suites in 2 days, paid zero inspection fee, and the light is actually 24/7!",
              },
              {
                img: "/cgstds.jpg",
                name: "Aisha Mohammed",
                dept: "Economics, UI Ibadan (200L)",
                text: "Being new to Ibadan, finding a safe hostel in Agbowo was terrifying. CribPal's verified distance check and physical verification gave my parents total peace of mind. Highly recommended!",
              },
              {
                img: "/collegestudent.jpg",
                name: "Chukwudi Eze",
                dept: "Computer Science, FUTA (400L)",
                text: "The direct connection to the hostel manager without greedy middlemen is the best thing that happened to Nigerian campus housing. The price on the site was the exact price I paid.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#F9FBFF] p-6 sm:p-8 rounded-3xl border border-[#E5E8EC] shadow-sm flex flex-col justify-between"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-[#F39C12] mb-4">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-[#F39C12]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#1E1E2F]/80 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-[#E5E8EC]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#007BFF]/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1E3F]">{item.name}</h4>
                    <p className="text-xs text-[#007BFF] font-medium">{item.dept}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Campus FAQ Accordion */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F9FBFF]">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] text-xs font-bold mb-3 tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1E3F] tracking-tight mb-4">
              Got Questions? We’ve Got Answers.
            </h2>
            <p className="text-base text-[#1E1E2F]/70">
              Everything you need to know about booking verified student hostels on CribPal.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E5E8EC] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#0B1E3F] hover:text-[#007BFF] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#007BFF] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-[#1E1E2F]/75 leading-relaxed border-t border-[#E5E8EC]/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* High-Converting Pre-Footer CTA Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0B1E3F] via-[#0D244D] to-[#007BFF] rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl shadow-[#0B1E3F]/20">
            {/* Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#50C9F2]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#007BFF]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-6 text-[#50C9F2]">
                ⚡ Next Semester Accommodations Now Open
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
                Ready to Secure Your Campus Space Without the Stress?
              </h2>
              <p className="text-base sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
                Hostels in high-demand campus zones fill up quickly as resumption nears. Browse verified spaces and book your spot today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/explore"
                  className="px-9 py-4 rounded-2xl font-bold text-base bg-white text-[#0B1E3F] hover:bg-[#F9FBFF] hover:scale-105 shadow-xl transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Available Hostels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/explore"
                  className="px-9 py-4 rounded-2xl font-bold text-base bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all inline-flex items-center justify-center"
                >
                  View Verified Campuses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-[#0B1E3F] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/CribPal.png" alt="CribPal Logo" width={40} height={40} />
                <span className="font-extrabold text-2xl tracking-tight text-white">CribPal</span>
              </div>
              <p className="text-sm text-white/70 max-w-sm mb-6 leading-relaxed">
                Nigeria's premier student housing platform. Eliminating middleman extortion with 100% physically verified campus accommodations.
              </p>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Zero Agent Fees
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#50C9F2]" /> Verified Properties
                </span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link href="/explore" className="hover:text-white transition-colors">Browse Hostels</Link></li>
                <li><Link href="/explore?search=UNILAG" className="hover:text-white transition-colors">UNILAG Hostels</Link></li>
                <li><Link href="/explore?search=UI" className="hover:text-white transition-colors">UI Ibadan Hostels</Link></li>
                <li><Link href="/explore?search=OAU" className="hover:text-white transition-colors">OAU Ile-Ife Hostels</Link></li>
                <li><Link href="/explore?search=FUTA" className="hover:text-white transition-colors">FUTA Akure Hostels</Link></li>
              </ul>
            </div>

            {/* Col 3: Company & Trust */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link href="/explore" className="hover:text-white transition-colors">Verification Process</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">Student Safety Guide</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* Col 4: Campus Support */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><span className="block">Email: support@cribpal.com</span></li>
                <li><span className="block">Lagos & Ibadan Campus Desks</span></li>
                <li><span className="block">Available Mon - Sat (8am - 7pm)</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} CribPal Inc. Built with ❤️ for Nigerian students.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Campus Guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
