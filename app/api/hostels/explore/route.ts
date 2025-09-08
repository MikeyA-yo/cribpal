import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const hostelsCollection = db.collection("hostels");

// GET - Fetch all active and verified hostels for students to explore
export async function GET(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "student") {
      return NextResponse.json({ error: "Access denied. Students only." }, { status: 403 });
    }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const features = url.searchParams.get('features')?.split(',').filter(f => f.trim()) || [];

    // Fetch all active and verified hostels first
    const hostels = await hostelsCollection
      .find({
        isActive: true,
        isVerified: true, // Only show verified hostels to students
      })
      .sort({ createdAt: -1 })
      .limit(100) // Reasonable limit for performance
      .toArray();

    // Apply filters manually
    let filteredHostels = hostels;

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredHostels = filteredHostels.filter(hostel =>
        hostel.name.toLowerCase().includes(searchTerm) ||
        hostel.address.toLowerCase().includes(searchTerm) ||
        (hostel.location && hostel.location.toLowerCase().includes(searchTerm))
      );
    }

    // Apply price filter
    if (minPrice || maxPrice) {
      filteredHostels = filteredHostels.filter(hostel => {
        const price = hostel.price;
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Apply features filter
    if (features.length > 0) {
      filteredHostels = filteredHostels.filter(hostel =>
        features.some(feature => hostel.features && hostel.features.includes(feature))
      );
    }

    // Increment view count for fetched hostels (optional)
    if (filteredHostels.length > 0) {
      const hostelIds = filteredHostels.map(h => h._id);
      await hostelsCollection.updateMany(
        { _id: { $in: hostelIds } },
        { $inc: { views: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      hostels: filteredHostels.map(hostel => ({
        ...hostel,
        _id: hostel._id.toString(),
      })),
      total: filteredHostels.length,
      totalAvailable: hostels.length, // Total before filtering
    });

  } catch (error) {
    console.error("Error fetching hostels for exploration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
