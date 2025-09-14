import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAdminSession } from '@/lib/admin-auth';

// Define permanent admins (owners)
const PERMANENT_ADMINS = [
  'ayomide@cribpal.admin',
  'robinson@cribpal.admin'
];

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Fetch all admin users
    const admins = await db.collection('users')
      .find({ userType: 'admin' })
      .project({ 
        _id: 1,
        name: 1, 
        email: 1, 
        createdAt: 1,
        lastLogin: 1
      })
      .sort({ createdAt: 1 })
      .toArray();

    // Add permanent status to admins
    const adminsWithStatus = admins.map(admin => ({
      ...admin,
      isPermanent: PERMANENT_ADMINS.includes(admin.email),
      status: 'Active' // You can enhance this with actual status tracking
    }));

    // Get pending votes
    const pendingVotes = await db.collection('adminVotes')
      .find({ 
        status: 'pending',
        expiresAt: { $gt: new Date() }
      })
      .toArray();

    return NextResponse.json({
      success: true,
      admins: adminsWithStatus,
      pendingVotes: pendingVotes,
      totalAdmins: admins.length
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch admins' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, targetEmail, targetName, reason } = await request.json();

    if (!action || !targetEmail) {
      return NextResponse.json({ 
        error: 'Action and target email are required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if target is permanent admin for remove action
    if (action === 'remove' && PERMANENT_ADMINS.includes(targetEmail)) {
      return NextResponse.json({ 
        error: 'Cannot remove permanent administrators' 
      }, { status: 400 });
    }

    // Check if there's already a pending vote for this action
    const existingVote = await db.collection('adminVotes').findOne({
      targetEmail,
      action,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (existingVote) {
      return NextResponse.json({ 
        error: 'There is already a pending vote for this action' 
      }, { status: 400 });
    }

    // For add action, check if user exists and is not already admin
    if (action === 'add') {
      const targetUser = await db.collection('users').findOne({ email: targetEmail });
      if (!targetUser) {
        return NextResponse.json({ 
          error: 'User not found' 
        }, { status: 404 });
      }
      if (targetUser.userType === 'admin') {
        return NextResponse.json({ 
          error: 'User is already an administrator' 
        }, { status: 400 });
      }
    }

    // For remove action, check if user is admin
    if (action === 'remove') {
      const targetUser = await db.collection('users').findOne({ email: targetEmail });
      if (targetUser?.userType !== 'admin') {
        return NextResponse.json({ 
          error: 'User is not an administrator' 
        }, { status: 400 });
      }
    }

    // Create the vote
    const vote = {
      action, // 'add' or 'remove'
      targetEmail,
      targetName: targetName || targetEmail,
      proposedBy: session.email,
      proposedByName: session.name || session.email,
      reason: reason || '',
      votes: {
        [session.email]: 'yes' // Proposer automatically votes yes
      },
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      requiredVotes: 2 // At least 2 yes votes needed
    };

    const insertResult = await db.collection('adminVotes').insertOne(vote);

    return NextResponse.json({
      success: true,
      message: `Vote created successfully. ${action === 'add' ? 'Add' : 'Remove'} admin vote is now pending.`,
      voteId: insertResult.insertedId
    });

  } catch (error) {
    console.error('Error creating admin vote:', error);
    return NextResponse.json({ 
      error: 'Failed to create vote' 
    }, { status: 500 });
  }
}
