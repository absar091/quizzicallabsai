
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader title="Privacy Policy" description="Last updated: July 29, 2024" />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Quizzicallabs™ ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We may collect personal information that you provide directly to us, such as when you create an account, including your name, email address, and class information. We also collect information automatically as you navigate the site, such as your usage data and quiz performance.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Create and manage your account.</li>
              <li>Provide, operate, and maintain our services.</li>
              <li>Personalize and improve your experience.</li>
              <li>Monitor and analyze usage and trends.</li>
              <li>Communicate with you, including for customer service.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Sharing Your Information</h2>
            <p>We do not share your personal information with third parties except as described in this Privacy Policy, such as to comply with legal obligations or to protect our rights.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage and Security</h2>
            <p>Your data is stored securely. We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
          </div>
            
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p>We use essential cookies to make our site functional. A cookie is a small text file stored on your device. By using our application, you consent to the use of these essential cookies.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Your Choices</h2>
            <p>You may review, change, or terminate your account at any time. You can also manage your bookmarked questions and view your quiz history directly from your dashboard.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
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
