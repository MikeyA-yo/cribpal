"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, MapPin, CheckCircle, X } from "lucide-react";

const dummyHostels = [
  {
    name: "Sunrise Hostel",
    address: "12, University Road, Yaba, Lagos",
    price: "₦350,000/year",
    location: "https://maps.app.goo.gl/KCPYhSyNwEC153jV6",
    image: "/room1.jpg",
    features: ["Electricity", "Water", "Female Only", "WiFi"]
  },
  {
    name: "Palm Court",
    address: "5, Herbert Macaulay Way, Yaba, Lagos",
    price: "₦320,000/year",
    location: "https://maps.app.goo.gl/V26weoUPQa64cYDp7",
    image: "/room2.jpg",
    features: ["Electricity", "Water", "Male Only", "Parking"]
  },
  {
    name: "Lakeside Residence",
    address: "22, Bariga Road, Yaba, Lagos",
    price: "₦400,000/year",
    location: "https://maps.app.goo.gl/tWa6XdWDUMiLFSid8",
    image: "/room3.jpg",
    features: ["Electricity", "Water", "Amenities", "WiFi"]
  },
];

const defaultFeatures = [
  { label: "Power/Electricity", value: "Electricity" },
  { label: "Water", value: "Water" },
  { label: "Male Only Hostel", value: "Male Only" },
  { label: "Female Only Hostel", value: "Female Only" },
  { label: "Amenities Provided", value: "Amenities" },
  { label: "WiFi", value: "WiFi" },
  { label: "Parking", value: "Parking" },
];

export default function AddHostel() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    price: "",
    location: "",
    features: [] as string[],
    other: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCheckbox(val: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(val)
        ? prev.features.filter((f) => f !== val)
        : [...prev.features, val],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would send the data to your backend
    setOpen(false);
    setForm({ name: "", address: "", price: "", location: "", features: [], other: "" });
    alert("Hostel added (dummy, not saved)");
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Your Hostels</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold"
        >
          <PlusCircle className="w-5 h-5" /> Add New Hostel
        </button>
      </div>
      {/* Hostel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyHostels.map((hostel, idx) => (
          <motion.div
            key={hostel.name}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <img src={hostel.image} alt={hostel.name} className="w-full h-44 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-blue-800 flex-1">{hostel.name}</h3>
                <a href={hostel.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Map
                </a>
              </div>
              <div className="text-blue-700 text-xs font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {(() => {
                  const segs = hostel.address.split(',');
                  return segs[1]?.trim() || hostel.address;
                })()}
              </div>
              <div className="text-gray-600 text-xs mb-1">{hostel.address}</div>
              <div className="text-blue-700 font-semibold mb-2">{hostel.price}</div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {hostel.features.map((f) => (
                  <span key={f} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-100">
                    <CheckCircle className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Hostel Dialog */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
              onClick={() => setOpen(false)}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add a New Hostel</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Hostel Name"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (e.g. ₦350,000/year)"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="url"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Google Maps Link"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <div>
                <div className="font-semibold mb-2">Features</div>
                <div className="grid grid-cols-2 gap-2">
                  {defaultFeatures.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.features.includes(f.value)}
                        onChange={() => handleCheckbox(f.value)}
                        className="accent-blue-600"
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
              <textarea
                name="other"
                value={form.other}
                onChange={handleChange}
                placeholder="Other notes or amenities..."
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[60px]"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
              >
                Add Hostel
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
