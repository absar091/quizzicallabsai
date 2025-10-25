import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, MapPin, Clock, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Quizzicallabz AI support team. Email, WhatsApp, and direct contact options available.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our support team. We're here to help you succeed with Quizzicallabz AI.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-card-foreground">
                <Mail className="h-6 w-6 text-blue-500" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Send us an email for detailed support and inquiries.
              </p>
              <div className="space-y-2">
                <p className="text-card-foreground font-semibold">hello@quizzicallabz.qzz.io</p>
                <p className="text-muted-foreground text-sm">Response time: 24-48 hours</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="mailto:hello@quizzicallabz.qzz.io">Send Email</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-card-foreground">
                <MessageCircle className="h-6 w-6 text-green-500" />
                WhatsApp Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Quick chat support for immediate assistance.
              </p>
              <div className="space-y-2">
                <p className="text-card-foreground font-semibold">+92 326 1536764</p>
                <p className="text-muted-foreground text-sm">Available: 9 AM - 6 PM PKT</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="https://wa.me/923261536764" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-card-foreground">Support Hours</h3>
              <p className="text-muted-foreground text-sm">
                Monday - Friday<br />
                9:00 AM - 6:00 PM PKT
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-card-foreground">Location</h3>
              <p className="text-muted-foreground text-sm">
                Vehari, Punjab<br />
                Pakistan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-card-foreground">Response Time</h3>
              <p className="text-muted-foreground text-sm">
                WhatsApp: Instant<br />
                Email: 24-48 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-card border-border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">How do I create a quiz from a PDF?</h4>
              <p className="text-muted-foreground">Upload your PDF in the Quiz Generator, and our AI will create questions automatically in about 30 seconds.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Is my data secure?</h4>
              <p className="text-muted-foreground">Yes, we use industry-standard encryption. Your documents and data are fully protected.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Can I use this for exam preparation?</h4>
              <p className="text-muted-foreground">Absolutely! We support MDCAT, ECAT, NTS, and other exam preparations with specialized content.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">How do I join Quiz Arena battles?</h4>
              <p className="text-muted-foreground">Visit the Quiz Arena section, create a room or join public battles to compete with friends in real-time!</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">Join thousands of students learning smarter with AI-powered quizzes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}