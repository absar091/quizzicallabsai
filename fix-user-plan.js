/**
 * Emergency script to manually activate a user's plan
 * Use this when webhook fails to process
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

async function fixUserPlan(userId, targetPlan = 'pro') {
  console.log(`🔧 Fixing plan for user: ${userId}`);
  console.log(`🎯 Target plan: ${targetPlan}`);

  try {
    // Plan limits
    const PLAN_LIMITS = {
      free: { tokens: 100000, quizzes: 20 },
      basic: { tokens: 250000, quizzes: 50 },
      pro: { tokens: 500000, quizzes: 100 },
      premium: { tokens: 1000000, quizzes: 200 },
    };

    const limits = PLAN_LIMITS[targetPlan];
    const now = new Date();
    const cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // 1. Update subscription node
    console.log('📝 Updating subscription node...');
    await db.ref(`users/${userId}/subscription`).update({
      plan: targetPlan,
      subscription_status: 'active',
      subscription_source: 'admin_fix',
      tokens_used: 0,
      tokens_limit: limits.tokens,
      quizzes_used: 0,
      quizzes_limit: limits.quizzes,
      billing_cycle_start: now.toISOString(),
      billing_cycle_end: cycleEnd.toISOString(),
      updated_at: now.toISOString(),
    });
    console.log('✅ Subscription updated');

    // 2. Update usage node
    console.log('📝 Updating usage node...');
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    await db.ref(`usage/${userId}/${year}/${month}`).set({
      plan: targetPlan,
      tokens_used: 0,
      tokens_limit: limits.tokens,
      quizzes_created: 0,
      month,
      year,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });
    console.log('✅ Usage updated');

    // 3. Update metadata
    console.log('📝 Updating metadata...');
    await db.ref(`users/${userId}/metadata`).update({
      plan: targetPlan,
      subscription_id: `manual_fix_${Date.now()}`,
      updated_at: now.toISOString(),
    });
    console.log('✅ Metadata updated');

    // 4. Clear pending plan change
    console.log('🧹 Clearing pending plan change...');
    await db.ref(`users/${userId}/pending_plan_change`).remove();
    console.log('✅ Pending plan change cleared');

    // 5. Update pending purchase
    console.log('📝 Updating pending purchase...');
    const pendingSnapshot = await db.ref(`pending_purchases/${userId}`).once('value');
    if (pendingSnapshot.exists()) {
      await db.ref(`pending_purchases/${userId}`).update({
        status: 'completed',
        activation_completed_at: now.toISOString(),
        note: 'Manually fixed by admin',
        updated_at: now.toISOString(),
      });
      console.log('✅ Pending purchase updated');
    }

    console.log('🎉 User plan fixed successfully!');
    console.log(`✨ User ${userId} is now on ${targetPlan} plan with ${limits.tokens} tokens`);

  } catch (error) {
    console.error('❌ Error fixing user plan:', error);
    throw error;
  }
}

// Run the fix
const userId = 'nihPCHdN1T90vNpsbUaQPa3q4q1'; // The user from the screenshot
const targetPlan = 'pro';

fixUserPlan(userId, targetPlan)
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
