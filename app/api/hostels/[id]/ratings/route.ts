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

// GET - Retrieve ratings for a hostel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hostelId } = await params;
    if (!hostelId || !ObjectId.isValid(hostelId)) {
      return NextResponse.json(
        { error: 'Invalid hostel ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get all ratings for this hostel
    const ratings = await db.collection('ratings').find({
      hostelId: new ObjectId(hostelId)
    }).toArray();

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;

    // Count ratings by stars
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      ratingCounts[rating.rating as keyof typeof ratingCounts]++;
    });

    // Get recent reviews (limit to 10 most recent)
    const recentReviews = ratings
      .filter(rating => rating.review && rating.review.trim() !== '')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(rating => ({
        id: rating._id.toString(),
        userId: rating.userId,
        userName: rating.userName || 'Anonymous',
        rating: rating.rating,
        review: rating.review,
        createdAt: rating.createdAt,
      }));

    return NextResponse.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings,
        ratingCounts,
        recentReviews,
      }
    });

  } catch (error) {
    console.error('Error retrieving ratings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add or update a rating for a hostel
export async function POST(
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

    const body = await request.json();
    const { rating, review } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate review (optional but if provided, should be reasonable length)
    if (review && review.length > 1000) {
      return NextResponse.json(
        { error: 'Review must be less than 1000 characters' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if hostel exists
    const hostel = await db.collection('hostels').findOne({
      _id: new ObjectId(hostelId)
    });

    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      );
    }

    // Check if user already rated this hostel
    const existingRating = await db.collection('ratings').findOne({
      hostelId: new ObjectId(hostelId),
      userId: session.user.id
    });

    const ratingData = {
      hostelId: new ObjectId(hostelId),
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      rating,
      review: review || '',
      updatedAt: new Date(),
    };

    if (existingRating) {
      // Update existing rating
      await db.collection('ratings').updateOne(
        { _id: existingRating._id },
        { $set: ratingData }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Rating updated successfully',
        data: { ...ratingData, id: existingRating._id.toString() }
      });
    } else {
      // Create new rating
      const result = await db.collection('ratings').insertOne({
        ...ratingData,
        createdAt: new Date(),
      });
      
      return NextResponse.json({
        success: true,
        message: 'Rating added successfully',
        data: { ...ratingData, id: result.insertedId.toString() }
      });
    }

  } catch (error) {
    console.error('Error adding/updating rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a rating
export async function DELETE(
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

    // Delete the user's rating for this hostel
    const result = await db.collection('ratings').deleteOne({
      hostelId: new ObjectId(hostelId),
      userId: session.user.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Rating not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rating deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}