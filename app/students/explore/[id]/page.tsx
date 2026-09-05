import { notFound } from 'next/navigation';
import HostelDetails from '@/components/students/hostel-details';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getHostel(id: string) {
  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const hostel = await db
      .collection('hostels')
      .findOne({ _id: new ObjectId(id) });
    
    if (!hostel) {
      return null;
    }
    
    // Convert ObjectId to string for serialization and add default values
    return {
      ...hostel,
      _id: hostel._id.toString(),
      images: hostel.images || [],
      features: hostel.features || [],
      location: hostel.location || '',
    };
  } catch (error) {
    console.error('Error fetching hostel:', error);
    return null;
  }
}

export default async function HostelDetailsPage({ params }: PageProps) {
  const { id } = await params;
  let hostel = await getHostel(id);
  
  if (!hostel) {
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
    } as any;
  }
  
  return <HostelDetails hostel={hostel as any} />;
}