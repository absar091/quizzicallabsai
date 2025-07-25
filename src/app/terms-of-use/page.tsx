
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfUsePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader title="Terms of Use" description="Last updated: July 29, 2024" />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Welcome to Quizzicallabs™. These Terms of Use ("Terms") govern your use of our application and services. By accessing or using our service, you agree to be bound by these Terms.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of Quizzicallabs™ and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Quizzicallabs™.</p>
          </div>
          
           <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. User Content</h2>
            <p>Our service allows you to generate content, including quizzes and study guides. You are responsible for the content that you generate, including its legality, reliability, and appropriateness. The AI-generated content is for educational and informational purposes only and we do not guarantee its accuracy.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Prohibited Uses</h2>
            <p>You agree not to use the service in any way that is unlawful, or for any purpose that is prohibited by these Terms. You may not use the service to generate content that is defamatory, obscene, pornographic, abusive, or that otherwise violates any law or right of any third party.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Disclaimer</h2>
            <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. Quizzicallabs™ makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein. The AI-generated content may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at legal@quizzicallabs.com.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
