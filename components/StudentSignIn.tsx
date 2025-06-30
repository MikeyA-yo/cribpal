
import Image from 'next/image';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const StudentSignIn = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <div className="md:w-1/2">
        <Image src="/cgstd.jpg" alt="Students" width={400} height={400} className="rounded-lg" />
      </div>
      <div className="md:w-1/2 md:pl-8">
        <h2 className="text-2xl font-bold mb-4">Student Sign In</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <div className="mt-4">
          <p className="text-center text-gray-500 text-xs">&copy;2025 CribPal. All rights reserved.</p>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center">
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full flex items-center">
            <FaFacebook className="mr-2" /> Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSignIn;
