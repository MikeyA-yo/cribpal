"use client";
import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { getHostelImage, deleteHostelImage, ImageData } from "@/lib/imageUtils";

interface HostelImageDisplayProps {
  hostelId: string;
  canDelete?: boolean; // Only hostel manager should be able to delete
  onImageDeleted?: () => void;
  className?: string;
}

export default function HostelImageDisplay({ 
  hostelId, 
  canDelete = false, 
  onImageDeleted,
  className = ""
}: HostelImageDisplayProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchImage();
  }, [hostelId]);

  const fetchImage = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await getHostelImage(hostelId);
      setImageData(data);
    } catch (err) {
      setError("Failed to load image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || !imageData) return;

    setDeleting(true);
    try {
      const success = await deleteHostelImage(hostelId);
      if (success) {
        setImageData(null);
        onImageDeleted?.();
      } else {
        setError("Failed to delete image");
      }
    } catch (err) {
      setError("Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <img
        src={imageData.dataUrl}
        alt={imageData.filename}
        className="w-full h-full object-cover rounded-lg"
      />
      
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
          title="Delete image"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {deleting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <p className="text-white">Deleting...</p>
        </div>
      )}
    </div>
  );
}
