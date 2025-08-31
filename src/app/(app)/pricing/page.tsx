
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, BrainCircuit, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlan } from '@/hooks/usePlan';
import Link from 'next/link';

const freeFeatures = [
    { text: "Unlimited quiz & guide generation" },
    { text: "Standard AI Model (Gemini 1.5 Flash)" },
    { text: "Full access to all prep modules" },
    { text: "Contains ads" },
];

const proFeatures = [
    { text: "All features from the Free plan" },
    { text: "Advanced AI Model (Gemini 1.5 Pro)" },
    { text: "Higher quality, more accurate answers" },
    { text: "Better reasoning for complex topics" },
    { text: "Ad-free experience" },
    { text: "Priority support" },
];

export default function PricingPage() {
    const { user } = useAuth();
    const { plan } = usePlan();

    return (
        <div>
            <PageHeader
                title="Choose Your Plan"
                description="Unlock the full potential of Quizzicallabs AI with our Pro plan."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Bot className="h-7 w-7"/>
                            Free
                        </CardTitle>
                        <CardDescription>Perfect for getting started and everyday study needs.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-3">
                            {freeFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary"/>
                                    <span className="text-muted-foreground">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" disabled={true}>
                            Your Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                 <Card className="flex flex-col border-primary shadow-lg ring-2 ring-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Sparkles className="h-7 w-7 text-accent"/>
                            Pro
                        </CardTitle>
                        <CardDescription>For students and educators who demand the best quality and performance.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-3xl font-bold">$2<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-3">
                            {proFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary"/>
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         {plan === 'Pro' ? (
                             <Button className="w-full" disabled>Your Current Plan</Button>
                         ) : (
                             <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                <Link href="/profile">Upgrade to Pro</Link>
                            </Button>
                         )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
