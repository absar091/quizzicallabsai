"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

export default function FlashcardViewer({ flashcards, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const activeCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!activeCard) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <PageHeader title="Flashcards Review" description="No flashcards available." />
        <Button variant="link" onClick={onBack}>Back to Results</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
      <PageHeader title="Flashcards Review" description="Review the concepts you got wrong." />
      <div className="w-full h-72 perspective-[1000px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
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
              <h3 className="text-2xl md:text-3xl font-bold">{activeCard.term}</h3>
            </motion.div>
            {/* Back */}
            <motion.div
              className="absolute w-full h-full flex items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-lg"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              animate={{ rotateY: isFlipped ? 0 : -180 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg md:text-xl text-muted-foreground">{activeCard.definition}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center text-muted-foreground font-medium">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4"/> Previous
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
          Next <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </div>
      <Button variant="link" onClick={onBack}>Back to Results</Button>
    </div>
  );
}
