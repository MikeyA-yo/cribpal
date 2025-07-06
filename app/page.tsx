"use client"
import Image from "next/image";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import BlueParticlesBg from "../components/BlueParticlesBg";

// Color palette
const COLORS = {
  primary: "#007BFF", // Digital Blue
  darkBlue: "#0B1E3F", // Midnight Interface
  skyBlue: "#50C9F2", // Soft Cyan Glow
  graphite: "#1E1E2F", // Graphite Frame
  cloud: "#E5E8EC", // Cloud Chrome
  offWhite: "#F9FBFF", // Ice Fog
  green: "#2ECC71", // Neon Byte
  orange: "#F39C12", // Alert Pulse
  purple: "#8E44AD", // Tech Lavender
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORS.offWhite }}>
      <BlueParticlesBg />
      <Navbar />
      {/* Hero Section */}
      <motion.section
        className="relative w-full flex flex-col items-center justify-center px-4 py-24 text-center mb-16 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COLORS.skyBlue} 0%, ${COLORS.primary} 100%)` }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Hero background image, only on md+ screens */}
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 z-0">
          <img
            src="/cgstds.jpg"
            alt="Students"
            className="h-full w-full object-cover rounded-l-[100vw] shadow-xl"
            style={{ borderTopLeftRadius: '100vw', borderBottomLeftRadius: '100vw' }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center  w-full md:w-2/3 mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-[#0B1E3F] -translate-y-10 bg-clip-text text-transparent"
          >
            Find a Hostel Without the Stress.<br />
            <span className="text-xl sm:text-2xl font-semibold block mt-2 text-white">
              No agents. No scams. Just verified, affordable spaces near campus.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-lg sm:text-xl mb-8" style={{ color: COLORS.cloud }}>
            CribPal is the easiest way for Unilag students to find off-campus accommodation — safely, transparently, and 100% student-focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/forstudents" className="px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-md hover:scale-105 hover:shadow-lg duration-200" style={{ background: COLORS.offWhite, color: COLORS.primary }}>I'm a Student</a>
            <a href="/forhostelowners" className="px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-md hover:scale-105 hover:shadow-lg duration-200" style={{ background: COLORS.primary, color: COLORS.offWhite }}>I'm a Hostel Owner</a>
            <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors border-2 hover:scale-105 hover:shadow-lg duration-200" style={{ color: COLORS.offWhite, borderColor: COLORS.offWhite }}>Browse Listings</a>
          </div>
        </div>
      </motion.section>

      {/* Why CribPal */}
      <motion.section
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-4 py-20 flex flex-col gap-10 mb-16"
        style={{ background: COLORS.cloud, borderRadius: 24 }}
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: COLORS.darkBlue }}>Why CribPal?</h2>
        <p className="text-center text-lg mb-6" style={{ color: COLORS.graphite }}>
          We know the struggle.<br />
          CribPal was built by students who got tired of walking around, paying agents, and getting lied to. We're here to change that.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl" style={{ color: COLORS.green }}>✔</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.darkBlue }}>No More Agent Fees</div>
              <div className="text-base" style={{ color: COLORS.graphite }}>Skip the commission and inspection charges. CribPal connects you directly with hostel owners.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl" style={{ color: COLORS.green }}>✔</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.darkBlue }}>Verified Hostels Only</div>
              <div className="text-base" style={{ color: COLORS.graphite }}>We inspect every listing and collect real reviews from students who've stayed there.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl" style={{ color: COLORS.purple }}>✔</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.darkBlue }}>Smart Search Tools</div>
              <div className="text-base" style={{ color: COLORS.graphite }}>Use filters, comfort ratings, and map views to find a place that actually fits your needs — and your budget.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl" style={{ color: COLORS.primary }}>✔</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.darkBlue }}>Book With Confidence</div>
              <div className="text-base" style={{ color: COLORS.graphite }}>Secure your space online with trusted payment and refund options.</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-4 py-20 flex flex-col gap-10 mb-16"
        style={{ background: COLORS.offWhite, borderRadius: 24 }}
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: COLORS.darkBlue }}>How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {["Sign Up", "Browse Listings", "Filter & Compare", "Book or Inspect", "Move in"].map((step, i) => (
            <motion.div
              key={step}
              className="flex flex-col items-center gap-2 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md" style={{ background: COLORS.skyBlue, color: COLORS.darkBlue }}>{i + 1}</div>
              <div className="font-semibold" style={{ color: COLORS.darkBlue }}>{step}</div>
              <div className="text-sm" style={{ color: COLORS.graphite }}>
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
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-4 py-20 flex flex-col gap-10 items-center mb-16"
        id="owners"
        style={{ background: COLORS.cloud, borderRadius: 24 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full bg-white rounded-xl shadow-md p-8 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-2xl hover:-translate-y-1">
          <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.primary }}>For Students</h3>
          <ul className="list-disc list-inside text-base flex flex-col gap-2" style={{ color: COLORS.graphite }}>
            <li>Browse and filter verified hostels near campus</li>
            <li>See real reviews and comfort ratings from other students</li>
            <li>Book or schedule inspections online—no agents needed</li>
            <li>Secure payment and refund options</li>
          </ul>
          <a href="/forstudents" className="mt-4 inline-block px-6 py-2 rounded-full font-semibold transition-colors shadow-md hover:scale-105 hover:shadow-lg duration-200" style={{ background: COLORS.primary, color: COLORS.offWhite }}>Find a Room</a>
        </div>
        {/* For Hostel Owners Card */}
        <div className="w-full bg-white rounded-xl shadow-md p-8 flex flex-col gap-4 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.darkBlue }}>For Hostel Owners</h2>
          <p className="text-lg mb-4" style={{ color: COLORS.graphite }}>
            Got space to rent?<br />
            Join CribPal to reach thousands of verified students without relying on third-party agents.
          </p>
          <ul className="text-left flex flex-col gap-2 mb-4" style={{ color: COLORS.darkBlue }}>
            <li>• Post listings for free</li>
            <li>• Set availability and prices</li>
            <li>• Manage bookings easily</li>
          </ul>
          <a href="/forhostelowners" className="px-6 py-2 rounded-full font-semibold transition-colors shadow-md hover:scale-105 hover:shadow-lg duration-200" style={{ background: COLORS.offWhite, color: COLORS.primary, border: `2px solid ${COLORS.primary}` }}>List Your Hostel Now</a>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-4 py-20 flex flex-col gap-10 mb-16"
        style={{ background: COLORS.offWhite, borderRadius: 24 }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: COLORS.darkBlue }}>Student Testimonials</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1"
            style={{ border: `1.5px solid ${COLORS.cloud}` }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="italic" style={{ color: COLORS.graphite }}>
              {`I wasted ₦3k on inspection fees before CribPal. Now I just filter what I want, book online, and move in without stress.`}
            </p>
            <div className="font-semibold mt-2" style={{ color: COLORS.darkBlue }}>— Bola, 300L Student, Unilag</div>
          </motion.div>
          <motion.div
            className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 transition-shadow duration-200 hover:shadow-2xl hover:-translate-y-1"
            style={{ border: `1.5px solid ${COLORS.cloud}` }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="italic" style={{ color: COLORS.graphite }}>
              {`Our hostel got fully booked in 2 weeks on CribPal. Zero agent drama.`}
            </p>
            <div className="font-semibold mt-2" style={{ color: COLORS.darkBlue }}>— Daniel, Hostel Manager</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="w-full flex flex-col items-center justify-center px-4 py-24 text-center mb-16"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.skyBlue} 100%)` }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: COLORS.offWhite }}>
          Stop guessing. Start booking.<br />
          <span className="text-xl sm:text-2xl font-semibold block mt-2" style={{ color: COLORS.cloud }}>
            Join thousands of students using CribPal to find better accommodation, faster.
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-md hover:scale-105 hover:shadow-lg duration-200" style={{ background: COLORS.offWhite, color: COLORS.primary }}>Create an Account</a>
          <a href="#" className="px-8 py-3 rounded-full font-bold text-lg transition-colors border-2 hover:scale-105 hover:shadow-lg duration-200" style={{ color: COLORS.offWhite, borderColor: COLORS.offWhite }}>Browse Verified Hostels</a>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full text-center py-12 text-sm border-t mt-8 flex flex-col gap-2 items-center" style={{ color: COLORS.graphite, borderTopColor: COLORS.cloud, background: COLORS.offWhite }}>
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
