import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";
import crypto from "crypto";

// Simple hash function using Node.js crypto (for development)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + process.env.ADMIN_SALT || 'cribpal-admin-salt').digest('hex');
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const usersCollection = db.collection("user");

// Default admin accounts
const DEFAULT_ADMINS = [
  {
    name: "Ayomide Oluwatola",
    email: "ayomide@cribpal.admin",
    password: "admin123"
  },
  {
    name: "Robinson Goodness",
    email: "robinson@cribpal.admin", 
    password: "admin123"
  },
  {
    name: "Mikey",
    email: "mikey@cribpal.admin",
    password: "admin123"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if this is a default admin email
    const defaultAdmin = DEFAULT_ADMINS.find(admin => admin.email === email);
    
    if (!defaultAdmin) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Check if admin already exists in database
    let adminUser = await usersCollection.findOne({ 
      email, 
      userType: "admin" 
    });

    // If admin doesn't exist in DB and password matches default, create them
    if (!adminUser && password === defaultAdmin.password) {
      const hashedPassword = hashPassword(password);
      
      const newAdmin = {
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        password: hashedPassword,
        userType: "admin",
        isFirstLogin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newAdmin);
      adminUser = { ...newAdmin, _id: result.insertedId };
    } 
    // If admin exists in DB, verify hashed password
    else if (adminUser) {
      const isValidPassword = verifyPassword(password, adminUser.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }
    }
    // If admin doesn't exist and password doesn't match default
    else {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Update first login status if needed
    if (adminUser.isFirstLogin) {
      await usersCollection.updateOne(
        { _id: adminUser._id },
        { 
          $set: { 
            isFirstLogin: false,
            lastLoginAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
    }

    // Create a simple session cookie for admin
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in database (using a sessions collection)
    const sessionsCollection = db.collection("admin_sessions");
    const sessionData = {
      sessionToken,
      userId: adminUser._id.toString(),
      email: adminUser.email,
      name: adminUser.name,
      userType: "admin",
      expiresAt: sessionExpiry,
      createdAt: new Date(),
    };

    // Store the session in database
    await sessionsCollection.insertOne(sessionData);

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        userType: "admin",
        isFirstLogin: adminUser.isFirstLogin,
      },
    });

    // Set session cookie
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionExpiry,
      path: '/admin'
    });

    return response;

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
