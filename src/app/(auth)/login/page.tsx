
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "@/components/ui/button";
import {
  isLoginAllowed,
  recordLoginFailure,
  recordLoginSuccess,
  getLoginRemainingAttempts,
  getLoginLockoutStatus,
  formatTimeRemaining,
  getProgressiveDelay
} from "@/lib/rate-limiting";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 🔐 Brute Force Protection State
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number | undefined>();
  const [nextAttemptDelay, setNextAttemptDelay] = useState(0);
  const [canAttemptLogin, setCanAttemptLogin] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResendVerification = async () => {
    if (auth.currentUser) {
        setIsResending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            toast({
                title: "Verification Email Sent!",
                description: "Please check your email and click the verification link, then try logging in again.",
            });
        } catch (error: any) {
             toast({
                title: "Error Sending Email",
                description: "Could not send verification email. Please try again in a few moments.",
                variant: "destructive",
            });
        } finally {
            setIsResending(false);
            setShowVerificationAlert(false);
            await auth.signOut();
        }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 🚨 BRUTE FORCE PROTECTION: Check if login is allowed
    if (!canAttemptLogin || nextAttemptDelay > 0) {
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${Math.ceil(nextAttemptDelay / 1000)} seconds before trying again.`,
        variant: "destructive",
      });
      return;
    }

    setShowVerificationAlert(false);
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);

      // 🔐 SUCCESSFUL LOGIN: Record success and reset counters
      recordLoginSuccess(values.email);
      setRemainingAttempts(5);
      setNextAttemptDelay(0);

      // Check if user has ever verified their email
      if (!userCredential.user.emailVerified) {
        const userRef = ref(db, `users/${userCredential.user.uid}/emailVerified`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          setShowVerificationAlert(true);
          setIsSubmitting(false);
          return;
        }
      } else {
        const userRef = ref(db, `users/${userCredential.user.uid}/emailVerified`);
        await set(userRef, true);
      }

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting...",
      });
    } catch (error: any) {
      // ❌ FAILED LOGIN: Record failure and show appropriate message
      recordLoginFailure(values.email);
      const newRemaining = getLoginRemainingAttempts(values.email);
      setRemainingAttempts(newRemaining);

      let errorMessage = "An unknown error occurred.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else {
        errorMessage = error.message;
      }

      // Add remaining attempts info to error message
      if (newRemaining < 5) {
        errorMessage += ` (${newRemaining} attempts remaining)`;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // 🛑 ACCOUNT LOCKOUT: If no attempts remaining
      if (newRemaining === 0) {
        const lockoutStatus = getLoginLockoutStatus(values.email);
        if (lockoutStatus.remainingLockTime) {
          setLockoutTimeRemaining(lockoutStatus.remainingLockTime);
          setNextAttemptDelay(lockoutStatus.remainingLockTime);
          toast({
            title: "Account Temporarily Locked",
            description: `Too many failed attempts. Try again in ${formatTimeRemaining(lockoutStatus.remainingLockTime)}.`,
            variant: "destructive",
          });
        }
      } else {
        // Progressive delay for remaining attempts
        const delay = getProgressiveDelay(5 - newRemaining + 1);
        setNextAttemptDelay(delay);
        setCanAttemptLogin(false);

        setTimeout(() => {
          setCanAttemptLogin(true);
          setNextAttemptDelay(0);
        }, delay);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome back!",
        description: "Successfully signed in with Google.",
      });
      // Redirect is handled by the AuthContext
    } catch (error: any) {
      let errorMessage = "Failed to sign in with Google. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups and try again.";
      }
      toast({
        title: "Google Sign-In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to continue to Quizzicallabzᴬᴵ.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
              {/* 🔐 Brute Force Protection Alerts */}
              {isLocked && lockoutTimeRemaining && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Account Temporarily Locked</AlertTitle>
                  <AlertDescription>
                    Too many failed login attempts. Try again in {formatTimeRemaining(lockoutTimeRemaining)}.
                    <Clock className="h-3 w-3 inline ml-1" />
                  </AlertDescription>
                </Alert>
              )}

              {remainingAttempts < 5 && remainingAttempts > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    {remainingAttempts} login attempt{remainingAttempts !== 1 ? 's' : ''} remaining.
                  </AlertDescription>
                </Alert>
              )}

              {!canAttemptLogin && nextAttemptDelay > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Too Many Attempts</AlertTitle>
                  <AlertDescription>
                    Please wait {Math.ceil(nextAttemptDelay / 1000)} seconds before trying again.
                  </AlertDescription>
                </Alert>
              )}

             {showVerificationAlert && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Email Not Verified</AlertTitle>
                  <AlertDescription>
                    You must verify your email address before logging in.
                    <Button
                        variant="link"
                        className="p-0 h-auto ml-1 font-bold text-destructive"
                        onClick={handleResendVerification}
                        disabled={isResending}
                    >
                        {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Resend verification email
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting && !showVerificationAlert}
              loadingText="Signing In..."
            >
              Sign In
            </Button>
            
            <div className="relative w-full">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              loading={isGoogleLoading}
              loadingText="Connecting to Google..."
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8 0 130.2 105.4 21.8 244 21.8c67.2 0 123 24.8 166.3 65.9l-67.5 64.9C258.5 122.1 223.5 101.8 182.8 101.8c-70.3 0-126.5 58.2-126.5 130.1s56.2 130.1 126.5 130.1c76.3 0 115.4-53.7 122.5-81.8H285V246.3h199.1c.3 15.2.7 30.2.7 45.5z"></path>
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground space-x-2">
              <span>Don't have an account?</span>
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
