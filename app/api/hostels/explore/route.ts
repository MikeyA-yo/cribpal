import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const campus = url.searchParams.get("campus");
    const features = url.searchParams.get("features")?.split(",").filter((f) => f.trim()) || [];

    let hostels: any[] = [];

    try {
      const client = await clientPromise;
      const db = client.db("cribpal");
      
      const dbHostels = await db
        .collection("hostels")
        .find({ isActive: { $ne: false } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      if (dbHostels && dbHostels.length > 0) {
        hostels = dbHostels.map((h) => ({
          ...h,
          _id: h._id.toString(),
          images: Array.isArray(h.images) && h.images.length > 0 ? h.images : ["/room1.jpg"],
          video: h.video || null,
          audio: h.audio || null,
          campusTag: h.campusTag || "Campus",
          roomType: h.roomType || "Single Room",
          distance: h.distance || "Near Campus",
        }));
      }
    } catch (dbError) {
      console.warn("MongoDB query error:", dbError);
    }

    // Filter logic
    let filteredHostels = hostels;

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filteredHostels = filteredHostels.filter(
        (hostel) =>
          hostel.name?.toLowerCase().includes(searchTerm) ||
          hostel.address?.toLowerCase().includes(searchTerm) ||
          (hostel.location && hostel.location.toLowerCase().includes(searchTerm)) ||
          (hostel.campusTag && hostel.campusTag.toLowerCase().includes(searchTerm)) ||
          (hostel.other && hostel.other.toLowerCase().includes(searchTerm))
      );
    }

    if (campus && campus !== "All") {
      filteredHostels = filteredHostels.filter(
        (hostel) => hostel.campusTag && hostel.campusTag.toLowerCase().includes(campus.toLowerCase())
      );
    }

    if (minPrice || maxPrice) {
      filteredHostels = filteredHostels.filter((hostel) => {
        const price = hostel.price;
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    if (features.length > 0) {
      filteredHostels = filteredHostels.filter((hostel) =>
        features.some((feature) => hostel.features && hostel.features.includes(feature))
      );
    }

    return NextResponse.json({
      success: true,
      hostels: filteredHostels,
      totalAvailable: filteredHostels.length,
    });
  } catch (error) {
    console.error("Error fetching explore hostels:", error);
    return NextResponse.json(
      {
        success: false,
        hostels: [],
        totalAvailable: 0,
        error: "Failed to load hostels",
      },
      { status: 500 }
    );
  }
}
