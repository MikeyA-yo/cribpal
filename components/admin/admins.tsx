'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Vote, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Crown
} from 'lucide-react';

interface Admin {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isPermanent: boolean;
  status: string;
  lastLogin?: string;
}

interface AdminVote {
  _id: string;
  action: 'add' | 'remove';
  targetEmail: string;
  targetName: string;
  proposedBy: string;
  proposedByName: string;
  reason: string;
  votes: Record<string, 'yes' | 'no'>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  expiresAt: string;
  requiredVotes: number;
}

interface AdminsData {
  admins: Admin[];
  pendingVotes: AdminVote[];
  totalAdmins: number;
}

export default function AdminsManagement() {
  const [data, setData] = useState<AdminsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminReason, setNewAdminReason] = useState('');
  const [removeReason, setRemoveReason] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    fetchAdmins();
    // Get current admin info from admin session
    fetch('/api/admin/session')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.admin) {
          setCurrentUserEmail(data.admin.email);
        }
      })
      .catch(() => {
        // Handle error silently for now
      });
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      console.log('Fetching admins...');
      const response = await fetch('/api/admin/admins');
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch admins');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVote = async (action: 'add' | 'remove', targetEmail: string, targetName: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetEmail,
          targetName,
          reason
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchAdmins(); // Refresh data
        setShowAddModal(false);
        setShowRemoveModal(false);
        setNewAdminEmail('');
        setNewAdminReason('');
        setRemoveReason('');
        setSelectedAdmin(null);
      } else {
        setError(result.error || 'Failed to create vote');
      }
    } catch (error) {
      setError('Failed to create vote');
    }
  };

  const handleVote = async (voteId: string, vote: 'yes' | 'no') => {
    try {
      const response = await fetch('/api/admin/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteId, vote })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchAdmins(); // Refresh data
      } else {
        setError(result.error || 'Failed to submit vote');
      }
    } catch (error) {
      setError('Failed to submit vote');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoteStats = (vote: AdminVote) => {
    const yesVotes = Object.values(vote.votes).filter(v => v === 'yes').length;
    const noVotes = Object.values(vote.votes).filter(v => v === 'no').length;
    return { yesVotes, noVotes, totalVotes: yesVotes + noVotes };
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" />
              Admin Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage administrator accounts and permissions through voting system.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <UserPlus className="w-4 h-4" />
              Propose Add Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Total Admins</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {data?.totalAdmins || 0}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-900">Pending Votes</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800 mt-1">
              {data?.pendingVotes?.length || 0}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Permanent Admins</span>
            </div>
            <p className="text-2xl font-bold text-purple-800 mt-1">
              {data?.admins?.filter(admin => admin.isPermanent).length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Current Admins */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Current Administrators</h2>
          <p className="text-gray-600 mt-1">All active administrator accounts</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {data?.admins?.map((admin) => (
              <div key={admin._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {admin.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{admin.name}</p>
                      {admin.isPermanent && (
                        <span title="Permanent Admin (Owner)">
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-xs text-gray-500">Joined: {formatDate(admin.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {admin.status}
                  </span>
                  {!admin.isPermanent && (
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowRemoveModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <span title="Propose removal">
                        <UserMinus className="w-4 h-4" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Votes */}
      {data?.pendingVotes && data.pendingVotes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Pending Votes</h2>
            <p className="text-gray-600 mt-1">Active voting proposals requiring your input</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {data.pendingVotes.map((vote) => {
                const { yesVotes, noVotes, totalVotes } = getVoteStats(vote);
                const hasVoted = Object.keys(vote.votes).includes(currentUserEmail);
                
                return (
                  <div key={vote._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {vote.action === 'add' ? (
                            <UserPlus className="w-5 h-5 text-green-600" />
                          ) : (
                            <UserMinus className="w-5 h-5 text-red-600" />
                          )}
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {vote.action} Administrator: {vote.targetName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Email:</strong> {vote.targetEmail}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Proposed by:</strong> {vote.proposedByName}
                        </p>
                        {vote.reason && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Reason:</strong> {vote.reason}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Expires: {formatDateTime(vote.expiresAt)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">{yesVotes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">{noVotes}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {vote.requiredVotes} votes needed
                        </p>
                      </div>
                    </div>
                    
                    {!hasVoted && (
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleVote(vote._id, 'yes')}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(vote._id, 'no')}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Vote No
                        </button>
                      </div>
                    )}
                    
                    {hasVoted && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-blue-600 font-medium">
                          ✓ You have already voted on this proposal
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Propose New Administrator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={newAdminReason}
                  onChange={(e) => setNewAdminReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Why should this user be granted admin access?"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleCreateVote('add', newAdminEmail, newAdminEmail, newAdminReason)}
                disabled={!newAdminEmail}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Create Vote
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAdminEmail('');
                  setNewAdminReason('');
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Admin Modal */}
      {showRemoveModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Propose Admin Removal</h3>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">
                You are proposing to remove <strong>{selectedAdmin.name}</strong> ({selectedAdmin.email}) 
                from administrator privileges.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={removeReason}
                  onChange={(e) => setRemoveReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Why should this admin access be revoked?"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleCreateVote('remove', selectedAdmin.email, selectedAdmin.name, removeReason)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Create Vote
              </button>
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setSelectedAdmin(null);
                  setRemoveReason('');
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
