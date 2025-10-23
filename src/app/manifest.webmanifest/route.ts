import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Quizzicallabzᴬᴵ - AI Study Partner',
    short_name: 'Quizzicallabzᴬᴵ',
    description: 'Generate custom quizzes, practice questions with AI explanations, and full study guides. Prepare for MDCAT, ECAT, and NTS with chapter-wise tests and full mock exams.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    categories: ['education', 'productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view of Quizzicallabzᴬᴵ'
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view of Quizzicallabzᴬᴵ'
      }
    ],
    shortcuts: [
      {
        name: 'Generate Quiz',
        short_name: 'New Quiz',
        description: 'Create a new custom quiz',
        url: '/generate-quiz',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Practice Questions',
        short_name: 'Practice',
        description: 'Generate practice questions',
        url: '/generate-questions',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192'
          }
        ]
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
