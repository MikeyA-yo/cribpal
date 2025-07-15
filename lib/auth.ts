import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB connection with enhanced SSL configuration
const client = new MongoClient(process.env.MONGO_URI!, {
  ssl: true,
  tlsAllowInvalidCertificates: true, // For development only
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  maxPoolSize: 10,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("cribpal");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  // Environment variables
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Authentication methods
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  
  // Social providers for Google sign-in
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  
  // User model customization for CribPal
  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
        defaultValue: "student", // Default to student, can be "hostel_manager"
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      university: {
        type: "string",
        required: false,
      },
      profileImage: {
        type: "string",
        required: false,
      },
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  
  // Advanced options
  advanced: {
    cookiePrefix: "cribpal-auth",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  
  // Rate limiting for security
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 attempts per minute
  },
});
