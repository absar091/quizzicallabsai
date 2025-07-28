
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Mail, MessageCircle, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function HowToUsePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="How to Use Quizzicallabs AI"
        description="Your guide to mastering our AI-powered learning platform."
      />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-8 text-sm text-muted-foreground leading-relaxed">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              Getting Started: Account & Verification
            </h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-base text-foreground">1. Creating Your Account</h3>
              <p>Signing up is easy! Just provide your name, email, class, and age. This information helps us tailor the learning experience just for you.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-base text-foreground">2. Verifying Your Email (Important!)</h3>
                <p>After signing up, we'll send a verification email to your inbox. You MUST verify your email before you can log in.</p>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Can't find the email?</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li><strong>Check your Spam/Junk folder.</strong> Sometimes verification emails get filtered by mistake. In your email client (like Gmail), look for a "Spam" or "Junk" folder in the sidebar.</li>
                            <li>Wait a few minutes. It can sometimes take a moment to arrive.</li>
                            <li>If you still have trouble after 10-15 minutes, please try signing up again or contact us.</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold text-base text-foreground">3. Login Issues After Verification</h3>
                <p>Sometimes it can take a few minutes for the verification status to sync. If you've verified your email but can't log in immediately, please try these steps:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Wait 2-3 minutes and try logging in again.</li>
                    <li>Refresh the login page.</li>
                    <li>If the problem persists, please reach out for help.</li>
                </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Using the Generation Tools
            </h2>
            <p>Our powerful AI tools are accessible from the sidebar. Here’s what each one does:</p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Custom Quiz:</strong> The ultimate tool for personalization. Specify a topic, difficulty, number of questions, question formats (like Multiple Choice), and styles (like Conceptual or Numerical) to generate a quiz that fits your exact study needs.
              </li>
              <li>
                <strong>Practice Questions:</strong> Need a quick study session? This tool generates a set of questions for any topic, complete with correct answers and detailed explanations to help you understand the concepts.
              </li>
              <li>
                <strong>Quiz from Document:</strong> Have your own study notes, a chapter from a book, or a lecture transcript? Upload a PDF or DOCX file, and our AI will create a quiz based *exclusively* on that document's content.
              </li>
              <li>
                <strong>Study Guide:</strong> Perfect for tackling new topics. Enter a subject, and our AI will generate a comprehensive guide including a summary, key concepts with definitions, simple analogies for complex ideas, and a quick self-quiz.
              </li>
               <li>
                <strong>Generate Paper:</strong> A specialized tool for educators. Create professional, print-ready exam papers with custom headers (school name, teacher, marks), two-column layouts to save paper, and an automatically generated answer key.
              </li>
               <li>
                <strong>MDCAT Prep:</strong> For students preparing for medical entry exams. This section provides high-difficulty, past-paper style tests organized by subject and chapter, designed to simulate the real exam environment.
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
             <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Need Help? Contact Us
            </h2>
             <Alert variant="default" className="bg-background">
                <MessageCircle className="h-4 w-4" />
                <AlertTitle>We're here for you!</AlertTitle>
                <AlertDescription>
                   If you're facing any issues with signing up, logging in, or using the app, please don't hesitate to reach out.
                   <div className="mt-2 font-semibold">
                        <p>WhatsApp Support: <a href="https://wa.me/923297642797" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+92 329 7642797</a></p>
                   </div>
                </AlertDescription>
             </Alert>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
