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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FBFF] to-[#E5E8EC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Image Section */}
        <div className="md:w-1/2 flex items-center justify-center bg-[#E5E8EC] p-8">
          <Image src="/hstmng.jpg" alt="Hostel Manager" width={320} height={320} className="rounded-2xl shadow-lg object-cover" />
        </div>
        {/* Form Section */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-6 text-[#0B1E3F] text-center">Hostel Manager Sign In</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-[#0B1E3F] text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-[#0B1E3F] text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border border-[#E5E8EC] rounded-lg w-full py-3 px-4 text-[#1E1E2F] bg-[#F9FBFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition"
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#007BFF] hover:bg-[#0B1E3F] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                type="button"
              >
                Sign In
              </button>
              <a className="font-semibold text-sm text-[#007BFF] hover:text-[#0B1E3F] transition" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
          <div className="mt-6 flex flex-col gap-3">
            <button className="bg-[#2ECC71] hover:bg-[#007BFF] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:scale-105">
              <FaGoogle className="text-lg" /> Sign in with Google
            </button>
            <button className="bg-[#8E44AD] hover:bg-[#007BFF] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:scale-105">
              <FaFacebook className="text-lg" /> Sign in with Facebook
            </button>
          </div>
          <div className="mt-8">
            <p className="text-center text-gray-400 text-xs">&copy;2025 CribPal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelManagerSignIn;
