
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "Learn how Quizzicallabs AI uses cookies to improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader title="Cookie Policy" description="Last updated: August 2, 2024" />
      <Card className="bg-muted/30">
        <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            This Cookie Policy explains what cookies are, how we use them on Quizzicallabs AI ("the Service"), and your choices regarding cookies.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li>
                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as user authentication (keeping you logged in), session management, and security. You cannot opt out of these cookies. The cookie banner you see is for consenting to these essential cookies.
                </li>
                 <li>
                    <strong>Performance and Analytics Cookies:</strong> These cookies, provided by services like Vercel Analytics, help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve the user experience.
                </li>
                <li>
                    <strong>Advertising Cookies:</strong> We use Google AdSense to display ads on our site. Google and its partners use cookies to serve ads based on your previous visits to our site or other sites on the internet. This helps make the ads you see more relevant to your interests.
                </li>
            </ul>
          </div>

           <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Your Choices Regarding Cookies</h2>
            <p>You have several options to control or limit how we and our partners use cookies:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.</li>
                <li>You can opt out of some third-party vendors' use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info/choices</a>.</li>
                <li>Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or to delete certain cookies. Please note that if you choose to block essential cookies, you may not be able to access all or parts of our Service.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. More Information</h2>
            <p>For more details on how we handle your data, please read our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions about our use of cookies, you can contact us at <a href="mailto:privacy@quizzicallabs.com" className="text-primary hover:underline">privacy@quizzicallabs.com</a>.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
