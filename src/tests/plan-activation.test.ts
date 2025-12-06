/**
 * Property-Based Tests for Plan Activation Service
 * 
 * Feature: whop-payment-fix, Property 1: Plan activation completeness
 * Validates: Requirements 1.2, 1.3, 1.4, 6.1, 6.2, 6.3
 * 
 * This test verifies that for any successful payment (including zero-dollar transactions),
 * activating the plan updates all three Firebase nodes: subscription, usage, and metadata
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

describe('Plan Activation Service - Property-Based Tests', () => {
  let mockFirebaseData: Record<string, any>;

  beforeEach(() => {
    // Reset mock data
    mockFirebaseData = {};

    // Mock adminDb.ref to return a reference that uses the shared mockFirebaseData
    (adminDb.ref as jest.Mock).mockImplementation((path: string) => {
      return {
        once: jest.fn((event: string) => {
          return Promise.resolve({
            exists: () => {
              return mockFirebaseData[path] !== undefined;
            },
            val: () => mockFirebaseData[path]
          });
        }),
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
        })
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 1: Plan activation completeness
   * 
   * For any successful payment (including zero-dollar transactions),
   * activating the plan should update all three Firebase nodes:
   * subscription, usage, and metadata
   */
  test('Property 1: Plan activation completeness - all nodes updated', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random activation parameters
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constantFrom('whop', 'promo_code', 'admin'),
          amount: fc.option(fc.nat({ max: 10000 }), { nil: undefined })
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data for each test case
          mockFirebaseData = {};

          // Execute plan activation
          const result = await planActivationService.activatePlan(params);

          // Property: Activation should succeed
          expect(result.success).toBe(true);
          expect(result.error).toBeUndefined();

          // Property: All three nodes should be updated
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          const subscriptionPath = `users/${params.userId}/subscription`;
          const usagePath = `usage/${params.userId}/${year}/${month}`;
          const metadataPath = `users/${params.userId}/metadata`;

          // Verify subscription node exists and has correct data
          expect(mockFirebaseData[subscriptionPath]).toBeDefined();
          const subscription = mockFirebaseData[subscriptionPath];
          expect(subscription.plan).toBe(params.plan);
          expect(subscription.subscription_status).toBe('active');
          expect(subscription.subscription_source).toBe(params.source);
          expect(subscription.tokens_limit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(subscription.quizzes_limit).toBe(PLAN_LIMITS[params.plan].quizzes);
          expect(subscription.tokens_used).toBe(0); // Reset on activation
          expect(subscription.quizzes_used).toBe(0); // Reset on activation

          // Verify usage node exists and has correct data
          expect(mockFirebaseData[usagePath]).toBeDefined();
          const usage = mockFirebaseData[usagePath];
          expect(usage.plan).toBe(params.plan);
          expect(usage.tokens_limit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(usage.tokens_used).toBe(0);
          expect(usage.quizzes_created).toBe(0);

          // Verify metadata node exists and has correct data
          expect(mockFirebaseData[metadataPath]).toBeDefined();
          const metadata = mockFirebaseData[metadataPath];
          expect(metadata.plan).toBe(params.plan);
          expect(metadata.subscription_id).toBe(params.subscriptionId);

          // Property: Result should contain correct limits
          expect(result.tokensLimit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(result.quizzesLimit).toBe(PLAN_LIMITS[params.plan].quizzes);

          // Property: All three nodes should be listed as activated
          expect(result.activatedNodes).toContain('subscription');
          expect(result.activatedNodes).toContain('usage');
          expect(result.activatedNodes).toContain('metadata');
          expect(result.activatedNodes?.length).toBe(3);
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });

  /**
   * Property 1 Extension: Zero-dollar transactions should behave identically
   * 
   * Verifies that amount=0 transactions activate plans with the same
   * completeness as paid transactions
   */
  test('Property 1 Extension: Zero-dollar transactions activate all nodes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constantFrom('whop', 'promo_code', 'admin'),
          amount: fc.constant(0) // Always zero-dollar
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data
          mockFirebaseData = {};

          // Execute plan activation with zero-dollar amount
          const result = await planActivationService.activatePlan(params);

          // Property: Zero-dollar transactions should succeed
          expect(result.success).toBe(true);
          expect(result.error).toBeUndefined();

          // Property: All three nodes should still be updated
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          const subscriptionPath = `users/${params.userId}/subscription`;
          const usagePath = `usage/${params.userId}/${year}/${month}`;
          const metadataPath = `users/${params.userId}/metadata`;

          expect(mockFirebaseData[subscriptionPath]).toBeDefined();
          expect(mockFirebaseData[usagePath]).toBeDefined();
          expect(mockFirebaseData[metadataPath]).toBeDefined();

          // Property: Token limits should match plan regardless of amount
          expect(result.tokensLimit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(result.quizzesLimit).toBe(PLAN_LIMITS[params.plan].quizzes);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1 Extension: Data consistency across nodes
   * 
   * Verifies that plan, token limits, and other key fields are consistent
   * across all three Firebase nodes after activation
   */
  test('Property 1 Extension: Data consistency across all nodes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constantFrom('whop', 'promo_code', 'admin'),
          amount: fc.option(fc.nat({ max: 10000 }), { nil: undefined })
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data
          mockFirebaseData = {};

          // Execute plan activation
          await planActivationService.activatePlan(params);

          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;

          const subscription = mockFirebaseData[`users/${params.userId}/subscription`];
          const usage = mockFirebaseData[`usage/${params.userId}/${year}/${month}`];
          const metadata = mockFirebaseData[`users/${params.userId}/metadata`];

          // Property: Plan should be consistent across all nodes
          expect(subscription.plan).toBe(params.plan);
          expect(usage.plan).toBe(params.plan);
          expect(metadata.plan).toBe(params.plan);

          // Property: Token limits should be consistent
          expect(subscription.tokens_limit).toBe(PLAN_LIMITS[params.plan].tokens);
          expect(usage.tokens_limit).toBe(PLAN_LIMITS[params.plan].tokens);

          // Property: Subscription ID should be consistent
          expect(subscription.subscription_id).toBe(params.subscriptionId);
          expect(metadata.subscription_id).toBe(params.subscriptionId);

          // Property: Usage should be reset to zero
          expect(subscription.tokens_used).toBe(0);
          expect(subscription.quizzes_used).toBe(0);
          expect(usage.tokens_used).toBe(0);
          expect(usage.quizzes_created).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1 Extension: Verification confirms completeness
   * 
   * After activation, verifyActivation should return true,
   * confirming all nodes are properly updated
   */
  test('Property 1 Extension: Verification confirms activation completeness', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          userEmail: fc.emailAddress(),
          plan: fc.constantFrom('basic', 'pro', 'premium'),
          subscriptionId: fc.uuid(),
          source: fc.constantFrom('whop', 'promo_code', 'admin'),
          amount: fc.option(fc.nat({ max: 10000 }), { nil: undefined })
        }),
        async (params: PlanActivationParams) => {
          // Reset mock data
          mockFirebaseData = {};

          // Execute plan activation
          const result = await planActivationService.activatePlan(params);
          expect(result.success).toBe(true);

          // Property: Verification should confirm completeness
          const verified = await planActivationService.verifyActivation(params.userId);
          expect(verified).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
