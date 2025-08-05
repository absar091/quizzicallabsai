
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Layers } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

const formSchema = z.object({
  topic: z.string().min(3, "Topic is required."),
  count: z.number().min(5).max(50),
});

export default function FlashcardsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const userId = "mock-user-id"; // Replace with actual user ID

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      count: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const result = await generateFlashcards({ ...values, userId });
      if (!result.deckId) {
        toast({
          title: "No Flashcards Generated",
          description: "The AI could not generate flashcards for this topic. Please try being more specific.",
          variant: "destructive"
        });
      } else {
        toast({
            title: "Deck Created!",
            description: "Your new flashcard deck is ready for review.",
        });
        router.push(`/flashcards/decks/${result.deckId}/review`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Generating Flashcards",
        description: "An error occurred. The AI model might be busy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Flashcard Generator"
        description="Create a deck of flashcards for any topic to supercharge your study sessions."
      />

      <div className="mb-8 flex justify-end">
          <Button asChild variant="outline">
              <Link href="/flashcards/decks">
                  <Layers className="mr-2 h-4 w-4" />
                  View My Decks
              </Link>
          </Button>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
            <div className="relative"><BrainCircuit className="h-20 w-20 text-primary" /><motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Sparkles className="h-8 w-8 text-accent animate-pulse" /></motion.div></div>
            <h2 className="text-2xl font-semibold mb-2 mt-6">Generating Your Flashcards...</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Our AI is crafting your study deck. This may take a moment.</p>
        </div>
      ) : (
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
                <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Deck
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
