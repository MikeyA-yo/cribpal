import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

const DEFAULT_HOSTELS = [
  {
    _id: "demo-1",
    name: "Emerald Court Luxury Suites",
    address: "St. Finbarr's College Road, Akoka, Yaba",
    location: "UNILAG (Akoka, Lagos)",
    price: 380000,
    features: ["WiFi", "Electricity", "Water", "Security", "AC"],
    images: ["/room1.jpg"],
    other: "3 mins walk to UNILAG Main Gate. 24/7 solar backup and treated borehole water.",
    views: 142,
  },
  {
    _id: "demo-2",
    name: "Campus View Premier Hall",
    address: "Agbowo University Gate Area, Ibadan",
    location: "University of Ibadan (UI)",
    price: 260000,
    features: ["WiFi", "Electricity", "Water", "Security", "Study Room"],
    images: ["/room2.jpg"],
    other: "5 mins walk to UI SUB Gate. En-suite bathrooms and quiet study lounge.",
    views: 98,
  },
  {
    _id: "demo-3",
    name: "Silver Crest Studio Apartments",
    address: "Commercial Avenue, Sabo, Yaba",
    location: "Yaba Tech & UNILAG",
    price: 550000,
    features: ["WiFi", "Electricity", "Water", "Security", "AC", "Gym", "Parking"],
    images: ["/room3.jpg"],
    other: "Modern serviced studio apartment with inverter backup, security guards, and gym access.",
    views: 215,
  },
  {
    _id: "demo-4",
    name: "Harmony Student Villa",
    address: "Ilesa Road, Opposite Campus Gate",
    location: "OAU (Ile-Ife)",
    price: 220000,
    features: ["Electricity", "Water", "Security", "Study Room"],
    images: ["/room4.jpg"],
    other: "Prepaid individual meter, fenced compound, quiet environment ideal for studying.",
    views: 76,
  },
  {
    _id: "demo-5",
    name: "Royal Palms Residence",
    address: "University Road, Akoka",
    location: "UNILAG (Akoka, Lagos)",
    price: 450000,
    features: ["WiFi", "Electricity", "Water", "Security", "AC"],
    images: ["/room5.jpg"],
    other: "4 mins to campus education gate. Kitchenette, fitted wardrobe, and constant light.",
    views: 184,
  },
  {
    _id: "demo-6",
    name: "Apex Heights Accommodation",
    address: "South Gate Junction, FUTA Road",
    location: "FUTA (Akure)",
    price: 290000,
    features: ["Electricity", "Water", "Security", "Parking"],
    images: ["/room6.jpg"],
    other: "4 mins walk to FUTA South Gate. Clean borehole water, fully interlocked compound.",
    views: 112,
  },
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const features = url.searchParams.get("features")?.split(",").filter((f) => f.trim()) || [];

    let hostels: any[] = [];

    try {
      const client = await clientPromise;
      const db = client.db("cribpal");
      const dbHostels = await db
        .collection("hostels")
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      if (dbHostels && dbHostels.length > 0) {
        hostels = dbHostels.map((h) => ({ ...h, _id: h._id.toString() }));
      }
    } catch (dbError) {
      console.warn("MongoDB query failed or not available, falling back to curated sample hostels:", dbError);
    }

    // If database has no hostels yet, supply the curated demo hostels
    if (hostels.length === 0) {
      hostels = DEFAULT_HOSTELS;
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
          (hostel.other && hostel.other.toLowerCase().includes(searchTerm))
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
        success: true,
        hostels: DEFAULT_HOSTELS,
        totalAvailable: DEFAULT_HOSTELS.length,
      },
      { status: 200 }
    );
  }
}
