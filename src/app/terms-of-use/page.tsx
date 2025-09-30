
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
            <h2 className="text-xl font-semibold text-foreground">3. User Conduct and Responsibilities</h2>
            <p>You agree not to use the Service:</p>
             <ul className="list-disc list-inside pl-4 space-y-1">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>To generate content that is defamatory, obscene, pornographic, abusive, or that infringes on any third party's rights, including intellectual property rights.</li>
                <li>For any form of academic dishonesty. The AI-generated content is a study aid, not a tool for cheating.</li>
                <li>To attempt to gain unauthorized access, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</li>
                <li>To reverse-engineer, decompile, or otherwise attempt to discover the source code or underlying algorithms of the Service.</li>
                <li>To share, post, or distribute harmful, offensive, discriminatory, or inappropriate content in any form, including during live quiz sessions.</li>
                <li>To harass, bully, or engage in any form of antisocial behavior in multiplayer arenas, live battles, or shared quiz spaces.</li>
                <li>To impersonate other users, celebrities, or entities in shared quiz sessions.</li>
            </ul>
            <p>In multiplayer arenas and quiz battles, you agree to maintain respectful conduct. Host controls and reporting tools are available for participants. Violations may result in temporary suspension or permanent account termination.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. User-Generated Content and Quiz Sharing</h2>
            <p>Our Service includes social features that allow you to create, share, and participate in multiplayer quiz battles ("Shared Content"). When you create or share quizzes, participate in live battles, or interact in multiplayer arenas, you grant us a non-exclusive, royalty-free, worldwide license to use, display, distribute, and adapt that content for the purpose of operating our Service.</p>
            <p>You retain ownership of the underlying intellectual property in your Shared Content, but you agree to indemnify us against any claims arising from infringement related to your content. We reserve the right to review, moderate, or remove any Shared Content that violates these Terms or applicable laws.</p>
            <p>You understand that Shared Content may be viewed by other users and accept responsibility for ensuring your content is appropriate for educational purposes. We are not liable for any misuse of Shared Content by other users.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Multiplayer Arenas and Live Quiz Battles</h2>
            <p>Our live multiplayer features ("Live Features") connect you in real-time with other users. When participating in Live Features:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>You agree to display good sportsmanship and respect for all participants.</li>
              <li>You acknowledge that interactions (including chat, usernames, and scores) may be recorded and monitored.</li>
              <li>You understand that live sessions depend on network connectivity and may be technically terminated at any time.</li>
              <li>You agree not to reveal personal information or engage in inappropriate behavior during sessions.</li>
            </ul>
            <p>Hosts have the authority to manage participants, moderate content, and terminate sessions. We reserve the right to end any Live Features session that violates our Terms or interferes with the experience of other users. We are not liable for technical difficulties, lost progress, or any indirect losses related to Live Features.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p>The Service and its original content (excluding content generated by users), features, and functionality are and will remain the exclusive property of QuizzicalLabs™ and its licensors. Our trademarks may not be used in connection with any product or service without prior written consent. You retain ownership of the documents you upload, but you grant us a temporary, non-exclusive license to use that content solely for the purpose of providing the Service to you.</p>
            <p>For Shared Content, you acknowledge that other users may derive inspiration from your quizzes. We encourage creative sharing but remind you to respect the intellectual property rights of others when creating educational content.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Fees, Billing & Termination</h2>
            <p>Some features of the Service are provided on a paid subscription basis ("Pro"). Subscription fees are billed in advance and are non-refundable except as required by law. You may cancel your subscription at any time. We reserve the right to suspend or terminate accounts for violations of these Terms or for non-payment.</p>
            <p>Accounts may also be temporarily suspended or permanently terminated for violations related to multiplayer conduct, inappropriate Shared Content, or disruptive behavior in Live Features.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability and Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permissible by law, QuizzicalLabs™ disclaims all warranties, express or implied, in connection with the Service and your use thereof. We do not warrant that the Service will be uninterrupted, secure, or error-free.</p>
            <p>We are not liable for content shared in multiplayer arenas, interactions during live battles, or any harm arising from user-to-user interactions. Users participate in social features at their own risk and are responsible for their conduct.</p>
            <p>In no event shall QuizzicalLabs™, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">9. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of material changes by posting the new Terms on this page and updating the "Last updated" date.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at legal@quizzicallabz.qzz.io.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
