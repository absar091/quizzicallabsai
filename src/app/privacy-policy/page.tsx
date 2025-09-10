
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
                <li><strong>Content Data:</strong> Documents you upload for quiz generation. These files are temporarily transmitted to our AI provider for processing and are not retained on our servers beyond the processing period unless you explicitly choose to save them.</li>
                <li><strong>Social Gaming Data:</strong> When you participate in multiplayer arenas or live quiz battles, we collect information about your interactions, including usernames used, scores, participation in sessions, and host/moderator actions. This data helps us maintain fair play and improve the multiplayer experience.</li>
                <li><strong>Shared Content Data:</strong> Information about quizzes you create and share, including quiz titles, descriptions, question content, sharing history, and visibility settings. This includes metadata like creation timestamps, user IDs, and engagement metrics.</li>
                <li><strong>Live Interaction Records:</strong> During live multiplayer sessions, we may temporarily record or log participant interactions, chat messages (if implemented), and session performance data to ensure a safe and enjoyable experience for all users.</li>
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
              <li>Manage and moderate multiplayer arenas, live quiz battles, and shared content to maintain a safe and enjoyable environment for all users.</li>
              <li>Track engagement and performance in social gaming features to provide you with personalized leaderboards, achievements, and progress statistics.</li>
              <li>Maintain records of shared content ownership, usage permissions, and sharing history for content management purposes.</li>
            </ul>
            <p>Social gaming data and live interaction records are used exclusively to enable and enhance the multiplayer experience. This data helps us detect and prevent inappropriate behavior, maintain fair play, and provide you with accurate performance metrics and achievements.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Advertising, Cookies, and Third-Party Services</h2>
            <p>We may use third-party services (for example, Google AdSense) to serve advertisements and analytics. These partners may set cookies or use similar technologies to collect information about your use of the Service across websites. This enables personalized advertising and analytics. For more information about cookies and how to opt out of personalized ads, please see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.</p>
             <p>You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage, Retention, and Security</h2>
            <p>Your data is stored securely on servers managed by Firebase (a Google company). We use administrative, technical, and physical security measures to protect your personal information. Uploaded documents for quiz generation are processed and then discarded; they are not stored on our servers.</p>
            <p>We retain your account information and quiz history as long as your account is active. Shared quizzes and social gaming data are retained for operational purposes and may be removed if flagged for moderation issues. Live interaction records are typically retained temporarily (hours to days) for monitoring purposes and then anonymized or deleted.</p>
            <p>If you delete your account, your personal data will be permanently removed from our active databases. However, anonymized data about quiz performance and engagement may be retained for analytics purposes. Content you have shared with other users may remain accessible to those users even after account deletion.</p>
            <p>Shared content metadata (creation timestamps, user IDs) is retained to maintain ownership records and prevent content disputes. This information helps us manage intellectual property rights and content moderation effectively.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Data Sharing and User Interactions</h2>
            <p>When you participate in social features:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Live Battles:</strong> Your username and real-time scoring are visible to other participants. Leaderboard rankings and achievements may be shared within the gaming community.</li>
              <li><strong>Shared Quizzes:</strong> Content you create and share becomes accessible to other users based on your privacy settings. Other users can take, favorite, and replay your quizzes.</li>
              <li><strong>Public Interactions:</strong> Performance data, ratings, and reviews of shared content are visible to all users to build a community-driven reputation system.</li>
            </ul>
            <p>We never sell or rent personal information to third parties. However, certain social gaming metrics and aggregated performance data may be used to create public leaderboards and community statistics.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Children's Privacy</h2>
            <p>Our service may be used by learners of all ages. We collect age information at signup to comply with applicable regulations and to tailor content appropriately. Social gaming features may be restricted for users under certain ages to comply with applicable children's privacy laws. If you are a parent or guardian and wish to review or request deletion of a minor's personal information, please contact us at privacy@quizzicallabz.qzz.io.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Your Data Rights</h2>
            <p>You have the right to access, update, or delete your information at any time through your Profile page. This includes the permanent deletion of your account and all associated data. For shared content, you may request removal of your quizzes at any time, though they may remain temporarily visible while we process the deletion.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@quizzicallabz.qzz.io.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
