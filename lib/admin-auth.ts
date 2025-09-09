import { MongoClient } from "mongodb";
import { cookies } from "next/headers";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const sessionsCollection = db.collection("admin_sessions");

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin-session')?.value;

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
