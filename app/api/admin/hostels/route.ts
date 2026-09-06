import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

// GET - Fetch all hostels for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';

    const filter: any = {};
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
        { campusTag: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const client = await clientPromise;
    const db = client.db("cribpal");
    const hostels = await db
      .collection("hostels")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      hostels,
      total: hostels.length,
    });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new hostel (Admin direct listing)
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.address || !data.price) {
      return NextResponse.json(
        { error: "Name, address, and price are required" },
        { status: 400 }
      );
    }

    // Direct single listing model: eliminate obsolete manager / approval fields
    const newHostel = {
      name: data.name.trim(),
      campusTag: data.campusTag?.trim() || "Campus",
      address: data.address.trim(),
      location: data.location?.trim() || data.address.trim(),
      distance: data.distance?.trim() || "Walking distance to campus",
      roomType: data.roomType?.trim() || "Single Room",
      price: Number(data.price),
      features: Array.isArray(data.features) 
        ? data.features 
        : typeof data.features === 'string'
        ? data.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        : [],
      other: data.other?.trim() || "",
      contactPhone: data.contactPhone?.trim() || "+234 812 345 6789",
      images: Array.isArray(data.images) ? data.images : [],
      video: data.video || null,
      audio: data.audio || null,
      isActive: true,
      isVerified: true,
      adminId: session.userId || "admin",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("cribpal");
    const result = await db.collection("hostels").insertOne(newHostel);

    return NextResponse.json({
      success: true,
      hostelId: result.insertedId,
      message: "Hostel listed successfully",
    });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a hostel by ID
export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Hostel ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("cribpal");

    let filter: any;
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { _id: id };
    }

    const result = await db.collection("hostels").deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Hostel listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}