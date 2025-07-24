
import Link from 'next/link';
import { BrainCircuit, Heart, Share2 } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <BrainCircuit className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">Quizzicallabs™</span>
                    </div>
                    <p className="text-sm text-gray-400">A Project By Absar Ahmad Rao</p>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Navigation</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link href="/dashboard" className="hover:text-primary">Home</Link></li>
                        <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Legal & Support</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Get Involved</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2"><Heart className="h-4 w-4"/> <Link href="#" className="hover:text-primary">Support</Link></li>
                        <li className="flex items-center gap-2"><Share2 className="h-4 w-4"/> <Link href="#" className="hover:text-primary">Share</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

    