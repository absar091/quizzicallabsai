'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { serviceAccountKey } from '@/services/serviceAccountKey-temp';
import { Flashcard, FlashcardDeck } from '@/ai/flows/generate-flashcards';
import { SrsParameters } from '@/lib/srs';

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

export async function getFlashcardDecks(userId: string): Promise<FlashcardDeck[]> {
    const decksRef = db.collection('flashcardDecks').where('userId', '==', userId);
    const snapshot = await decksRef.get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data() as FlashcardDeck);
}

export async function getDueFlashcards(deckId: string, userId: string): Promise<Flashcard[]> {
    const now = new Date().toISOString();
    const cardsRef = db.collection(`flashcardDecks/${deckId}/flashcards`)
        .where('userId', '==', userId)
        .where('dueDate', '<=', now);

    const snapshot = await cardsRef.get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data() as Flashcard);
}

export async function updateFlashcardSrs(
    flashcardId: string,
    deckId: string,
    srsParameters: SrsParameters,
    dueDate: string
) {
    const cardRef = db.doc(`flashcardDecks/${deckId}/flashcards/${flashcardId}`);
    await cardRef.update({
        ...srsParameters,
        dueDate,
    });
}
