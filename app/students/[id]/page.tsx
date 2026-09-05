import HostelDetails from "@/components/students/HostelDetails";
import { getHostelById } from "@/lib/db"; // we will create this
import { notFound } from "next/navigation";

export default async function HostelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let hostel: any = null;
  try {
    hostel = await getHostelById(id);
  } catch (err) {
    console.warn("DB error or cluster paused:", err);
  }

  if (!hostel) {
    // Fallback demo hostel
    hostel = {
      _id: id,
      name: "Emerald Court Luxury Suites",
      address: "St. Finbarr's College Road, Akoka",
      price: 380000,
      location: "UNILAG (Akoka, Lagos)",
      features: ["24/7 Power", "WiFi", "Treated Water", "Security"],
      images: ["/room1.jpg", "/room2.jpg"],
      other: "3 mins walk to UNILAG Main Gate. 24/7 solar backup.",
      views: 184,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Convert ObjectIds to strings
  const serializedHostel = {
    ...hostel,
    _id: hostel._id?.toString() || id,
    createdAt: hostel.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: hostel.updatedAt?.toISOString?.() || new Date().toISOString(),
  };

  return <HostelDetails hostel={serializedHostel} />;
}
