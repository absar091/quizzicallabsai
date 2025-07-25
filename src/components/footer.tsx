
import Link from 'next/link';
import { BrainCircuit, Mail, Phone, Heart, Share2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
    const currentYear = new Date().getFullYear();
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
                        <div className="flex gap-2">
                            <Button variant="outline"><Heart className="mr-2 h-4 w-4"/> Support</Button>
                            <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/> Share</Button>
                        </div>
                    </div>
                </div>
                 <div className="mt-12 border-t pt-8 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4" />
                        <p>Disclaimer: This is a beta project. Features may change and errors may occur.</p>
                    </div>
                    <p className="text-sm text-muted-foreground">&copy; {currentYear} Quizzicallabs™. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}
