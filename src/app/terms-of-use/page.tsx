
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl mx-auto">
        <PageHeader title="Terms of Use" description="Last updated: September 10, 2025" />
        <Card className="bg-card border-border">
          <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              Welcome to Quizzicallabzᴬᴵ. These Terms of Use ("Terms") govern your access to and use of our application and services ("Service"), which are a product of QuizzicalLabs™. By accessing or using our Service, you agree to be bound by these Terms.
            </p>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">1. Accounts</h2>
              <p>When you create an account with us, you guarantee that you are above the age of 5 and that the information you provide is accurate, complete, and current. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">2. Use of AI-Generated Content</h2>
              <p>Our Service uses AI to generate content ("AI Content"), including quizzes and study guides. AI Content may contain inaccuracies, omissions, or biases. It is provided for educational use only and should not replace professional academic materials or verified sources.</p>
              <p>You are responsible for verifying any AI Content before using it for academic or professional purposes. Please see our <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for additional guidance regarding AI limitations and risks.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">3. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at legal@quizzicallabz.qzz.io.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
