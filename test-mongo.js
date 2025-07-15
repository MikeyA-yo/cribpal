// Test MongoDB connection
import { MongoClient } from 'mongodb';

const testConnection = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://cribpalofficial:0qWWlsUmvkc4iFwZ@cluster0.jnegezs.mongodb.net/cribpal?retryWrites=true&w=majority&ssl=true&authSource=admin';
  
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(uri, {
    ssl: true,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('cribpal');
    const adminDb = client.db().admin();
    const result = await adminDb.ping();
    console.log('✅ Database ping successful:', result);
    
    // Test creating a collection
    const collections = await db.listCollections().toArray();
    console.log('✅ Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n🔧 SSL/TLS Error Detected. Try these solutions:');
      console.log('1. Check your MongoDB Atlas network access settings');
      console.log('2. Ensure your IP address is whitelisted');
      console.log('3. Verify your credentials are correct');
      console.log('4. Try the connection string without SSL parameters');
    }
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
};

testConnection();
