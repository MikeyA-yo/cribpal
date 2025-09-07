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

// GET - Get user profile
export async function GET(request: NextRequest) {
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

    const user = session.user as any;

    // Return user profile data directly from session
    const profile = {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      userType: user.userType || 'student',
      university: user.university || '',
      profileImage: user.profileImage || '',
      isVerified: user.isVerified || false,
    };

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
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
    const { name, email, firstName, lastName, phone, university, profileImage } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find user by _id as ObjectId (we now know this is how Better Auth works)
    const userInDb = await db.collection('user').findOne({ _id: new ObjectId(session.user.id) });
    console.log('User found:', userInDb ? 'YES' : 'NO');

    if (!userInDb) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user (only if email is being changed)
    if (email !== session.user.email) {
      const existingUser = await db.collection('user').findOne({
        email: email,
        _id: { $ne: userInDb._id }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 409 }
        );
      }
    }

    // Update user profile in the user collection using email as identifier
    const updateData = {
      name,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      university: university || '',
      profileImage: profileImage || '',
      updatedAt: new Date(),
    };

    // Update user using _id as ObjectId (the proper way!)
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    console.log('Update result for user:', session.user.id, result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user data using _id
    const updatedUser = await db.collection('user').findOne({ _id: new ObjectId(session.user.id) });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 }
      );
    }

    const profile = {
      id: updatedUser._id.toString(),
      name: updatedUser.name || '',
      email: updatedUser.email || '',
      firstName: updatedUser.firstName || '',
      lastName: updatedUser.lastName || '',
      phone: updatedUser.phone || '',
      userType: updatedUser.userType || 'student',
      university: updatedUser.university || '',
      profileImage: updatedUser.profileImage || updatedUser.image || '',
      isVerified: updatedUser.isVerified || false,
    };

    return NextResponse.json(
      { message: 'Profile updated successfully', profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
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

    const db = await getDatabase();

    // Delete user's hostels if they are a hostel manager
    const user = await db.collection('user').findOne({ _id: new ObjectId(session.user.id) });
    if (user?.userType === 'hostel_manager') {
      await db.collection('hostels').deleteMany({ managerId: session.user.id });
    }

    // Delete user sessions (this might use different field)
    await db.collection('session').deleteMany({ userId: session.user.id });

    // Delete user account using _id as ObjectId
    const result = await db.collection('user').deleteOne({ _id: new ObjectId(session.user.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
