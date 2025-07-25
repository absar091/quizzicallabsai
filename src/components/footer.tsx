
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Phone, Heart, Share2, AlertTriangle, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

export function Footer() {
    const { toast } = useToast();
    const currentYear = new Date().getFullYear();
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [appUrl, setAppUrl] = useState('');

    useEffect(() => {
        setAppUrl(window.location.origin);

        const popUpCount = parseInt(sessionStorage.getItem('sharePopUpCount') || '0');
        if (popUpCount < 2) {
            const timer = setTimeout(() => {
                setShowShareDialog(true);
                sessionStorage.setItem('sharePopUpCount', String(popUpCount + 1));
            }, 15000); // 15 seconds
            return () => clearTimeout(timer);
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
                    title: 'Quizzicallabs™ AI',
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
        <footer className="border-t bg-background text-foreground">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold">Quizzicallabs™</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">A Project By Absar Ahmad Rao</p>
                        <p className="text-sm font-semibold mb-2">Contribute or give feedback:</p>
                        <a href="mailto:Ahmadraoabsar@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                           <Mail className="h-4 w-4" /> Ahmadraoabsar@gmail.com
                        </a>
                         <a href="tel:+923297642797" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-2">
                           <Phone className="h-4 w-4" /> +92 329 7642797
                        </a>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Navigation</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
                            <Link href="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link>
                            <Link href="/generate-quiz" className="text-muted-foreground hover:text-primary">New Quiz</Link>
                        </nav>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-4">Legal & Support</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
                             <Link href="/terms-of-use" className="text-muted-foreground hover:text-primary">Terms of Use</Link>
                            <Link href="/#" className="text-muted-foreground hover:text-primary">MIT License</Link>
                             <Link href="/#" className="text-muted-foreground hover:text-primary">Support Us</Link>
                        </nav>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">Get Involved</h3>
                        <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                            <div className="flex gap-2">
                                <Button variant="outline"><Heart className="mr-2 h-4 w-4"/> Support</Button>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
                                </AlertDialogTrigger>
                            </div>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Share with Friends!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Enjoying Quizzicallabs? Help us grow by sharing this app with your friends and classmates.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex items-center space-x-2">
                                    <Input value={appUrl} readOnly />
                                    <Button size="icon" onClick={handleCopy}>
                                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 {navigator.share && (
                                    <AlertDialogAction onClick={handleNativeShare}>Share Natively</AlertDialogAction>
                                )}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                 <div className="mt-12 border-t pt-8 text-center space-y-4">
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                             <p>This is a beta project. Features may change and errors may occur.</p>
                        </div>
                         <p className="text-xs text-muted-foreground max-w-2xl">This application is an AI-powered study tool intended to assist with your learning. While we strive to provide accurate and helpful content, we do not guarantee success in any exam. We strongly recommend consulting with your teachers and educational professionals as part of your study plan.</p>
                    </div>
                    <p className="text-sm text-muted-foreground">&copy; {currentYear} Quizzicallabs™. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}
