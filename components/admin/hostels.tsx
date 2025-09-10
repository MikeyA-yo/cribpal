"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Filter, 
  Building, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  MoreVertical,
  Shield,
  AlertTriangle
} from "lucide-react";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location: string;
  features: string[];
  other: string;
  isActive: boolean;
  isVerified: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  manager: Manager | null;
  verificationDate?: string;
  verifiedBy?: string;
  adminNotes?: string;
}

export default function AdminHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch hostels
  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const response = await fetch(`/api/admin/hostels?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch hostels');
      }

      setHostels(data.hostels || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hostels');
      console.error('Error fetching hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update verification status
  const updateVerificationStatus = async (hostelId: string, isVerified: boolean) => {
    try {
      setVerificationLoading(true);

      const response = await fetch('/api/admin/hostels', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostelId,
          isVerified,
          adminNotes: adminNotes.trim() || undefined,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update verification status');
      }

      // Update local state
      setHostels(prev => prev.map(hostel => 
        hostel._id === hostelId 
          ? { ...hostel, isVerified, verificationDate: new Date().toISOString() }
          : hostel
      ));

      setShowVerificationModal(false);
      setSelectedHostel(null);
      setAdminNotes("");

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification status');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Handle verification modal
  const openVerificationModal = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setAdminNotes(hostel.adminNotes || "");
    setShowVerificationModal(true);
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}/year`;
  };

  // Get status badge
  const getStatusBadge = (hostel: Hostel) => {
    if (hostel.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [statusFilter, searchTerm]);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Hostel Applications
        </h1>
        <p className="text-gray-600">
          Review and manage hostel verification status
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hostels by name, address, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white min-w-[150px]"
            >
              <option value="all">All Hostels</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <div className="text-lg font-semibold mb-2">Loading hostels...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      ) : hostels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hostels found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No hostel applications have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {hostels.length} hostel{hostels.length !== 1 ? 's' : ''}
          </div>

          {/* Hostels List */}
          <div className="space-y-4">
            {hostels.map((hostel, index) => (
              <motion.div
                key={hostel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Hostel Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{hostel.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{hostel.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-semibold text-red-600">{formatPrice(hostel.price)}</span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {hostel.views || 0} views
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(hostel)}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hostel.features.slice(0, 4).map((feature) => (
                        <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {hostel.features.length > 4 && (
                        <span className="text-gray-500 text-xs">
                          +{hostel.features.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Manager Info */}
                    {hostel.manager ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Manager Contact
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <span className="font-medium text-gray-700">Name:</span>
                              <p className="text-gray-900 mt-1">{hostel.manager.name}</p>
                            </div>
                            <div className="md:col-span-1 lg:col-span-2">
                              <span className="font-medium text-gray-700 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                Email:
                              </span>
                              <p className="text-gray-900 mt-1 break-all">{hostel.manager.email}</p>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              Phone:
                            </span>
                            <p className="text-gray-900 mt-1">{hostel.manager.phone}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-700 text-sm">⚠️ Manager contact information not available</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => openVerificationModal(hostel)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      {hostel.isVerified ? 'Update Status' : 'Verify Hostel'}
                    </button>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Applied: {new Date(hostel.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedHostel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Update Verification Status
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">{selectedHostel.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedHostel.address}</p>
              <p className="text-sm">
                Current Status: {getStatusBadge(selectedHostel)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about verification decision..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateVerificationStatus(selectedHostel._id, true)}
                disabled={verificationLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                {verificationLoading ? 'Updating...' : 'Verify'}
              </button>
              
              <button
                onClick={() => updateVerificationStatus(selectedHostel._id, false)}
                disabled={verificationLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium"
              >
                <XCircle className="w-4 h-4" />
                {verificationLoading ? 'Updating...' : 'Reject'}
              </button>
              
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setSelectedHostel(null);
                  setAdminNotes("");
                }}
                disabled={verificationLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}