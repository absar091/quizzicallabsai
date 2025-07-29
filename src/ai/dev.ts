import { config } from 'dotenv';
config();

import '@/ai/flows/generate-practice-questions.ts';
import '@/ai/flows/generate-custom-quiz.ts';
import '@/ai/flows/generate-quiz-from-document.ts';
import '@/ai/flows/generate-explanations-for-incorrect-answers.ts';
import '@/ai/flows/generate-study-guide.ts';
import '@/ai/flows/generate-simple-explanation.ts';
import '@/ai/flows/generate-nts-quiz.ts';
