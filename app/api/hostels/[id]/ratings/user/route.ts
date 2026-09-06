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

// GET - Get user's rating for a specific hostel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: hostelId } = await params;
    if (!hostelId || !ObjectId.isValid(hostelId)) {
      return NextResponse.json(
        { error: 'Invalid hostel ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find user's rating for this hostel
    const userRating = await db.collection('ratings').findOne({
      hostelId: new ObjectId(hostelId),
      userId: session.user.id
    });

    if (userRating) {
      return NextResponse.json({
        success: true,
        data: {
          rating: userRating.rating,
          review: userRating.review || '',
          createdAt: userRating.createdAt,
          updatedAt: userRating.updatedAt,
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null
      });
    }

  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}