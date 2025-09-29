import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quizzicallabzᴬᴵ</h3>
            <p className="text-gray-400 mb-4">
              AI-powered educational platform transforming learning through personalized quizzes and study materials.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 QuizzicallabzTM. All rights reserved.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              <li><Link href="/security" className="hover:text-white">Security Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:support@quizzicallabs.com" className="hover:text-white">Contact Support</a></li>
              <li><a href="mailto:legal@quizzicallabs.com" className="hover:text-white">Legal Inquiries</a></li>
              <li><a href="mailto:security@quizzicallabs.com" className="hover:text-white">Security Issues</a></li>
              <li><Link href="/.well-known/security.txt" className="hover:text-white">Report Vulnerability</Link></li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 className="font-semibold mb-4">Platform Status</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">In Development</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Platform is currently in beta. Features and availability may vary.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p className="text-sm">
            Quizzicallabzᴬᴵ is a product of QuizzicallabzTM. 
            Built with ❤️ for educators and learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}