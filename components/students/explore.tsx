"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, MapPin, Heart, Eye, Search, Filter } from "lucide-react";

const availableHostels = [
  {
    id: 1,
    name: "Golden View Hostel",
    address: "8, Akoka Road, Yaba, Lagos",
    price: "₦280,000/year",
    location: "https://maps.google.com/maps?q=6.5244,3.3792&z=15&output=embed",
    image: "/room3.jpg",
    features: ["Electricity", "Water", "WiFi", "Parking", "Amenities"],
    rating: 4.5,
    distance: "0.8km from campus",
    availability: "6 rooms available",
  },
  {
    id: 2,
    name: "Emerald Heights",
    address: "15, University Road, Akoka, Lagos",
    price: "₦320,000/year",
    location: "https://maps.google.com/maps?q=6.5201,3.3856&z=15&output=embed",
    image: "/room4.jpg",
    features: ["Electricity", "Water", "Female Only", "WiFi", "Security"],
    rating: 4.8,
    distance: "0.5km from campus",
    availability: "3 rooms available",
  },
  {
    id: 3,
    name: "Royal Castle Hostel",
    address: "22, Herbert Macaulay Way, Yaba, Lagos",
    price: "₦380,000/year",
    location: "https://maps.google.com/maps?q=6.5095,3.3757&z=15&output=embed",
    image: "/room5.jpg",
    features: ["Electricity", "Water", "Male Only", "WiFi", "Parking", "Gym"],
    rating: 4.2,
    distance: "1.2km from campus",
    availability: "8 rooms available",
  },
  {
    id: 4,
    name: "BlueBay Student Lodge",
    address: "5, Randle Avenue, Yaba, Lagos",
    price: "₦260,000/year",
    location: "https://maps.google.com/maps?q=6.5156,3.3798&z=15&output=embed",
    image: "/room6.jpg",
    features: ["Electricity", "Water", "WiFi", "Study Room"],
    rating: 4.0,
    distance: "0.9km from campus",
    availability: "12 rooms available",
  },
  {
    id: 5,
    name: "Sunset Paradise",
    address: "30, Folagbade Street, Yaba, Lagos",
    price: "₦340,000/year",
    location: "https://maps.google.com/maps?q=6.5123,3.3734&z=15&output=embed",
    image: "/room7.jpg",
    features: ["Electricity", "Water", "WiFi", "Parking", "Laundry", "Security"],
    rating: 4.6,
    distance: "1.0km from campus",
    availability: "5 rooms available",
  },
];

export default function Explore() {
  const [hostels] = useState(availableHostels);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedHostels, setSavedHostels] = useState<number[]>([]);

  const toggleSave = (hostelId: number) => {
    setSavedHostels(prev => 
      prev.includes(hostelId) 
        ? prev.filter(id => id !== hostelId)
        : [...prev, hostelId]
    );
  };

  const filteredHostels = hostels.filter(hostel =>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-gray-600">
          Showing {filteredHostels.length} of {hostels.length} available hostels
        </div>
      </div>

      {/* Hostels Grid */}
      {filteredHostels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4">🔍</span>
          <div className="text-lg font-semibold mb-2">No hostels found</div>
          <div className="text-sm">Try adjusting your search terms or filters.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHostels.map((hostel, idx) => (
            <motion.div
              key={hostel.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              {/* Image with Save Button */}
              <div className="relative">
                <img src={hostel.image} alt={hostel.name} className="w-full h-44 object-cover" />
                <button
                  onClick={() => toggleSave(hostel.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition ${
                    savedHostels.includes(hostel.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedHostels.includes(hostel.id) ? 'fill-current' : ''}`} />
                </button>
                
                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ {hostel.rating}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-800 mb-1">{hostel.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{hostel.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="text-blue-700 font-semibold text-lg mb-2">{hostel.price}</div>
                
                <div className="text-green-600 text-sm font-medium mb-3">{hostel.availability}</div>

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

                {/* Map iframe */}
                <div className="w-full rounded-lg overflow-hidden mb-3 border border-blue-100">
                  <iframe
                    src={hostel.location}
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={hostel.name + " map"}
                  />
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button
                    onClick={() => toggleSave(hostel.id)}
                    className={`px-4 py-2 rounded-lg shadow transition font-semibold ${
                      savedHostels.includes(hostel.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {savedHostels.includes(hostel.id) ? 'Saved' : 'Save'}
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