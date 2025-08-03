
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Careers",
    description: "Join the Quizzicallabs AI team and help us revolutionize education technology.",
};

export default function CareersPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="Join Our Mission"
        description="We're building the future of personalized education, one feature at a time."
      />
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary"/>
                    Our Vision
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
                <p>
                   At QuizzicalLabs™, our vision is to make high-quality, personalized learning accessible to every student and educator, regardless of their location or resources. We believe that technology, powered by artificial intelligence, can unlock human potential by creating tools that are not just smart, but also intuitive, engaging, and genuinely helpful. We're passionate about building a platform that saves time, reduces stress, and fosters a true love for learning.
                </p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-primary"/>
                    Current Opportunities
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
                <p>
                    While we do not have any open positions at the moment, we are always on the lookout for talented and passionate individuals who share our vision. If you are an expert in AI/ML, front-end development (Next.js/React), or educational content design, we would love to hear from you.
                </p>
                <div className="mt-6">
                    <Button asChild>
                         <a href="mailto:Ahmadraoabsar@gmail.com?subject=Career%20Inquiry%20at%20Quizzicallabs">
                            <Mail className="mr-2 h-4 w-4"/>
                            Contact Us
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
