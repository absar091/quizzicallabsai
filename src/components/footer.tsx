import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container flex-col-reverse items-center justify-between gap-4 py-8 sm:flex-row sm:py-4">
                <p className="text-sm text-muted-foreground">
                    A Project By <span className='font-bold'>Absar Ahmad Rao</span>
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">Quizzicallabs™</span>
                </div>
            </div>
        </footer>
    )
}
