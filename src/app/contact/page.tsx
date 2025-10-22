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
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get in touch with our support team. We're here to help you succeed with Quizzicallabz AI.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Mail className="h-6 w-6 text-blue-500" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                Send us an email for detailed support and inquiries.
              </p>
              <div className="space-y-2">
                <p className="text-white font-semibold">hello@quizzicallabz.qzz.io</p>
                <p className="text-white/60 text-sm">Response time: 24-48 hours</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="mailto:hello@quizzicallabz.qzz.io">Send Email</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <MessageCircle className="h-6 w-6 text-green-500" />
                WhatsApp Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                Quick chat support for immediate assistance.
              </p>
              <div className="space-y-2">
                <p className="text-white font-semibold">+92 326 1536764</p>
                <p className="text-white/60 text-sm">Available: 9 AM - 6 PM PKT</p>
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
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-white">Support Hours</h3>
              <p className="text-white/70 text-sm">
                Monday - Friday<br />
                9:00 AM - 6:00 PM PKT
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-white">Location</h3>
              <p className="text-white/70 text-sm">
                Pakistan<br />
                Remote Support Available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2 text-white">Response Time</h3>
              <p className="text-white/70 text-sm">
                WhatsApp: Instant<br />
                Email: 24-48 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-white">How do I create a quiz from a PDF?</h4>
              <p className="text-white/70">Upload your PDF in the Quiz Generator, and our AI will create questions automatically in about 30 seconds.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">Is my data secure?</h4>
              <p className="text-white/70">Yes, we use industry-standard encryption. Your documents and data are fully protected.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">Can I use this for exam preparation?</h4>
              <p className="text-white/70">Absolutely! We support MDCAT, ECAT, NTS, and other exam preparations with specialized content.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">How do I join Quiz Arena battles?</h4>
              <p className="text-white/70">Visit the Quiz Arena section, create a room or join public battles to compete with friends in real-time!</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
          <p className="text-white/70 mb-6">Join thousands of students learning smarter with AI-powered quizzes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}