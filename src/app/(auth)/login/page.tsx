
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle, loading: authLoading } = useAuth();
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
                description: "A new verification link has been sent to your email address. Please check your inbox and spam folder.",
            });
        } catch (error: any) {
             toast({
                title: "Error Sending Email",
                description: "Could not send verification email. Please try again in a few moments.",
                variant: "destructive",
            });
        } finally {
            setIsResending(false);
            setShowVerificationAlert(false); // Hide the alert after action
            await auth.signOut();
        }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setShowVerificationAlert(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      
      if (!userCredential.user.emailVerified) {
        setShowVerificationAlert(true);
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } catch (error: any) {
       let errorMessage = "An unknown error occurred.";
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else {
            errorMessage = error.message;
        }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirect will be handled by the AuthProvider
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to continue to Quizzicallabs AI.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
              render={({ field }) => (
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            
            <div className="relative w-full">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={authLoading}>
              {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8 0 130.2 105.4 21.8 244 21.8c67.2 0 123 24.8 166.3 65.9l-67.5 64.9C258.5 122.1 223.5 101.8 182.8 101.8c-70.3 0-126.5 58.2-126.5 130.1s56.2 130.1 126.5 130.1c76.3 0 115.4-53.7 122.5-81.8H285V246.3h199.1c.3 15.2.7 30.2.7 45.5z"></path>
                </svg>
              }
              Google
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
