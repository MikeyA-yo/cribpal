"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogOut, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function StudentSettings() {
  const { profile, loading, error, updateProfile, signOut, deleteAccount } = useUserProfile();
  const [form, setForm] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    university: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        university: profile.university || "",
      });
    }
  }, [profile]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear success/error messages when user starts typing
    if (saveSuccess) setSaveSuccess(false);
    if (saveError) setSaveError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const result = await updateProfile({
      name: form.name,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      university: form.university,
    });

    setSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error || "Failed to save changes");
    }
  }

  async function handleSignOut() {
    if (confirm("Are you sure you want to sign out?")) {
      const result = await signOut();
      if (!result.success) {
        alert(result.error || "Failed to sign out");
      }
    }
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const result = await deleteAccount();
      if (!result.success) {
        alert(result.error || "Failed to delete account");
      }
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">Error loading profile: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Student Settings</h2>
      
      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">Profile updated successfully!</span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{saveError}</span>
          </div>
        </motion.div>
      )}
      
      <form onSubmit={handleSave} className="flex flex-col gap-5 bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+234 812 345 6789"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">University/Institution *</label>
          <input
            type="text"
            name="university"
            value={form.university}
            onChange={handleChange}
            placeholder="Your university or institution"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition disabled:opacity-60 flex items-center justify-center"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition font-semibold w-full md:w-auto justify-center"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-lg shadow hover:bg-red-100 transition font-semibold w-full md:w-auto justify-center"
        >
          <Trash2 className="w-5 h-5" /> Delete Account
        </button>
      </div>
    </motion.div>
  );
}
