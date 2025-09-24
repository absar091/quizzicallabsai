import { auth } from './firebase';
import { sendPasswordResetEmail, sendEmailVerification, User } from 'firebase/auth';

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent successfully!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to send password reset email'
    };
  }
};

// Send email verification
export const sendVerificationEmail = async (user: User): Promise<{ success: boolean; message: string }> => {
  try {
    await sendEmailVerification(user);
    return {
      success: true,
      message: 'Verification email sent successfully!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to send verification email'
    };
  }
};

// Check if email is verified
export const isEmailVerified = (user: User | null): boolean => {
  return user?.emailVerified || false;
};