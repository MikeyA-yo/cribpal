import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.ADMIN_SALT || 'cribpal-admin-salt')).digest('hex');
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

// Default admin accounts for quick access
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
  },
  {
    name: "Admin",
    email: "admin@cribpal.com",
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

    const client = await clientPromise;
    const db = client.db("cribpal");
    const usersCollection = db.collection("user");
    const sessionsCollection = db.collection("admin_sessions");

    const defaultAdmin = DEFAULT_ADMINS.find(admin => admin.email.toLowerCase() === email.toLowerCase());
    let adminUser = await usersCollection.findOne({ 
      email: email.toLowerCase(), 
      userType: "admin" 
    });

    if (defaultAdmin) {
      if (password !== defaultAdmin.password) {
        return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
      }

      if (!adminUser) {
        const newAdmin = {
          name: defaultAdmin.name,
          email: defaultAdmin.email.toLowerCase(),
          password: hashPassword(defaultAdmin.password),
          userType: "admin",
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await usersCollection.insertOne(newAdmin);
        adminUser = { ...newAdmin, _id: result.insertedId };
      }
    } else if (adminUser) {
      const isValid = verifyPassword(password, adminUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Create a 24-hour admin session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await sessionsCollection.insertOne({
      sessionToken,
      userId: adminUser._id.toString(),
      email: adminUser.email,
      name: adminUser.name,
      userType: "admin",
      expiresAt: sessionExpiry,
      createdAt: new Date(),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        userType: "admin",
      },
    });

    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionExpiry,
      path: '/'
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
