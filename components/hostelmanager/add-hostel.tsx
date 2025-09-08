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

// Price formatting function
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}/year`;
}

export default function AddHostel() {
  const { hostels, loading, error, createHostel, deleteHostel } = useHostels();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdHostelId, setCreatedHostelId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    price: 0,
    location: "",
    features: [] as string[],
    other: "",
  });
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editSubmitError, setEditSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    price: 0,
    location: "",
    features: [] as string[],
    other: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    });
  }

  function handleCheckbox(val: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(val)
        ? prev.features.filter((f) => f !== val)
        : [...prev.features, val],
    }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSubmitError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setSubmitError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setSelectedImage(null);
    setImagePreview('');
    const input = document.getElementById('image-input') as HTMLInputElement;
    if (input) input.value = '';
  }

  async function uploadImageAfterHostelCreation(hostelId: string) {
    if (!selectedImage) return true;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch(`/api/hostels/${hostelId}/images`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return response.ok;
    } catch (error) {
      console.error('Error uploading image:', error);
      return false;
    }
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
      price: form.price, // Keep as number
      location: form.location,
      features: form.features,
      other: form.other,
    });

    if (result.success && result.hostel) {
      // Upload image if selected
      if (selectedImage) {
        const imageUploaded = await uploadImageAfterHostelCreation(result.hostel._id);
        if (!imageUploaded) {
          setSubmitError("Hostel created but image upload failed");
          setIsSubmitting(false);
          return;
        }
      }

      // Reset form and close dialog
      setForm({ name: "", address: "", price: 0, location: "", features: [], other: "" });
      clearImage();
      setOpen(false);
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

  const handleEditHostel = (hostel: any) => {
    setEditingHostel(hostel);
    setEditForm({
      name: hostel.name,
      address: hostel.address,
      price: typeof hostel.price === 'string' ? parseFloat(hostel.price) : hostel.price,
      location: hostel.location,
      features: hostel.features || [],
      other: hostel.other || "",
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingHostel(null);
    setEditSelectedImage(null);
    setEditImagePreview("");
    setEditSubmitError("");
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm({ 
      ...editForm, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    });
  };

  const handleEditCheckbox = (val: string) => {
    setEditForm((prev) => ({
      ...prev,
      features: prev.features.includes(val)
        ? prev.features.filter((f) => f !== val)
        : [...prev.features, val],
    }));
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setEditSubmitError('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setEditSubmitError('Image size must be less than 5MB');
      return;
    }

    setEditSelectedImage(file);
    setEditSubmitError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearEditImage = () => {
    setEditSelectedImage(null);
    setEditImagePreview('');
    const input = document.getElementById('edit-image-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.address || !editForm.price || !editForm.location) {
      setEditSubmitError("Please fill in all required fields");
      return;
    }

    setIsEditSubmitting(true);
    setEditSubmitError("");

    try {
      // First, update the hostel details
      const updateResponse = await fetch(`/api/hostels/${editingHostel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        setEditSubmitError(errorData.error || 'Failed to update hostel');
        return;
      }

      // If there's a new image, upload it
      if (editSelectedImage) {
        const formData = new FormData();
        formData.append('image', editSelectedImage);

        const imageResponse = await fetch(`/api/hostels/${editingHostel._id}/images`, {
          method: 'POST',
          body: formData,
        });

        if (!imageResponse.ok) {
          setEditSubmitError("Hostel updated but image upload failed");
          return;
        }
      }

      // Close dialog and refresh hostels list
      handleCloseEditDialog();
      // Note: You might want to trigger a refresh of the hostels list here
      
    } catch (error) {
      setEditSubmitError("An error occurred while updating the hostel");
    } finally {
      setIsEditSubmitting(false);
    }
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
              <div className="text-blue-700 font-semibold mb-2">{formatPrice(hostel.price)}</div>
              
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
                  onClick={() => handleEditHostel(hostel)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-blue-900">
                Add a New Hostel
              </h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                onClick={handleCloseModal}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {submitError}
                </div>
              )}            {/* Hostel creation form */}
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
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price (e.g. 350000)"
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                  min="0"
                  step="1000"
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
                
                {/* Image Upload Field */}
                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Hostel Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full h-32 object-cover mx-auto rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          id="image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-input"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Choose Image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Max 5MB, JPG/PNG/GIF</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding Hostel..." : "Add Hostel"}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && editingHostel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseEditDialog()}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-blue-900">
                Edit {editingHostel.name}
              </h3>
              <button
                onClick={handleCloseEditDialog}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {editSubmitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {editSubmitError}
                </div>
              )}

              {/* Current Image Display */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Current Hostel Image</h4>
                <HostelImageDisplay 
                  hostelId={editingHostel._id}
                  canDelete={true}
                  className="w-full h-48 rounded-lg"
                />
              </div>

              {/* Edit Form */}
              <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Hostel Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    placeholder="Hostel Name"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditFormChange}
                    placeholder="Address"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Price (₦/year)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditFormChange}
                    placeholder="Price (e.g. 350000)"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditFormChange}
                    placeholder="Google Maps Link"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {defaultFeatures.map((f) => (
                      <label key={f.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editForm.features.includes(f.value)}
                          onChange={() => handleEditCheckbox(f.value)}
                          className="accent-blue-600"
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Other Notes
                  </label>
                  <textarea
                    name="other"
                    value={editForm.other}
                    onChange={handleEditFormChange}
                    placeholder="Other notes or amenities..."
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[60px]"
                  />
                </div>
                
                {/* New Image Upload */}
                <div>
                  <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
                    Upload New Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {editImagePreview ? (
                      <div className="relative">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="max-w-full h-32 object-cover mx-auto rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={clearEditImage}
                          className="text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Remove New Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          id="edit-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageSelect}
                          className="hidden"
                        />
                        <label
                          htmlFor="edit-image-input"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Choose New Image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Max 5MB, JPG/PNG/GIF</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditSubmitting ? "Updating..." : "Update Hostel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditDialog}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
