export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Terms of Service</h1>

        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using Quizzicallabzᴬᴵ ("we," "our," or "us") at quizzicallabz.qzz.io, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and QuizzicalLabs™.</p>
          <p>If you do not agree to abide by the above, please do not use this service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p className="mb-4">Quizzicallabzᴬᴵ is an AI-powered educational platform that provides:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Personalized quiz generation from documents and topics</li>
            <li>Live multiplayer quiz battles and competitions</li>
            <li>AI-generated study guides and educational content</li>
            <li>Progress tracking and performance analytics</li>
            <li>Social learning features and content sharing</li>
            <li>Exam preparation tools for MDCAT, ECAT, and NTS</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
          <p className="mb-4">To access certain features of our service, you must register for an account. You agree to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your account information to keep it accurate and current</li>
            <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access or security breaches</li>
            <li>Be responsible for all activities that occur under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Uses and Content</h2>
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-500 mb-4">
            <p className="font-bold text-red-700 mb-3">🚫 IMMEDIATE ACCOUNT TERMINATION for:</p>
            <ul className="list-disc pl-6 text-red-600 space-y-1">
              <li>Creating or distributing harmful, illegal, or inappropriate content</li>
              <li>Content involving minors in inappropriate contexts</li>
              <li>Promoting violence, hate speech, or discrimination</li>
              <li>Attempting to bypass security measures or hack the platform</li>
              <li>Impersonating other users or entities</li>
              <li>Sharing content that infringes on intellectual property rights</li>
              <li>Using the platform for academic dishonesty or cheating</li>
              <li>Engaging in harassment, bullying, or abusive behavior</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Account Suspension and Termination</h2>
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400 mb-4">
            <p className="font-bold mb-3">⚠️ Violation Consequences:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>First Offense:</strong> Written warning and content removal</li>
              <li><strong>Second Offense:</strong> Temporary suspension (7-30 days)</li>
              <li><strong>Severe Violations:</strong> Immediate permanent account termination</li>
              <li><strong>Email Blocking:</strong> Associated email addresses may be blocked</li>
            </ul>
          </div>
          <p className="mb-4"><strong>Appeal Process:</strong> Terminated users may appeal by contacting legal@quizzicallabz.qzz.io within 30 days of termination.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
          <p className="mb-4">The service and its original content, features, and functionality are owned by QuizzicalLabs™ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>You retain ownership of content you upload to the platform</li>
            <li>You grant us a limited license to use uploaded content for service provision</li>
            <li>AI-generated content is provided for educational use only</li>
            <li>Our trademarks and branding may not be used without permission</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data Protection</h2>
          <p className="mb-4">Your privacy is important to us. Our collection and use of personal information is governed by our comprehensive Privacy Policy, which includes:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Data collection practices and purposes</li>
            <li>Information sharing and disclosure policies</li>
            <li>Data retention and deletion procedures</li>
            <li>User rights regarding personal data</li>
            <li>Cookie usage and tracking technologies</li>
            <li>International data transfer compliance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Subscription Services and Billing</h2>
          <p className="mb-4">Some features require a paid subscription ("Pro"). By subscribing:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>You agree to pay all applicable fees and charges</li>
            <li>Subscriptions automatically renew unless cancelled</li>
            <li>Fees are non-refundable except as required by law</li>
            <li>We reserve the right to change pricing with advance notice</li>
            <li>Failed payments may result in service suspension</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitation of Liability</h2>
          <p className="mb-4">The service is provided "as is" and "as available." We disclaim all warranties and shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Service interruptions or downtime</li>
            <li>Loss of data or content</li>
            <li>AI-generated content inaccuracies</li>
            <li>Third-party service failures</li>
            <li>Indirect, incidental, or consequential damages</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p>You agree to indemnify and hold harmless QuizzicalLabs™ and its affiliates from any claims, damages, losses, costs, and expenses arising from:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Your use of the service</li>
            <li>Your violation of these terms</li>
            <li>Content you upload or share</li>
            <li>Your interactions with other users</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law and Jurisdiction</h2>
          <p className="mb-4">These Terms shall be governed by the laws of Pakistan, without regard to conflict of law principles. Any disputes arising from these terms or your use of the service shall be resolved through:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Good faith negotiations between parties</li>
            <li>Mediation through a neutral third party</li>
            <li>Binding arbitration if mediation fails</li>
            <li>Pakistan courts as final jurisdiction</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. International Compliance</h2>
          <p className="mb-4">Users accessing the service from outside Pakistan must comply with:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Local laws and regulations regarding online services</li>
            <li>Export control and sanctions compliance</li>
            <li>International data protection laws (GDPR, CCPA, etc.)</li>
            <li>Age restrictions and parental consent requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
          <p className="mb-4">We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.</p>
          <p>We will notify users of material changes through email or platform notifications.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-3">General Inquiries</h3>
              <p><strong>Website:</strong> <a href="https://quizzicallabz.qzz.io" className="text-blue-600 hover:underline">quizzicallabz.qzz.io</a></p>
              <p><strong>Email:</strong> hello@quizzicallabz.qzz.io</p>
              <p><strong>WhatsApp:</strong> +923261536764</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-3">Legal & Compliance</h3>
              <p><strong>Legal Department:</strong> legal@quizzicallabz.qzz.io</p>
              <p><strong>Privacy Officer:</strong> privacy@quizzicallabz.qzz.io</p>
              <p><strong>Security Issues:</strong> security@quizzicallabz.qzz.io</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-50 p-4 rounded mt-8">
          <p className="font-semibold mb-2">📋 Summary of Key Terms:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Use the service responsibly and for educational purposes only</li>
            <li>Respect intellectual property and user content rights</li>
            <li>Maintain appropriate conduct in all interactions</li>
            <li>Understand AI limitations and verify content before use</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Contact us for any questions or concerns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
