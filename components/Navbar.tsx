"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="w-full flex items-center justify-between py-4 px-6 sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(0, 123, 255, 0.65)", // Digital Blue with opacity
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-2">
        {/* Logo Placeholder */}
        <Image src="/CribPal.png" alt="CribPal Logo" width={52} height={52} />
        <span className="font-bold text-xl" style={{ color: '#F9FBFF' }}>CribPal</span>
        
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/forstudents" className="font-medium transition-colors" style={{ color: '#F9FBFF' }}>For Students</Link>
        <Link href="/forhostelowners" className="font-medium transition-colors" style={{ color: '#F9FBFF' }}>For Hostel Owners</Link>
        <Link href="#" className="px-4 py-2 rounded-full font-semibold transition-colors" style={{ background: '#F9FBFF', color: '#007BFF' }}>Get Started</Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block w-6 h-0.5 mb-1" style={{ background: '#F9FBFF' }}></span>
        <span className="block w-6 h-0.5 mb-1" style={{ background: '#F9FBFF' }}></span>
        <span className="block w-6 h-0.5" style={{ background: '#F9FBFF' }}></span>
      </button>
      {/* Mobile Menu */}
      {open && (
        <div
          className="absolute top-full left-0 w-full flex flex-col items-center py-4 gap-4 md:hidden shadow-lg animate-fade-in z-50 backdrop-blur-md"
          style={{
            background: "rgba(0, 123, 255, 0.85)",
            WebkitBackdropFilter: "blur(12px)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link href="/forstudents" className="font-medium transition-colors" style={{ color: '#F9FBFF' }} onClick={() => setOpen(false)}>For Students</Link>
          <Link href="/forhostelowners" className="font-medium transition-colors" style={{ color: '#F9FBFF' }} onClick={() => setOpen(false)}>For Hostel Owners</Link>
          <Link href="#" className="px-4 py-2 rounded-full font-semibold transition-colors" style={{ background: '#F9FBFF', color: '#007BFF' }} onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  );
} 