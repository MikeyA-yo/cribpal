import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
async function getDatabase() {
  const client = new MongoClient(process.env.MONGO_URI!, {
    ssl: true,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  });
  
  await client.connect();
  return client.db('cribpal');
}

// POST - Set user type after signup
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userType, firstName, lastName, phone, businessName, university } = body;

    // Validate userType
    if (!userType || (userType !== 'student' && userType !== 'hostel_manager')) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be "student" or "hostel_manager"' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Update user with userType and additional fields
    const updateData: any = {
      userType,
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (businessName) updateData.businessName = businessName;
    if (university) updateData.university = university;

    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    console.log('UserType update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user data
    const updatedUser = await db.collection('user').findOne({ _id: new ObjectId(session.user.id) });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User type updated successfully',
      user: {
        id: updatedUser._id.toString(),
        userType: updatedUser.userType,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        businessName: updatedUser.businessName,
        university: updatedUser.university,
      }
    });

  } catch (error) {
    console.error('Error setting user type:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
