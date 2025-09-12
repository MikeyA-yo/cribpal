import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getAdminSession } from '@/lib/admin-auth';

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

// GET - Fetch all students for admin dashboard
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = await getAdminSession(request);
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('user');

    // Get query parameters for filtering and pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Build query for students only
    const query: any = { userType: 'student' };

    // Add search filter
    if (search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { university: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination
    const totalStudents = await usersCollection.countDocuments(query);

    // Fetch students with pagination
    const students = await usersCollection
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get activity stats (you can expand this based on your needs)
    const totalCount = await usersCollection.countDocuments({ userType: 'student' });
    const recentCount = await usersCollection.countDocuments({
      userType: 'student',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    // Format student data for frontend
    const formattedStudents = students.map(student => ({
      _id: student._id.toString(),
      name: student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      phone: student.phone || '',
      university: student.university || '',
      emailVerified: student.emailVerified || false,
      profileImage: student.profileImage || '',
      createdAt: student.createdAt || new Date(),
      updatedAt: student.updatedAt || new Date(),
      lastLoginAt: student.lastLoginAt || null,
    }));

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      pagination: {
        current: page,
        limit,
        total: totalStudents,
        pages: Math.ceil(totalStudents / limit),
      },
      stats: {
        total: totalCount,
        recent: recentCount,
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student account (admin action)
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = await getAdminSession(request);
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const studentId = url.searchParams.get('id');

    if (!studentId || !ObjectId.isValid(studentId)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Delete student account
    const result = await db.collection('user').deleteOne({
      _id: new ObjectId(studentId),
      userType: 'student'
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Optional: Clean up related data (sessions, etc.)
    await db.collection('session').deleteMany({ userId: studentId });

    return NextResponse.json({
      success: true,
      message: 'Student account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}