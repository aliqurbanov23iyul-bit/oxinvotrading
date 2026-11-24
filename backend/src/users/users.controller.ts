import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, publicUserSelect } from '../auth/auth.types';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { EncryptionService } from '../common/security/encryption.service';
import { CredentialsDto, ProfileDto, SettingsDto } from './users.dto';
@ApiTags('Current user') @ApiCookieAuth()
@Controller({ path: 'users/me', version: '1' })
export class UsersController {
  constructor(private readonly db: DatabaseService, private readonly auth: AuthService, private readonly encryption: EncryptionService) {}
  @Get() me(@Req() req: AuthRequest) { return req.auth!.user; }
  @Patch() profile(@Req() req: AuthRequest, @Body() dto: ProfileDto) { return this.db.tenant(req.auth!.user.id, async tx => { const user = await tx.user.update({ where: { id: req.auth!.user.id }, data: dto, select: publicUserSelect }); await this.auth.audit(tx, 'USER_UPDATED', user.id, user.id); return user; }); }
  @Get('subscription') subscription(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, async tx => ({subscription:await tx.userSubscription.findFirst({ where: { userId: req.auth!.user.id }, include: { plan: true }, orderBy: { createdAt: 'desc' } })})); }
  @Get('overview') overview(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, async tx => {
    const userId = req.auth!.user.id;
    const snapshot = await tx.portfolioSnapshot.findFirst({ where: { userId, tradingMode: 'PAPER' }, orderBy: { recordedAt: 'desc' } });
    const totals = await tx.trade.aggregate({ where: { userId }, _sum: { realizedProfit: true }, _count: true });
    const activeTrades = await tx.trade.count({ where: { userId, status: 'OPEN' } });
    const subscription = await this.auth.activeSubscription(tx, userId);
    return { totalBalance: snapshot?.totalBalance.toString() ?? '0', totalProfit: totals._sum.realizedProfit?.toString() ?? '0', totalTrades: totals._count, activeTrades,
      tradingMode: 'PAPER', tradingAvailable: false, subscriptionActive: Boolean(subscription), binanceIntegrated: false, telegramIntegrated: false, botStatus: 'STOPPED' };
  }); }
  @Get('trades') trades(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.trade.findMany({ where: { userId: req.auth!.user.id }, take: 100, orderBy: { openedAt: 'desc' } })); }
  @Get('trades/:id') trade(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.db.tenant(req.auth!.user.id, async tx => { const row = await tx.trade.findFirst({ where: { id, userId: req.auth!.user.id } }); if (!row) throw new NotFoundException(); return row; }); }
  @Get('orders') orders(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.order.findMany({ where: { userId: req.auth!.user.id }, take: 100 })); }
  @Get('bots') bots(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.tradingBot.findMany({ where: { userId: req.auth!.user.id } })); }
  @Get('portfolio') portfolio(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.portfolioSnapshot.findMany({ where: { userId: req.auth!.user.id, tradingMode: 'PAPER' }, take: 100, orderBy: { recordedAt: 'asc' } })); }
  @Get('ai-decisions') decisions(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.aIDecision.findMany({ where: { userId: req.auth!.user.id }, take: 100 })); }
  @Get('notifications') notifications(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.notification.findMany({ where: { userId: req.auth!.user.id }, take: 100, orderBy: { createdAt: 'desc' } })); }
  @Patch('notifications/:id/read') read(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.db.tenant(req.auth!.user.id, async tx => { const result = await tx.notification.updateMany({ where: { id, userId: req.auth!.user.id }, data: { isRead: true } }); if (!result.count) throw new NotFoundException(); return { ok: true }; }); }
  @Get('binance') binance(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, async tx => ({ connection: await tx.binanceConnection.findUnique({ where: { userId: req.auth!.user.id }, select: { id: true, connectionStatus: true, lastSyncAt: true } }), integrated: false })); }
  @Patch('binance') saveBinance(@Req() req: AuthRequest, @Body() dto: CredentialsDto) { return this.db.tenant(req.auth!.user.id, async tx => {
    const userId = req.auth!.user.id;
    const data = { encryptedApiKey: this.encryption.encrypt(dto.apiKey, userId + ':binance:key'), encryptedApiSecret: this.encryption.encrypt(dto.apiSecret, userId + ':binance:secret'), connectionStatus: 'DISCONNECTED' as const };
    await tx.binanceConnection.upsert({ where: { userId }, create: { userId, ...data }, update: data }); return { saved: true, connected: false, integrated: false };
  }); }
  @Get('telegram') telegram(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, async tx => ({ connection: await tx.telegramConnection.findUnique({ where: { userId: req.auth!.user.id }, select: { id: true, telegramUsername: true, connectionStatus: true } }), integrated: false })); }
  @Get('settings') settings(@Req() req: AuthRequest) { return this.db.tenant(req.auth!.user.id, tx => tx.userSetting.findMany({ where: { userId: req.auth!.user.id }, select: { key: true, value: true } })); }
  @Patch('settings') saveSettings(@Req() req: AuthRequest, @Body() dto: SettingsDto) { return this.db.tenant(req.auth!.user.id, async tx => { for (const [key, value] of Object.entries(dto)) if (value !== undefined) await tx.userSetting.upsert({ where: { userId_key: { userId: req.auth!.user.id, key } }, create: { userId: req.auth!.user.id, key, value }, update: { value } }); return { ok: true }; }); }
}
