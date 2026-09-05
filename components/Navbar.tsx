"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import {
  User,
  LogOut,
  Menu,
  X,
  Compass,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (
        open &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("#mobile-menu-toggle")
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Get dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!session?.user) return null;
    const user = session.user as any;
    const userType = user.userType;
    return userType === "admin" ? "/admin" : "/students";
  };

  const dashboardUrl = getDashboardUrl();
  const userName = session?.user?.name || "User";

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setOpen(false);
    try {
      await fetch("/api/user/signout", { method: "POST", credentials: "include" });
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0B1E3F]/90 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white/10 border border-white/20 p-1 flex items-center justify-center group-hover:border-[#007BFF] transition-colors">
            <Image
              src="/CribPal.png"
              alt="CribPal Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              CribPal
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[10px] text-white/60 font-medium tracking-wide -mt-1 hidden sm:block">
              Verified Student Living
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/students"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-[#50C9F2]" />
            Explore Hostels
          </Link>
          <Link
            href="/students?search=UNILAG"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Campuses
          </Link>
          <Link
            href="/students"
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#50C9F2]" />
            How It Works
          </Link>
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              {dashboardUrl && (
                <Link
                  href={dashboardUrl}
                  className="text-sm font-semibold text-white hover:text-[#50C9F2] transition-colors"
                >
                  My Dashboard
                </Link>
              )}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium transition-all"
                >
                  <User className="w-4 h-4 text-[#50C9F2]" />
                  <span className="max-w-28 truncate">{userName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    </div>
                    {dashboardUrl && (
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#007BFF]" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href={dashboardUrl === "/admin" ? "/admin/settings" : "/students/settings"}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/students"
                className="px-5 py-2.5 rounded-full font-bold text-sm bg-[#007BFF] hover:bg-[#0062cc] text-white shadow-md shadow-[#007BFF]/30 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <span>Find a Crib</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger / Close Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors focus:outline-none cursor-pointer"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

      </div>

      {/* Modern Slide-Down Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#0B1E3F] border-b border-white/15 shadow-2xl"
          >
            <div className="px-5 pt-3 pb-6 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto">
              
              {/* Session / User Info Header (if logged in) */}
              {session?.user && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#007BFF]/20 border border-[#007BFF]/40 flex items-center justify-center text-[#50C9F2]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{userName}</p>
                      <p className="text-xs text-[#50C9F2] font-medium mt-1">
                        {(session.user as any).userType === "admin" ? "Admin Access" : "Student Member"}
                      </p>
                    </div>
                  </div>
                  {dashboardUrl && (
                    <Link
                      href={dashboardUrl}
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-[#007BFF] text-white text-xs font-bold hover:bg-[#0062cc]"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation Links with Icons */}
              <div className="space-y-1 pt-1">
                <Link
                  href="/students"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/10 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#007BFF]/20 text-[#50C9F2] flex items-center justify-center group-hover:bg-[#007BFF] group-hover:text-white transition-colors">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">Explore Hostels</span>
                      <span className="text-xs text-white/60">500+ verified campus spaces</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/students?search=UNILAG"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/10 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">Verified Campuses</span>
                      <span className="text-xs text-white/60">UNILAG, UI, OAU, FUTA & more</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/students"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/10 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-[#50C9F2] flex items-center justify-center group-hover:bg-[#007BFF] group-hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">How It Works</span>
                      <span className="text-xs text-white/60">3 simple steps without agents</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <Link
                  href="/students"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-sm shadow-lg shadow-[#007BFF]/30 transition-all"
                >
                  <span>Find a Crib (0% Agent Fees)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {session?.user && (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 font-bold text-sm transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                )}
              </div>

              {/* Mobile Drawer Bottom Badge */}
              <div className="pt-3 flex items-center justify-center gap-2 text-[11px] text-white/40 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#50C9F2]" />
                <span>100% Verified Campus Living • No Middlemen</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}