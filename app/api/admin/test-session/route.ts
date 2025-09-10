import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing admin session...");
    
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ 
        error: "No session found",
        debug: "Session validation failed"
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: session,
      message: "Session is valid"
    });

  } catch (error) {
    console.error("Session test error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
