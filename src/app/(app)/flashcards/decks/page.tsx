import { getFlashcardDecks } from "@/app/(app)/flashcards/actions";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Layers, PlusCircle, ArrowRight } from "lucide-react";

export default async function FlashcardDecksPage() {
    // This is a server component, but auth state is needed.
    // In a real app, you'd get the user from a server-side session.
    // For this example, we'll assume a mock user ID.
    const userId = "mock-user-id"; // Replace with actual user ID provider
    const decks = await getFlashcardDecks(userId);

    return (
        <div>
            <PageHeader
                title="My Flashcard Decks"
                description="Select a deck to start a review session or create a new one."
            />

            <div className="mb-8 flex justify-end">
                <Button asChild>
                    <Link href="/flashcards">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Deck
                    </Link>
                </Button>
            </div>

            {decks.length === 0 ? (
                <div className="text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg p-12">
                    <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No decks found</h3>
                    <p className="mt-2 text-sm">You haven't created any flashcard decks yet.</p>
                    <Button asChild className="mt-6">
                         <Link href="/flashcards">Create Your First Deck</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                        <Card key={deck.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{deck.topic}</CardTitle>
                                <CardDescription>{deck.cardCount} cards</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">
                                    Created on: {new Date(deck.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/flashcards/decks/${deck.id}/review`}>
                                        Start Review <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
