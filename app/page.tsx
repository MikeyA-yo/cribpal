"use client"
import Image from "next/image";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4EDD3' }}>
      <Navbar />
      {/* Hero Section */}
      <motion.section
        className="w-full flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{ background: '#A5BFCC' }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ color: '#4C585B' }}>
          Find a Hostel Without the Stress.<br />
          <span className="text-xl sm:text-2xl font-semibold block mt-2" style={{ color: '#7E99A3' }}>
            No agents. No scams. Just verified, affordable spaces near campus.
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl mb-8" style={{ color: '#4C585B' }}>
          CribPal is the easiest way for Unilag students to find off-campus accommodation — safely, transparently, and 100% student-focused.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors" style={{ background: '#4C585B', color: '#F4EDD3' }}>Get Started</a>
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors border-2 border-[#4C585B]" style={{ color: '#4C585B' }}>Browse Listings</a>
        </div>
      </motion.section>

      {/* Why CribPal */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-8"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#4C585B' }}>Why CribPal?</h2>
        <p className="text-center text-lg mb-6" style={{ color: '#7E99A3' }}>
          We know the struggle.<br />
          CribPal was built by students who got tired of walking around, paying agents, and getting lied to. We're here to change that.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✔</span>
            <div>
              <div className="font-semibold" style={{ color: '#4C585B' }}>No More Agent Fees</div>
              <div className="text-base" style={{ color: '#7E99A3' }}>Skip the commission and inspection charges. CribPal connects you directly with hostel owners.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✔</span>
            <div>
              <div className="font-semibold" style={{ color: '#4C585B' }}>Verified Hostels Only</div>
              <div className="text-base" style={{ color: '#7E99A3' }}>We inspect every listing and collect real reviews from students who've stayed there.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✔</span>
            <div>
              <div className="font-semibold" style={{ color: '#4C585B' }}>Smart Search Tools</div>
              <div className="text-base" style={{ color: '#7E99A3' }}>Use filters, comfort ratings, and map views to find a place that actually fits your needs — and your budget.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✔</span>
            <div>
              <div className="font-semibold" style={{ color: '#4C585B' }}>Book With Confidence</div>
              <div className="text-base" style={{ color: '#7E99A3' }}>Secure your space online with trusted payment and refund options.</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-8"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#4C585B' }}>How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {["Sign Up", "Browse Listings", "Filter & Compare", "Book or Inspect", "Move in"].map((step, i) => (
            <motion.div
              key={step}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl" style={{ background: '#A5BFCC', color: '#4C585B' }}>{i + 1}</div>
              <div className="font-semibold" style={{ color: '#4C585B' }}>{step}</div>
              <div className="text-sm" style={{ color: '#7E99A3' }}>
                {[
                  "Just your name and student ID.",
                  "From verified hostels around your campus.",
                  "By price, comfort, distance, and more.",
                  "Directly from the app — no agents needed.",
                  "With peace of mind."
                ][i]}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* For Hostel Owners */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-8 items-center"
        id="owners"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#4C585B' }}>For Hostel Owners</h2>
        <p className="text-center text-lg mb-6" style={{ color: '#7E99A3' }}>
          Got space to rent?<br />
          Join CribPal to reach thousands of verified students without relying on third-party agents.
        </p>
        <ul className="text-left flex flex-col gap-2 mb-4" style={{ color: '#4C585B' }}>
          <li>• Post listings for free</li>
          <li>• Set availability and prices</li>
          <li>• Manage bookings easily</li>
        </ul>
        <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors" style={{ background: '#F4EDD3', color: '#4C585B', border: '2px solid #4C585B' }}>List Your Hostel Now</a>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#4C585B' }}>Student Testimonials</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-2"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="italic" style={{ color: '#7E99A3' }}>
              {`I wasted ₦3k on inspection fees before CribPal. Now I just filter what I want, book online, and move in without stress.`}
            </p>
            <div className="font-semibold mt-2" style={{ color: '#4C585B' }}>— Bola, 300L Student, Unilag</div>
          </motion.div>
          <motion.div
            className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="italic" style={{ color: '#7E99A3' }}>
              {`Our hostel got fully booked in 2 weeks on CribPal. Zero agent drama.`}
            </p>
            <div className="font-semibold mt-2" style={{ color: '#4C585B' }}>— Daniel, Hostel Manager</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="w-full flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{ background: '#A5BFCC' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#4C585B' }}>
          Stop guessing. Start booking.<br />
          <span className="text-xl sm:text-2xl font-semibold block mt-2" style={{ color: '#7E99A3' }}>
            Join thousands of students using CribPal to find better accommodation, faster.
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors" style={{ background: '#4C585B', color: '#F4EDD3' }}>Create an Account</a>
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors border-2 border-[#4C585B]" style={{ color: '#4C585B' }}>Browse Verified Hostels</a>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-sm border-t mt-8 flex flex-col gap-2 items-center" style={{ color: '#7E99A3', borderTopColor: '#A5BFCC', background: '#fff' }}>
        <div>© 2025 CribPal. Built by students, for students.</div>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <a href="#" className="hover:underline">Contact us</a>
          <a href="#" className="hover:underline">Terms & Privacy</a>
          <a href="#" className="hover:underline">Instagram</a>
          <a href="#" className="hover:underline">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
