import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const hostelsCollection = db.collection("hostels");

// GET - Fetch a specific hostel
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hostel ID" }, { status: 400 });
    }

    const hostel = await hostelsCollection.findOne({
      _id: new ObjectId(id),
      managerId: session.user.id // Ensure user can only access their own hostels
    });

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      hostel: {
        ...hostel,
        _id: hostel._id.toString(),
      }
    });

  } catch (error) {
    console.error("Error fetching hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a hostel
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.userType !== "hostel_manager") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, address, price, location, features, other, images } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hostel ID" }, { status: 400 });
    }

    // Validate required fields
    if (!name || !address || !price || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData = {
      name: name.trim(),
      address: address.trim(),
      price: price.trim(),
      location: location.trim(),
      features: features || [],
      other: other?.trim() || "",
      images: images || [],
      updatedAt: new Date(),
    };

    const result = await hostelsCollection.updateOne(
      {
        _id: new ObjectId(id),
        managerId: session.user.id // Ensure user can only update their own hostels
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Hostel updated successfully"
    });

  } catch (error) {
    console.error("Error updating hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hostel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.userType !== "hostel_manager") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hostel ID" }, { status: 400 });
    }

    const result = await hostelsCollection.deleteOne({
      _id: new ObjectId(id),
      managerId: session.user.id // Ensure user can only delete their own hostels
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Hostel deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
