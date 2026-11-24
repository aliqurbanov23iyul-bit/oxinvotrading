-- PostgreSQL-only invariants not represented by Prisma's schema language.
-- No data deletion, reset, seeded accounts or real trading activation.
BEGIN;

ALTER TABLE "User" ADD CONSTRAINT "User_username_canonical"
  CHECK ("username" = lower("username") AND "username" ~ '^[a-z0-9][a-z0-9._-]{2,63}$');
ALTER TABLE "User" ADD CONSTRAINT "User_password_argon2id"
  CHECK ("passwordHash" LIKE '$argon2id$%');
ALTER TABLE "User" ADD CONSTRAINT "User_soft_delete_consistent"
  CHECK (("status" = 'DELETED') = ("deletedAt" IS NOT NULL));
ALTER TABLE "Session" ADD CONSTRAINT "Session_expiry_valid" CHECK ("expiresAt" > "createdAt");
ALTER TABLE "SubscriptionPlan" ADD CONSTRAINT "SubscriptionPlan_values_valid"
  CHECK ("durationDays" > 0 AND "price" >= 0);
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_dates_valid"
  CHECK ("expirationDate" > "startDate");
CREATE UNIQUE INDEX "UserSubscription_one_active_per_user" ON "UserSubscription" ("userId") WHERE "status" = 'ACTIVE';
ALTER TABLE "TelegramConnectionToken" ADD CONSTRAINT "TelegramConnectionToken_expiry_valid"
  CHECK ("expiresAt" > "createdAt" AND ("usedAt" IS NULL OR "usedAt" >= "createdAt"));

-- Deliberate Stage 2 hard lock. Future LIVE activation requires a separate,
-- explicitly reviewed migration in addition to execution/risk/auth controls.
ALTER TABLE "TradingBot" ADD CONSTRAINT "TradingBot_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "Order" ADD CONSTRAINT "Order_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "OrderFill" ADD CONSTRAINT "OrderFill_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "AIDecision" ADD CONSTRAINT "AIDecision_paper_only" CHECK ("tradingMode" = 'PAPER');
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_paper_only" CHECK ("tradingMode" = 'PAPER');

ALTER TABLE "Trade" ADD CONSTRAINT "Trade_values_valid"
  CHECK ("quantity" > 0 AND "entryPrice" > 0 AND ("exitPrice" IS NULL OR "exitPrice" > 0) AND "fees" >= 0);
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_close_consistent"
  CHECK (("closedAt" IS NULL OR "closedAt" >= "openedAt") AND ("status" <> 'CLOSED' OR ("closedAt" IS NOT NULL AND "exitPrice" IS NOT NULL)));
ALTER TABLE "Order" ADD CONSTRAINT "Order_values_valid"
  CHECK ("quantity" > 0 AND ("price" IS NULL OR "price" > 0) AND "filledQuantity" >= 0 AND "filledQuantity" <= "quantity");
ALTER TABLE "OrderFill" ADD CONSTRAINT "OrderFill_values_valid"
  CHECK ("quantity" > 0 AND "price" > 0 AND "commission" >= 0);
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_balances_valid"
  CHECK ("totalBalance" >= 0 AND "availableBalance" >= 0 AND "availableBalance" <= "totalBalance");
ALTER TABLE "MarketSignal" ADD CONSTRAINT "MarketSignal_scores_valid"
  CHECK ("price" > 0 AND "momentumScore" BETWEEN 0 AND 100 AND "opportunityScore" BETWEEN 0 AND 100 AND "sentimentScore" BETWEEN -100 AND 100);
ALTER TABLE "AIDecision" ADD CONSTRAINT "AIDecision_confidence_valid" CHECK ("confidenceScore" BETWEEN 0 AND 100);

COMMIT;
