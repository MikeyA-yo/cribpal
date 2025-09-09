export default function AdminManagementPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Management</h1>
        <p className="text-gray-600 mb-6">
          Manage administrator accounts and permissions.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">Coming Soon</h2>
          <p className="text-purple-700">
            This page will allow you to:
          </p>
          <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
            <li>View all admin accounts</li>
            <li>Add or remove administrator access</li>
            <li>Manage admin roles and permissions</li>
            <li>Monitor admin activity logs</li>
          </ul>
        </div>

        {/* Current Admins Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Administrators</h3>
          <div className="space-y-3">
            {[
              { name: "Ayomide Oluwatola", email: "ayomide@cribpal.admin", status: "Active" },
              { name: "Robinson Goodness", email: "robinson@cribpal.admin", status: "Active" },
              { name: "Mikey", email: "mikey@cribpal.admin", status: "Active" },
            ].map((admin, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {admin.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
