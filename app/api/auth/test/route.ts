import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test database connection and auth setup
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    return NextResponse.json({
      success: true,
      message: "Better Auth with MongoDB is configured correctly!",
      session: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        userType: session.user.userType || "student"
      } : null
    });
  } catch (error) {
    console.error("Auth setup error:", error);
    return NextResponse.json({
      success: false,
      message: "Auth setup error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
