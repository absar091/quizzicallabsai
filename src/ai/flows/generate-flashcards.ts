
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating flashcards for a given topic.
 *
 * - generateFlashcards: An async function that takes a topic and returns a set of flashcards.
 * - GenerateFlashcardsInput: The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput: The output type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestore} from 'firebase-admin/firestore';
import {customAlphabet} from 'nanoid';
import {initializeApp, getApps} from 'firebase-admin/app';
import {serviceAccountKey} from '@/services/serviceAccountKey-temp';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: {
      clientEmail: serviceAccountKey.client_email,
      privateKey: serviceAccountKey.private_key,
      projectId: serviceAccountKey.project_id,
    },
  });
}

const db = getFirestore();

// Nano ID for generating unique, URL-friendly IDs
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the flashcards.'),
  count: z.number().min(5).max(50).describe('The number of flashcards to generate.'),
  userId: z.string().describe('The ID of the user requesting the flashcards.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

// The AI-generated content for a single flashcard.
const FlashcardContentSchema = z.object({
  term: z.string().describe('The key term, concept, or question for the front of the flashcard.'),
  definition: z.string().describe('The concise definition, answer, or explanation for the back of the flashcard.'),
});

// The full flashcard object, including SRS data, as stored in Firestore.
export const FlashcardSchema = z.object({
  id: z.string().describe('A unique identifier for the flashcard.'),
  deckId: z.string().describe('The ID of the deck this card belongs to.'),
  userId: z.string().describe('The ID of the user who owns this card.'),
  term: z.string(),
  definition: z.string(),
  // SRS (Spaced Repetition System) fields
  interval: z.number().describe('The number of days to wait before showing the card again.'),
  repetition: z.number().describe('The number of times the card has been successfully recalled.'),
  easeFactor: z.number().describe("A factor that determines how quickly the interval grows (aka 'EF')."),
  dueDate: z.string().describe('The ISO 8601 date string for when the card is next due for review.'),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

// A deck of flashcards.
export const FlashcardDeckSchema = z.object({
  id: z.string(),
  userId: z.string(),
  topic: z.string(),
  createdAt: z.string(),
  cardCount: z.number(),
});
export type FlashcardDeck = z.infer<typeof FlashcardDeckSchema>;

export const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardContentSchema).describe('An array of generated flashcard content.'),
  deckId: z.string().describe('The ID of the newly created deck.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  const {topic, count, userId} = input;

  // 1. Create a new deck in Firestore
  const deckId = nanoid();
  const deckRef = db.collection('flashcardDecks').doc(deckId);
  const deckData: FlashcardDeck = {
    id: deckId,
    userId,
    topic,
    createdAt: new Date().toISOString(),
    cardCount: count,
  };
  await deckRef.set(deckData);

  // 2. Generate flashcard content using the AI flow
  const {output} = await prompt({topic, count});
  if (!output?.flashcards) {
    throw new Error('AI failed to generate flashcard content.');
  }

  // 3. Create full flashcard objects with initial SRS data
  const now = new Date().toISOString();
  const flashcards: Flashcard[] = output.flashcards.map((cardContent) => ({
    ...cardContent,
    id: nanoid(),
    deckId,
    userId,
    // Initial SRS values
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: now,
  }));

  // 4. Batch-write the new flashcards to a subcollection
  const batch = db.batch();
  const cardsRef = db.collection(`flashcardDecks/${deckId}/flashcards`);
  flashcards.forEach((card) => {
    const docRef = cardsRef.doc(card.id);
    batch.set(docRef, card);
  });
  await batch.commit();

  // 5. Return the deckId and the generated content
  return {
    flashcards: output.flashcards,
    deckId,
  };
}

const promptText = `You are an expert educator specializing in creating effective study materials. Your task is to generate a set of high-quality, concise, and accurate flashcards for the given topic.

**CRITICAL DIRECTIVES:**
1.  **ACCURACY IS PARAMOUNT:** All terms and definitions must be factually correct and directly relevant to the topic.
2.  **CONCISENESS:** Keep the text for both the term and the definition brief and to the point. Flashcards should be easily digestible.
3.  **EXACT COUNT:** You MUST generate exactly {{{count}}} flashcards.
4.  **TERM (FRONT):** The 'term' should be a single key concept, a person, a date, or a short question.
5.  **DEFINITION (BACK):** The 'definition' should be a clear, simple explanation or answer to the term.
6.  **FINAL OUTPUT FORMAT:** Your final output MUST be ONLY the JSON object specified in the output schema. No extra text or commentary.

---

**TASK: Generate {{{count}}} flashcards for the following topic:**

*   **Topic:** '{{{topic}}}'

Generate the flashcards now.`;

const prompt = ai.definePrompt({
    name: "generateFlashcardsPrompt",
    prompt: promptText,
    input: { schema:  z.object({
        topic: z.string(),
        count: z.number(),
    }) },
    output: { schema: z.object({
        flashcards: z.array(FlashcardContentSchema)
    }) },
});
