
# Quizzicallabs AI

Welcome to **Quizzicallabs AI**, your ultimate AI-powered study partner designed to revolutionize the way students and educators approach learning and assessment. Built with cutting-edge technology, this platform provides a suite of powerful tools to generate personalized learning materials in seconds.

## ✨ Features

Quizzicallabs AI is packed with features to cater to a wide range of educational needs:

-   **Custom Quiz Generator**: Create highly tailored quizzes on any topic in the world. Specify difficulty levels (Easy, Medium, Hard, Master), question counts (up to 55), and question formats (Multiple Choice, Descriptive) for targeted study sessions.
-   **Practice Questions**: Quickly generate a set of practice questions on any topic, complete with correct answers and detailed AI-generated explanations to help you master the concepts.
-   **Quiz from Document**: Upload your own study materials—such as PDFs or DOCX files—and let our AI create a quiz based *exclusively* on the content of your document. This ensures your practice is perfectly aligned with your curriculum.
-   **AI Study Guide Generator**: Need to get up to speed on a new topic? Our AI can generate a comprehensive study guide that includes a high-level summary, key concepts with definitions, simple analogies for complex ideas, and a quick self-quiz to check your knowledge.
-   **Exam Paper Generator**: A powerful tool for educators. Create professional, print-ready exam papers with custom headers (school name, teacher, marks), multiple variants to prevent cheating, and an automatically generated answer key.
-   **MDCAT Preparation Module**: A specialized section for students preparing for the Medical & Dental College Admission Test. This module provides high-difficulty, past-paper style tests organized by subject and chapter, simulating the real exam environment.
-   **ECAT Preparation Module**: A dedicated section for students preparing for the Engineering College Admission Test, with subject-wise tests based on the official syllabus.
-   **NTS Preparation Module**: A comprehensive tool for various National Testing Service (NTS) categories (e.g., NAT-IE, NAT-IM, NAT-ICS), offering syllabus-based practice.
-   **Mock Tests**: Full-length mock tests for MDCAT, ECAT, and NTS that simulate the real exam experience by generating questions section-by-section according to the official paper patterns.
-   **Performance Tracking**: Monitor your progress with a personalized dashboard. View graphs of your recent scores, track your mastery level by topic, and identify your strengths and weaknesses.
-   **Bookmarks & Review**: Bookmark challenging questions during a quiz to revisit them later. The dashboard includes a dedicated review session to help you focus on areas that need improvement.
-   **PDF Export**: Download generated quizzes, practice questions, and study guides as formatted PDFs for offline study or printing.

## 🔒 Authentication and Security

User security and data privacy are top priorities for Quizzicallabs AI.

-   **Firebase Authentication**: We use a robust, secure authentication system powered by Firebase. All passwords are encrypted, and user sessions are managed with industry-standard security protocols for a safe, cross-device experience.
-   **Email Verification**: To ensure the validity of user accounts and prevent spam, all new users must verify their email address before they can log in.
-   **Data Security**: User data, including quiz results and bookmarks, is stored securely. Our security rules are configured to ensure that users can only access their own data, preventing unauthorized access.
-   **Data Persistence**: For a seamless user experience, your quiz progress, bookmarks, and results are saved locally in your browser's IndexedDB and synced with Firebase. This means you can pick up right where you left off, even if you lose your internet connection.

## 🚀 Technology Stack

This application is built with a modern, robust, and scalable technology stack:

-   **Frontend**: [Next.js](https://nextjs.org/) (with App Router) & [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (powered by Google's Gemini models)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Realtime Database, Firestore)
-   **Deployment**: [Vercel](https://vercel.com/) / [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

To get started with developing or running this project locally, you'll need to have Node.js and npm installed.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies**:
    ```bash
    cd <project-directory>
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env.local` file in the root of the project and add your Firebase and Genkit API keys:
    ```
    # Firebase Public Keys
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # ... other public keys

    # Genkit/Google AI Key
    GEMINI_API_KEY=...

    # Cron Secret for scheduled tasks
    CRON_SECRET=...
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

The application will be available at your local development address.
