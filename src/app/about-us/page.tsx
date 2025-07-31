
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import type { Metadata } from 'next';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about the mission of Quizzicallabs AI and its creator, Absar Ahmad Rao.",
};

export default function AboutUsPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="About Quizzicallabs AI"
        description="Our mission is to make personalized education accessible to everyone."
      />
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary"/>
                    About Me
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
                <p>
                    I am Absar Ahmad Rao, a passionate student with a vision to bridge the gap between quality education and accessible digital tools. While pursuing my journey in the medical field, I’ve combined my academic insight with a strong interest in technology to develop practical solutions for students under my parent company, QuizzicalLabs™.
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Logo className="h-6 w-6 text-primary"/>
                    About the App
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
               <p>
                    Quizzicallabs AI is a product of QuizzicalLabs™, born from a simple idea: learning should be limitless, personalized, and engaging. As a student, I experienced firsthand the challenge of finding high-quality, specific study materials on demand. Standard resources are often too broad or don't match the curriculum's pace.
                </p>
                <p>
                    This platform is my answer to that challenge. It leverages the power of cutting-edge artificial intelligence to serve as a tireless study partner, available 24/7. Whether you need to generate a custom quiz on a niche topic, create a comprehensive study guide, prepare for standardized tests like the MDCAT, ECAT, or NTS, or even produce professional-grade exam papers for your class, Quizzicallabs AI is designed to do it in seconds.
                </p>
                <p>
                    Our goal is to empower both students and educators by providing tools that save time, enhance understanding, and make learning more effective. We are continuously working to improve the platform and add new features to support your academic journey.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
