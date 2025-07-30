
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, Phone, Heart, Share2, Copy, Check, HelpCircle, Github } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

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
           handleCopy();
        }
    };

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">Quizzicallabs<sup className='font-serif'>ᴬᴵ</sup></span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">A product by <strong>QuizzicalLabs™</strong></p>
                        <p className="text-sm text-muted-foreground">The ultimate AI-powered study partner designed to revolutionize learning and assessment.</p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-semibold mb-4 text-foreground">App</h3>
                        <nav className="flex flex-col gap-3 text-sm">
                            <Link href="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link>
                            <Link href="/generate-quiz" className="text-muted-foreground hover:text-primary">Custom Quiz</Link>
                            <Link href="/generate-from-document" className="text-muted-foreground hover:text-primary">From Document</Link>
                            <Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link>
                        </nav>
                    </div>

                     <div className="md:col-span-2">
                        <h3 className="font-semibold mb-4 text-foreground">Company</h3>
                        <nav className="flex flex-col gap-3 text-sm">
                            <Link href="/about-us" className="text-muted-foreground hover:text-primary">About Us</Link>
                            <Link href="/how-to-use/contact-support" className="text-muted-foreground hover:text-primary">Contact</Link>
                            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
                            <Link href="/terms-of-use" className="text-muted-foreground hover:text-primary">Terms of Use</Link>
                             <Link href="/disclaimer" className="text-muted-foreground hover:text-primary">Disclaimer</Link>
                        </nav>
                    </div>
                    
                    <div className="md:col-span-4">
                         <h3 className="font-semibold mb-4 text-foreground">Get Involved & Stay Connected</h3>
                         <p className="text-sm text-muted-foreground mb-4">Enjoying the app? Share it with friends or give us feedback!</p>
                         <div className="flex flex-wrap gap-3 items-center">
                            <Button onClick={handleNativeShare} variant="outline"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
                            <Button asChild><a href="https://wa.me/923261536764" target="_blank" rel="noopener noreferrer"><Heart className="mr-2 h-4 w-4"/> Feedback</a></Button>
                         </div>
                    </div>
                </div>

                 <Separator className="my-8" />
                 
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">&copy; {currentYear} QuizzicalLabs™. All Rights Reserved. Created by <strong>Absar Ahmad Rao</strong>.</p>
                    <div className="flex gap-4 items-center">
                        <a href="mailto:Ahmadraoabsar@gmail.com" className="text-muted-foreground hover:text-primary" title="Email">
                            <Mail className="h-5 w-5" /> 
                        </a>
                        <a href="https://wa.me/923261536764" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="WhatsApp">
                            <Phone className="h-5 w-5" />
                        </a>
                        <a href="https://www.tiktok.com/@absarahmadrao?_t=ZN-8yQ5Of16dXy&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="TikTok">
                            <TikTokIcon className="h-5 w-5"/>
                        </a>
                        <a href="https://github.com/absar091" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="GitHub">
                            <Github className="h-5 w-5"/>
                        </a>
                    </div>
                 </div>
            </div>
        </footer>
    )
}
