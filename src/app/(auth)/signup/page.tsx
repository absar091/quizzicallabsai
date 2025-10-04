
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from "react";
import { ref, set } from "firebase/database";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef } from "react";

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
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  fatherName: z.string().min(1, { message: "Father's name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  className: z.string().min(1, { message: "Class is required." }),
  age: z.coerce.number().min(5, "You must be at least 5 years old.").max(100, "Please enter a valid age."),
  agree: z.boolean().refine(val => val, {
    message: "You must accept the terms to continue."
  }),
  recaptcha: z.string().min(1, { message: "Please complete the reCAPTCHA challenge." }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      email: "",
      password: "",
      className: "",
      age: '' as unknown as number, // Initialize with empty string to prevent uncontrolled input error
      agree: false,
      recaptcha: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      await updateProfile(userCredential.user, {
        displayName: values.fullName,
      });

      // Store additional user info in Realtime Database
      const userRef = ref(db, 'users/' + userCredential.user.uid);
      await set(userRef, {
        uid: userCredential.user.uid,
        fullName: values.fullName,
        fatherName: values.fatherName,
        email: values.email,
        className: values.className,
        age: values.age,
        plan: 'Free' // Default plan
      });

      // Send email verification with continue URL
      const continueUrl = `${window.location.origin}/login?verified=true`;
      await sendEmailVerification(userCredential.user, {
        url: continueUrl,
        handleCodeInApp: false // Let Firebase handle the action page
      });

      toast({
        title: "Account Created! Please Verify Your Email",
        description: "A verification email has been sent with a continue link. Please check your main inbox and also your spam/junk folder.",
        duration: 9000,
      });
      
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      router.push("/login");
    } catch (error: any) {
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email address is already in use. Please use a different email.";
        } else {
            errorMessage = error.message;
        }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      form.setValue('recaptcha', '');
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
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
        title: "Google Sign-Up Failed",
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
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Get started with your AI learning journey.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <Button
               variant="outline"
               className="w-full"
               onClick={handleGoogleSignIn}
               type="button"
               disabled={isSubmitting || isGoogleLoading}
               loading={isGoogleLoading}
               loadingText="Signing up with Google..."
             >
               <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                 <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8 0 130.2 105.4 21.8 244 21.8c67.2 0 123 24.8 166.3 65.9l-67.5 64.9C258.5 122.1 223.5 101.8 182.8 101.8c-70.3 0-126.5 58.2-126.5 130.1s56.2 130.1 126.5 130.1c76.3 0 115.4-53.7 122.5-81.8H285V246.3h199.1c.3 15.2.7 30.2.7 45.5z"></path>
               </svg>
               Sign up with Google
             </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">OR SIGN UP WITH EMAIL</span>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Richard Roe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 10th Grade" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 16" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="recaptcha"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                    <FormControl>
                        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                          <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                              onChange={(value) => field.onChange(value || "")}
                              onExpired={() => field.onChange("")}
                              onError={() => {
                                console.error('reCAPTCHA error');
                                field.onChange("");
                              }}
                          />
                        ) : (
                          <div className="text-red-500 text-sm">
                            reCAPTCHA configuration missing. Please contact support.
                          </div>
                        )}
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
            <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                         I agree to the{" "}
                         <Link href="/terms-of-use" className="text-primary hover:underline" target="_blank">
                            Terms of Use
                        </Link>
                        ,{" "}
                         <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                        </Link>
                        , and{" "}
                         <Link href="/disclaimer" className="text-primary hover:underline" target="_blank">
                            Disclaimer
                        </Link>.
                        </FormLabel>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
             />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Creating Account..."
            >
              Create Account
            </Button>
            <div className="text-center text-sm text-muted-foreground space-x-2">
              <span>Already have an account?</span>
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
                <Link href="/how-to-use" className="font-medium text-primary hover:underline">
                    Need Help?
                </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
