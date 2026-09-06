"use client";

import React, { useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  Mic,
  Plus,
  Check,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  Play
} from "lucide-react";
import { motion } from "framer-motion";

interface AddHostelFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const COMMON_AMENITIES = [
  "24/7 Solar Power",
  "Treated Borehole Water",
  "High-Speed WiFi",
  "Uniformed Security",
  "Air Conditioning",
  "Fitted Kitchenette",
  "Wardrobe & Shelves",
  "Reading Desk & Chair",
  "Individual Prepaid Meter",
  "En-suite Bathroom",
  "CCTV Surveillance",
  "Gated Compound",
  "Parking Space",
];

const CAMPUS_PRESETS = [
  "UNILAG (Akoka, Lagos)",
  "University of Ibadan (UI)",
  "OAU (Ile-Ife)",
  "FUTA (Akure)",
  "UNN (Nsukka)",
  "Covenant University",
  "YabaTech",
  "LASU (Ojo)",
];

const ROOM_TYPES = [
  "Self-Con Studio",
  "2-Man Shared Room",
  "1-Bedroom Flat",
  "Single Room",
  "3-4 Man Shared",
];

export default function AddHostelForm({ onSuccess, onCancel }: AddHostelFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core hostel fields (simplified for single direct admin listing)
  const [name, setName] = useState("");
  const [campusTag, setCampusTag] = useState("UNILAG (Akoka, Lagos)");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [roomType, setRoomType] = useState("Self-Con Studio");
  const [price, setPrice] = useState("");
  const [other, setOther] = useState("");
  const [contactPhone, setContactPhone] = useState("+234 812 345 6789");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "24/7 Solar Power",
    "Treated Borehole Water",
    "High-Speed WiFi",
    "Uniformed Security",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");

  // Media files & URLs
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [uploadStatus, setUploadStatus] = useState<string>("");

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(prev => prev.filter(a => a !== item));
    } else {
      setSelectedAmenities(prev => [...prev, item]);
    }
  };

  const addCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  // Image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const newUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Video selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
  };

  // Audio selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      if (audioPreview) URL.revokeObjectURL(audioPreview);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const removeAudio = () => {
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioFile(null);
    setAudioPreview(null);
  };

  // Cloudinary upload helper
  const uploadToCloudinary = async (file: File, fileType: "image" | "video" | "audio") => {
    const sigRes = await fetch("/api/cloudinary-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "cribpal_hostels" }),
    });

    if (!sigRes.ok) {
      throw new Error("Failed to get Cloudinary upload authorization");
    }

    const { timestamp, signature, cloudName, apiKey, folder } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    // Cloudinary auto upload supports image, video, and audio seamlessly
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Cloudinary upload failed:", err);
      throw new Error(`Cloudinary upload failed for ${file.name}`);
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setUploadStatus("Preparing listing assets...");

    try {
      // 1. Upload Images
      const uploadedImages: string[] = [];
      if (imageFiles.length > 0) {
        setUploadStatus(`Uploading ${imageFiles.length} photos to Cloudinary...`);
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1} of ${imageFiles.length}...`);
          const url = await uploadToCloudinary(imageFiles[i], "image");
          uploadedImages.push(url);
        }
      }

      // 2. Upload Video Tour if present
      let uploadedVideoUrl: string | null = null;
      if (videoFile) {
        setUploadStatus("Uploading video tour to Cloudinary...");
        uploadedVideoUrl = await uploadToCloudinary(videoFile, "video");
      }

      // 3. Upload Audio Walkthrough if present
      let uploadedAudioUrl: string | null = null;
      if (audioFile) {
        setUploadStatus("Uploading audio walkthrough / voice note to Cloudinary...");
        uploadedAudioUrl = await uploadToCloudinary(audioFile, "audio");
      }

      setUploadStatus("Publishing verified hostel to database...");

      // 4. Save to Backend (Direct admin listing - no obsolete manager fields)
      const payload = {
        name,
        campusTag,
        address,
        location: campusTag,
        distance: distance.trim() || "Walking distance to campus",
        roomType,
        price: Number(price),
        features: selectedAmenities,
        other,
        contactPhone,
        images: uploadedImages.length > 0 ? uploadedImages : ["/room1.jpg"],
        video: uploadedVideoUrl,
        audio: uploadedAudioUrl,
      };

      const response = await fetch("/api/admin/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to publish hostel");
      }

      onSuccess();
    } catch (err) {
      console.error("Listing error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while publishing");
    } finally {
      setSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl shadow-[#0B1E3F]/5 border border-[#E5E8EC] p-6 sm:p-10 max-w-4xl mx-auto"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#007BFF]/10 text-[#007BFF] flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1E3F]">
              Direct Admin Hostel Listing
            </h2>
            <p className="text-xs text-gray-500">
              List verified student accommodation with photos, video walkthrough, and voice note tour.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadStatus && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-[#007BFF] text-xs font-bold flex items-center gap-2 mb-6 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Property Details */}
        <div>
          <h3 className="text-sm font-extrabold text-[#0B1E3F] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#007BFF]" />
            1. Property Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Hostel Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emerald Court Luxury Suites"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Annual Rent Price (₦/year) *
              </label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 380000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/10"
              />
            </div>
          </div>
        </div>

        {/* Location & Room Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Campus / University *
            </label>
            <input
              list="campus-list"
              required
              type="text"
              value={campusTag}
              onChange={(e) => setCampusTag(e.target.value)}
              placeholder="Select or type campus..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF]"
            />
            <datalist id="campus-list">
              {CAMPUS_PRESETS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Room Type *
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF]"
            >
              {ROOM_TYPES.map((rt) => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Distance to Campus Gate
            </label>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g. 3 mins walk to Main Gate"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF]"
            />
          </div>
        </div>

        {/* Address & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Full Physical Address *
            </label>
            <input
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. St. Finbarr's College Road, Akoka, Yaba"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Inspection / Admin Desk Tel (WhatsApp)
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+234 812 345 6789"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] font-semibold focus:outline-none focus:border-[#007BFF]"
            />
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-extrabold text-[#0B1E3F] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#007BFF]" />
              2. Amenities & Features
            </h3>
            <span className="text-xs text-gray-400 font-semibold">{selectedAmenities.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_AMENITIES.map((item) => {
              const isSelected = selectedAmenities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#007BFF] text-white shadow-sm shadow-[#007BFF]/20"
                      : "bg-[#F9FBFF] text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Add Custom Amenity */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add other amenity..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#F9FBFF]"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-black transition cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Media Uploads: Photos, Video, Audio */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-extrabold text-[#0B1E3F] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#007BFF]" />
            3. Media Assets (Cloudinary Direct Storage)
          </h3>

          {/* A. Photos */}
          <div className="p-4 rounded-2xl bg-[#F9FBFF] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#007BFF]" />
                Hostel Photos ({imagePreviews.length} selected)
              </label>
              <span className="text-[11px] text-gray-400">JPG, PNG, WebP (Multiple)</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 group shadow-sm">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}

              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-[#007BFF]/30 hover:border-[#007BFF] bg-white rounded-2xl cursor-pointer hover:bg-blue-50/50 transition text-gray-500">
                <Upload className="w-5 h-5 mb-1 text-[#007BFF]" />
                <span className="text-[11px] font-bold text-[#0B1E3F]">Add Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* B. Video Tour */}
          <div className="p-4 rounded-2xl bg-[#F9FBFF] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-600" />
                Video Tour Walkthrough (Optional)
              </label>
              <span className="text-[11px] text-gray-400">MP4, WebM, MOV</span>
            </div>

            {videoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black max-w-md">
                <video src={videoPreview} controls className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-gray-900 text-white text-[11px] font-semibold flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{videoFile?.name}</span>
                  <span className="text-emerald-400">Ready to upload</span>
                </div>
              </div>
            ) : (
              <label className="p-6 border-2 border-dashed border-purple-200 hover:border-purple-500 bg-white rounded-2xl cursor-pointer hover:bg-purple-50/30 transition flex flex-col items-center justify-center text-center">
                <Video className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-xs font-bold text-[#0B1E3F]">Upload Video Tour (.mp4, .webm)</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Students can watch the room walkthrough directly on CribPal</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
            )}
          </div>

          {/* C. Audio Walkthrough / Voice Note */}
          <div className="p-4 rounded-2xl bg-[#F9FBFF] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-600" />
                Audio Walkthrough / Landlord Voice Note (Optional)
              </label>
              <span className="text-[11px] text-gray-400">MP3, WAV, M4A</span>
            </div>

            {audioPreview ? (
              <div className="p-4 rounded-2xl bg-white border border-gray-200 max-w-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[220px]">
                    {audioFile?.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <audio src={audioPreview} controls className="w-full h-10" />
              </div>
            ) : (
              <label className="p-6 border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-white rounded-2xl cursor-pointer hover:bg-emerald-50/30 transition flex flex-col items-center justify-center text-center">
                <Mic className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-[#0B1E3F]">Upload Audio Walkthrough / Voice Note (.mp3, .m4a)</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Recorded commentary on water pressure, environment, and electricity</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Description / Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Hostel Description & Highlights
          </label>
          <textarea
            rows={3}
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="e.g. 3 mins walk to UNILAG Main Gate. 24/7 solar inverter backup, quiet environment, ideal for serious students..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FBFF] text-sm text-[#0B1E3F] focus:outline-none focus:border-[#007BFF] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-[#007BFF] hover:bg-[#0062cc] text-white font-bold text-sm shadow-md shadow-[#007BFF]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Listing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Verified Hostel</span>
              </>
            )}
          </button>
        </div>

      </form>
    </motion.div>
  );
}
