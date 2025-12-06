import mongoose from "mongoose";

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

/**
 * Global cache for MongoDB connection
 * This prevents multiple connections in development/hot reload
 */
const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Only throw error at runtime, not during build
if (!MONGODB_URI && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn("⚠️ MONGODB_URI not defined. MongoDB features will be disabled.");
}

/**
 * Connect to MongoDB using mongoose with connection caching
 * This is the recommended approach for Next.js applications
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined. Please set it in your environment variables.");
  }

  if (cached.conn) {
    console.log("🟡 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ New MongoDB connection established");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise on failure
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB (mainly for testing)
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("🔌 MongoDB connection closed");
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Get current connection status
 */
export function getConnectionStatus(): {
  state: number;
  name: string;
  readyState: 'disconnected' | 'connecting' | 'connected' | 'disconnecting' | 'invalid';
} {
  const state = mongoose.connection.readyState;
  const states: { [key: number]: 'disconnected' | 'connecting' | 'connected' | 'disconnecting' | 'invalid' } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'invalid'
  };

  return {
    state,
    name: mongoose.connection.name || 'unknown',
    readyState: states[state] || 'invalid'
  };
}

// Export mongoose for direct use
export { mongoose };
export default mongoose;
