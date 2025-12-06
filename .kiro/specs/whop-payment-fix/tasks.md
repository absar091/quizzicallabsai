# Implementation Plan

- [x] 1. Create centralized Plan Activation Service





  - Create `src/lib/plan-activation.ts` with unified activation logic
  - Implement `activatePlan()` method with transaction support
  - Implement `verifyActivation()` for consistency checks
  - Implement `rollbackActivation()` for error recovery
  - Add comprehensive logging for all operations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3_

- [x] 1.1 Write property test for plan activation completeness


  - **Property 1: Plan activation completeness**
  - **Validates: Requirements 1.2, 1.3, 1.4, 6.1, 6.2, 6.3**

- [x] 2. Fix webhook handler for zero-dollar transactions





  - Update `src/app/api/webhooks/whop/route.ts` to handle amount=0
  - Add `handleZeroDollarTransaction()` function
  - Update `handleMembershipActivated()` to use Plan Activation Service
  - Add retry logic with exponential backoff
  - Enhance logging with webhook payload details
  - Store webhook errors in Firebase `/webhook_errors`
  - _Requirements: 2.2, 2.4, 2.5, 3.1, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4_

- [x] 2.1 Write property test for zero-dollar transaction equivalence


  - **Property 2: Zero-dollar transaction equivalence**
  - **Validates: Requirements 2.2, 2.4, 2.5**



- [x] 2.2 Write property test for webhook idempotency





  - **Property 6: Webhook idempotency**
  - **Validates: Requirements 8.2**

- [x] 3. Implement promo code database schema





  - Create Firebase Realtime Database structure for `/promo_codes`
  - Create structure for `/promo_code_redemptions`
  - Update Firebase security rules for promo code access
  - Add admin role checking in security rules
  - _Requirements: 7.1, 9.1, 9.2_

- [ ] 4. Create promo code validation and redemption API
  - Create `src/lib/promo-code-service.ts` with validation logic
  - Implement `validatePromoCode()` method
  - Implement `redeemPromoCode()` method with usage tracking
  - Create `src/app/api/promo-code/redeem/route.ts` endpoint
  - Add authentication and rate limiting
  - Integrate with Plan Activation Service
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7_

- [ ] 4.1 Write property test for promo code single-use enforcement
  - **Property 3: Promo code single-use enforcement**
  - **Validates: Requirements 7.6**

- [ ] 4.2 Write property test for promo code expiration enforcement
  - **Property 7: Promo code expiration enforcement**
  - **Validates: Requirements 7.7**

- [ ] 4.3 Write property test for token limit assignment
  - **Property 8: Token limit assignment**
  - **Validates: Requirements 1.2, 7.3**

- [ ] 5. Create admin promo code management APIs
  - Create `src/app/api/admin/promo-code/create/route.ts`
  - Create `src/app/api/admin/promo-code/list/route.ts`
  - Create `src/app/api/admin/promo-code/deactivate/route.ts`
  - Add admin authentication middleware
  - Implement promo code generation with unique IDs
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6. Implement subscription status polling hook
  - Create `src/hooks/useSubscriptionPolling.ts`
  - Implement 2-second polling interval
  - Add 60-second timeout
  - Stop polling when status becomes "active"
  - Return loading state and current status
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6.1 Write property test for polling termination
  - **Property 5: Polling termination**
  - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 7. Update payment success page with real-time polling



  - Update `src/app/payment/success/page.tsx`
  - Integrate `useSubscriptionPolling` hook
  - Display real-time status updates
  - Show token limits when activated
  - Add support contact link for failed activations
  - Remove fake 2-second delay
  - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Create promo code input UI component
  - Create `src/components/promo-code-input.tsx`
  - Add input field with validation
  - Implement loading and error states
  - Display success message with plan details
  - Add user-friendly error messages
  - _Requirements: 7.5_

- [ ] 9. Add promo code redemption to pricing page
  - Update `src/app/pricing/page.tsx`
  - Add PromoCodeInput component
  - Handle successful redemption with plan activation
  - Update UI to show Pro benefits immediately
  - Add celebration animation on success

  - _Requirements: 7.5_

- [ ] 10. Update subscription data model

  - Add `subscription_source` field to subscription node
  - Add `activation_attempts` field for retry tracking
  - Add `last_activation_error` field for debugging
  - Update `src/lib/whop.ts` to use new fields
  - Migrate existing subscriptions to new schema
  - _Requirements: 6.1, 6.2, 6.3, 8.4_

- [ ] 10.1 Write property test for subscription status consistency
  - **Property 4: Subscription status consistency**
  - **Validates: Requirements 6.4**

- [ ] 11. Enhance pending purchases tracking
  - Update pending_purchases schema with new fields
  - Add `webhook_received_at` timestamp
  - Add `activation_completed_at` timestamp
  - Add `error` field for failure tracking
  - Update webhook handler to populate these fields
  - _Requirements: 3.5, 5.5, 8.1_

- [ ] 12. Add comprehensive error logging
  - Create `src/lib/payment-logger.ts` utility
  - Log all webhook events to Firebase
  - Log all promo code redemptions
  - Log all plan activations with before/after states
  - Create admin dashboard for viewing logs
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 13. Implement edge case handling
  - Add duplicate webhook detection
  - Add queuing for webhooks before user registration
  - Handle already-active subscription renewals
  - Implement pending plan change cleanup
  - Add network error retry with exponential backoff
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Update whop service with new activation flow
  - Update `src/lib/whop.ts` `upgradePlan()` method
  - Integrate with Plan Activation Service
  - Remove direct Firebase updates
  - Add activation verification
  - Update error handling
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 15. Add promo code to dashboard
  - Update `src/app/(protected)/(main)/dashboard/page.tsx`
  - Add "Have a promo code?" section
  - Integrate PromoCodeInput component
  - Show redemption history
  - Display current plan from promo code
  - _Requirements: 7.5_

- [ ] 16. Create monitoring and alerting system
  - Create `src/lib/payment-monitoring.ts`
  - Track webhook processing success rate
  - Track average plan activation time
  - Track failed activation count
  - Create alert triggers for anomalies
  - Add admin notification system
  - _Requirements: 5.5_

- [ ] 17. Write integration tests for complete flows
  - Test end-to-end Whop payment with zero-dollar promo
  - Test end-to-end in-app promo code redemption
  - Test webhook retry logic
  - Test subscription polling behavior
  - Test data consistency across all nodes

- [ ] 18. Update environment variables and documentation
  - Add promo code configuration to `.env.example`
  - Update WHOP_WEBHOOK_SETUP_GUIDE.md
  - Create PROMO_CODE_SETUP_GUIDE.md
  - Document admin promo code management
  - Add troubleshooting guide for payment issues
  - _Requirements: All_

- [ ] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Deploy Firebase security rules
  - Deploy updated security rules for promo codes
  - Test admin access controls
  - Test user redemption permissions
  - Verify data isolation
  - _Requirements: 9.1, 9.2_

- [ ] 21. Manual testing and validation
  - Test Whop payment with $0 promo code
  - Test Whop payment without promo code
  - Test in-app promo code redemption
  - Test expired promo code rejection
  - Test duplicate promo code usage
  - Verify real-time status updates
  - Check Firebase data consistency
  - Verify all logging is working
  - _Requirements: All_

- [ ] 22. Final checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.
