"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import BlueParticlesBg from "../components/BlueParticlesBg";
import { Search, Shield, Users } from "lucide-react";
import Link from "next/link";

const COLORS = {
  primary: "#007BFF",
  darkBlue: "#0B1E3F",
  skyBlue: "#50C9F2",
  graphite: "#1E1E2F",
  cloud: "#E5E8EC",
  offWhite: "#F9FBFF",
  green: "#2ECC71",
  orange: "#F39C12",
  purple: "#8E44AD",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-offWhite">
      <BlueParticlesBg />
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative w-full flex items-center justify-center px-4 pt-28 pb-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-skyBlue to-primary opacity-90"></div>
        <div className="absolute inset-0">
          <Image
            src="/cgstds.jpg"
            alt="Happy students"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-20"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold mb-4 text-white shadow-lg"
          >
            Find Your Perfect Student Hostel.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-lg md:text-xl mb-8 text-cloud"
          >
            No agents. No scams. Just verified, affordable spaces near campus,
            built for students by students.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/forstudents"
              className="px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-xl hover:scale-105 duration-300 bg-offWhite text-primary"
            >
              I'm a Student
            </Link>
            <Link
              href="/forhostelowners"
              className="px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-xl hover:scale-105 duration-300 bg-darkBlue text-offWhite"
            >
              I'm a Hostel Owner
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Why CribPal Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
            Why Choose CribPal?
          </h2>
          <p className="text-lg text-graphite mt-2">
            The smart, safe, and simple way to find your next home.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Shield size={48} className="text-primary mb-4" />, title: "Verified & Secure", text: "Every hostel is verified by our team, and all payments are secured. Say goodbye to uncertainty." },
            { icon: <Search size={48} className="text-green mb-4" />, title: "Advanced Search", text: "Filter by price, location, amenities, and more to find the perfect match for your needs and budget." },
            { icon: <Users size={48} className="text-purple mb-4" />, title: "Community Focused", text: "Built by students, for students. We understand your needs and connect you with the best options." }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {card.icon}
              <h3 className="text-xl font-semibold text-darkBlue mb-2">
                {card.title}
              </h3>
              <p className="text-graphite">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-cloud py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
              How It Works
            </h2>
            <p className="text-lg text-graphite mt-2">
              Find your hostel in three simple steps.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: 1, title: "Search & Discover", text: "Browse through our curated list of verified hostels near your campus." },
              { num: 2, title: "Book & Pay", text: "Found the one? Book your spot and pay securely through our platform." },
              { num: 3, title: "Move In!", text: "That's it! Pack your bags and get ready to start your new semester in your new home." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-darkBlue mb-2">
                  {step.title}
                </h3>
                <p className="text-graphite">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hostels Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
              Featured Hostels
            </h2>
            <p className="text-lg text-graphite mt-2">
              Check out some of the top-rated hostels on our platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group"
              >
                <div className="relative h-48">
                  <Image
                    src={`/room${i + 1}.jpg`}
                    alt={`Hostel room ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-darkBlue">
                    Modern Shared Room
                  </h3>
                  <p className="text-graphite">Yaba, Lagos</p>
                  <p className="text-primary font-bold mt-2">₦250,000/year</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="#"
              className="px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-xl hover:scale-105 duration-300 bg-primary text-white"
            >
              Browse All Hostels
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-cloud py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
              What Students Say
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { img: "/cgstd.jpg", name: "Tunde, Year 3", text: "\"CribPal made finding a hostel so easy. I found a great place in just a few hours without any agent drama. Highly recommended!\"" },
              { img: "/cgstds.jpg", name: "Aisha, Year 2", text: "\"I was skeptical at first, but the verification process gave me peace of mind. The hostel was exactly as advertised.\"" }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <p className="text-graphite italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center mt-4">
                  <Image
                    src={testimonial.img}
                    alt="Student"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="ml-4 font-semibold text-darkBlue">{testimonial.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkBlue text-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CribPal</h3>
            <p className="text-cloud">
              Your trusted partner in student accommodation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/forstudents" className="hover:text-skyBlue">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/forhostelowners" className="hover:text-skyBlue">
                  For Hostel Owners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skyBlue">
                  Browse Hostels
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-skyBlue">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skyBlue">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skyBlue">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Add social media links here */}
            </div>
          </div>
        </div>
        <div className="text-center text-cloud mt-8 pt-8 border-t border-graphite">
          <p>&copy; {new Date().getFullYear()} CribPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
