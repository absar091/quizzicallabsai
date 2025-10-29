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
  
  await firestore.collection('users').doc(email).set({
    email,
    name: email.split('@')[0],
    emailVerificationToken: code,
    emailVerificationExpires: expires,
    isEmailVerified: false,
    updatedAt: Date.now()
  }, { merge: true });
}

// Verify code from Firebase
export async function verifyCodeFromDB(email: string, code: string): Promise<boolean> {
  const userDoc = await firestore.collection('users').doc(email).get();
  
  if (!userDoc.exists) return false;
  
  const userData = userDoc.data();
  const now = Date.now();
  
  if (userData?.emailVerificationToken === code && userData?.emailVerificationExpires > now) {
    await firestore.collection('users').doc(email).update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      updatedAt: now
    });
    return true;
  }
  
  return false;
}

// Check if email is verified
export async function isEmailVerified(email: string): Promise<boolean> {
  const userDoc = await firestore.collection('users').doc(email).get();
  return userDoc.exists ? userDoc.data()?.isEmailVerified || false : false;
}