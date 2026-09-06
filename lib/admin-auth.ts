import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/db";

export async function getAdminSession(request?: NextRequest) {
  try {
    let sessionToken: string | undefined;
    
    if (request) {
      sessionToken = request.cookies.get('admin-session')?.value;
    } else {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get('admin-session')?.value;
    }

    if (!sessionToken) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db("cribpal");
    const sessionsCollection = db.collection("admin_sessions");

    const session = await sessionsCollection.findOne({
      sessionToken,
      expiresAt: { $gt: new Date() },
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
