import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, BookOpen, Video, Download, Search } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Help Center",
    description: "Get help and support for Quizzicallabzᴬᴵ. Find answers to common questions and contact our support team.",
};

export default function HelpPage() {
  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Quizzicallabzᴬᴵ",
      icon: BookOpen,
      links: [
        { title: "How to Use Guide", href: "/how-to-use", description: "Complete guide to all features" },
        { title: "Creating Your First Quiz", href: "/how-to-use#quiz-creation", description: "Step-by-step quiz creation tutorial" },
        { title: "Joining Quiz Arena", href: "/how-to-use#quiz-arena", description: "How to participate in live battles" },
      ]
    },
    {
      title: "Account & Billing",
      description: "Manage your account and subscription",
      icon: HelpCircle,
      links: [
        { title: "Account Settings", href: "/profile", description: "Update your profile and preferences" },
        { title: "Pro Subscription", href: "/pricing", description: "Upgrade to Pro features" },
        { title: "Billing & Invoices", href: "/billing", description: "Manage your subscription" },
      ]
    },
    {
      title: "Technical Support",
      description: "Troubleshooting and technical issues",
      icon: Search,
      links: [
        { title: "Common Issues", href: "/help#common-issues", description: "Solutions to frequent problems" },
        { title: "System Requirements", href: "/help#requirements", description: "Browser and device compatibility" },
        { title: "Performance Tips", href: "/help#performance", description: "Optimize your experience" },
      ]
    }
  ];

  const quickActions = [
    { title: "Contact Support", href: "mailto:hello@quizzicallabz.qzz.io", icon: MessageCircle, description: "Get direct help from our team" },
    { title: "WhatsApp Support", href: "https://wa.me/923261536764", icon: MessageCircle, description: "Quick chat support" },
    { title: "Video Tutorials", href: "/tutorials", icon: Video, description: "Visual learning guides" },
  ];

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <PageHeader
        title="Help Center"
        description="Find answers, get support, and learn how to make the most of Quizzicallabzᴬᴵ"
      />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <action.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={action.href} {...(action.href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  Get Help
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Sections */}
      <div className="space-y-8">
        {helpSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-primary" />
                {section.title}
              </CardTitle>
              <p className="text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div>
                      <h4 className="font-medium">{link.title}</h4>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={link.href}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How do I create a quiz from a PDF document?</h4>
              <p className="text-muted-foreground">Upload your PDF document in the Quiz Generator, and our AI will automatically extract key concepts and generate relevant questions. The process takes about 30 seconds.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-muted-foreground">Yes, we use industry-standard encryption and security measures. Your documents and personal information are protected. See our Privacy Policy for details.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I use this for MDCAT/ECAT preparation?</h4>
              <p className="text-muted-foreground">Absolutely! Our platform includes specialized modules for MDCAT, ECAT, and NTS exam preparation with curriculum-specific content.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I join a live quiz battle?</h4>
              <p className="text-muted-foreground">Visit the Quiz Arena section, create a room or join an existing public battle. You can compete with friends in real-time!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
          <p className="text-muted-foreground mb-6">Our support team is here to help you succeed with Quizzicallabzᴬᴵ</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="mailto:hello@quizzicallabz.qzz.io">Email Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://wa.me/923261536764" target="_blank" rel="noopener noreferrer">WhatsApp Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
