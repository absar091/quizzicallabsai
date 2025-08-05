import { Flashcard } from '@/ai/flows/generate-flashcards';
import { addDays } from 'date-fns';

// Corresponds to user's self-assessment of how well they remembered the card.
// 0 = "Again" (complete blackout)
// 1 = "Hard" (remembered with difficulty)
// 2 = "Good" (remembered, but with some hesitation)
// 3 = "Easy" (recalled instantly)
// Note: We will use a 4-button UI mapping to 0, 1, 2, 3.
export type SrsQuality = 0 | 1 | 2 | 3;

export interface SrsParameters {
    interval: number;
    repetition: number;
    easeFactor: number;
}

/**
 * Implements the SM-2 spaced repetition algorithm.
 * @param flashcard The flashcard object containing current SRS data.
 * @param quality The user's assessment of their recall quality (0-3).
 * @returns The updated SRS parameters for the flashcard.
 */
export function calculateSrsParameters(
    flashcard: Pick<Flashcard, 'repetition' | 'easeFactor' | 'interval'>,
    quality: SrsQuality
): SrsParameters {

    // If recall quality is low (less than 2), reset repetition count.
    if (quality < 2) {
        return {
            repetition: 0,
            interval: 1, // Show again in 1 day.
            easeFactor: flashcard.easeFactor, // Ease factor is not changed on a failed repetition.
        };
    }

    let { repetition, easeFactor, interval } = flashcard;

    // Update ease factor based on quality of recall.
    // The formula is based on the SM-2 algorithm.
    easeFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    if (easeFactor < 1.3) {
        easeFactor = 1.3; // Ease factor should not go below 1.3.
    }

    // Set the new interval based on the repetition number.
    if (repetition === 0) {
        interval = 1;
    } else if (repetition === 1) {
        interval = 6;
    } else {
        interval = Math.ceil(interval * easeFactor);
    }

    // Increment the repetition counter.
    repetition = repetition + 1;

    return { repetition, easeFactor, interval };
}

/**
 * Calculates the next due date for a flashcard.
 * @param interval The new interval in days.
 * @returns The next due date as an ISO string.
 */
export function getNextDueDate(interval: number): string {
    const now = new Date();
    const dueDate = addDays(now, interval);
    return dueDate.toISOString();
}
