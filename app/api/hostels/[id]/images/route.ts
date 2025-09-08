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

// POST - Upload image for a hostel
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const user = session.user as any;
    if (user.userType !== 'hostel_manager') {
      return NextResponse.json(
        { error: 'Only hostel managers can upload images' },
        { status: 403 }
      );
    }

    const hostelId = params.id;
    if (!hostelId || !ObjectId.isValid(hostelId)) {
      return NextResponse.json(
        { error: 'Invalid hostel ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if hostel exists and belongs to this user
    const hostel = await db.collection('hostels').findOne({
      _id: new ObjectId(hostelId),
      managerId: new ObjectId(session.user.id)
    });

    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found or access denied' },
        { status: 404 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to array buffer then to array
    const arrayBuffer = await file.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(arrayBuffer));

    // Store image in database
    const imageDoc = {
      hostelId: new ObjectId(hostelId),
      managerId: new ObjectId(session.user.id),
      filename: file.name,
      contentType: file.type,
      size: file.size,
      imageData: imageArray,
      uploadedAt: new Date(),
    };

    const result = await db.collection('images').insertOne(imageDoc);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve image for a hostel
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hostelId = params.id;
    if (!hostelId || !ObjectId.isValid(hostelId)) {
      return NextResponse.json(
        { error: 'Invalid hostel ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find the image for this hostel
    const image = await db.collection('images').findOne({
      hostelId: new ObjectId(hostelId)
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert array back to buffer
    const imageBuffer = Buffer.from(image.imageData);
    
    // Convert to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${image.contentType};base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      image: {
        id: image._id.toString(),
        filename: image.filename,
        contentType: image.contentType,
        size: image.size,
        uploadedAt: image.uploadedAt,
        dataUrl: dataUrl,
      }
    });

  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove image for a hostel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const user = session.user as any;
    if (user.userType !== 'hostel_manager') {
      return NextResponse.json(
        { error: 'Only hostel managers can delete images' },
        { status: 403 }
      );
    }

    const hostelId = params.id;
    if (!hostelId || !ObjectId.isValid(hostelId)) {
      return NextResponse.json(
        { error: 'Invalid hostel ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Delete the image (ensure it belongs to this user)
    const result = await db.collection('images').deleteOne({
      hostelId: new ObjectId(hostelId),
      managerId: new ObjectId(session.user.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Image not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
