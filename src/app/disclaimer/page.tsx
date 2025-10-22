export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Disclaimer</h1>
          <p className="text-xl text-white/80">Important information about our platform</p>
        </div>

        <div className="space-y-8">
        <p className="text-sm text-white/60 mb-8 text-center">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">1. Educational Purpose Only</h2>
          <p className="mb-4 text-white/80">Quizzicallabzᴬᴵ ("we," "our," or "us") operates as an educational technology platform designed to supplement traditional learning methods. Our services are intended for educational and informational purposes only.</p>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl border-l-4 border-l-blue-500 mb-4">
            <p className="font-semibold mb-2 text-white">Important:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Our platform is a study aid, not a replacement for professional education</li>
              <li>AI-generated content should be used as a supplement to verified academic materials</li>
              <li>Users are responsible for verifying information accuracy before academic use</li>
              <li>We recommend consulting qualified educators for critical learning decisions</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">2. Beta Platform Status</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl border-l-4 border-l-blue-500 mb-4">
            <p className="font-semibold mb-3 text-white">🚧 Beta Development Notice</p>
            <p className="mb-3 text-white/80">Quizzicallabzᴬᴵ is currently in active development and beta testing phase. Users should be aware of the following:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Features may change, be added, or removed without prior notice</li>
              <li>Platform stability and uptime are not guaranteed during beta</li>
              <li>Some features may be experimental and subject to modification</li>
              <li>Performance may vary as we optimize our systems</li>
              <li>Data migration or loss may occur during updates</li>
            </ul>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. AI-Generated Content Limitations</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl border-l-4 border-l-blue-500 mb-4">
            <p className="font-semibold mb-3 text-white">🤖 AI Content Disclaimer</p>
            <p className="mb-3 text-white/80">All AI-generated content on our platform has inherent limitations:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li><strong className="text-white">Potential Inaccuracies:</strong> AI may generate incorrect or outdated information</li>
              <li><strong className="text-white">Contextual Limitations:</strong> AI may not fully understand nuanced academic contexts</li>
              <li><strong className="text-white">Bias and Fairness:</strong> AI models may reflect training data biases</li>
              <li><strong className="text-white">Creative Interpretations:</strong> AI may interpret prompts differently than intended</li>
              <li><strong className="text-white">Knowledge Cutoffs:</strong> AI knowledge may not include very recent developments</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. No Academic Guarantees</h2>
          <p className="mb-4">We make no guarantees regarding academic performance, test scores, or learning outcomes. Educational success depends on various factors including:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Individual effort and dedication to studies</li>
            <li>Quality of study materials and resources used</li>
            <li>Prior knowledge and learning abilities</li>
            <li>External factors such as study environment and support systems</li>
            <li>Consistency and regularity of platform usage</li>
          </ul>
          <p>Our platform is designed to enhance learning efficiency, but results vary significantly between users.</p>
        </section>

        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">5. Academic Integrity and Ethics</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl border-l-4 border-l-blue-500 mb-4">
            <p className="font-semibold mb-3 text-white">⚠️ Academic Dishonesty Warning</p>
            <p className="mb-3 text-white/80">Users must maintain academic integrity when using our platform:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>AI-generated content should be used as a study aid, not for cheating</li>
              <li>Do not submit AI-generated work as your own original work</li>
              <li>Always cite and reference sources appropriately</li>
              <li>Follow your institution's academic integrity policies</li>
              <li>Use platform features responsibly and ethically</li>
            </ul>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Service Availability and Reliability</h2>
          <p className="mb-4">We strive to provide reliable service but cannot guarantee:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Continuous, uninterrupted platform access</li>
            <li>Complete data preservation during technical issues</li>
            <li>Immediate response times for all features</li>
            <li>Compatibility with all devices and browsers</li>
            <li>Third-party service integrations will always function</li>
          </ul>
          <p>Users should maintain backups of important study materials and not rely solely on our platform for critical academic work.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Content and Links</h2>
          <p className="mb-4">Our platform may contain links to third-party websites or integrate with external services. We are not responsible for:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Content, accuracy, or availability of third-party websites</li>
            <li>Privacy practices of external services or platforms</li>
            <li>Terms of service or policies of linked websites</li>
            <li>Damages or losses resulting from third-party interactions</li>
            <li>Changes in third-party service availability or functionality</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
            <p className="font-semibold mb-3 text-white">Legal Limitation Notice</p>
            <p className="mb-3 text-white/80">To the maximum extent permitted by applicable law:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>We shall not be liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed the amount paid for our services</li>
              <li>We are not responsible for damages resulting from platform unavailability</li>
              <li>Educational outcomes and academic performance are not guaranteed</li>
              <li>Users assume all risks associated with AI-generated content usage</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. User-Generated Content</h2>
          <p className="mb-4">Users are solely responsible for content they upload, share, or generate using our platform:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Accuracy and appropriateness of uploaded documents</li>
            <li>Copyright compliance for shared materials</li>
            <li>Respectful and appropriate conduct in social features</li>
            <li>Consequences of sharing quiz results or study materials</li>
            <li>Permissions and rights for any shared educational content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Age and Usage Restrictions</h2>
          <p className="mb-4">Our platform has specific usage guidelines:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Intended for users aged 13 and above</li>
            <li>Parental supervision recommended for younger users</li>
            <li>Educational institutions should establish appropriate usage policies</li>
            <li>Professional users should ensure compliance with workplace guidelines</li>
            <li>International users should comply with local laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Intellectual Property Rights</h2>
          <p className="mb-4">Users retain ownership of their original content but grant us limited rights:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Platform-generated content may be used for service improvement</li>
            <li>We may feature exceptional user content (with permission)</li>
            <li>Users must respect copyright laws for uploaded materials</li>
            <li>AI-generated content should not be claimed as original work</li>
            <li>Trademark and branding usage must follow our guidelines</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Privacy and Data Handling</h2>
          <p className="mb-4">While we implement robust security measures, users should understand:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Educational data may be processed by AI systems</li>
            <li>Usage patterns help improve platform functionality</li>
            <li>Data may be stored across multiple secure locations</li>
            <li>Users should review our comprehensive Privacy Policy</li>
            <li>Data handling follows applicable privacy laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Export Control and Sanctions</h2>
          <p className="mb-4">Users must comply with applicable export control laws:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Platform access may be restricted in certain jurisdictions</li>
            <li>Users are responsible for compliance with local laws</li>
            <li>Educational content should not violate export restrictions</li>
            <li>International users should verify service availability</li>
            <li>Sanctions compliance is the responsibility of each user</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Changes and Updates</h2>
          <p className="mb-4">As our platform evolves, users should expect:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Regular updates and feature enhancements</li>
            <li>Changes to terms and policies with proper notice</li>
            <li>Evolution of AI capabilities and content generation</li>
            <li>Platform improvements based on user feedback</li>
            <li>Occasional downtime for maintenance and updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. User Responsibilities</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl border-l-4 border-l-blue-500 mb-4">
            <p className="font-semibold mb-3 text-white">✅ Best Practices for Users</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Verify AI-generated content before academic use</li>
              <li>Maintain regular backups of important study materials</li>
              <li>Use strong, unique passwords for account security</li>
              <li>Report technical issues or inappropriate content promptly</li>
              <li>Respect community guidelines in social features</li>
              <li>Keep software and browsers updated for optimal performance</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Contact and Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h3 className="font-semibold mb-3 text-white">General Support</h3>
              <p className="text-white/80"><strong className="text-white">Website:</strong> <a href="https://quizzicallabz.qzz.io" className="text-blue-400 hover:underline">quizzicallabz.qzz.io</a></p>
              <p className="text-white/80"><strong className="text-white">Email:</strong> hello@quizzicallabz.qzz.io</p>
              <p className="text-white/80"><strong className="text-white">WhatsApp:</strong> +923261536764</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h3 className="font-semibold mb-3 text-white">Legal & Compliance</h3>
              <p className="text-white/80"><strong className="text-white">Legal Inquiries:</strong> legal@quizzicallabz.qzz.io</p>
              <p className="text-white/80"><strong className="text-white">Privacy Concerns:</strong> privacy@quizzicallabz.qzz.io</p>
              <p className="text-white/80"><strong className="text-white">Security Issues:</strong> security@quizzicallabz.qzz.io</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">17. Governing Law</h2>
          <p>This Disclaimer is governed by the laws of Pakistan and applicable international regulations. Any disputes will be resolved in accordance with our Terms of Service and local jurisdiction requirements.</p>
        </section>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mt-8">
          <p className="font-semibold mb-2 text-white">📚 Educational Philosophy</p>
          <p className="mb-3 text-white/80">At Quizzicallabzᴬᴵ, we believe technology should enhance, not replace, human learning. Our AI tools are designed to:</p>
          <ul className="list-disc pl-6 space-y-2 text-white/70">
            <li>🤝 Supplement traditional teaching methods</li>
            <li>⚡ Accelerate learning through personalization</li>
            <li>🎯 Make education more accessible and engaging</li>
            <li>📈 Help students achieve better academic outcomes</li>
            <li>🌍 Democratize quality educational resources</li>
          </ul>
        </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mt-6">
            <p className="font-semibold mb-2 text-white">📞 Need Help Understanding This Disclaimer?</p>
            <p className="text-white/80">If you have questions about this disclaimer or need clarification on any points, please don't hesitate to contact our support team. We're here to help you use our platform effectively and responsibly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}