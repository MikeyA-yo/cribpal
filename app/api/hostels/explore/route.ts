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
    const features = url.searchParams.get('features')?.split(',') || [];

    // Build filter query
    const filter: any = {
      isActive: true,
      isVerified: true, // Only show verified hostels to students
    };

    // Add search filter (search in name, address, location)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Add features filter
    if (features.length > 0) {
      filter.features = { $in: features };
    }

    // Fetch hostels
    const hostels = await hostelsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 hostels for performance
      .toArray();

    // Filter by price if provided (price is stored as string, so we need to parse)
    let filteredHostels = hostels;
    if (minPrice || maxPrice) {
      filteredHostels = hostels.filter(hostel => {
        // Extract numeric value from price string (e.g., "₦280,000/year" -> 280000)
        const priceMatch = hostel.price.match(/[\d,]+/);
        if (!priceMatch) return true;
        
        const priceValue = parseInt(priceMatch[0].replace(/,/g, ''));
        
        if (minPrice && priceValue < parseInt(minPrice)) return false;
        if (maxPrice && priceValue > parseInt(maxPrice)) return false;
        
        return true;
      });
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
    });

  } catch (error) {
    console.error("Error fetching hostels for exploration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
