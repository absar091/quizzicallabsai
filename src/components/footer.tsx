import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Quizzicallabzᴬᴵ</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered educational platform transforming learning through personalized quizzes and study materials.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>© 2025 QuizzicallabzTM</p>
              <p>All rights reserved.</p>
              <p className="mt-2">
                <a href="https://quizzicallabz.qzz.io" className="hover:text-primary transition-colors">quizzicallabz.qzz.io</a>
              </p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/security" className="hover:text-primary transition-colors">Security Policy</Link></li>
              <li><Link href="/.well-known/security.txt" className="hover:text-primary transition-colors">Security.txt</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="mailto:hello@quizzicallabz.qzz.io" className="hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="mailto:legal@quizzicallabz.qzz.io" className="hover:text-primary transition-colors">Legal Inquiries</a></li>
              <li><a href="mailto:security@quizzicallabz.qzz.io" className="hover:text-primary transition-colors">Security Issues</a></li>
              <li><a href="mailto:privacy@quizzicallabz.qzz.io" className="hover:text-primary transition-colors">Privacy Concerns</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/api-docs" className="hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link href="/status" className="hover:text-primary transition-colors">System Status</Link></li>
              <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                <span className="text-sm">Beta Testing</span>
              </div>
              <p className="text-xs text-muted-foreground/80 mt-2">
                Hosted at quizzicallabz.qzz.io
              </p>
              <p className="text-xs text-muted-foreground/80">
                Features may vary during development.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p className="text-sm mb-4 md:mb-0">
              Quizzicallabzᴬᴵ is a product of QuizzicallabzTM. Built with ❤️ for educators and learners worldwide.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="https://quizzicallabz.qzz.io" className="hover:text-primary transition-colors">quizzicallabz.qzz.io</a>
              <span>•</span>
              <span>Version 2.5.0</span>
              <span>•</span>
              <span>Beta</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}