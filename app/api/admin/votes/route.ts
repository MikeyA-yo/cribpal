import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getAdminSession } from '@/lib/admin-auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { voteId, vote } = await request.json();

    if (!voteId || !vote || !['yes', 'no'].includes(vote)) {
      return NextResponse.json({ 
        error: 'Vote ID and valid vote (yes/no) are required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Find the vote
    const adminVote = await db.collection('adminVotes').findOne({
      _id: new ObjectId(voteId),
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!adminVote) {
      return NextResponse.json({ 
        error: 'Vote not found or expired' 
      }, { status: 404 });
    }

    // Check if user already voted
    if (adminVote.votes[session.email]) {
      return NextResponse.json({ 
        error: 'You have already voted on this proposal' 
      }, { status: 400 });
    }

    // Add the vote
    const updatedVotes = {
      ...adminVote.votes,
      [session.email]: vote
    };

    // Count votes
    const yesVotes = Object.values(updatedVotes).filter(v => v === 'yes').length;
    const noVotes = Object.values(updatedVotes).filter(v => v === 'no').length;
    const totalVotes = yesVotes + noVotes;

    // Get total admin count to determine if voting is complete
    const totalAdmins = await db.collection('users').countDocuments({ userType: 'admin' });

    let newStatus = 'pending';
    let message = 'Vote recorded successfully';

    // Check if vote should be resolved
    if (yesVotes >= adminVote.requiredVotes) {
      // Vote passed - execute the action
      newStatus = 'approved';
      
      if (adminVote.action === 'add') {
        await db.collection('users').updateOne(
          { email: adminVote.targetEmail },
          { 
            $set: { 
              userType: 'admin',
              adminGrantedAt: new Date(),
              adminGrantedBy: session.email
            }
          }
        );
        message = `Vote approved! ${adminVote.targetName} has been granted admin access.`;
      } else if (adminVote.action === 'remove') {
        await db.collection('users').updateOne(
          { email: adminVote.targetEmail },
          { 
            $set: { 
              userType: 'student', // Default back to student
              adminRemovedAt: new Date(),
              adminRemovedBy: session.email
            }
          }
        );
        message = `Vote approved! ${adminVote.targetName} has been removed from admin access.`;
      }
    } else if (noVotes > totalAdmins - adminVote.requiredVotes) {
      // Vote failed - not enough possible yes votes remaining
      newStatus = 'rejected';
      message = 'Vote rejected. Not enough support for this proposal.';
    } else if (totalVotes === totalAdmins) {
      // All admins voted but didn't reach required threshold
      newStatus = 'rejected';
      message = 'Vote rejected. Required vote threshold not met.';
    }

    // Update the vote
    await db.collection('adminVotes').updateOne(
      { _id: new ObjectId(voteId) },
      { 
        $set: {
          votes: updatedVotes,
          status: newStatus,
          resolvedAt: newStatus !== 'pending' ? new Date() : undefined,
          resolvedBy: newStatus !== 'pending' ? session.email : undefined
        }
      }
    );

    return NextResponse.json({
      success: true,
      message,
      status: newStatus,
      yesVotes,
      noVotes,
      totalVotes,
      requiredVotes: adminVote.requiredVotes
    });

  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ 
      error: 'Failed to process vote' 
    }, { status: 500 });
  }
}
