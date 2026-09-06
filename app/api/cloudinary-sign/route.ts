import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Only allow admins to sign uploads
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const folder = body.folder || 'cribpal_hostels';
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign: Record<string, any> = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      timestamp,
      folder,
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
