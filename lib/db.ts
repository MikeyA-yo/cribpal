import { MongoClient, ObjectId } from "mongodb";

// Cache the MongoDB connection
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(process.env.MONGO_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(process.env.MONGO_URI);
  clientPromise = client.connect();
}

export async function getHostelById(id: string) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db("cribpal");
  const hostels = db.collection("hostels");
  
  if (!ObjectId.isValid(id)) return null;

  // Also increment view count
  await hostels.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
  
  return await hostels.findOne({ _id: new ObjectId(id) });
}

export default clientPromise;
