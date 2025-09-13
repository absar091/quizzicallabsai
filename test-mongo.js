require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not defined in .env file");
  console.log("🔧 Please add this to your .env file:");
  console.log("MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/database");
  process.exit(1);
}

async function testMongoConnection() {
  const client = new MongoClient(uri);

  try {
    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    await client.connect();

    console.log("✅ Successfully connected to MongoDB Atlas!");
    console.log("📍 Database URL:", uri.split('@')[1].split('/')[0]);

    // Test database operations
    const db = client.db("quizzicallabs");

    // List collections
    const collections = await db.listCollections().toArray();
    console.log("📋 Available collections:", collections.map(col => col.name));

    // Test a simple query on a common collection
    try {
      const usersCount = await db.collection("users").countDocuments();
      console.log("👥 User documents count:", usersCount);
    } catch (err) {
      console.log("⚠️  No users collection or it's empty");
    }

    console.log("🎉 MongoDB connection test completed successfully!");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("Error:", error.message);

    // Provide helpful troubleshooting information
    if (error.message.includes("authentication failed")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Check if MongoDB username/password is correct");
      console.log("2. Verify network access is allowed in MongoDB Atlas");
      console.log("3. Ensure IP whitelist includes your current IP");
    }

    if (error.message.includes("getaddrinfo ENOTFOUND")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Check internet connection");
      console.log("2. Verify cluster URL is correct");
    }

    if (error.message.includes("connection timed out")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Check if MongoDB cluster is paused");
      console.log("2. Verify cluster tier allows connections");
    }
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

// Enhanced test with connection diagnostics
async function detailedMongoTest() {
  console.log("🔬 Running detailed MongoDB diagnostics...");

  // Test basic connectivity
  try {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(uri);

    const startTime = Date.now();
    await client.connect();
    const connectTime = Date.now() - startTime;

    console.log(`⚡ Connection time: ${connectTime}ms`);

    // Test database info
    const db = client.db("quizzicallabs");
    const stats = await db.stats();
    console.log("📊 Database stats:", {
      collections: stats.collections,
      documents: stats.objects,
      dataSize: `${Math.round(stats.dataSize / 1024)} KB`
    });

    await client.close();

  } catch (error) {
    console.error("🔍 Detailed analysis of connection failure:");
    console.error("Code:", error.code || "Unknown");
    console.error("CodeName:", error.codeName || "Unknown");
  }
}

if (require.main === module) {
  console.log("🚀 MongoDB Connection Test for Quizzicallabs");
  console.log("=" .repeat(50));
  testMongoConnection().then(() => {
    console.log("\n📝 Additional Diagnostics:");
    return detailedMongoTest();
  });
}

module.exports = { testMongoConnection, detailedMongoTest };
