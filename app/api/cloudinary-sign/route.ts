import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    // Only allow admins to sign uploads
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error signing cloudinary request:', error);
    return NextResponse.json(
      { error: 'Failed to sign request' },
      { status: 500 }
    );
  }
}
