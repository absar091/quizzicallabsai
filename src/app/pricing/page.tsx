import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <PageHeader title="Pricing" description="Choose the plan that fits your learning goals" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Starter plan for casual learners</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-4xl font-bold">$0 <span className="text-sm text-muted-foreground">/ month</span></p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Unlimited quizzes & guides</li>
              <li>Standard AI model</li>
              <li>Full prep modules (with ads)</li>
            </ul>
            <Button asChild className="w-full"><Link href="/signup">Get Started</Link></Button>
          </CardContent>
        </Card>

        <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For power users and educators</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$2 <span className="text-sm text-muted-foreground">/ month</span></p>
            <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
              <li>Advanced AI (higher accuracy)</li>
              <li>Ad-free experience</li>
              <li>Priority support</li>
              <li>Higher rate limits</li>
            </ul>
            <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"><Link href="/signup">Upgrade</Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>All plans include access to all study tools. Payments are handled securely via Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}
