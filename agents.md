# Quizzicallabs AI - Agent Documentation

## Overview
Quizzicallabs AI is a comprehensive AI-powered educational platform built with Next.js, Firebase, and Google's Genkit AI framework. It provides personalized learning experiences through custom quiz generation, exam preparation modules, and performance tracking.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI components
- **AI**: Google Genkit with Gemini models (1.5-flash for free, 2.5-pro for premium)
- **Backend**: Firebase (Auth, Realtime Database, Firestore)
- **Deployment**: Vercel/Firebase App Hosting
- **Local Storage**: IndexedDB for offline data persistence

### Project Structure
```
src/
├── ai/                    # AI flows and Genkit configuration
│   ├── flows/            # Individual AI generation flows
│   └── genkit.ts         # Main AI configuration
├── app/                  # Next.js app router pages
│   ├── (auth)/          # Authentication pages
│   ├── (protected)/     # Protected routes
│   └── api/             # API routes
├── components/          # Reusable UI components
├── context/            # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── services/           # External service integrations
```

## Core Features

### AI-Powered Quiz Generation
- **Custom Quiz Generator**: Creates tailored quizzes with configurable difficulty, question count (1-55), and formats
- **Document-Based Quizzes**: Generates quizzes from uploaded PDFs/DOCX files
- **Study Guide Generator**: Creates comprehensive study materials with summaries and self-quizzes
- **Practice Questions**: Generates questions with AI explanations for incorrect answers

### Exam Preparation Modules
- **MDCAT Prep**: Medical entrance test preparation with subject-wise tests (Biology, Chemistry, Physics, English, Logical Reasoning)
- **ECAT Prep**: Engineering entrance test preparation
- **NTS Prep**: National Testing Service exam preparation
- **Mock Tests**: Full-length simulated exams with official paper patterns

### User Management & Analytics
- **Firebase Authentication**: Email/password and Google OAuth with email verification
- **Performance Tracking**: Progress analytics with charts and insights
- **Bookmarking System**: Save challenging questions for review
- **Achievement System**: Gamified learning with unlockable milestones

## AI Integration

### Genkit Flows
Located in `src/ai/flows/`, each flow handles specific AI tasks:
- `generate-custom-quiz.ts`: Main quiz generation with strict validation
- `generate-quiz-from-document.ts`: Document-based quiz creation
- `generate-study-guide.ts`: Comprehensive study material generation
- `generate-dashboard-insights.ts`: Personalized learning recommendations
- `generate-explanations-for-incorrect-answers.ts`: AI explanations for wrong answers

### Model Selection
- **Free Tier**: Gemini 1.5 Flash
- **Pro Tier**: Gemini 2.5 Pro
- Dynamic model selection based on user subscription

### Key AI Features
- LaTeX support for mathematical equations
- Chemical structure rendering with SMILES notation
- Adaptive difficulty based on user performance
- Syllabus-adherent question generation for standardized tests

## Data Management

### Firebase Integration
- **Authentication**: User management with profile data
- **Realtime Database**: User progress and quiz results
- **Security Rules**: Strict data access controls

### Local Storage (IndexedDB)
- Offline quiz data persistence
- Bookmark storage
- Performance metrics caching
- Seamless online/offline synchronization

## User Experience

### Responsive Design
- Mobile-first approach with bottom navigation
- Desktop sidebar navigation
- PWA capabilities with offline support
- Dark/light theme support

### Performance Features
- Splash screen with session persistence
- Lazy loading for AI components
- Optimized bundle splitting
- Image optimization

## Development Workflow

### Scripts
```bash
npm run dev          # Development server
npm run genkit:dev   # Genkit development server
npm run build        # Production build
npm run lint         # Code linting
```

### Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# AI Configuration
GEMINI_API_KEY=
NEXT_PUBLIC_FREE_MODEL_NAME=gemini-1.5-flash
NEXT_PUBLIC_PRO_MODEL_NAME=gemini-2.5-pro

# Security
NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY=
RECAPTCHA_V3_SECREEY=
CRON_SECRET=
```

## Key Components

### Authentication Flow
- Email/password registration with verification
- Google OAuth integration
- Protected route middleware
- User profile management

### Quiz Engine
- Dynamic question rendering with LaTeX support
- Multiple choice and descriptive question types
- Real-time progress tracking
- Bookmark functionality
- PDF export capabilities

### Dashboard Analytics
- Performance visualization with Recharts
- AI-generated insights and recommendations
- Achievement tracking
- Study streak monitoring

## Security & Privacy

### Data Protection
- Firebase security rules for user data isolation
- reCAPTCHA protection on registration
- Email verification requirement
- Secure session management

### Content Safety
- Input validation and sanitization
- Rate limiting on AI requests
- Error handling and fallbacks
- PII protection in examples

## Deployment

### Production Setup
- Vercel deployment with Firebase integration
- Environment variable configuration
- Database rules deployment
- Analytics and monitoring setup

### Monitoring
- Firebase Analytics integration
- Error tracking and logging
- Performance monitoring
- User engagement metrics

This documentation provides a comprehensive overview of the Quizzicallabs AI platform architecture, features, and development practices.