import AdminDashboard from "@/components/admin/dashboard";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin');
  }

  return <AdminDashboard user={session} />;
}
