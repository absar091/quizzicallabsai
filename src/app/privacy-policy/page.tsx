
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader title="Privacy Policy" description="Last updated: July 30, 2024" />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            QuizzicalLabs™ ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, Quizzicallabs AI. By using our service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Personal Identification Information:</strong> Name, email address, age, and class/grade information that you provide when you register an account.</li>
                <li><strong>Usage Data:</strong> Information on how you use the application, such as features used, quizzes taken, scores, and performance analytics. This is collected automatically.</li>
                <li><strong>Content Data:</strong> Documents you upload for quiz generation. This data is used solely for the purpose of generating the quiz and is not stored long-term.</li>
                <li><strong>Device and Connection Information:</strong> We collect standard information such as your IP address, browser type, and operating system for security and analytics purposes.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Create and manage your account.</li>
              <li>Provide, operate, and maintain our services.</li>
              <li>Personalize and improve your experience, for example, by tailoring AI-generated content to your age and class level.</li>
              <li>Monitor and analyze usage and trends to improve the application.</li>
              <li>Communicate with you for customer service, updates, and other informational purposes.</li>
              <li>Prevent fraud and ensure the security of our services.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Advertising, Cookies, and AdSense</h2>
            <p>We use Google AdSense to serve ads. Our advertising partners, including Google, may use cookies to serve ads based on your prior visits to our website or other websites. This enables personalized advertising.</p>
            <p>You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>. You can also opt out of some third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info/choices</a>.</p>
             <p>We also use essential cookies required for site functionality, such as keeping you logged in. By using our application, you consent to the use of these necessary cookies.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage, Retention, and Security</h2>
            <p>Your data is stored securely on servers managed by Firebase (a Google company). We use administrative, technical, and physical security measures to protect your personal information. Uploaded documents for quiz generation are processed and then discarded; they are not stored on our servers.</p>
            <p>We retain your account information and quiz history as long as your account is active. If you delete your account, your personal data will be permanently removed from our active databases.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Children's Privacy</h2>
            <p>Our service is available to users of all ages, including those under 13. We collect age information at signup to comply with relevant regulations and to tailor content appropriately. We do not knowingly collect more information than is reasonably necessary to provide the service.</p>
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

    