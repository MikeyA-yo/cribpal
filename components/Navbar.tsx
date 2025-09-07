"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!session?.user) return null;
    
    // Type assertion to access custom fields
    const user = session.user as any;
    const userType = user.userType;
    
    if (userType === 'hostel_manager') {
      return '/hostelmanager';
    } else {
      return '/students';
    }
  };

  const dashboardUrl = getDashboardUrl();
  const userName = session?.user?.name || 'User';

  return (
    <nav
      className="w-full flex items-center justify-between py-3 px-4 md:px-6 sticky top-0 z-50"
      style={{
        background: "rgba(11, 30, 63, 0.8)", // Darker, more professional blue
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex items-center gap-2">
        {/* Logo Placeholder */}
        <Image src="/CribPal.png" alt="CribPal Logo" width={52} height={52} />
        <span className="font-bold text-xl" style={{ color: '#F9FBFF' }}>CribPal</span>
        
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 items-center">
        {session?.user ? (
          // Authenticated user menu
          <div className="flex items-center gap-4">
            {dashboardUrl && (
              <Link 
                href={dashboardUrl} 
                className="font-medium transition-colors hover:opacity-80" 
                style={{ color: '#F9FBFF' }}
              >
                My Dashboard
              </Link>
            )}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-colors hover:opacity-80"
                style={{ background: 'rgba(249, 251, 255, 0.1)', color: '#F9FBFF' }}
              >
                <User className="w-4 h-4" />
                <span className="max-w-24 truncate">{userName}</span>
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {dashboardUrl && (
                    <Link
                      href={dashboardUrl}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href={dashboardUrl === '/hostelmanager' ? '/hostelmanager/settings' : '/students/settings'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      // Sign out functionality
                      try {
                        await fetch('/api/user/signout', { method: 'POST', credentials: 'include' });
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Sign out error:', error);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Non-authenticated user menu
          <>
            <Link href="/forstudents" className="font-medium transition-colors hover:opacity-80" style={{ color: '#F9FBFF' }}>For Students</Link>
            <Link href="/forhostelowners" className="font-medium transition-colors hover:opacity-80" style={{ color: '#F9FBFF' }}>For Hostel Owners</Link>
            <Link href="/forstudents" className="px-4 py-2 rounded-full font-semibold transition-colors hover:opacity-90" style={{ background: '#F9FBFF', color: '#007BFF' }}>Get Started</Link>
          </>
        )}
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
          {session?.user ? (
            // Authenticated mobile menu
            <>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(249, 251, 255, 0.1)', color: '#F9FBFF' }}>
                <User className="w-4 h-4" />
                <span className="font-medium">{userName}</span>
              </div>
              {dashboardUrl && (
                <Link 
                  href={dashboardUrl} 
                  className="font-medium transition-colors" 
                  style={{ color: '#F9FBFF' }} 
                  onClick={() => setOpen(false)}
                >
                  My Dashboard
                </Link>
              )}
              <Link
                href={dashboardUrl === '/hostelmanager' ? '/hostelmanager/settings' : '/students/settings'}
                className="font-medium transition-colors"
                style={{ color: '#F9FBFF' }}
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={async () => {
                  setOpen(false);
                  try {
                    await fetch('/api/user/signout', { method: 'POST', credentials: 'include' });
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors"
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F9FBFF' }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            // Non-authenticated mobile menu
            <>
              <Link href="/forstudents" className="font-medium transition-colors" style={{ color: '#F9FBFF' }} onClick={() => setOpen(false)}>For Students</Link>
              <Link href="/forhostelowners" className="font-medium transition-colors" style={{ color: '#F9FBFF' }} onClick={() => setOpen(false)}>For Hostel Owners</Link>
              <Link href="/forstudents" className="px-4 py-2 rounded-full font-semibold transition-colors" style={{ background: '#F9FBFF', color: '#007BFF' }} onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
} 