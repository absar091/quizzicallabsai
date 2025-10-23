import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
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
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
              <li><a href="mailto:hello@quizzicallabz.qzz.io" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a></li>
              <li><a href="https://wa.me/923261536764" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp Chat
              </a></li>
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
              Quizzicallabzᴬᴵ is a product of QuizzicallabzTM. 
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
