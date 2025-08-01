
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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
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
        setShowVerificationAlert(true); // Don't sign out immediately, show the alert first
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

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
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
            <div className="text-center text-sm text-muted-foreground space-x-2">
              <span>Don't have an account?</span>
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
             <div className="text-center text-sm text-muted-foreground space-x-2">
              <span>Having trouble?</span>
              <Link href="/how-to-use/account-verification" className="font-medium text-primary hover:underline">
                Need help?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
