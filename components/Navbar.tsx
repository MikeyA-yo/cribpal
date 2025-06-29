import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 sticky top-0 z-50" style={{ background: '#4C585B' }}>
      <div className="flex items-center gap-2">
        {/* Logo Placeholder */}
        <span className="font-bold text-xl" style={{ color: '#F4EDD3' }}>CribPal</span>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="#students" className="font-medium transition-colors" style={{ color: '#F4EDD3' }}>For Students</Link>
        <Link href="#owners" className="font-medium transition-colors" style={{ color: '#F4EDD3' }}>For Hostel Owners</Link>
        <Link href="#" className="px-4 py-2 rounded-full font-semibold transition-colors" style={{ background: '#7E99A3', color: '#4C585B' }}>Get Started</Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block w-6 h-0.5 mb-1" style={{ background: '#F4EDD3' }}></span>
        <span className="block w-6 h-0.5 mb-1" style={{ background: '#F4EDD3' }}></span>
        <span className="block w-6 h-0.5" style={{ background: '#F4EDD3' }}></span>
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full flex flex-col items-center bg-[#4C585B] py-4 gap-4 md:hidden shadow-lg animate-fade-in z-50">
          <Link href="#students" className="font-medium transition-colors" style={{ color: '#F4EDD3' }} onClick={() => setOpen(false)}>For Students</Link>
          <Link href="#owners" className="font-medium transition-colors" style={{ color: '#F4EDD3' }} onClick={() => setOpen(false)}>For Hostel Owners</Link>
          <Link href="#" className="px-4 py-2 rounded-full font-semibold transition-colors" style={{ background: '#7E99A3', color: '#4C585B' }} onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  );
} 