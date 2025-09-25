import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { hostelIds } = await request.json();

    if (!hostelIds || !Array.isArray(hostelIds) || hostelIds.length === 0) {
      return NextResponse.json({
        success: true,
        hostels: []
      });
    }

    const { db } = await connectToDatabase();

    // Convert string IDs to ObjectIds
    const objectIds = hostelIds
      .filter(id => ObjectId.isValid(id))
      .map(id => new ObjectId(id));

    if (objectIds.length === 0) {
      return NextResponse.json({
        success: true,
        hostels: []
      });
    }

    // Fetch hostels by IDs
    const hostels = await db.collection('hostels')
      .find({ 
        _id: { $in: objectIds },
        isActive: true,
        isVerified: true
      })
      .project({
        _id: 1,
        name: 1,
        address: 1,
        price: 1,
        location: 1,
        images: 1,
        features: 1,
        other: 1,
        views: 1,
        createdAt: 1
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectIds to strings for frontend
    const formattedHostels = hostels.map(hostel => ({
      ...hostel,
      _id: hostel._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      hostels: formattedHostels
    });

  } catch (error) {
    console.error('Error fetching hostels by IDs:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}