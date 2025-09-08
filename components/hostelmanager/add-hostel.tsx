"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, MapPin, CheckCircle, X, Trash2, Edit2 } from "lucide-react";
import { useHostels } from "@/hooks/useHostels";
import ImageUpload from "./ImageUpload";
import HostelImageDisplay from "./HostelImageDisplay";

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
  const { hostels, loading, error, createHostel, deleteHostel } = useHostels();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdHostelId, setCreatedHostelId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
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
    handleCreateHostel();
  }

  async function handleCreateHostel() {
    if (!form.name || !form.address || !form.price || !form.location) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const result = await createHostel({
      name: form.name,
      address: form.address,
      price: form.price,
      location: form.location,
      features: form.features,
      other: form.other,
    });

    if (result.success && result.hostel) {
      // Store the created hostel ID for image upload
      setCreatedHostelId(result.hostel._id);
      setShowImageUpload(true);
      
      // Reset the form but keep the modal open for image upload
      setForm({ name: "", address: "", price: "", location: "", features: [], other: "" });
    } else {
      setSubmitError(result.error || "Failed to create hostel");
    }

    setIsSubmitting(false);
  }

  async function handleDeleteHostel(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    const result = await deleteHostel(id);
    if (!result.success) {
      alert(`Failed to delete hostel: ${result.error}`);
    }
  }

  const handleImageUploaded = (imageId: string) => {
    console.log("Image uploaded with ID:", imageId);
    // Close the modal and reset state
    handleCloseModal();
  };

  const handleSkipImage = () => {
    // Close the modal without uploading image
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
    setShowImageUpload(false);
    setCreatedHostelId(null);
    setSubmitError("");
  };

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

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <span className="ml-3 text-gray-600">Loading your hostels...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && hostels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No hostels added yet</div>
          <p className="text-gray-400 mb-6">Start by adding your first hostel to CribPal</p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold"
          >
            <PlusCircle className="w-5 h-5" /> Add Your First Hostel
          </button>
        </div>
      )}

      {/* Hostel Cards */}
      {!loading && hostels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hostels.map((hostel, idx) => (
          <motion.div
            key={hostel._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            {/* Use HostelImageDisplay component or fallback to default image */}
            <div className="w-full h-44 overflow-hidden">
              <HostelImageDisplay 
                hostelId={hostel._id}
                canDelete={true}
                onImageDeleted={() => {
                  // Optionally refresh hostels or show a message
                  console.log('Image deleted for hostel:', hostel._id);
                }}
                className="w-full h-44 object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-blue-800 flex-1">{hostel.name}</h3>
                <a href={hostel.location} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Map
                </a>
              </div>
              
              {/* Status indicators */}
              <div className="flex gap-2 mb-2">
                {hostel.isVerified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    Verified
                  </span>
                )}
                {!hostel.isActive && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                    Inactive
                  </span>
                )}
                {!hostel.isVerified && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                    Pending Review
                  </span>
                )}
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
              
              {/* Stats */}
              <div className="text-xs text-gray-500 mb-2">
                Views: {hostel.views} • Bookings: {hostel.bookings}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {hostel.features.map((f) => (
                  <span key={f} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-100">
                    <CheckCircle className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => {/* TODO: Implement edit */}}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteHostel(hostel._id, hostel.name)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

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
              onClick={handleCloseModal}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {showImageUpload ? "Add Hostel Image" : "Add a New Hostel"}
            </h3>
            
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {submitError}
              </div>
            )}
            
            {showImageUpload && createdHostelId ? (
              // Image upload step
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <p className="font-semibold">Hostel created successfully! 🎉</p>
                  <p className="text-sm">Now add an image to make your hostel more appealing</p>
                </div>
                
                <ImageUpload 
                  hostelId={createdHostelId}
                  onImageUploaded={handleImageUploaded}
                />
                
                <button
                  type="button"
                  onClick={handleSkipImage}
                  className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Skip for now
                </button>
              </div>
            ) : (
              // Hostel creation form
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
                  disabled={isSubmitting}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding Hostel..." : "Add Hostel"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
