import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { firestore } from './firebase-admin';
import { withQuotaTracking, shouldUseCache } from './quota-monitor';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface VerificationTokenPayload {
  email: string;
  code: string;
  exp: number;
}

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create JWT token with verification code
export function createVerificationToken(email: string, code: string): string {
  const payload: VerificationTokenPayload = {
    email,
    code,
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
  };
  return jwt.sign(payload, JWT_SECRET);
}

// Verify JWT token and extract code
export function verifyToken(token: string): VerificationTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as VerificationTokenPayload;
  } catch {
    return null;
  }
}

// Store verification code in Firebase
export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const { FieldValue } = await import('firebase-admin/firestore');
  const now = Date.now();
  const expires = now + (15 * 60 * 1000); // 15 minutes from now
  
  console.log('Storing verification code:', {
    email,
    code,
    expires: new Date(expires).toISOString(),
    now: new Date(now).toISOString(),
    expiresIn: '15 minutes'
  });
  
  try {
    await firestore.collection('users').doc(email).set({
      email,
      name: email.split('@')[0],
      emailVerificationToken: String(code).trim(), // Ensure string and trim
      emailVerificationExpires: expires,
      isEmailVerified: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('Code stored successfully for:', email, 'expires at:', new Date(expires).toISOString());
  } catch (error) {
    console.error('Error storing verification code:', error);
    throw error;
  }
}

// Verify code from Firebase
export async function verifyCodeFromDB(email: string, code: string): Promise<boolean> {
  try {
    const userDoc = await firestore.collection('users').doc(email).get();
    
    if (!userDoc.exists) {
      console.log('User document not found for email:', email);
      return false;
    }
    
    const userData = userDoc.data();
    const now = Date.now();
    
    console.log('Verification attempt:', {
      email,
      providedCode: code,
      storedCode: userData?.emailVerificationToken,
      expires: userData?.emailVerificationExpires ? new Date(userData.emailVerificationExpires).toISOString() : 'null',
      now: new Date(now).toISOString()
    });
    
    // Ensure we have the required fields
    if (!userData?.emailVerificationToken || !userData?.emailVerificationExpires) {
      console.log('Missing verification data for:', email);
      return false;
    }
    
    // Convert both codes to strings and trim whitespace for comparison
    const storedCode = String(userData.emailVerificationToken).trim();
    const providedCode = String(code).trim();
    
    // Check if code matches
    const isCodeMatch = storedCode === providedCode;
    
    if (!isCodeMatch) {
      console.log('Code mismatch - Expected:', storedCode, 'Got:', providedCode);
      return false;
    }
    
    // Check if code hasn't expired
    const isNotExpired = userData.emailVerificationExpires > now;
    
    if (!isNotExpired) {
      console.log('Code expired - Expires:', new Date(userData.emailVerificationExpires).toISOString(), 'Now:', new Date(now).toISOString());
      return false;
    }
    
    // Code is valid and not expired - mark as verified
    const { FieldValue } = await import('firebase-admin/firestore');
    await firestore.collection('users').doc(email).update({
      isEmailVerified: true,
      emailVerificationToken: FieldValue.delete(),
      emailVerificationExpires: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    console.log('Code verified successfully for:', email);
    return true;
    
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
}

// FIXED: Check if email is verified with advanced caching and quota handling
const verificationCache = new Map<string, { verified: boolean, timestamp: number }>();

export async function isEmailVerified(email: string): Promise<boolean> {
  // Check cache first with adaptive caching based on quota usage
  const cached = verificationCache.get(email);
  if (cached && shouldUseCache(cached.timestamp, 5)) {
    console.log('Using cached verification status for:', email);
    return cached.verified;
  }

  try {
    // Use quota tracking wrapper
    const verified = await withQuotaTracking(async () => {
      const userDoc = await firestore.collection('users').doc(email).get();
      return userDoc.exists ? userDoc.data()?.isEmailVerified || false : false;
    }, 'read');
    
    // Cache the result
    verificationCache.set(email, { verified, timestamp: Date.now() });
    
    return verified;
  } catch (error: any) {
    console.error('Error checking email verification:', error);
    
    // Return cached data if available, otherwise assume not verified
    if (cached) {
      console.log('Using stale cached data due to error:', error.message);
      return cached.verified;
    }
    
    // For quota errors, assume not verified to be safe
    return false;
  }
}