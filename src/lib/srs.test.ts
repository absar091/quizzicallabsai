import { calculateSrsParameters, SrsQuality } from './srs';
import { Flashcard } from '@/ai/flows/generate-flashcards';

describe('calculateSrsParameters', () => {
    const baseCard: Pick<Flashcard, 'repetition' | 'easeFactor' | 'interval'> = {
        repetition: 0,
        easeFactor: 2.5,
        interval: 0,
    };

    test('should reset card when quality is "Again" (0)', () => {
        const card: typeof baseCard = { ...baseCard, repetition: 3, interval: 10 };
        const result = calculateSrsParameters(card, 0 as SrsQuality);
        expect(result.repetition).toBe(0);
        expect(result.interval).toBe(1);
        expect(result.easeFactor).toBe(2.5); // Ease factor does not change on failure
    });

    test('should reset card when quality is "Hard" (1)', () => {
        const card: typeof baseCard = { ...baseCard, repetition: 3, interval: 10 };
        const result = calculateSrsParameters(card, 1 as SrsQuality);
        expect(result.repetition).toBe(0);
        expect(result.interval).toBe(1);
        expect(result.easeFactor).toBe(2.5);
    });

    test('First correct review (quality "Good" = 2)', () => {
        const result = calculateSrsParameters(baseCard, 2 as SrsQuality);
        expect(result.repetition).toBe(1);
        expect(result.interval).toBe(1);
        // EF formula: 2.5 + (0.1 - (3 - 2) * (0.08 + (3 - 2) * 0.02)) = 2.5 + (0.1 - 1 * 0.1) = 2.5
        expect(result.easeFactor).toBeCloseTo(2.5);
    });

    test('Second correct review (quality "Good" = 2)', () => {
        let card = { ...baseCard };
        card = { ...card, ...calculateSrsParameters(card, 2 as SrsQuality) }; // First review
        const result = calculateSrsParameters(card, 2 as SrsQuality); // Second review

        expect(result.repetition).toBe(2);
        expect(result.interval).toBe(6);
        expect(result.easeFactor).toBeCloseTo(2.5);
    });

    test('Third correct review (quality "Good" = 2)', () => {
        let card = { ...baseCard };
        card = { ...card, ...calculateSrsParameters(card, 2 as SrsQuality) }; // First
        card = { ...card, ...calculateSrsParameters(card, 2 as SrsQuality) }; // Second
        const result = calculateSrsParameters(card, 2 as SrsQuality); // Third

        expect(result.repetition).toBe(3);
        // Interval formula: ceil(6 * 2.5) = 15
        expect(result.interval).toBe(15);
        expect(result.easeFactor).toBeCloseTo(2.5);
    });

    test('should increase ease factor on "Easy" (3) recall', () => {
        const result = calculateSrsParameters(baseCard, 3 as SrsQuality);
        // EF formula: 2.5 + (0.1 - (3 - 3) * (...)) = 2.6
        expect(result.easeFactor).toBeCloseTo(2.6);
    });

    test('should not let ease factor go below 1.3', () => {
        const card = { ...baseCard, easeFactor: 1.3 };
        // This quality would normally decrease it: 1.3 + (0.1 - (3 - 2) * (0.1)) = 1.3
        const result = calculateSrsParameters(card, 2 as SrsQuality);
        expect(result.easeFactor).toBe(1.3);
    });
});
