
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-practice-questions.ts';
import '@/ai/flows/generate-custom-quiz.ts';
import '@/ai/flows/generate-quiz-from-document.ts';
import '@/ai/flows/generate-explanations-for-incorrect-answers.ts';
import '@/ai/flows/generate-study-guide.ts';
import '@/ai/flows/generate-simple-explanation.ts';
import '@/ai/flows/generate-nts-quiz.ts';
import '@/ai/flows/generate-dashboard-insights.ts';
import '@/ai/flows/generate-help-bot-response.ts';

import * as cron from 'node-cron';
import { sendDailyReminderNotifications } from '@/services/notification-service';

// This will only run in the local development environment (`npm run genkit:dev`)
if (process.env.NODE_ENV !== 'production') {
    // Schedule a cron job to run every minute for testing purposes.
    // For a real daily notification, you would use a '0 18 * * *' schedule (6 PM every day).
    cron.schedule('* * * * *', () => {
        console.log('Running scheduled dev task: sending notifications...');
        sendDailyReminderNotifications().catch(console.error);
    });

    console.log('Local cron job for notifications scheduled. It will run every minute for testing.');
}
