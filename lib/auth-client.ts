import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// Export commonly used methods for convenience
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession, 
  getSession,
  updateUser,
} = authClient;

// Custom types for CribPal
export type UserType = "student" | "hostel_manager";

export interface CribPalUser {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  phone?: string;
  university?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
