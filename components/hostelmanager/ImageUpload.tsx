"use client";
import React, { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadHostelImage, validateImageFile, createImagePreview } from "@/lib/imageUtils";

interface ImageUploadProps {
  hostelId?: string; // Only available after hostel is created
  onImageUploaded?: (imageId: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ hostelId, onImageUploaded, disabled }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    // Create preview
    try {
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
    } catch (error) {
      console.error("Error creating preview:", error);
      setUploadError("Failed to create image preview");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !hostelId) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const result = await uploadHostelImage(hostelId, selectedFile);
      
      if (result.success && result.imageId) {
        onImageUploaded?.(result.imageId);
        // Keep the preview but clear the file input
        setSelectedFile(null);
      } else {
        setUploadError(result.error || "Upload failed");
      }
    } catch (error) {
      setUploadError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadError("");
  };

  return (
    <div className="w-full">
      <label className="block text-[#0B1E3F] text-sm font-mono font-semibold mb-2">
        Hostel Image
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-48 object-cover mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Select an image for your hostel</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
          id="image-upload"
        />
        
        <div className="flex gap-2 justify-center mt-4">
          <label
            htmlFor="image-upload"
            className={`px-4 py-2 rounded-lg border cursor-pointer flex items-center gap-2 ${
              disabled || isUploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-[#0B1E3F] border-[#0B1E3F] hover:bg-[#0B1E3F] hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            Select Image
          </label>

          {selectedFile && hostelId && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isUploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0B1E3F] text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}
        </div>

        {!hostelId && selectedFile && (
          <p className="text-sm text-amber-600 mt-2">
            Save the hostel first, then upload the image
          </p>
        )}

        {uploadError && (
          <p className="text-sm text-red-600 mt-2">{uploadError}</p>
        )}
      </div>
    </div>
  );
}
