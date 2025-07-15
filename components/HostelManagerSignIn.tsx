"use client";

import Image from "next/image";
import { FaGoogle } from 'react-icons/fa';
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const COLORS = {
  primary: "#007BFF",
  darkBlue: "#0B1E3F",
  offWhite: "#F9FBFF",
  cloud: "#E5E8EC",
};

const HostelManagerSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Sign in failed");
        return;
      }

      if (data?.user) {
        // Update user info (if needed by backend)
        await authClient.updateUser({});
        
        // Redirect to hostel manager dashboard
        router.push("/hostelmanager");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/hostelmanager", // Redirect to hostel manager dashboard after success
      });

      if (error) {
        setError(error.message || "Google sign in failed");
      }
    } catch (err) {
      setError("Google sign in failed");
      console.error("Google sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col w-full md:flex-row">
      {/* Left: Sign In Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#F9FBFF] px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-mono font-extrabold mb-6 text-[#0B1E3F] text-center">Hostel Manager Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleEmailSignIn}>
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#007BFF] hover:bg-[#0B1E3F] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007BFF] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
              <a className="font-semibold text-sm text-[#007BFF] hover:text-[#0B1E3F] transition font-mono" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
          {/* Social Sign In Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button 
              className="w-full flex items-center justify-center gap-2 border border-[#2ECC71] bg-transparent text-[#2ECC71] font-bold py-3 px-6 rounded-full transition-all duration-200 hover:bg-[#2ECC71]/10 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              type="button"
            >
              <FaGoogle className="text-lg" /> {isLoading ? "Please wait..." : "Sign in with Google"}
            </button>
          </div>
          
          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm font-mono">
              Don't have an account?{" "}
              <a href="/forhostelowners/signup" className="text-[#007BFF] hover:text-[#0B1E3F] font-semibold transition">
                Sign up here
              </a>
            </p>
          </div>
          
          <div className="mt-8">
            <p className="text-center text-gray-400 text-xs font-mono">&copy;2025 CribPal. All rights reserved.</p>
          </div>
        </div>
      </div>
      {/* Right: Image */}
      <div className="flex-1 relative min-h-[300px] md:min-h-0 h-64 md:h-auto">
        <Image
          src="/hstmng.jpg"
          alt="Hostel Manager"
          fill
          className="object-cover w-full h-full md:rounded-l-3xl"
          priority
        />
        {/* Overlay for better contrast on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-none from-[#0B1E3F]/60 to-transparent md:from-transparent" />
      </div>
    </div>
  );
};

export default HostelManagerSignIn;
