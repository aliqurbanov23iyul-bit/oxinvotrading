BEGIN;
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "rememberMe" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginThrottle" (
    "key" CHAR(64) NOT NULL,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedUntil" TIMESTAMPTZ(3),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LoginThrottle_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key_key" ON "UserSetting"("userId", "key");

-- CreateIndex
CREATE INDEX "LoginThrottle_updatedAt_idx" ON "LoginThrottle"("updatedAt");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Transaction-local RLS on pooled connections.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
CREATE POLICY "User_tenant_scope" ON "User" USING (current_setting('oxinvo.admin',true)='true' OR "id"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "id"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" FORCE ROW LEVEL SECURITY;
CREATE POLICY "Session_tenant_scope" ON "Session" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "UserSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSubscription" FORCE ROW LEVEL SECURITY;
CREATE POLICY "UserSubscription_tenant_scope" ON "UserSubscription" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "BinanceConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BinanceConnection" FORCE ROW LEVEL SECURITY;
CREATE POLICY "BinanceConnection_tenant_scope" ON "BinanceConnection" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "TelegramConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TelegramConnection" FORCE ROW LEVEL SECURITY;
CREATE POLICY "TelegramConnection_tenant_scope" ON "TelegramConnection" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "TelegramConnectionToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TelegramConnectionToken" FORCE ROW LEVEL SECURITY;
CREATE POLICY "TelegramConnectionToken_tenant_scope" ON "TelegramConnectionToken" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "TradingBot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TradingBot" FORCE ROW LEVEL SECURITY;
CREATE POLICY "TradingBot_tenant_scope" ON "TradingBot" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "Trade" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trade" FORCE ROW LEVEL SECURITY;
CREATE POLICY "Trade_tenant_scope" ON "Trade" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" FORCE ROW LEVEL SECURITY;
CREATE POLICY "Order_tenant_scope" ON "Order" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "OrderFill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderFill" FORCE ROW LEVEL SECURITY;
CREATE POLICY "OrderFill_tenant_scope" ON "OrderFill" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "PortfolioSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortfolioSnapshot" FORCE ROW LEVEL SECURITY;
CREATE POLICY "PortfolioSnapshot_tenant_scope" ON "PortfolioSnapshot" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "AIDecision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AIDecision" FORCE ROW LEVEL SECURITY;
CREATE POLICY "AIDecision_tenant_scope" ON "AIDecision" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" FORCE ROW LEVEL SECURITY;
CREATE POLICY "Notification_tenant_scope" ON "Notification" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "NotificationPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationPreference" FORCE ROW LEVEL SECURITY;
CREATE POLICY "NotificationPreference_tenant_scope" ON "NotificationPreference" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
ALTER TABLE "UserSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSetting" FORCE ROW LEVEL SECURITY;
CREATE POLICY "UserSetting_tenant_scope" ON "UserSetting" USING (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true)) WITH CHECK (current_setting('oxinvo.admin',true)='true' OR "userId"::text=current_setting('oxinvo.user_id',true));
CREATE OR REPLACE FUNCTION oxinvo_protect_last_super_admin() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF OLD.role = 'SUPER_ADMIN' AND OLD.status = 'ACTIVE' AND (TG_OP = 'DELETE' OR NEW.role <> 'SUPER_ADMIN' OR NEW.status <> 'ACTIVE') THEN
  PERFORM pg_advisory_xact_lock(hashtext('oxinvo.user-management'));
  IF NOT EXISTS (SELECT 1 FROM "User" WHERE role='SUPER_ADMIN' AND status='ACTIVE' AND id<>OLD.id) THEN
   RAISE EXCEPTION 'LAST_ACTIVE_SUPER_ADMIN' USING ERRCODE='23514';
  END IF;
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER "User_protect_last_super_admin" BEFORE UPDATE OR DELETE ON "User" FOR EACH ROW EXECUTE FUNCTION oxinvo_protect_last_super_admin();
COMMIT;
