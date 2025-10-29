import { auth } from './firebase';
import { sendPasswordResetEmail, User } from 'firebase/auth';

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

// Send email verification code
export const sendVerificationEmail = async (user: User): Promise<{ success: boolean; message: string }> => {
  try {
    if (!user.email) {
      throw new Error('User email is required');
    }
    
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: user.email, 
        name: user.displayName || user.email.split('@')[0] 
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        message: 'Verification code sent successfully!'
      };
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to send verification code'
    };
  }
};

// Check if email is verified
export const isEmailVerified = (user: User | null): boolean => {
  return user?.emailVerified || false;
};