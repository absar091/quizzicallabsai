
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  className: z.string().min(1, { message: "Class is required." }),
  age: z.coerce.number().min(5, "You must be at least 5 years old.").max(100, "Please enter a valid age."),
  agree: z.boolean().refine(val => val, {
    message: "You must accept the privacy policy to continue."
  })
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      className: "",
      age: '' as unknown as number, // Initialize with empty string to prevent uncontrolled input error
      agree: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      const displayName = `${values.fullName}__CLASS__${values.className}__AGE__${values.age}`;
      
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      await sendEmailVerification(userCredential.user);

      toast({
        title: "Account Created! Please Verify Your Email",
        description: "A verification email has been sent to your inbox. Please also check your spam folder.",
      });
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
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Get started with your AI learning journey.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                         <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                        </Link>
                        .
                        </FormLabel>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
             />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
