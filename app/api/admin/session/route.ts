import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        userType: session.userType
      }
    });
  } catch (error) {
    console.error('Error getting admin session:', error);
    return NextResponse.json({ 
      error: 'Failed to get admin session' 
    }, { status: 500 });
  }
}
