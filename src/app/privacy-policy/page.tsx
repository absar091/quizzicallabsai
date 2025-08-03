
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader title="Privacy Policy" description="Last updated: August 2, 2024" />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            QuizzicalLabs™ ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, Quizzicallabs AI. By using our service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Personal Identification Information:</strong> Name, email address, age, and class/grade information that you provide when you register an account. This information is used to personalize your experience and is never shared with third parties.</li>
                <li><strong>Usage Data:</strong> Information on how you use the application, such as features used, quizzes taken, scores, performance analytics, and bookmarked questions. This is collected automatically to power your dashboard and help you track your progress.</li>
                <li><strong>Content Data:</strong> Documents you upload for quiz generation. This data is transmitted to our AI provider for the sole purpose of generating the quiz and is not stored or logged on our servers after processing.</li>
                <li><strong>Device and Connection Information:</strong> We collect standard information such as your IP address, browser type, and operating system for security, debugging, and analytics purposes.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Create and manage your account.</li>
              <li>Provide, operate, and maintain our services.</li>
              <li>Personalize and improve your experience, for example, by tailoring AI-generated content to your age and class level and providing performance insights on your dashboard.</li>
              <li>Monitor and analyze usage and trends to improve the application.</li>
              <li>Communicate with you for customer service, updates, and other informational purposes.</li>
              <li>Prevent fraud and ensure the security of our services.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Advertising, Cookies, and AdSense</h2>
            <p>We use Google AdSense to serve ads. Our advertising partners, including Google, may use cookies to serve ads based on your prior visits to our website or other websites. This enables personalized advertising. For more detailed information on our use of cookies, please see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.</p>
             <p>You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage, Retention, and Security</h2>
            <p>Your data is stored securely on servers managed by Firebase (a Google company). We use administrative, technical, and physical security measures to protect your personal information. Uploaded documents for quiz generation are processed and then discarded; they are not stored on our servers.</p>
            <p>We retain your account information and quiz history as long as your account is active. If you delete your account, your personal data will be permanently removed from our active databases.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Children's Privacy</h2>
            <p>Our service is available to users of all ages, including those under 13. We collect age information at signup to comply with relevant regulations and to tailor content appropriately. We do not knowingly collect more information than is reasonably necessary to provide the service. Parents or guardians can review or request deletion of their child's personal information by contacting us.</p>
          </div>
            
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Your Data Rights</h2>
            <p>You have the right to access, update, or delete your information at any time through your Profile page. This includes the permanent deletion of your account and all associated data.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@quizzicallabs.com.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
