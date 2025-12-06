# Requirements Document

## Introduction

This specification addresses critical payment integration issues in the Whop checkout system where successful payments are not properly activating user subscriptions. Users complete payment successfully but remain on the Free plan without receiving their purchased Pro plan benefits (500k tokens and premium features). The system must ensure immediate and reliable plan activation upon successful payment completion.

## Glossary

- **Whop**: Third-party payment and subscription management platform
- **Payment System**: The complete checkout, webhook, and plan activation workflow
- **Plan Activation**: The process of upgrading a user's account from Free to a paid tier (Basic/Pro/Premium)
- **Webhook Handler**: Server endpoint that receives and processes payment notifications from Whop
- **Promo Code**: Discount code that can be applied during checkout
- **Token Limit**: Maximum number of AI tokens available per billing cycle
- **Subscription Status**: Current state of user's subscription (pending, active, cancelled, expired)
- **Firebase Realtime Database**: Backend database storing user subscription data
- **Plan Sync**: Process of ensuring user's plan status is consistent across all system components

## Requirements

### Requirement 1

**User Story:** As a user who completes payment on Whop, I want my Pro plan to activate immediately, so that I can access my purchased 500k tokens and premium features without delay.

#### Acceptance Criteria

1. WHEN a user completes payment successfully on Whop THEN the Payment System SHALL activate the user's purchased plan within 30 seconds
2. WHEN plan activation occurs THEN the Payment System SHALL update the user's token limit to match the purchased plan's allocation
3. WHEN plan activation occurs THEN the Payment System SHALL reset the user's token usage counter to zero
4. WHEN plan activation occurs THEN the Payment System SHALL set the subscription status to "active"
5. WHEN plan activation completes THEN the Payment System SHALL redirect the user to a success page displaying their new plan details

### Requirement 2

**User Story:** As a user, I want promo codes to work consistently between Whop checkout and in-app pricing, so that I receive the correct discount regardless of where I apply the code.

#### Acceptance Criteria

1. WHEN a user applies a promo code on Whop checkout THEN the Payment System SHALL validate the code against the same promo code database used in-app
2. WHEN a promo code reduces the price to zero dollars on Whop THEN the Payment System SHALL still activate the plan and grant full benefits immediately
3. WHEN a promo code is applied on Whop THEN the Webhook Handler SHALL receive the discounted amount in the payment notification
4. WHEN processing a zero-dollar transaction with a valid promo code THEN the Payment System SHALL treat it as a successful payment and set subscription status to "active"
5. WHEN the Webhook Handler receives a zero-dollar payment event THEN the Payment System SHALL activate the user's plan without requiring payment verification

### Requirement 3

**User Story:** As a developer, I want the webhook handler to reliably process all payment events from Whop, so that no successful payments result in failed plan activations.

#### Acceptance Criteria

1. WHEN the Webhook Handler receives a payment event from Whop THEN the Payment System SHALL log the complete webhook payload for debugging
2. WHEN the Webhook Handler processes a membership activation event THEN the Payment System SHALL match the user by email address to their Firebase account
3. WHEN user matching by email fails THEN the Payment System SHALL attempt to match by Whop user ID
4. WHEN user matching succeeds THEN the Payment System SHALL update the Firebase Realtime Database subscription node with the new plan details
5. WHEN webhook processing fails THEN the Payment System SHALL log the error details and return a retry-able HTTP status code

### Requirement 4

**User Story:** As a user, I want to see my payment status update in real-time, so that I know immediately when my plan upgrade is complete.

#### Acceptance Criteria

1. WHEN a user is on the payment success page THEN the Payment System SHALL poll the subscription status every 2 seconds
2. WHEN the subscription status changes to "active" THEN the Payment System SHALL display the updated plan information
3. WHEN 60 seconds elapse without activation THEN the Payment System SHALL display a support contact message
4. WHEN the user's plan activates THEN the Payment System SHALL update all UI components to reflect the new token limits and features

### Requirement 5

**User Story:** As a system administrator, I want comprehensive logging of the payment flow, so that I can diagnose and fix payment issues quickly.

#### Acceptance Criteria

1. WHEN any payment-related event occurs THEN the Payment System SHALL log the event with timestamp, user ID, and event type
2. WHEN the Webhook Handler receives a request THEN the Payment System SHALL log the webhook signature verification result
3. WHEN plan activation is attempted THEN the Payment System SHALL log the before and after subscription states
4. WHEN an error occurs in the payment flow THEN the Payment System SHALL log the complete error stack trace
5. WHEN a user's plan fails to activate THEN the Payment System SHALL create an alert entry in the admin monitoring dashboard

### Requirement 6

**User Story:** As a user, I want my subscription data to be consistent across all parts of the application, so that I don't encounter conflicting information about my plan status.

#### Acceptance Criteria

1. WHEN plan activation occurs THEN the Payment System SHALL update the subscription node in Firebase Realtime Database
2. WHEN plan activation occurs THEN the Payment System SHALL update the usage tracking node with the new plan limits
3. WHEN plan activation occurs THEN the Payment System SHALL update the user metadata node with the subscription ID
4. WHEN all database updates complete THEN the Payment System SHALL verify data consistency across all nodes
5. WHEN data inconsistency is detected THEN the Payment System SHALL retry the update operation up to 3 times

### Requirement 7

**User Story:** As a user, I want to apply promo codes directly in the app and receive Pro benefits immediately, so that I don't need to go through external payment systems.

#### Acceptance Criteria

1. WHEN a user enters a promo code in the app THEN the Payment System SHALL verify the code against the Firebase promo code database
2. WHEN an in-app promo code is valid and unused THEN the Payment System SHALL activate the corresponding plan immediately
3. WHEN in-app promo code activation occurs THEN the Payment System SHALL update the user's token limits to match the plan
4. WHEN in-app promo code activation occurs THEN the Payment System SHALL set the subscription status to "active"
5. WHEN in-app promo code activation completes THEN the Payment System SHALL display the Pro benefits in the user interface within 2 seconds
6. WHEN a promo code has already been used THEN the Payment System SHALL reject the code with an appropriate error message
7. WHEN a promo code is expired THEN the Payment System SHALL reject the code with an expiration message

### Requirement 9

**User Story:** As an administrator, I want to create and manage promo codes, so that I can offer discounts and free trials to users.

#### Acceptance Criteria

1. WHEN an administrator creates a promo code THEN the Payment System SHALL store the code with plan type, usage limit, and expiration date
2. WHEN a promo code is created THEN the Payment System SHALL generate a unique code identifier
3. WHEN a promo code is used THEN the Payment System SHALL increment the usage counter
4. WHEN a promo code reaches its usage limit THEN the Payment System SHALL mark it as inactive
5. WHEN querying promo codes THEN the Payment System SHALL return only active, non-expired codes

### Requirement 8

**User Story:** As a developer, I want the payment system to handle edge cases gracefully, so that users don't get stuck in invalid states.

#### Acceptance Criteria

1. WHEN a webhook arrives before the user completes registration THEN the Payment System SHALL queue the webhook for processing after registration
2. WHEN duplicate webhooks arrive for the same payment THEN the Payment System SHALL process only the first webhook and ignore duplicates
3. WHEN a webhook arrives for an already-active subscription THEN the Payment System SHALL update the renewal date without resetting usage
4. WHEN network errors occur during plan activation THEN the Payment System SHALL implement exponential backoff retry logic
5. WHEN a user has a pending plan change THEN the Payment System SHALL clear the pending state upon successful activation
