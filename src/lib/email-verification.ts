import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { firestore } from './firebase-admin';

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
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const now = Date.now();
  
  console.log('Storing verification code:', {
    email,
    code,
    expires: new Date(expires).toISOString(),
    now: new Date(now).toISOString()
  });
  
  try {
    await firestore.collection('users').doc(email).set({
      email,
      name: email.split('@')[0],
      emailVerificationToken: code,
      emailVerificationExpires: expires,
      isEmailVerified: false,
      updatedAt: now
    }, { merge: true });
    
    // Verify the code was stored correctly
    const doc = await firestore.collection('users').doc(email).get();
    const data = doc.data();
    console.log('Verification after storage:', {
      stored: data?.emailVerificationToken,
      expires: data?.emailVerificationExpires,
      match: data?.emailVerificationToken === code
    });
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
      providedCodeType: typeof code,
      storedCode: userData?.emailVerificationToken,
      storedCodeType: typeof userData?.emailVerificationToken,
      expires: userData?.emailVerificationExpires ? new Date(userData.emailVerificationExpires).toISOString() : 'null',
      now: new Date(now).toISOString(),
      isExpired: (userData?.emailVerificationExpires || 0) <= now,
      timeDiffMinutes: ((userData?.emailVerificationExpires || 0) - now) / (1000 * 60)
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
    
    // Check if code matches and hasn't expired
    if (storedCode === providedCode && userData.emailVerificationExpires > now) {
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
      console.log('Code mismatch - Expected:', storedCode, 'Got:', providedCode, 'Match:', storedCode === providedCode);
    }
    if (userData.emailVerificationExpires <= now) {
      console.log('Code expired - Expires:', new Date(userData.emailVerificationExpires).toISOString(), 'Now:', new Date(now).toISOString());
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
}

// Check if email is verified
export async function isEmailVerified(email: string): Promise<boolean> {
  const userDoc = await firestore.collection('users').doc(email).get();
  return userDoc.exists ? userDoc.data()?.isEmailVerified || false : false;
}