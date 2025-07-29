
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Phone, Heart, Share2, Copy, Check, HelpCircle, Github } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M11.623 5.423a4.23 4.23 0 0 1 4.23 4.23v0a4.23 4.23 0 0 1-4.23 4.23H7.393a4.23 4.23 0 0 1-4.23-4.23v0a4.23 4.23 0 0 1 4.23-4.23h4.23Z"/>
        <path d="M15.853 9.653a4.23 4.23 0 0 1-4.23-4.23v0"/>
        <path d="M12.493 18.347a4.23 4.23 0 0 1-4.23-4.23h0"/>
    </svg>
)

export function Footer() {
    const { toast } = useToast();
    const currentYear = new Date().getFullYear();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [appUrl, setAppUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setAppUrl(window.location.origin);
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl);
        setIsCopied(true);
        toast({ title: 'Link Copied!', description: 'You can now share it with your friends.' });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Quizzicallabs AI',
                    text: 'Check out this AI-powered learning platform!',
                    url: appUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            setShowShareDialog(true);
        }
    };

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold">Quizzicallabs AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">A product by <span className="font-bold">Absar Ahmad Rao</span></p>
                        <p className="text-sm font-semibold mb-2">Connect or give feedback:</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                            <a href="mailto:Ahmadraoabsar@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" title="Email">
                               <Mail className="h-5 w-5" /> 
                            </a>
                             <a href="https://wa.me/923297642797" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" title="WhatsApp">
                               <Phone className="h-5 w-5" />
                            </a>
                            <a href="https://www.tiktok.com/@absarahmadrao?_t=ZN-8yQ5Of16dXy&_r=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" title="TikTok">
                               <TikTokIcon className="h-5 w-5"/>
                            </a>
                            <a href="https://github.com/absar091" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" title="GitHub">
                               <Github className="h-5 w-5"/>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Navigation</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
                            <Link href="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link>
                            <Link href="/generate-quiz" className="text-muted-foreground hover:text-primary">New Quiz</Link>
                            <Link href="/about-us" className="text-muted-foreground hover:text-primary">About Us</Link>
                        </nav>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-4">Legal & Support</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/how-to-use" className="text-muted-foreground hover:text-primary flex items-center gap-2"><HelpCircle className="h-4 w-4"/> How to Use</Link>
                            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
                             <Link href="/terms-of-use" className="text-muted-foreground hover:text-primary">Terms of Use</Link>
                              <Link href="/disclaimer" className="text-muted-foreground hover:text-primary">Disclaimer</Link>
                        </nav>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">Get Involved</h3>
                        <div className="flex gap-2">
                            <Button variant="outline"><Heart className="mr-2 h-4 w-4"/> Support</Button>
                            <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                                <AlertDialogTrigger asChild>
                                    <Button onClick={handleNativeShare} variant="outline"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Share with Friends!</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Enjoying Quizzicallabs AI? Help us grow by sharing this app with your friends and classmates.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <Input value={appUrl} readOnly />
                                        <Button size="icon" onClick={handleCopy}>
                                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
                 <div className="mt-12 border-t pt-8 text-center space-y-4">
                     <p className="text-sm text-muted-foreground">&copy; {currentYear} QuizzicalLabs™. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}
