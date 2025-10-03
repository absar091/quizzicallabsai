import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // Basic auth check (you should implement proper admin auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    console.log(`📊 Generating email stats for last ${days} days...`);

    // Get all email preferences
    const preferencesRef = collection(firestore, 'email-preferences');
    const preferencesSnapshot = await getDocs(preferencesRef);

    let totalUsers = 0;
    let fullyUnsubscribed = 0;
    const preferenceStats = {
      quizResults: { enabled: 0, disabled: 0 },
      studyReminders: { enabled: 0, disabled: 0 },
      loginAlerts: { enabled: 0, disabled: 0 },
      promotions: { enabled: 0, disabled: 0 },
      newsletters: { enabled: 0, disabled: 0 }
    };

    preferencesSnapshot.forEach(doc => {
      const data = doc.data();
      totalUsers++;

      if (data.preferences?.all === true) {
        fullyUnsubscribed++;
      } else {
        // Count individual preferences
        Object.keys(preferenceStats).forEach(key => {
          if (data.preferences?.[key] === false) {
            preferenceStats[key as keyof typeof preferenceStats].disabled++;
          } else {
            preferenceStats[key as keyof typeof preferenceStats].enabled++;
          }
        });
      }
    });

    // Get recent users (for context)
    const usersRef = collection(firestore, 'users');
    const recentUsersQuery = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const recentUsersSnapshot = await getDocs(recentUsersQuery);
    const totalRegisteredUsers = recentUsersSnapshot.size;

    // Calculate opt-out rates
    const optOutRates = Object.keys(preferenceStats).reduce((acc, key) => {
      const stats = preferenceStats[key as keyof typeof preferenceStats];
      const total = stats.enabled + stats.disabled;
      acc[key] = total > 0 ? (stats.disabled / total * 100).toFixed(2) : '0.00';
      return acc;
    }, {} as Record<string, string>);

    const stats = {
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days
      },
      users: {
        totalRegistered: totalRegisteredUsers,
        withPreferences: totalUsers,
        fullyUnsubscribed,
        subscriptionRate: totalUsers > 0 ? ((totalUsers - fullyUnsubscribed) / totalUsers * 100).toFixed(2) : '100.00'
      },
      preferences: preferenceStats,
      optOutRates,
      summary: {
        mostOptedOut: Object.entries(optOutRates).reduce((a, b) => 
          parseFloat(optOutRates[a[0]]) > parseFloat(b[1]) ? a : b
        )[0],
        leastOptedOut: Object.entries(optOutRates).reduce((a, b) => 
          parseFloat(optOutRates[a[0]]) < parseFloat(b[1]) ? a : b
        )[0]
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error generating email stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate email statistics'
      },
      { status: 500 }
    );
  }
}

// POST endpoint to get detailed user preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { success: false, error: 'Array of emails is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const email of emails.slice(0, 50)) { // Limit to 50 emails per request
      try {
        const { getUserEmailPreferences } = await import('@/lib/email-preferences');
        const preferences = await getUserEmailPreferences(email);
        
        results.push({
          email: email.substring(0, 10) + '...', // Anonymize for privacy
          preferences,
          fullyUnsubscribed: preferences.all === true
        });
      } catch (error) {
        results.push({
          email: email.substring(0, 10) + '...',
          error: 'Failed to fetch preferences'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total: results.length
    });

  } catch (error: any) {
    console.error('Error getting detailed preferences:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get detailed preferences'
      },
      { status: 500 }
    );
  }
}