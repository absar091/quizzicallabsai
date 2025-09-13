import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get database information
    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    // List collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Get stats
    const stats = await db.stats();

    return NextResponse.json({
      success: true,
      message: "🎉 MongoDB connection working successfully!",
      database: {
        name: dbName,
        collections: collectionNames,
        collections_count: collections.length,
        data_size: `${Math.round(stats.dataSize / 1024 / 1024)} MB`,
        documents_count: stats.objects
      },
      connection: {
        ready_state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });

  } catch (error: any) {
    console.error("MongoDB test route error:", error);

    return NextResponse.json({
      success: false,
      message: "❌ MongoDB connection failed",
      error: {
        name: error.name,
        message: error.message,
        code: error.code || 'UNKNOWN'
      },
      troubleshooting: [
        "Check your MONGODB_URI in .env.local",
        "Ensure your MongoDB Atlas cluster is running",
        "Verify your IP is whitelisted in Atlas",
        "Confirm database user credentials are correct"
      ]
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: "POST to MongoDB test successful",
      received: body
    });

  } catch (error: any) {
    console.error("MongoDB POST test error:", error);

    return NextResponse.json({
      success: false,
      message: "❌ MongoDB POST test failed",
      error: error.message
    }, { status: 500 });
  }
}
