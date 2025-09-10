import { MongoClient } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const sessionsCollection = db.collection("admin_sessions");

export async function getAdminSession(request?: NextRequest) {
  try {
    let sessionToken: string | undefined;
    
    if (request) {
      // For API routes, get cookie from request
      sessionToken = request.cookies.get('admin-session')?.value;
    } else {
      // For server components, use next/headers
      const cookieStore = await cookies();
      sessionToken = cookieStore.get('admin-session')?.value;
    }

    if (!sessionToken) {
      return null;
    }

    // Find session in database
    const session = await sessionsCollection.findOne({
      sessionToken,
      expiresAt: { $gt: new Date() }, // Check if session hasn't expired
    });

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      name: session.name,
      email: session.email,
      userType: session.userType,
    };
  } catch (error) {
    console.error("Error getting admin session:", error);
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Admin session required");
  }
  return session;
}
