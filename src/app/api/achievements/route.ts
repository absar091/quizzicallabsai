// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { withRateLimit, RateLimitPresets } from '@/lib/api-rate-limiter';
import connectDB from '@/lib/mongodb';
import { User, Achievement } from '@/lib/models';

/**
 * GET /api/achievements
 * Fetch user's earned achievements and stats
 */
export const GET = withRateLimit(
  RateLimitPresets.API_READ,
  withAuth(async (request: NextRequest, user: any) => {
    try {
      await connectDB();

      // Fetch user data
      const userData = await User.findOne({ uid: user.uid });

      if (!userData) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Fetch user's achievements
      const achievements = await Achievement.find({ userId: user.uid })
        .sort({ earnedAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        achievements: achievements.map((a) => ({
          achievementId: a.type,
          earnedAt: a.earnedAt,
        })),
        stats: userData.stats,
      });
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch achievements', details: error.message },
        { status: 500 }
      );
    }
  })
);

/**
 * POST /api/achievements
 * Award an achievement to a user
 */
export const POST = withRateLimit(
  RateLimitPresets.API_STANDARD,
  withAuth(async (request: NextRequest, user: any) => {
    try {
      const body = await request.json();
      const { achievementId, metadata } = body;

      if (!achievementId) {
        return NextResponse.json(
          { error: 'Achievement ID is required' },
          { status: 400 }
        );
      }

      await connectDB();

      // Check if achievement already earned
      const existing = await Achievement.findOne({
        userId: user.uid,
        type: achievementId,
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Achievement already earned' },
          { status: 409 }
        );
      }

      // Import achievement definitions
      const { ACHIEVEMENT_DEFINITIONS } = await import('@/lib/achievement-system');
      const definition = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === achievementId);

      if (!definition) {
        return NextResponse.json(
          { error: 'Invalid achievement ID' },
          { status: 400 }
        );
      }

      // Create achievement record
      const achievement = await Achievement.create({
        userId: user.uid,
        type: definition.type,
        title: definition.title,
        description: definition.description,
        metadata: metadata || definition.requirement,
        earnedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        achievement: {
          id: achievement._id,
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          earnedAt: achievement.earnedAt,
        },
      });
    } catch (error: any) {
      console.error('Error awarding achievement:', error);
      return NextResponse.json(
        { error: 'Failed to award achievement', details: error.message },
        { status: 500 }
      );
    }
  })
);