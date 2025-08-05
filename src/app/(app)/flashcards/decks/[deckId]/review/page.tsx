"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle, BrainCircuit, Sparkles } from 'lucide-react';

import { getDueFlashcards, updateFlashcardSrs } from '@/app/(app)/flashcards/actions';
import { Flashcard } from '@/ai/flows/generate-flashcards';
import { calculateSrsParameters, getNextDueDate, SrsQuality } from '@/lib/srs';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';

export default function ReviewPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const deckId = params.deckId as string;
    const userId = "mock-user-id"; // Replace with actual user ID

    const [cards, setCards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [reviewedCount, setReviewedCount] = useState(0);

    useEffect(() => {
        async function loadDueCards() {
            if (!deckId || !userId) return;
            setIsLoading(true);
            try {
                const dueCards = await getDueFlashcards(deckId, userId);
                setCards(dueCards);
                if (dueCards.length === 0) {
                    setSessionComplete(true);
                }
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch due cards.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
        loadDueCards();
    }, [deckId, userId, toast]);

    const handleQualitySelection = async (quality: SrsQuality) => {
        const card = cards[currentIndex];
        const srsParams = calculateSrsParameters(card, quality);
        const newDueDate = getNextDueDate(srsParams.interval);

        try {
            await updateFlashcardSrs(card.id, card.deckId, srsParams, newDueDate);

            setReviewedCount(prev => prev + 1);

            if (currentIndex + 1 < cards.length) {
                setIsFlipped(false);
                setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
            } else {
                setSessionComplete(true);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update card. Please try again.", variant: "destructive" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
                <div className="relative"><BrainCircuit className="h-20 w-20 text-primary" /><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="h-8 w-8 text-accent animate-pulse" /></motion.div></div>
                <h2 className="text-2xl font-semibold mb-2 mt-6">Loading Review Session...</h2>
                <p className="text-muted-foreground max-w-sm mb-6">Finding cards that are due for review.</p>
            </div>
        );
    }

    if (sessionComplete) {
        return (
            <div className="text-center">
                 <PageHeader
                    title="Review Complete!"
                    description={`You have reviewed ${reviewedCount} card${reviewedCount === 1 ? '' : 's'}. Come back later for more.`}
                />
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-card rounded-lg border">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold">All done for now!</h2>
                    <p className="text-muted-foreground mt-2">There are no more cards due for review in this deck.</p>
                     <Button onClick={() => router.push('/flashcards/decks')} className="mt-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
                    </Button>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div>
            <PageHeader
                title="Flashcard Review"
                description="Review your due cards to strengthen your memory."
            />
            <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-xl h-72 perspective-[1000px]">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            className="relative w-full h-full"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <motion.div
                                className="absolute w-full h-full flex items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-lg"
                                style={{ backfaceVisibility: 'hidden' }}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3 className="text-2xl md:text-3xl font-bold">{currentCard.term}</h3>
                            </motion.div>
                            {/* Back */}
                            <motion.div
                                className="absolute w-full h-full flex items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-lg"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                animate={{ rotateY: isFlipped ? 0 : -180 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-lg md:text-xl text-muted-foreground">{currentCard.definition}</p>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="text-center text-muted-foreground font-medium">
                    Card {currentIndex + 1} of {cards.length}
                </div>

                {!isFlipped ? (
                    <Button onClick={() => setIsFlipped(true)} size="lg">Show Answer</Button>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={() => handleQualitySelection(0)} variant="destructive" className="flex-1">Again</Button>
                        <Button onClick={() => handleQualitySelection(1)} variant="outline" className="flex-1">Hard</Button>
                        <Button onClick={() => handleQualitySelection(2)} className="flex-1">Good</Button>
                        <Button onClick={() => handleQualitySelection(3)} variant="secondary" className="flex-1 bg-green-500 hover:bg-green-600 text-white">Easy</Button>
                    </div>
                )}
                 <Button onClick={() => router.push('/flashcards/decks')} variant="ghost" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Exit Review
                </Button>
            </div>
        </div>
    );
}
