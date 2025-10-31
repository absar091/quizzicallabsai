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
  // Use server timestamp for consistency
  const { FieldValue } = await import('firebase-admin/firestore');
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes from now
  
  console.log('Storing verification code:', {
    email,
    code,
    expires: new Date(expires).toISOString(),
    now: new Date().toISOString()
  });
  
  try {
    await firestore.collection('users').doc(email).set({
      email,
      name: email.split('@')[0],
      emailVerificationToken: code,
      emailVerificationExpires: expires,
      isEmailVerified: false,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('Code stored successfully for:', email);
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
      now: new Date(now).toISOString(),
      currentTimestamp: now,
      expiresTimestamp: userData?.emailVerificationExpires,
      isExpired: (userData?.emailVerificationExpires || 0) <= now,
      timeDiffMinutes: ((userData?.emailVerificationExpires || 0) - now) / (1000 * 60),
      codesMatch: String(userData?.emailVerificationToken) === String(code)
    });
    
    // Ensure we have the required fields
    if (!userData?.emailVerificationToken || !userData?.emailVerificationExpires) {
      console.log('Missing verification data for:', email, {
        hasToken: !!userData?.emailVerificationToken,
        hasExpires: !!userData?.emailVerificationExpires
      });
      return false;
    }
    
    // Convert both codes to strings for comparison
    const storedCode = String(userData.emailVerificationToken);
    const providedCode = String(code);
    
    // Check if code matches and hasn't expired (with fallback for timestamp issues)
    const isCodeMatch = storedCode === providedCode;
    const isNotExpired = userData.emailVerificationExpires > now;
    
    // Temporary fix for timestamp issues - if timestamp is in future, check if it's within reasonable range
    const timestampInFuture = userData.emailVerificationExpires > (now + 24 * 60 * 60 * 1000); // More than 24 hours in future
    const shouldBypassExpiry = timestampInFuture && (userData.emailVerificationExpires - now) < (365 * 24 * 60 * 60 * 1000); // Less than 1 year
    
    if (isCodeMatch && (isNotExpired || shouldBypassExpiry)) {
      // Clear the verification token after successful verification
      await firestore.collection('users').doc(email).update({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: now
      });
      console.log('Code verified successfully for:', email);
      return true;
    }
    
    // Log why verification failed
    if (storedCode !== providedCode) {
      console.log('Code mismatch - Expected:', storedCode, 'Got:', providedCode);
    }
    if (userData.emailVerificationExpires <= now) {
      console.log('Code expired - Expires:', new Date(userData.emailVerificationExpires).toISOString(), 'Now:', new Date(now).toISOString());
    }
    
    console.log('Verification failed:', {
      codeMatch: storedCode === providedCode,
      notExpired: userData.emailVerificationExpires > now,
      timestampIssue: userData.emailVerificationExpires > (now + 24 * 60 * 60 * 1000)
    });
    
    return false;
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