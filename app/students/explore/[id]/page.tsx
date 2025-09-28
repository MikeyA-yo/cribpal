import { notFound } from 'next/navigation';
import HostelDetails from '@/components/students/hostel-details';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface PageProps {
  params: {
    id: string;
  };
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
  const hostel = await getHostel(params.id);
  
  if (!hostel) {
    notFound();
  }
  
  return <HostelDetails hostel={hostel as any} />;
}