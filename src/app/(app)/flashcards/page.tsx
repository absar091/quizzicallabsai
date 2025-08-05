
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, BrainCircuit, ArrowLeft, ArrowRight, Layers, FileText, Settings, SlidersHorizontal, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards, GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  topic: z.string().min(3, "Topic is required."),
  count: z.number().min(5).max(50),
});

type Flashcard = GenerateFlashcardsOutput["flashcards"][0];

export default function FlashcardsPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      count: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    try {
      const result = await generateFlashcards(values);
      if (!result.flashcards || result.flashcards.length === 0) {
        toast({
          title: "No Flashcards Generated",
          description: "The AI could not generate flashcards for this topic. Please try being more specific.",
          variant: "destructive"
        });
      } else {
        setFlashcards(result.flashcards);
      }
    } catch (error) {
      toast({
        title: "Error Generating Flashcards",
        description: "An error occurred. The AI model might be busy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleNext = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const resetGenerator = () => {
    setFlashcards(null);
    form.reset();
  }

  return (
    <div>
      <PageHeader
        title="AI Flashcard Generator"
        description="Create a deck of flashcards for any topic to supercharge your study sessions."
      />

      {isGenerating && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
            <div className="relative"><BrainCircuit className="h-20 w-20 text-primary" /><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="h-8 w-8 text-accent animate-pulse" /></motion.div></div>
            <h2 className="text-2xl font-semibold mb-2 mt-6">Generating Your Flashcards...</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Our AI is crafting your study deck. This may take a moment.</p>
        </div>
      )}

      {!isGenerating && !flashcards && (
        <Card className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Create Flashcard Deck</CardTitle>
                <CardDescription>What topic do you want to study?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Krebs Cycle, Important Dates in World War I" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Flashcards: <span className="font-bold text-primary">{field.value}</span></FormLabel>
                      <FormControl>
                        <Slider
                          onValueChange={(value) => field.onChange(value[0])}
                          defaultValue={[field.value]}
                          max={50}
                          min={5}
                          step={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Deck
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {flashcards && (
        <div className="flex flex-col items-center gap-6">
           <div className="w-full max-w-xl h-72 perspective-[1000px]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        className="relative w-full h-full cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front of the card */}
                        <motion.div
                            className="absolute w-full h-full flex items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-lg"
                            style={{ backfaceVisibility: 'hidden' }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold">{flashcards[currentIndex].term}</h3>
                        </motion.div>
                        {/* Back of the card */}
                        <motion.div
                             className="absolute w-full h-full flex items-center justify-center p-8 text-center bg-card border rounded-2xl shadow-lg"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            animate={{ rotateY: isFlipped ? 0 : -180 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-lg md:text-xl text-muted-foreground">{flashcards[currentIndex].definition}</p>
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
             <Button variant="link" onClick={resetGenerator}>Create another deck</Button>
        </div>
      )}
    </div>
  );
}
