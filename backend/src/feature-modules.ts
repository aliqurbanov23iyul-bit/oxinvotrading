import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { BinanceModule } from './binance/binance.module';
import { TelegramModule } from './telegram/telegram.module';
import { TradingModule } from './trading/trading.module';
import { MarketScannerModule } from './market-scanner/market-scanner.module';
import { AiProvidersModule } from './ai-providers/ai-providers.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SettingsModule } from './settings/settings.module';

export const FeatureModules = [AuthModule, UsersModule, AdminModule, SubscriptionsModule, BinanceModule, TelegramModule, TradingModule, MarketScannerModule, AiProvidersModule, PortfolioModule, AnalyticsModule, NotificationsModule, AuditLogsModule, SettingsModule];
