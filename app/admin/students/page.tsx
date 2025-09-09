export default function AdminStudentsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Student Accounts</h1>
        <p className="text-gray-600 mb-6">
          Manage student accounts and user activity.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Coming Soon</h2>
          <p className="text-green-700">
            This page will allow you to:
          </p>
          <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
            <li>View all registered students</li>
            <li>Manage student account status</li>
            <li>Monitor user activity and engagement</li>
            <li>Handle support requests and issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
