export default function AdminHostelsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hostel Applications</h1>
        <p className="text-gray-600 mb-6">
          Manage and review hostel applications and listings.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
          <p className="text-blue-700">
            This page will allow you to:
          </p>
          <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
            <li>Review pending hostel applications</li>
            <li>Approve or reject hostel listings</li>
            <li>Manage existing hostel accounts</li>
            <li>View hostel performance metrics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
