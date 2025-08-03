
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Terminal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "API Documentation",
    description: "Integrate the power of Quizzicallabs AI into your own applications with our upcoming developer API.",
};

export default function ApiDocsPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <PageHeader
        title="Developer API"
        description="Integrate the power of Quizzicallabs AI into your own applications."
      />
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Terminal className="h-6 w-6 text-primary"/>
                    Coming Soon
                </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
                <p>
                    We are currently developing a robust and easy-to-use API that will allow developers, educational institutions, and other platforms to harness the power of our AI-driven quiz and content generation tools.
                </p>
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                    <h4 className="font-semibold text-foreground mb-2">Potential Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Endpoint for generating custom quizzes with detailed parameters.</li>
                        <li>Endpoint for creating practice questions with AI explanations.</li>
                        <li>Endpoint for generating full study guides from a topic.</li>
                        <li>Secure authentication with API keys.</li>
                        <li>Webhook support for asynchronous job completion.</li>
                    </ul>
                </div>
                <p className="mt-6">
                    Stay tuned for updates. If you are interested in becoming an early beta tester, please contact us with your use case.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
