import AdminHostels from "@/components/admin/hostels";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminHostelsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin');
  }

  return <AdminHostels />;
}
