import Image from 'next/image';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const COLORS = {
  primary: "#007BFF",
  darkBlue: "#0B1E3F",
  offWhite: "#F9FBFF",
  cloud: "#E5E8EC",
};

const HostelManagerSignIn = () => {
  return (
    <div className="min-h-screen flex flex-col w-full md:flex-row">
      {/* Left: Sign In Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#F9FBFF] px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-mono font-extrabold mb-6 text-[#0B1E3F] text-center">Hostel Manager Sign In</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition font-mono"
                id="email"
                type="email"
                placeholder="Email"
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
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#007BFF] hover:bg-[#0B1E3F] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007BFF] font-mono"
                type="button"
              >
                Sign In
              </button>
              <a className="font-semibold text-sm text-[#007BFF] hover:text-[#0B1E3F] transition font-mono" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
          {/* Social Sign In Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 border border-[#2ECC71] bg-transparent text-[#2ECC71] font-bold py-3 px-6 rounded-full transition-all duration-200 hover:bg-[#2ECC71]/10 hover:scale-105">
              <FaGoogle className="text-lg" /> Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border border-[#007BFF] bg-transparent text-[#007BFF] font-bold py-3 px-6 rounded-full transition-all duration-200 hover:bg-[#007BFF]/10 hover:scale-105">
              <FaFacebook className="text-lg" /> Sign in with Facebook
            </button>
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
