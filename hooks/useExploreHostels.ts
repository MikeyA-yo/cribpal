"use client";

import { useState, useEffect } from 'react';
import { Hostel } from './useHostels';

export interface ExploreFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
}

// Function to fetch image for a specific hostel
const fetchHostelImage = async (hostelId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/hostels/${hostelId}/images`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.image?.dataUrl || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching image for hostel ${hostelId}:`, error);
    return null;
  }
};

export const useExploreHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExploreFilters>({});

  // Fetch hostels with filters
  const fetchHostels = async (appliedFilters: ExploreFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (appliedFilters.search) params.append('search', appliedFilters.search);
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice.toString());
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice.toString());
      if (appliedFilters.features && appliedFilters.features.length > 0) {
        params.append('features', appliedFilters.features.join(','));
      }

      const response = await fetch(`/api/hostels/explore?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hostels');
      }

      const hostelsData = data.hostels || [];

      // Fetch images for each hostel
      const hostelsWithImages = await Promise.all(
        hostelsData.map(async (hostel: any) => {
          const imageUrl = await fetchHostelImage(hostel._id);
          return {
            ...hostel,
            images: imageUrl ? [imageUrl] : [], // Add image to images array
          };
        })
      );

      setHostels(hostelsWithImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hostels');
      console.error('Error fetching hostels for exploration:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and fetch hostels
  const applyFilters = async (newFilters: ExploreFilters) => {
    setFilters(newFilters);
    await fetchHostels(newFilters);
  };

  // Clear filters
  const clearFilters = async () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    await fetchHostels(emptyFilters);
  };

  // Initial fetch
  useEffect(() => {
    fetchHostels();
  }, []);

  return {
    hostels,
    loading,
    error,
    filters,
    applyFilters,
    clearFilters,
    refetch: () => fetchHostels(filters),
  };
};
