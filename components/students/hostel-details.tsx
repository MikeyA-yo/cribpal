"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  CheckCircle, 
  Heart, 
  ArrowLeft, 
  CreditCard, 
  Eye, 
  Users, 
  Wifi, 
  Car, 
  Shield,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Hostel {
  _id: string;
  name: string;
  address: string;
  price: number;
  location?: string;
  images?: string[];
  features?: string[];
  other?: string;
  views?: number;
  description?: string;
  capacity?: number;
  contact?: {
    phone?: string;
    email?: string;
  };
  availableRooms?: number;
}

interface HostelDetailsProps {
  hostel: Hostel;
}

// Price formatting function
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}/year`;
}

export default function HostelDetails({ hostel }: HostelDetailsProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoved, setIsLoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hostelImages, setHostelImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'reservation' | 'full'>('reservation');
  
  // Rating states
  const [ratingsData, setRatingsData] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  // Check if hostel is already saved, fetch images and ratings
  useEffect(() => {
    checkIfSaved();
    fetchHostelImages();
    fetchRatings();
  }, []);

  const fetchHostelImages = async () => {
    try {
      setImagesLoading(true);
      const response = await fetch(`/api/hostels/${hostel._id}/images`);
      const result = await response.json();
      
      if (result.success && result.image) {
        setHostelImages([result.image.dataUrl]);
      } else {
        setHostelImages([]);
      }
    } catch (error) {
      console.error('Error fetching hostel images:', error);
      setHostelImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await fetch('/api/user/saved-hostels');
      const result = await response.json();
      
      if (result.success && result.lovedHostels) {
        setIsLoved(result.lovedHostels.includes(hostel._id));
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const toggleSave = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/saved-hostels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostelId: hostel._id,
          action: isLoved ? 'unsave' : 'save'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsLoved(!isLoved);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (index: number) => {
    if (hostelImages.length > 0) {
      return hostelImages[index] || hostelImages[0];
    }
    return `/room${Math.floor(Math.random() * 8) + 1}.jpg`;
  };

  const nextImage = () => {
    if (hostelImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % hostelImages.length);
    }
  };

  const prevImage = () => {
    if (hostelImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + hostelImages.length) % hostelImages.length);
    }
  };

  const handlePayment = (type: 'reservation' | 'full') => {
    setPaymentType(type);
    setPaymentAmount(type === 'reservation' ? (hostel.price * 0.1).toString() : hostel.price.toString());
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    // This would integrate with a payment processor like Paystack, Flutterwave, etc.
    alert(`Payment of ₦${parseInt(paymentAmount).toLocaleString()} initiated. This would redirect to payment gateway.`);
    setShowPaymentModal(false);
  };

  const fetchRatings = async () => {
    try {
      setRatingsLoading(true);
      const response = await fetch(`/api/hostels/${hostel._id}/ratings`);
      const result = await response.json();
      
      if (result.success) {
        setRatingsData(result.data);
      }
      
      // Also fetch user's existing rating
      try {
        const userRatingResponse = await fetch(`/api/hostels/${hostel._id}/ratings/user`);
        const userRatingResult = await userRatingResponse.json();
        
        if (userRatingResult.success && userRatingResult.data) {
          setUserRating(userRatingResult.data.rating);
          setUserReview(userRatingResult.data.review || '');
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setRatingsLoading(false);
    }
  };

  const submitRating = async () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    try {
      const response = await fetch(`/api/hostels/${hostel._id}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: userRating,
          review: userReview.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowRatingModal(false);
        setUserRating(0);
        setUserReview('');
        // Refresh ratings data
        await fetchRatings();
      } else {
        alert(result.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${
              interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explore
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isLoved 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-gray-50 text-gray-600 border border-gray-200'
            } hover:scale-105`}
          >
            <Heart className={`w-4 h-4 ${isLoved ? 'fill-red-500 text-red-500' : ''}`} />
            {loading ? 'Saving...' : isLoved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
              {imagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <img 
                  src={getImageUrl(currentImageIndex)} 
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                />
              )}
              {hostelImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {hostelImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {hostelImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {hostelImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${hostel.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hostel Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-green-900">{hostel.name}</h1>
                {ratingsData && ratingsData.totalRatings > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-700 font-semibold">{ratingsData.averageRating}</span>
                      <span className="text-gray-500 text-sm">({ratingsData.totalRatings} reviews)</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{hostel.address}</span>
              </div>
              
              <div className="text-2xl font-bold text-green-700 mb-4">
                {formatPrice(hostel.price)}
              </div>
              
              {hostel.other && (
                <div className="text-green-600 font-medium mb-4">{hostel.other}</div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {hostel.capacity && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{hostel.capacity} students</span>
                </div>
              )}
              {hostel.availableRooms && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{hostel.availableRooms} rooms available</span>
                </div>
              )}
            </div>

            {/* Description */}
            {hostel.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{hostel.description}</p>
              </div>
            )}

            {/* Features */}
            {hostel.features && hostel.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hostel.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {hostel.contact && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {hostel.contact.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{hostel.contact.phone}</span>
                    </div>
                  )}
                  {hostel.contact.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{hostel.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ratings & Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ratings & Reviews</h3>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  {userRating > 0 ? 'Update Review' : 'Write Review'}
                </button>
              </div>
              
              {ratingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
              ) : ratingsData && ratingsData.totalRatings > 0 ? (
                <div className="space-y-4">
                  {/* Rating Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{ratingsData.averageRating}</div>
                        <div className="flex justify-center mb-1">
                          {renderStars(Math.round(ratingsData.averageRating))}
                        </div>
                        <div className="text-sm text-gray-600">{ratingsData.totalRatings} reviews</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-600 w-3">{star}</span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ 
                                  width: `${ratingsData.totalRatings > 0 ? (ratingsData.ratingCounts[star] / ratingsData.totalRatings) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-6">{ratingsData.ratingCounts[star]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Reviews */}
                  {ratingsData.recentReviews.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Reviews</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {ratingsData.recentReviews.map((review: any) => (
                          <div key={review.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium text-gray-900">{review.userName}</div>
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {review.review && (
                              <p className="text-gray-700 text-sm">{review.review}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">No reviews yet</div>
                  <div className="text-sm">Be the first to review this hostel!</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
              <button
                onClick={() => handlePayment('reservation')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
              >
                <CreditCard className="w-4 h-4" />
                Reserve with 10% (₦{(hostel.price * 0.1).toLocaleString()})
              </button>
              
              <button
                onClick={() => handlePayment('full')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
              >
                <CreditCard className="w-4 h-4" />
                Pay Full Amount ({formatPrice(hostel.price)})
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition font-semibold">
                <Eye className="w-4 h-4" />
                Schedule Inspection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {paymentType === 'reservation' ? 'Reserve Hostel' : 'Full Payment'}
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Hostel:</div>
                <div className="font-semibold">{hostel.name}</div>
                <div className="text-sm text-gray-600 mt-2 mb-1">Amount:</div>
                <div className="text-2xl font-bold text-green-600">
                  ₦{parseInt(paymentAmount).toLocaleString()}
                </div>
              </div>
              
              {paymentType === 'reservation' && (
                <div className="text-sm text-gray-600">
                  This is a 10% reservation fee. You'll pay the remaining 90% upon moving in.
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rate & Review {hostel.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex justify-center">
                  {renderStars(userRating, true, setUserRating)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience with this hostel..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {userReview.length}/1000
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setUserRating(0);
                    setUserReview('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={submittingRating}
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={submittingRating || userRating === 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}