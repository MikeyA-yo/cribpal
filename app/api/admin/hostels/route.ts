import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getAdminSession } from "@/lib/admin-auth";

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db("cribpal");
const hostelsCollection = db.collection("hostels");
const usersCollection = db.collection("user");

// GET - Fetch all hostels for admin review
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // 'verified', 'pending', 'all'
    const search = url.searchParams.get('search') || '';

    // Build filter query
    const filter: any = {};
    
    if (status === 'verified') {
      filter.isVerified = true;
    } else if (status === 'pending') {
      filter.isVerified = { $ne: true };
    }
    // If status is 'all' or not specified, fetch all hostels

    // Add search filter if provided
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch hostels with manager details
    const hostels = await hostelsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Found ${hostels.length} hostels`);
    console.log('Sample hostel managerId:', hostels[0]?.managerId);

    // Debug: Check if we have any hostel managers in the database
    const totalManagers = await usersCollection.countDocuments({ userType: "hostel_manager" });
    console.log(`Total hostel managers in database: ${totalManagers}`);
    
    if (totalManagers > 0) {
      const sampleManager = await usersCollection.findOne({ userType: "hostel_manager" });
      console.log('Sample manager:', { 
        id: sampleManager?._id, 
        name: sampleManager?.name || sampleManager?.firstName,
        email: sampleManager?.email 
      });
    }

    // Get manager details for each hostel
    const hostelsWithManagers = await Promise.all(
      hostels.map(async (hostel) => {
        let manager = null;
        
        if (hostel.managerId) {
          try {
            console.log(`Fetching manager for hostel ${hostel.name}, managerId: ${hostel.managerId}, type: ${typeof hostel.managerId}`);
            
            // Convert string managerId to ObjectId for database query
            if (ObjectId.isValid(hostel.managerId)) {
              const managerObjectId = new ObjectId(hostel.managerId);
              console.log(`Converted to ObjectId: ${managerObjectId}`);
              
              manager = await usersCollection.findOne({ 
                _id: managerObjectId,
                userType: "hostel_manager" 
              });
              
              console.log(`Manager found:`, manager ? `${manager.name || manager.firstName}` : 'not found');
            } else {
              console.log(`Invalid managerId format: ${hostel.managerId}`);
            }
          } catch (error) {
            console.error(`Error fetching manager for hostel ${hostel._id}:`, error);
          }
        } else {
          console.log(`No managerId for hostel ${hostel.name}`);
        }

        return {
          ...hostel,
          _id: hostel._id.toString(),
          manager: manager ? {
            id: manager._id.toString(),
            name: manager.name || `${manager.firstName || ''} ${manager.lastName || ''}`.trim() || 'No name',
            email: manager.email || 'No email',
            phone: manager.phone || manager.phoneNumber || 'No phone',
            userType: manager.userType,
          } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      hostels: hostelsWithManagers,
      total: hostelsWithManagers.length,
    });

  } catch (error) {
    console.error("Error fetching hostels for admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update hostel verification status
export async function PUT(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hostelId, isVerified, adminNotes } = await request.json();

    if (!hostelId || typeof isVerified !== 'boolean') {
      return NextResponse.json(
        { error: "Hostel ID and verification status are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(hostelId)) {
      return NextResponse.json({ error: "Invalid hostel ID" }, { status: 400 });
    }

    // Update hostel verification status
    const updateData: any = {
      isVerified,
      verificationDate: new Date(),
      verifiedBy: session.userId,
      updatedAt: new Date(),
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const result = await hostelsCollection.updateOne(
      { _id: new ObjectId(hostelId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Hostel ${isVerified ? 'verified' : 'unverified'} successfully`,
    });

  } catch (error) {
    console.error("Error updating hostel verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}