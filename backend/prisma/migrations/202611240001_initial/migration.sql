BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPIRED', 'DELETED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('AZ', 'EN', 'TR', 'RU');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('DISCONNECTED', 'PENDING', 'CONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "BotStatus" AS ENUM ('STOPPED', 'RUNNING', 'PAUSED', 'ERROR');

-- CreateEnum
CREATE TYPE "TradingMode" AS ENUM ('PAPER', 'LIVE');

-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUBMITTED', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('BUY', 'WAIT', 'SELL');

-- CreateEnum
CREATE TYPE "ProviderName" AS ENUM ('OPENAI', 'GEMINI', 'GROK', 'LOCAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BUY_EXECUTED', 'SELL_EXECUTED', 'PROFIT', 'LOSS', 'BALANCE_UPDATE', 'AI_OPPORTUNITY', 'BOT_STARTED', 'BOT_STOPPED', 'CONNECTION_ERROR', 'DAILY_SUMMARY', 'SECURITY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(160) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "preferredLanguage" "Language" NOT NULL DEFAULT 'AZ',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "deletedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "lastLoginAt" TIMESTAMPTZ(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionTokenHash" CHAR(64) NOT NULL,
    "ipAddress" INET,
    "userAgent" VARCHAR(512),
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "features" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "startDate" TIMESTAMPTZ(3) NOT NULL,
    "expirationDate" TIMESTAMPTZ(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BinanceConnection" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "encryptedApiKey" TEXT NOT NULL,
    "encryptedApiSecret" TEXT NOT NULL,
    "connectionStatus" "ConnectionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "lastSyncAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BinanceConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramConnection" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "telegramChatId" BIGINT,
    "telegramUsername" VARCHAR(64),
    "connectionStatus" "ConnectionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "connectedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TelegramConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramConnectionToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramConnectionToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradingBot" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "status" "BotStatus" NOT NULL DEFAULT 'STOPPED',
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "strategy" VARCHAR(120),
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "lastActivityAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TradingBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "botId" UUID NOT NULL,
    "symbol" VARCHAR(32) NOT NULL,
    "side" "OrderSide" NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'OPEN',
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "quantity" DECIMAL(38,18) NOT NULL,
    "entryPrice" DECIMAL(38,18) NOT NULL,
    "exitPrice" DECIMAL(38,18),
    "fees" DECIMAL(38,18) NOT NULL DEFAULT 0,
    "realizedProfit" DECIMAL(38,18) NOT NULL DEFAULT 0,
    "realizedProfitPercentage" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "entryReason" TEXT,
    "exitReason" TEXT,
    "openedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "botId" UUID NOT NULL,
    "tradeId" UUID,
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "clientOrderId" VARCHAR(36) NOT NULL,
    "exchangeOrderId" VARCHAR(64),
    "symbol" VARCHAR(32) NOT NULL,
    "side" "OrderSide" NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "quantity" DECIMAL(38,18) NOT NULL,
    "price" DECIMAL(38,18),
    "filledQuantity" DECIMAL(38,18) NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFill" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "symbol" VARCHAR(32) NOT NULL,
    "exchangeTradeId" VARCHAR(64),
    "quantity" DECIMAL(38,18) NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "commission" DECIMAL(38,18) NOT NULL DEFAULT 0,
    "commissionAsset" VARCHAR(16) NOT NULL,
    "executedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "OrderFill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "valuationCurrency" VARCHAR(16) NOT NULL DEFAULT 'USDT',
    "totalBalance" DECIMAL(38,18) NOT NULL,
    "availableBalance" DECIMAL(38,18) NOT NULL,
    "realizedProfit" DECIMAL(38,18) NOT NULL,
    "unrealizedProfit" DECIMAL(38,18) NOT NULL,
    "recordedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSignal" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(32) NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "volumeChange" DECIMAL(18,8) NOT NULL,
    "momentumScore" DECIMAL(8,4) NOT NULL,
    "sentimentScore" DECIMAL(8,4) NOT NULL,
    "opportunityScore" DECIMAL(8,4) NOT NULL,
    "signalType" "SignalType" NOT NULL,
    "analysis" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIDecision" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "botId" UUID NOT NULL,
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "symbol" VARCHAR(32) NOT NULL,
    "provider" "ProviderName" NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "decision" "SignalType" NOT NULL,
    "confidenceScore" DECIMAL(8,4) NOT NULL,
    "reasoning" TEXT NOT NULL,
    "marketData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIProvider" (
    "id" UUID NOT NULL,
    "providerName" "ProviderName" NOT NULL,
    "modelName" VARCHAR(120) NOT NULL,
    "encryptedApiKey" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AIProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "telegramEnabled" BOOLEAN NOT NULL DEFAULT false,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "targetUserId" UUID,
    "action" VARCHAR(120) NOT NULL,
    "resource" VARCHAR(120) NOT NULL,
    "resourceId" VARCHAR(120),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ipAddress" INET,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" UUID NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tradingMode" "TradingMode" NOT NULL DEFAULT 'PAPER',
    "scope" VARCHAR(80) NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "requestHash" CHAR(64) NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'PENDING',
    "resourceId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_status_createdAt_idx" ON "User"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionTokenHash_key" ON "Session"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_revokedAt_expiresAt_idx" ON "Session"("userId", "revokedAt", "expiresAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_status_expirationDate_idx" ON "UserSubscription"("userId", "status", "expirationDate");

-- CreateIndex
CREATE INDEX "UserSubscription_planId_idx" ON "UserSubscription"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "BinanceConnection_userId_key" ON "BinanceConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramConnection_userId_key" ON "TelegramConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramConnection_telegramChatId_key" ON "TelegramConnection"("telegramChatId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramConnectionToken_tokenHash_key" ON "TelegramConnectionToken"("tokenHash");

-- CreateIndex
CREATE INDEX "TelegramConnectionToken_userId_usedAt_expiresAt_idx" ON "TelegramConnectionToken"("userId", "usedAt", "expiresAt");

-- CreateIndex
CREATE INDEX "TelegramConnectionToken_expiresAt_idx" ON "TelegramConnectionToken"("expiresAt");

-- CreateIndex
CREATE INDEX "TradingBot_userId_tradingMode_status_idx" ON "TradingBot"("userId", "tradingMode", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TradingBot_id_userId_tradingMode_key" ON "TradingBot"("id", "userId", "tradingMode");

-- CreateIndex
CREATE INDEX "Trade_userId_tradingMode_status_openedAt_idx" ON "Trade"("userId", "tradingMode", "status", "openedAt");

-- CreateIndex
CREATE INDEX "Trade_botId_userId_tradingMode_idx" ON "Trade"("botId", "userId", "tradingMode");

-- CreateIndex
CREATE INDEX "Trade_symbol_openedAt_idx" ON "Trade"("symbol", "openedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_id_userId_botId_tradingMode_symbol_key" ON "Trade"("id", "userId", "botId", "tradingMode", "symbol");

-- CreateIndex
CREATE INDEX "Order_userId_tradingMode_status_createdAt_idx" ON "Order"("userId", "tradingMode", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_botId_userId_tradingMode_idx" ON "Order"("botId", "userId", "tradingMode");

-- CreateIndex
CREATE INDEX "Order_tradeId_userId_botId_tradingMode_idx" ON "Order"("tradeId", "userId", "botId", "tradingMode");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_userId_tradingMode_symbol_key" ON "Order"("id", "userId", "tradingMode", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_tradingMode_clientOrderId_key" ON "Order"("userId", "tradingMode", "clientOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_tradingMode_symbol_exchangeOrderId_key" ON "Order"("userId", "tradingMode", "symbol", "exchangeOrderId");

-- CreateIndex
CREATE INDEX "OrderFill_orderId_userId_tradingMode_symbol_idx" ON "OrderFill"("orderId", "userId", "tradingMode", "symbol");

-- CreateIndex
CREATE INDEX "OrderFill_userId_tradingMode_executedAt_idx" ON "OrderFill"("userId", "tradingMode", "executedAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrderFill_userId_tradingMode_symbol_exchangeTradeId_key" ON "OrderFill"("userId", "tradingMode", "symbol", "exchangeTradeId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSnapshot_userId_tradingMode_valuationCurrency_reco_key" ON "PortfolioSnapshot"("userId", "tradingMode", "valuationCurrency", "recordedAt");

-- CreateIndex
CREATE INDEX "MarketSignal_symbol_createdAt_idx" ON "MarketSignal"("symbol", "createdAt");

-- CreateIndex
CREATE INDEX "MarketSignal_signalType_createdAt_idx" ON "MarketSignal"("signalType", "createdAt");

-- CreateIndex
CREATE INDEX "AIDecision_userId_tradingMode_createdAt_idx" ON "AIDecision"("userId", "tradingMode", "createdAt");

-- CreateIndex
CREATE INDEX "AIDecision_botId_userId_tradingMode_idx" ON "AIDecision"("botId", "userId", "tradingMode");

-- CreateIndex
CREATE UNIQUE INDEX "AIProvider_providerName_modelName_key" ON "AIProvider"("providerName", "modelName");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_notificationType_key" ON "NotificationPreference"("userId", "notificationType");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_targetUserId_createdAt_idx" ON "AuditLog"("targetUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_resource_resourceId_createdAt_idx" ON "AuditLog"("resource", "resourceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_status_createdAt_idx" ON "IdempotencyRecord"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_userId_tradingMode_scope_key_key" ON "IdempotencyRecord"("userId", "tradingMode", "scope", "key");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BinanceConnection" ADD CONSTRAINT "BinanceConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramConnection" ADD CONSTRAINT "TelegramConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramConnectionToken" ADD CONSTRAINT "TelegramConnectionToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradingBot" ADD CONSTRAINT "TradingBot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_botId_userId_tradingMode_fkey" FOREIGN KEY ("botId", "userId", "tradingMode") REFERENCES "TradingBot"("id", "userId", "tradingMode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_botId_userId_tradingMode_fkey" FOREIGN KEY ("botId", "userId", "tradingMode") REFERENCES "TradingBot"("id", "userId", "tradingMode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tradeId_userId_botId_tradingMode_symbol_fkey" FOREIGN KEY ("tradeId", "userId", "botId", "tradingMode", "symbol") REFERENCES "Trade"("id", "userId", "botId", "tradingMode", "symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFill" ADD CONSTRAINT "OrderFill_orderId_userId_tradingMode_symbol_fkey" FOREIGN KEY ("orderId", "userId", "tradingMode", "symbol") REFERENCES "Order"("id", "userId", "tradingMode", "symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIDecision" ADD CONSTRAINT "AIDecision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIDecision" ADD CONSTRAINT "AIDecision_botId_userId_tradingMode_fkey" FOREIGN KEY ("botId", "userId", "tradingMode") REFERENCES "TradingBot"("id", "userId", "tradingMode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
