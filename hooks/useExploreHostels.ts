"use client";

import { useState, useEffect } from 'react';
import { Hostel } from './useHostels';

export interface ExploreFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
}

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

      setHostels(data.hostels || []);
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
