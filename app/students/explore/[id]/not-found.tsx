export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Hostel Not Found</h2>
        <p className="text-gray-600 mb-8">
          The hostel you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/students"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Back to Explore
        </a>
      </div>
    </div>
  );
}