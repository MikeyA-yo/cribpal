"use client";

import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const COLORS = {
  primary: "#007BFF",
  darkBlue: "#0B1E3F",
  offWhite: "#F9FBFF",
  cloud: "#E5E8EC",
  green: "#2ECC71",
};

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      if (error) {
        setError(error.message || "Sign up failed");
        return;
      }

      if (data?.user) {
        router.push("/students");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/students",
      });

      if (error) {
        setError(error.message || "Google sign up failed");
      }
    } catch (err) {
      setError("Google sign up failed");
      console.error("Google sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full md:flex-row">
      {/* Left: Sign Up Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#F9FBFF] px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-mono font-extrabold mb-6 text-[#0B1E3F] text-center">Student Sign Up</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="university">
                University
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="university"
                name="university"
                type="text"
                placeholder="Your University"
                value={formData.university}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="password"
                name="password"
                type="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <button
              className="w-full bg-[#007BFF] hover:bg-[#0B1E3F] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007BFF] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          {/* Social Sign Up Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-mono">Or sign up with</span>
              </div>
            </div>
            
            <button 
              className="w-full mt-4 flex items-center justify-center gap-2 border border-[#2ECC71] bg-transparent text-[#2ECC71] font-bold py-3 px-6 rounded-full transition-all duration-200 hover:bg-[#2ECC71]/10 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              type="button"
            >
              <FaGoogle className="text-lg" /> {isLoading ? "Please wait..." : "Sign up with Google"}
            </button>
          </div>
          
          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm font-mono">
              Already have an account?{" "}
              <a href="/forstudents" className="text-[#007BFF] hover:text-[#0B1E3F] font-semibold transition">
                Sign in here
              </a>
            </p>
          </div>
          
          <div className="mt-6">
            <p className="text-center text-gray-400 text-xs font-mono">&copy;2025 CribPal. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right: Image */}
      <div className="flex-1 relative min-h-[300px] md:min-h-0 h-64 md:h-auto">
        <Image
          src="/cgstd.jpg"
          alt="Students"
          fill
          className="object-cover w-full h-full md:rounded-l-3xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-none from-[#0B1E3F]/60 to-transparent md:from-transparent" />
      </div>
    </div>
  );
};

export default StudentSignUp;
