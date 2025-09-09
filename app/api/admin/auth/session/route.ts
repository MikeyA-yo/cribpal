import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No admin session found" },
        { status: 401 }
      );
    }

    // In a real app, you'd validate the session token against your database
    // For now, we'll just check if it exists
    return NextResponse.json({
      success: true,
      user: {
        userType: "admin",
        // You'd fetch real user data from session
      }
    });

  } catch (error) {
    console.error("Admin session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
