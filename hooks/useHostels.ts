"use client";

import { useState, useEffect } from 'react';
import { authClient, useSession } from '@/lib/auth-client';

// Extend the session user type to include custom fields
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  university?: string;
  profileImage?: string;
  isVerified?: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
}

export interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: string;
  location: string;
  features: string[];
  other?: string;
  images?: string[];
  managerId: string;
  managerName: string;
  managerEmail: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  bookings: number;
}
export interface CreateHostelData {
  name: string;
  address: string;
  price: string;
  location: string;
  features: string[];
  other?: string;
  images?: string[];
}

export const useHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch hostels
  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/hostels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hostels');
      }

      setHostels(data.hostels || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hostels');
      console.error('Error fetching hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new hostel
  const createHostel = async (hostelData: CreateHostelData): Promise<{ success: boolean; error?: string; hostel?: Hostel }> => {
    try {
      setError(null);

      const response = await fetch('/api/hostels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(hostelData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create hostel');
      }

      // Add the new hostel to the list
      if (data.hostel) {
        setHostels(prev => [data.hostel, ...prev]);
      }

      return { success: true, hostel: data.hostel };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create hostel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update a hostel
  const updateHostel = async (id: string, hostelData: CreateHostelData): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const response = await fetch(`/api/hostels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(hostelData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update hostel');
      }

      // Update the hostel in the list
      setHostels(prev => prev.map(hostel => 
        hostel._id === id 
          ? { ...hostel, ...hostelData, updatedAt: new Date().toISOString() }
          : hostel
      ));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hostel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a hostel
  const deleteHostel = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const response = await fetch(`/api/hostels/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete hostel');
      }

      // Remove the hostel from the list
      setHostels(prev => prev.filter(hostel => hostel._id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete hostel';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Fetch hostels when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      const user = session.user as ExtendedUser;
      if (user.userType === 'hostel_manager') {
        fetchHostels();
      }
    }
  }, [session]);

  return {
    hostels,
    loading,
    error,
    createHostel,
    updateHostel,
    deleteHostel,
    refetch: fetchHostels,
  };
};
