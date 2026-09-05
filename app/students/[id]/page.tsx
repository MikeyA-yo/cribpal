import HostelDetails from "@/components/students/HostelDetails";
import { getHostelById } from "@/lib/db"; // we will create this
import { notFound } from "next/navigation";

export default async function HostelDetailsPage({ params }: { params: { id: string } }) {
  const hostel = await getHostelById(params.id);

  if (!hostel) {
    notFound();
  }

  // Convert ObjectIds to strings
  const serializedHostel = {
    ...hostel,
    _id: hostel._id.toString(),
    createdAt: hostel.createdAt.toISOString(),
    updatedAt: hostel.updatedAt.toISOString(),
  };

  return <HostelDetails hostel={serializedHostel} />;
}
