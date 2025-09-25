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

// GET - Get user's saved hostels
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

    const db = await getDatabase();
    
    // Get user's saved hostels
    const user = await db.collection('user').findOne({ 
      _id: new ObjectId(session.user.id) 
    });

    const lovedHostels = user?.lovedHostels || [];

    return NextResponse.json({
      success: true,
      lovedHostels
    });

  } catch (error) {
    console.error('Error fetching saved hostels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save/unsave a hostel
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

    const { hostelId, action } = await request.json();

    if (!hostelId || !action || !['save', 'unsave'].includes(action)) {
      return NextResponse.json(
        { error: 'Hostel ID and valid action (save/unsave) are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify hostel exists (optional check)
    const hostel = await db.collection('hostels').findOne({ 
      _id: new ObjectId(hostelId) 
    });
    
    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      );
    }

    // Update user's loved hostels
    let updateOperation;
    if (action === 'save') {
      // Add hostel to loved list (if not already there)
      updateOperation = {
        $addToSet: { lovedHostels: hostelId }
      };
    } else {
      // Remove hostel from loved list
      updateOperation = {
        $pull: { lovedHostels: hostelId }
      };
    }

    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      updateOperation
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated loved hostels list
    const updatedUser = await db.collection('user').findOne({ 
      _id: new ObjectId(session.user.id) 
    });
    
    const lovedHostels = updatedUser?.lovedHostels || [];

    return NextResponse.json({
      success: true,
      message: `Hostel ${action === 'save' ? 'saved' : 'removed'} successfully`,
      lovedHostels,
      isLoved: action === 'save'
    });

  } catch (error) {
    console.error('Error updating saved hostels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}