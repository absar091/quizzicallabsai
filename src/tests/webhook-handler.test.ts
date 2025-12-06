/**
 * Property-Based Tests for Webhook Handler
 * 
 * Feature: whop-payment-fix
 * 
 * Property 2: Zero-dollar transaction equivalence
 * Validates: Requirements 2.2, 2.4, 2.5
 * 
 * Property 6: Webhook idempotency
 * Validates: Requirements 8.2
 */

import * as fc from 'fast-check';
import { planActivationService, PlanActivationParams } from '@/lib/plan-activation';
import { db as adminDb } from '@/lib/firebase-admin';
import { PLAN_LIMITS } from '@/lib/whop-constants';

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => {
  const mockDb = {
    ref: jest.fn()
  };
  return {
    db: mockDb
  };
});

describe('Webhook Handler - Property-Based Tests', () => {
  let mockFirebaseData: Record<string, any>;

  beforeEach(() => {
    // Reset mock data
    mockFirebaseData = {};

    // Mock adminDb.ref to return a reference that uses the shared mockFirebaseData
    (adminDb.ref as jest.Mock).mockImplementation((path: string) => {
      return {
        once: jest.fn(() => {
          return Promise.resolve({
            exists: () => {
              return mockFirebaseData[path] !== undefined;
            },
            val: () => mockFirebaseData[path],
            forEach: (callback: (child: any) => void) => {
              if (mockFirebaseData[path]) {
                Object.keys(mockFirebaseData[path]).forEach((key) => {
                  callback({
                    key,
                    val: () => mockFirebaseData[path][key]
                  });
                });
              }
            }
          });
        }),
        orderByChild: jest.fn(() => ({
          equalTo: jest.fn(() => ({
            once: jest.fn(() => {
              // Find user by email
              const usersPath = 'users';
              const users = mockFirebaseData[usersPath] || {};
              const matchingUsers: Record<string, any> = {};
              
              Object.keys(users).forEach((userId) => {
                matchingUsers[userId] = users[userId];
              });

              return Promise.resolve({
                exists: () => Object.keys(matchingUsers).length > 0,
                forEach: (callback: (child: any) => void) => {
                  Object.keys(matchingUsers).forEach((userId) => {
                    callback({
                      key: userId,
                      val: () => matchingUsers[userId]
                    });
                  });
                }
              });
            })
          }))
        })),
        set: jest.fn((data: any) => {
          mockFirebaseData[path] = data;
          return Promise.resolve();
        }),
        update: jest.fn((data: any) => {
          if (!mockFirebaseData[path]) {
            mockFirebaseData[path] = {};
          }
          mockFirebaseData[path] = { ...mockFirebaseData[path], ...data };
          return Promise.resolve();
        }),
        remove: jest.fn(() => {
          delete mockFirebaseData[path];
          return Promise.resolve();
        }),
        push: jest.fn(() => {
          const key = `generated-key-${Date.now()}-${Math.random()}`;
          return {
            key,
            set: jest.fn((data: any) => {
              if (!mockFirebaseData[path]) {
                mockFirebaseData[path] = {};
              }
              mockFirebaseData[path][key] = data;
              return Promise.resolve();
            })
          };
        })
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 2: Zero-dollar transaction equivalence
   * 
   * For any payment with amount = 0 and valid promo code,
   * the plan activation should grant identical benefits as a paid transaction
   * 
   * Validates: Requirements 2.2, 2.4, 2.5
   */
  test('Property 2: Zero-dollar transaction equivalence', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random activation parameters
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constant('whop' as const)
        }),
        async (baseParams) => {
          // Reset mock data for each test case
          mockFirebaseData = {};

          // Create two activation scenarios: one with amount=0, one with amount>0
          const zeroDollarParams: PlanActivationParams = {
            ...baseParams,
            amount: 0
          };

          const paidParams: PlanActivationParams = {
            ...baseParams,
            userId: `${baseParams.userId}-paid`, // Different user to avoid conflicts
            amount: 100 // $1.00
          };

          // Execute both activations
          const zeroDollarResult = await planActivationService.activatePlan(zeroDollarParams);
          const paidResult = await planActivationService.activatePlan(paidParams);

          // Property: Both should succeed
          expect(zeroDollarResult.success).toBe(true);
          expect(paidResult.success).toBe(true);

          // Property: Both should grant identical token limits
          expect(zeroDollarResult.tokensLimit).toBe(paidResult.tokensLimit);
          expect(zeroDollarResult.tokensLimit).toBe(PLAN_LIMITS[baseParams.plan].tokens);

          // Property: Both should grant identical quiz limits
          expect(zeroDollarResult.quizzesLimit).toBe(paidResult.quizzesLimit);
          expect(zeroDollarResult.quizzesLimit).toBe(PLAN_LIMITS[baseParams.plan].quizzes);

          // Property: Both should activate the same plan
          expect(zeroDollarResult.plan).toBe(paidResult.plan);
          expect(zeroDollarResult.plan).toBe(baseParams.plan);

          // Property: Both should update all three nodes
          expect(zeroDollarResult.activatedNodes).toEqual(paidResult.activatedNodes);
          expect(zeroDollarResult.activatedNodes).toContain('subscription');
          expect(zeroDollarResult.activatedNodes).toContain('usage');
          expect(zeroDollarResult.activatedNodes).toContain('metadata');

          // Verify subscription data is equivalent
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          const zeroSubscription = mockFirebaseData[`users/${zeroDollarParams.userId}/subscription`];
          const paidSubscription = mockFirebaseData[`users/${paidParams.userId}/subscription`];

          // Property: Subscription status should be 'active' for both
          expect(zeroSubscription.subscription_status).toBe('active');
          expect(paidSubscription.subscription_status).toBe('active');

          // Property: Token and quiz limits should be identical
          expect(zeroSubscription.tokens_limit).toBe(paidSubscription.tokens_limit);
          expect(zeroSubscription.quizzes_limit).toBe(paidSubscription.quizzes_limit);

          // Property: Usage should be reset to zero for both
          expect(zeroSubscription.tokens_used).toBe(0);
          expect(paidSubscription.tokens_used).toBe(0);
          expect(zeroSubscription.quizzes_used).toBe(0);
          expect(paidSubscription.quizzes_used).toBe(0);

          // Verify usage data is equivalent
          const zeroUsage = mockFirebaseData[`usage/${zeroDollarParams.userId}/${year}/${month}`];
          const paidUsage = mockFirebaseData[`usage/${paidParams.userId}/${year}/${month}`];

          expect(zeroUsage.tokens_limit).toBe(paidUsage.tokens_limit);
          expect(zeroUsage.tokens_used).toBe(0);
          expect(paidUsage.tokens_used).toBe(0);
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });

  /**
   * Property 6: Webhook idempotency
   * 
   * For any webhook payload, processing the same webhook multiple times
   * should result in the same final state as processing it once
   * 
   * Validates: Requirements 8.2
   */
  test('Property 6: Webhook idempotency', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random activation parameters
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constant('whop' as const),
          amount: fc.option(fc.nat({ max: 10000 }), { nil: undefined })
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data
          mockFirebaseData = {};

          // Process the webhook once
          const firstResult = await planActivationService.activatePlan(params);
          expect(firstResult.success).toBe(true);

          // Capture the state after first processing
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          const subscriptionPath = `users/${params.userId}/subscription`;
          const usagePath = `usage/${params.userId}/${year}/${month}`;
          const metadataPath = `users/${params.userId}/metadata`;

          const firstSubscription = JSON.parse(JSON.stringify(mockFirebaseData[subscriptionPath]));
          const firstUsage = JSON.parse(JSON.stringify(mockFirebaseData[usagePath]));
          const firstMetadata = JSON.parse(JSON.stringify(mockFirebaseData[metadataPath]));

          // Process the same webhook again (idempotent operation)
          const secondResult = await planActivationService.activatePlan(params);
          expect(secondResult.success).toBe(true);

          // Capture the state after second processing
          const secondSubscription = mockFirebaseData[subscriptionPath];
          const secondUsage = mockFirebaseData[usagePath];
          const secondMetadata = mockFirebaseData[metadataPath];

          // Property: Plan should remain the same
          expect(secondSubscription.plan).toBe(firstSubscription.plan);
          expect(secondUsage.plan).toBe(firstUsage.plan);
          expect(secondMetadata.plan).toBe(firstMetadata.plan);

          // Property: Token limits should remain the same
          expect(secondSubscription.tokens_limit).toBe(firstSubscription.tokens_limit);
          expect(secondUsage.tokens_limit).toBe(firstUsage.tokens_limit);

          // Property: Quiz limits should remain the same
          expect(secondSubscription.quizzes_limit).toBe(firstSubscription.quizzes_limit);

          // Property: Subscription status should remain 'active'
          expect(secondSubscription.subscription_status).toBe('active');
          expect(secondSubscription.subscription_status).toBe(firstSubscription.subscription_status);

          // Property: Usage should still be reset to zero (not accumulated)
          expect(secondSubscription.tokens_used).toBe(0);
          expect(secondSubscription.quizzes_used).toBe(0);
          expect(secondUsage.tokens_used).toBe(0);
          expect(secondUsage.quizzes_created).toBe(0);

          // Property: Subscription ID should remain the same
          expect(secondSubscription.subscription_id).toBe(firstSubscription.subscription_id);
          expect(secondMetadata.subscription_id).toBe(firstMetadata.subscription_id);

          // Property: Results should be identical
          expect(secondResult.tokensLimit).toBe(firstResult.tokensLimit);
          expect(secondResult.quizzesLimit).toBe(firstResult.quizzesLimit);
          expect(secondResult.plan).toBe(firstResult.plan);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 Extension: Multiple webhook processing doesn't corrupt data
   * 
   * Processing the same webhook 3+ times should still maintain data integrity
   */
  test('Property 6 Extension: Multiple webhook processing maintains integrity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constant('whop' as const),
          amount: fc.option(fc.nat({ max: 10000 }), { nil: undefined })
        }),
        fc.integer({ min: 2, max: 5 }), // Number of times to process
        async (params: PlanActivationParams, numProcessing: number) => {
          // Reset mock data
          mockFirebaseData = {};

          // Process the webhook multiple times
          const results = [];
          for (let i = 0; i < numProcessing; i++) {
            const result = await planActivationService.activatePlan(params);
            results.push(result);
            expect(result.success).toBe(true);
          }

          // Property: All results should be identical
          for (let i = 1; i < results.length; i++) {
            expect(results[i].tokensLimit).toBe(results[0].tokensLimit);
            expect(results[i].quizzesLimit).toBe(results[0].quizzesLimit);
            expect(results[i].plan).toBe(results[0].plan);
          }

          // Property: Final state should be valid
          const verified = await planActivationService.verifyActivation(params.userId);
          expect(verified).toBe(true);

          // Property: Usage should still be zero (not accumulated)
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const subscription = mockFirebaseData[`users/${params.userId}/subscription`];
          
          expect(subscription.tokens_used).toBe(0);
          expect(subscription.quizzes_used).toBe(0);
        }
      ),
      { numRuns: 50 } // Fewer runs since we're processing multiple times per run
    );
  });

  /**
   * Property 6 Extension: Idempotency with zero-dollar transactions
   * 
   * Zero-dollar transactions should also be idempotent
   */
  test('Property 6 Extension: Zero-dollar webhook idempotency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constant('whop' as const),
          amount: fc.constant(0) // Always zero-dollar
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data
          mockFirebaseData = {};

          // Process zero-dollar webhook twice
          const firstResult = await planActivationService.activatePlan(params);
          const secondResult = await planActivationService.activatePlan(params);

          // Property: Both should succeed
          expect(firstResult.success).toBe(true);
          expect(secondResult.success).toBe(true);

          // Property: Results should be identical
          expect(secondResult.tokensLimit).toBe(firstResult.tokensLimit);
          expect(secondResult.quizzesLimit).toBe(firstResult.quizzesLimit);
          expect(secondResult.plan).toBe(firstResult.plan);

          // Property: Final state should grant full benefits
          expect(secondResult.tokensLimit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(secondResult.quizzesLimit).toBe(PLAN_LIMITS[params.plan].quizzes);
        }
      ),
      { numRuns: 100 }
    );
  });
});
