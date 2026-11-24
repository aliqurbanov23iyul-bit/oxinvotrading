import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { AuthRequest, Roles, publicUserSelect } from '../auth/auth.types';
import { AdminService } from './admin.service';
import { CreateUserDto, SubscriptionDto, UpdateUserDto, UserQueryDto } from './admin.dto';
import { ProviderDto, SystemSettingDto, BroadcastDto } from './config.dto';
import { EncryptionService } from '../common/security/encryption.service';
import { AuthService } from '../auth/auth.service';
@ApiTags('Admin') @ApiCookieAuth() @Roles('SUPER_ADMIN', 'ADMIN')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly admin: AdminService, private readonly db: DatabaseService, private readonly encryption: EncryptionService, private readonly auth: AuthService) {}
  @Get('users') list(@Req() req: AuthRequest, @Query() query: UserQueryDto) { return this.admin.list(req.auth!, query); }
  @Post('users') create(@Req() req: AuthRequest, @Body() dto: CreateUserDto) { return this.admin.create(req.auth!, dto); }
  @Get('users/:id') detail(@Param('id', ParseUUIDPipe) id: string) { return this.admin.detail(id); }
  @Patch('users/:id') update(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) { return this.admin.update(req.auth!, id, dto); }
  @Delete('users/:id') remove(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.admin.update(req.auth!, id, { status: 'DELETED' }); }
  @Post('users/:id/reset-password') reset(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.admin.reset(req.auth!, id); }
  @Post('users/:id/suspend') suspend(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.admin.update(req.auth!, id, { status: 'SUSPENDED' }); }
  @Post('users/:id/activate') activate(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.admin.update(req.auth!, id, { status: 'ACTIVE' }); }
  @Post('users/:id/revoke-sessions') revoke(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string) { return this.admin.revoke(req.auth!, id); }
  @Patch('users/:id/subscription') subscription(@Req() req: AuthRequest, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SubscriptionDto) { return this.admin.subscription(req.auth!, id, dto); }
  @Get('overview') overview() { return this.admin.overview(); }
  @Get('trades') trades(@Query() query: UserQueryDto) { return this.db.system(tx => tx.trade.findMany({ take: query.pageSize, skip: (query.page-1)*query.pageSize, orderBy:{openedAt:'desc'}, include:{user:{select:{username:true}}} })); }
  @Get('analytics') analytics() { return this.db.system(async tx => {
    const users=await tx.user.findMany({where:{role:'USER',status:{not:'DELETED'}},select:publicUserSelect});
    const totals=await tx.trade.groupBy({by:['userId'],_sum:{realizedProfit:true},_count:true});
    return users.map(user=>({...user,realizedPnl:totals.find(row=>row.userId===user.id)?._sum.realizedProfit?.toString()??'0',totalTrades:totals.find(row=>row.userId===user.id)?._count??0}));
  }); }
  @Get('subscription-plans') plans() { return this.db.system(tx => tx.subscriptionPlan.findMany({ where: { isActive: true }, include:{_count:{select:{subscriptions:{where:{status:'ACTIVE',expirationDate:{gt:new Date()},user:{status:{not:'DELETED'}}}}}}}, orderBy: { name: 'asc' } })); }
  @Roles('SUPER_ADMIN') @Get('audit-logs') audit(@Query() query: UserQueryDto) { return this.db.system(async tx => ({ items: await tx.auditLog.findMany({ skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { createdAt: 'desc' }, include: { actor: { select: { username: true } }, target: { select: { username: true } } } }), total: await tx.auditLog.count() })); }
  @Roles('SUPER_ADMIN') @Get('ai-providers') providers() { return this.db.system(tx => tx.aIProvider.findMany({ select: { id: true, providerName: true, modelName: true, isEnabled: true, configuration: true, updatedAt: true } })); }
  @Roles('SUPER_ADMIN') @Post('ai-providers') saveProvider(@Req() req: AuthRequest, @Body() dto: ProviderDto) { return this.db.system(async tx => {
    const data = { isEnabled: dto.isEnabled, configuration: { priority: dto.priority }, ...(dto.apiKey ? { encryptedApiKey: this.encryption.encrypt(dto.apiKey, 'ai:' + dto.providerName + ':' + dto.modelName) } : {}) };
    const row = await tx.aIProvider.upsert({ where: { providerName_modelName: { providerName: dto.providerName, modelName: dto.modelName } }, create: { providerName: dto.providerName, modelName: dto.modelName, ...data }, update: data, select: { id: true, providerName: true, modelName: true, isEnabled: true } });
    await this.auth.audit(tx, 'AI_PROVIDER_UPDATED', req.auth!.user.id, null); return row;
  }); }
  @Roles('SUPER_ADMIN') @Get('settings') settings() { return this.db.system(tx => tx.systemSetting.findMany({ where: { key: { in: ['maintenanceMode','supportContact'] } } })); }
  @Roles('SUPER_ADMIN') @Patch('settings') saveSetting(@Req() req: AuthRequest, @Body() dto: SystemSettingDto) { return this.db.system(async tx => {
    const row = await tx.systemSetting.upsert({ where: { key: dto.key }, create: { key: dto.key, value: dto.value }, update: { value: dto.value } }); await this.auth.audit(tx, 'SYSTEM_SETTING_UPDATED', req.auth!.user.id, null, { key: dto.key }); return row;
  }); }
  @Post('notifications') broadcast(@Req() req: AuthRequest, @Body() dto: BroadcastDto) { return this.db.system(async tx => {
    const users = await tx.user.findMany({ where: { status: { not: 'DELETED' }, ...(req.auth!.user.role === 'ADMIN' ? { role: 'USER' as const } : {}) }, select: { id: true } });
    await tx.notification.createMany({ data: users.map(user => ({ userId: user.id, type: 'SYSTEM', title: dto.title, message: dto.message })) }); return { recipients: users.length };
  }); }
}
