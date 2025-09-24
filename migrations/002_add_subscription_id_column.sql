-- -------------------------------------------------------
-- Migration: [Subscriptions table updation]
-- Date: 2025-09-16
-- -------------------------------------------------------

ALTER TABLE subscriptions
ADD COLUMN stripe_subscription_id VARCHAR(191) NULL AFTER user_id;