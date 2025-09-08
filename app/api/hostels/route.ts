import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const hostelsCollection = db.collection("hostels");

// GET - Fetch hostels for the current user
export async function GET(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "hostel_manager") {
      return NextResponse.json({ error: "Access denied. Hostel managers only." }, { status: 403 });
    }

    // Fetch hostels belonging to this user
    const hostels = await hostelsCollection
      .find({ managerId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      hostels: hostels.map(hostel => ({
        ...hostel,
        _id: hostel._id.toString(),
      }))
    });

  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new hostel
export async function POST(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userType !== "hostel_manager") {
      return NextResponse.json({ error: "Access denied. Hostel managers only." }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, price, location, features, other, images } = body;

    // Validate required fields
    if (!name || !address || !price || !location) {
      return NextResponse.json(
        { error: "Missing required fields: name, address, price, location" },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNumber = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    // Create hostel document
    const hostelData = {
      name: name.trim(),
      address: address.trim(),
      price: priceNumber, // Store as number
      location: location.trim(),
      features: features || [],
      other: other?.trim() || "",
      images: images || [],
      managerId: session.user.id,
      managerName: session.user.name || `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim(),
      managerEmail: session.user.email,
      isActive: true,
      isVerified: false, // Requires admin verification
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      bookings: 0,
    };

    const result = await hostelsCollection.insertOne(hostelData);

    if (!result.insertedId) {
      return NextResponse.json(
        { error: "Failed to create hostel" },
        { status: 500 }
      );
    }

    // Return the created hostel
    const createdHostel = await hostelsCollection.findOne({
      _id: result.insertedId
    });

    return NextResponse.json({
      success: true,
      message: "Hostel created successfully",
      hostel: {
        ...createdHostel,
        _id: createdHostel!._id.toString(),
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
