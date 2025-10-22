export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80">How we protect and handle your data</p>
        </div>

        <div className="space-y-8">
        <p className="text-sm text-white/60 mb-8 text-center">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
          <p className="text-white/80 mb-4">Quizzicallabzᴬᴵ ("we," "our," or "us") operates the website quizzicallabz.qzz.io and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered educational platform.</p>
          <p className="text-white/80">We are committed to protecting your privacy and ensuring transparency in our data practices. This policy applies to all users of our services, including students, educators, and visitors to our website.</p>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">2.1 Personal Information</h3>
          <p className="mb-4 text-white/80">When you create an account or use our services, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-white/70">
            <li>Email address and password (for account creation)</li>
            <li>Display name and profile information</li>
            <li>Educational institution (if provided)</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-white">2.2 Educational Data</h3>
          <p className="mb-4 text-white/80">To provide personalized learning experiences, we collect:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-white/70">
            <li>Quiz scores and performance metrics</li>
            <li>Study progress and completion data</li>
            <li>Learning preferences and subject interests</li>
            <li>Document uploads for quiz generation</li>
            <li>Usage patterns and feature interactions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-white">2.3 Technical Data</h3>
          <p className="mb-4 text-white/80">We automatically collect certain technical information:</p>
          <ul className="list-disc pl-6 space-y-2 text-white/70">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Error logs and crash reports</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Service Provision:</strong> To create personalized quizzes, track progress, and deliver AI-powered educational content</li>
            <li><strong>Platform Improvement:</strong> To analyze usage patterns and enhance our services</li>
            <li><strong>Communication:</strong> To send important updates, educational tips, and respond to inquiries</li>
            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
            <li><strong>Legal Compliance:</strong> To meet legal obligations and enforce our terms of service</li>
            <li><strong>Research:</strong> To improve AI algorithms and educational outcomes (using anonymized data)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
          <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in platform operations (under strict confidentiality agreements)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
            <li><strong>Platform Security:</strong> To protect against fraud, abuse, or security threats</li>
            <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p className="mb-4">We retain your information for the following periods:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Account Data:</strong> Retained while your account is active and for 3 years after account deletion</li>
            <li><strong>Educational Data:</strong> Retained for the duration of your account plus 2 years for service improvement</li>
            <li><strong>Technical Logs:</strong> Retained for 90 days for debugging and security purposes</li>
            <li><strong>Communication:</strong> Retained for 3 years for customer service purposes</li>
          </ul>
          <p>You may request data deletion at any time by contacting our privacy team.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="mb-4">We use cookies and similar technologies to enhance your experience:</p>

          <h3 className="text-xl font-semibold mb-3">6.1 Essential Cookies</h3>
          <p className="mb-4">Required for basic platform functionality:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Authentication and session management</li>
            <li>Security and fraud prevention</li>
            <li>Basic user preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.2 Analytics Cookies</h3>
          <p className="mb-4">Help us understand platform usage:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Feature usage tracking</li>
            <li>Performance monitoring</li>
            <li>Error reporting</li>
          </ul>

          <p>You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
          <p className="mb-4">Our platform integrates with the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Firebase (Google):</strong> Authentication, database, and hosting services</li>
            <li><strong>Google AI (Gemini):</strong> AI-powered content generation</li>
            <li><strong>Vercel:</strong> Website hosting and content delivery</li>
            <li><strong>MongoDB:</strong> Additional data storage and processing</li>
          </ul>
          <p>These services have their own privacy policies and may process data according to their terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
          <p className="mb-4">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Data centers located in the United States and European Union</li>
            <li>Standard contractual clauses for international transfers</li>
            <li>Adequacy decisions where applicable</li>
            <li>Technical and organizational security measures</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
          <p className="mb-4">We implement comprehensive security measures to protect your information:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li><strong>Encryption:</strong> All data encrypted in transit and at rest</li>
            <li><strong>Access Controls:</strong> Strict access limitations to authorized personnel only</li>
            <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
            <li><strong>Incident Response:</strong> Established procedures for security incidents</li>
            <li><strong>Employee Training:</strong> Regular privacy and security training for staff</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
          <p className="mb-4">Our services are intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take immediate steps to delete the information.</p>
          <p>Parents and guardians concerned about their children's use of our platform should contact us immediately.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Your Rights and Choices</h2>
          <p className="mb-4">You have the following rights regarding your personal information:</p>

          <h3 className="text-xl font-semibold mb-3">11.1 Access Rights</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Request information about data we hold about you</li>
            <li>Receive a copy of your personal data in a structured format</li>
            <li>Know the purposes of processing and categories of data</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">11.2 Correction Rights</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Correct inaccurate or incomplete personal information</li>
            <li>Update your profile and account information</li>
            <li>Modify your communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">11.3 Deletion Rights</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Request deletion of your personal information</li>
            <li>Close your account and remove associated data</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">11.4 Other Rights</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Object to processing of your personal data</li>
            <li>Restrict processing in certain circumstances</li>
            <li>Data portability to another service</li>
            <li>Lodge complaints with supervisory authorities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. How to Exercise Your Rights</h2>
          <p className="mb-4">To exercise any of these rights, please contact us:</p>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded mb-4">
            <p className="mb-2"><strong>Email:</strong> privacy@quizzicallabz.qzz.io</p>
            <p className="mb-2"><strong>Response Time:</strong> We will respond within 30 days</p>
            <p className="mb-2"><strong>Verification:</strong> We may request additional information to verify your identity</p>
            <p><strong>No Charge:</strong> Exercising these rights is free of charge</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Data Protection Officer</h2>
          <p className="mb-4">We have appointed a Data Protection Officer (DPO) to oversee our privacy practices:</p>
          <div className="bg-card border border-border p-4 rounded">
            <p className="mb-2"><strong>Data Protection Officer:</strong> Absar Ahmad Rao</p>
            <p className="mb-2"><strong>Email:</strong> privacy@quizzicallabz.qzz.io</p>
            <p><strong>Address:</strong> QuizzicallabzTM, Pakistan</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
          <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications for significant changes</li>
            <li>Updating the "Last updated" date at the top of this policy</li>
          </ul>
          <p>Your continued use of our services after changes become effective constitutes acceptance of the updated policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded">
              <h3 className="font-semibold mb-3">General Inquiries</h3>
              <p><strong>Website:</strong> <a href="https://quizzicallabz.qzz.io" className="text-primary hover:underline">quizzicallabz.qzz.io</a></p>
              <p><strong>Email:</strong> hello@quizzicallabz.qzz.io</p>
              <p><strong>WhatsApp:</strong> +923261536764</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 p-4 rounded">
              <h3 className="font-semibold mb-3">Privacy-Specific</h3>
              <p><strong>Privacy Officer:</strong> privacy@quizzicallabz.qzz.io</p>
              <p><strong>Legal Department:</strong> legal@quizzicallabz.qzz.io</p>
              <p><strong>Security Issues:</strong> security@quizzicallabz.qzz.io</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Governing Law</h2>
          <p>This Privacy Policy is governed by the laws of Pakistan and applicable international privacy regulations, including GDPR where applicable. Any disputes will be resolved in accordance with our Terms of Service.</p>
        </section>

          <div className="bg-accent/10 border border-accent/20 p-4 rounded mt-8">
            <p className="font-semibold mb-2">📋 Summary of Key Points:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>We collect minimal data necessary for AI-powered educational services</li>
              <li>Your data is used to personalize learning and improve our platform</li>
              <li>We implement strong security measures to protect your information</li>
              <li>You have comprehensive rights to access, correct, and delete your data</li>
              <li>We are transparent about third-party services and data handling</li>
              <li>Contact our Privacy Officer for any privacy-related concerns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
