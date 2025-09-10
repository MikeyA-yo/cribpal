"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, MapPin, Heart, Eye, Search, Filter, X, DollarSign } from "lucide-react";
import { useExploreHostels } from "@/hooks/useExploreHostels";

// Price formatting function
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}/year`;
}

const availableFeatures = [
  "Electricity", "Water", "WiFi", "Parking", "Security", "Laundry", 
  "Gym", "Study Room", "Amenities", "Male Only", "Female Only"
];

export default function Explore() {
  const { hostels, loading, error, filters, applyFilters, clearFilters } = useExploreHostels();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedHostels, setSavedHostels] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    minPrice: "",
    maxPrice: "",
    features: [] as string[],
  });

  // Fallback dummy data for when backend fails
  const dummyHostels = [
    {
      _id: "dummy1",
      name: "Golden View Hostel",
      address: "8, Akoka Road, Yaba, Lagos",
      price: 280000,
      location: "https://maps.google.com/maps?q=6.5244,3.3792&z=15&output=embed",
      images: ["/room3.jpg"],
      features: ["Electricity", "Water", "WiFi", "Parking", "Amenities"],
      other: "0.8km from campus, 6 rooms available",
      managerId: "dummy",
      isActive: true,
      isVerified: true,
      views: 120,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "dummy2",
      name: "Emerald Heights",
      address: "15, University Road, Akoka, Lagos",
      price: 320000,
      location: "https://maps.google.com/maps?q=6.5201,3.3856&z=15&output=embed",
      images: ["/room4.jpg"],
      features: ["Electricity", "Water", "Female Only", "WiFi", "Security"],
      other: "0.5km from campus, 3 rooms available",
      managerId: "dummy",
      isActive: true,
      isVerified: true,
      views: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "dummy3",
      name: "Royal Castle Hostel",
      address: "22, Herbert Macaulay Way, Yaba, Lagos",
      price: 380000,
      location: "https://maps.google.com/maps?q=6.5095,3.3757&z=15&output=embed",
      images: ["/room5.jpg"],
      features: ["Electricity", "Water", "Male Only", "WiFi", "Parking", "Gym"],
      other: "1.2km from campus, 8 rooms available",
      managerId: "dummy",
      isActive: true,
      isVerified: true,
      views: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "dummy4",
      name: "BlueBay Student Lodge",
      address: "5, Randle Avenue, Yaba, Lagos",
      price: 260000,
      location: "https://maps.google.com/maps?q=6.5156,3.3798&z=15&output=embed",
      images: ["/room6.jpg"],
      features: ["Electricity", "Water", "WiFi", "Study Room"],
      other: "0.9km from campus, 12 rooms available",
      managerId: "dummy",
      isActive: true,
      isVerified: true,
      views: 95,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "dummy5",
      name: "Sunset Paradise",
      address: "30, Folagbade Street, Yaba, Lagos",
      price: 340000,
      location: "https://maps.google.com/maps?q=6.5123,3.3734&z=15&output=embed",
      images: ["/room7.jpg"],
      features: ["Electricity", "Water", "WiFi", "Parking", "Laundry", "Security"],
      other: "1.0km from campus, 5 rooms available",
      managerId: "dummy",
      isActive: true,
      isVerified: true,
      views: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Use backend data if available, otherwise use dummy data
  const displayHostels = hostels.length > 0 ? hostels : (error ? dummyHostels : []);

  const toggleSave = (hostelId: string) => {
    setSavedHostels(prev => 
      prev.includes(hostelId) 
        ? prev.filter(id => id !== hostelId)
        : [...prev, hostelId]
    );
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    await applyFilters({
      ...filters,
      search: value.trim() || undefined,
    });
  };

  const handleApplyFilters = async () => {
    const newFilters = {
      ...filters,
      search: searchTerm.trim() || undefined,
      minPrice: tempFilters.minPrice && !isNaN(parseInt(tempFilters.minPrice)) ? parseInt(tempFilters.minPrice) : undefined,
      maxPrice: tempFilters.maxPrice && !isNaN(parseInt(tempFilters.maxPrice)) ? parseInt(tempFilters.maxPrice) : undefined,
      features: tempFilters.features && tempFilters.features.length > 0 ? tempFilters.features : undefined,
    };
    
    await applyFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = async () => {
    setTempFilters({
      minPrice: "",
      maxPrice: "",
      features: [],
    });
    setSearchTerm("");
    await clearFilters();
    setShowFilters(false);
  };

  const toggleFeature = (feature: string) => {
    setTempFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getImageUrl = (hostel: any) => {
    if (hostel.images && hostel.images.length > 0) {
      // Use the actual database image if it exists
      return hostel.images[0];
    }
    // Fallback to random room image if no database image
    return `/room${Math.floor(Math.random() * 8) + 1}.jpg`;
  };

  const filteredHostels = displayHostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">Explore Hostels</h2>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hostels by name or location..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter className="w-5 h-5" />
            Filters
            {(filters.minPrice || filters.maxPrice || (filters.features && filters.features.length > 0)) && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                {[
                  filters.minPrice && "Min",
                  filters.maxPrice && "Max", 
                  filters.features && filters.features.length > 0 && `${filters.features.length} features`
                ].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Hostels</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range (₦/year)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={tempFilters.minPrice}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={tempFilters.maxPrice}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features & Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        tempFilters.features.includes(feature)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-gray-600 mb-4">
          <div>
            {loading ? (
              "Loading hostels..."
            ) : error && displayHostels.length === 0 ? (
              "Using demo data - backend unavailable"
            ) : (
              `Showing ${filteredHostels.length} of ${displayHostels.length} available hostels`
            )}
          </div>
          {error && !loading && (
            <div className="text-orange-600 text-sm">
              ⚠️ Demo mode - {error}
            </div>
          )}
        </div>
      </div>

      {/* Hostels Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-lg font-semibold mb-2">Loading hostels...</div>
          <div className="text-sm">Please wait while we fetch available hostels.</div>
        </div>
      ) : filteredHostels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4">🔍</span>
          <div className="text-lg font-semibold mb-2">No hostels found</div>
          <div className="text-sm">Try adjusting your search terms or filters.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHostels.map((hostel, idx) => (
            <motion.div
              key={hostel._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              {/* Image with Save Button */}
              <div className="relative">
                <img src={getImageUrl(hostel)} alt={hostel.name} className="w-full h-44 object-cover" />
                <button
                  onClick={() => toggleSave(hostel._id)}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition ${
                    savedHostels.includes(hostel._id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedHostels.includes(hostel._id) ? 'fill-current' : ''}`} />
                </button>
                
                {/* Views Badge */}
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  👁️ {hostel.views || 0}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-800 mb-1">{hostel.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{hostel.address}</span>
                    </div>
                  </div>
                </div>

                <div className="text-blue-700 font-semibold text-lg mb-2">{formatPrice(hostel.price)}</div>
                
                {hostel.other && (
                  <div className="text-green-600 text-sm font-medium mb-3">{hostel.other}</div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {hostel.features.slice(0, 4).map((feature) => (
                    <span key={feature} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-100">
                      <CheckCircle className="w-3 h-3" /> {feature}
                    </span>
                  ))}
                  {hostel.features.length > 4 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{hostel.features.length - 4} more
                    </span>
                  )}
                </div>

                {/* Map link */}
                {hostel.location && (
                  <div className="w-full mb-3">
                    <a
                      href={hostel.location.replace('output=embed', '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      View Location on Maps
                    </a>
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button
                    onClick={() => toggleSave(hostel._id)}
                    className={`px-4 py-2 rounded-lg shadow transition font-semibold ${
                      savedHostels.includes(hostel._id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {savedHostels.includes(hostel._id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}