"use client";

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: string;
  university: string;
  profileImage: string;
  isVerified: boolean;
}

interface UpdateProfileData {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  university?: string;
  profileImage?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Sign out user
  const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const response = await fetch('/api/user/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign out');
      }

      // Clear local state
      setProfile(null);
      
      // Redirect to home page
      window.location.href = '/';
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete user account
  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Clear local state
      setProfile(null);
      
      // Redirect to home page
      window.location.href = '/';
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Fetch profile when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    signOut,
    deleteAccount,
    refetch: fetchProfile,
  };
};
