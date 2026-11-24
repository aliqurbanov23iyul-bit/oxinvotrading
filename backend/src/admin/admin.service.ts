import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';
import { AuthContext, publicUserSelect } from '../auth/auth.types';
import { PasswordService } from '../common/security/password.service';
import { generatePassword } from '../auth/credentials';
import { Prisma } from '../generated/prisma/client';
import { CreateUserDto, SubscriptionDto, UpdateUserDto, UserQueryDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService, private readonly auth: AuthService, private readonly passwords: PasswordService) {}
  private async manage(tx: Prisma.TransactionClient, actor: AuthContext, targetId?: string, requestedRole?: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('oxinvo.user-management'))`;
    const caller = await tx.user.findUnique({ where: { id: actor.user.id } });
    if (!caller || caller.status !== 'ACTIVE' || !['ADMIN', 'SUPER_ADMIN'].includes(caller.role)) throw new ForbiddenException();
    const target = targetId ? await tx.user.findUnique({ where: { id: targetId } }) : null;
    if (targetId && (!target || target.status === 'DELETED')) throw new NotFoundException();
    if (caller.role === 'ADMIN' && ((target && target.role !== 'USER') || (requestedRole && requestedRole !== 'USER'))) throw new ForbiddenException();
    return target;
  }
  private async protectLast(tx: Prisma.TransactionClient, target: { id: string; role: string; status: string }, role: string, status: string) {
    if (target.role === 'SUPER_ADMIN' && target.status === 'ACTIVE' && (role !== 'SUPER_ADMIN' || status !== 'ACTIVE')) {
      if (await tx.user.count({ where: { role: 'SUPER_ADMIN', status: 'ACTIVE', id: { not: target.id } } }) === 0) throw new ConflictException();
    }
  }
  async account(tx: Prisma.TransactionClient, id: string) {
    const user = await tx.user.findUnique({ where: { id }, select: publicUserSelect });
    if (!user) throw new NotFoundException();
    const subscription = await tx.userSubscription.findFirst({ where: { userId: id }, include: { plan: true }, orderBy: { createdAt: 'desc' } });
    const totals = await tx.trade.aggregate({ where: { userId: id }, _sum: { realizedProfit: true }, _count: true });
    const wins = await tx.trade.count({ where: { userId: id, realizedProfit: { gt: 0 } } });
    const snapshot = await tx.portfolioSnapshot.findFirst({ where: { userId: id, tradingMode: 'PAPER' }, orderBy: { recordedAt: 'desc' } });
    const bot = await tx.tradingBot.findFirst({ where: { userId: id } });
    const binance = await tx.binanceConnection.findUnique({ where: { userId: id }, select: { connectionStatus: true } });
    const telegram = await tx.telegramConnection.findUnique({ where: { userId: id }, select: { connectionStatus: true } });
    return { ...user, subscription, portfolioBalance: snapshot?.totalBalance.toString() ?? '0', realizedPnl: totals._sum.realizedProfit?.toString() ?? '0', totalTrades: totals._count, winRate: totals._count ? wins / totals._count * 100 : 0, botStatus: bot?.status ?? 'STOPPED', binanceConnected: binance?.connectionStatus === 'CONNECTED', telegramConnected: telegram?.connectionStatus === 'CONNECTED' };
  }
  list(actor: AuthContext, query: UserQueryDto) {
    return this.db.system(async tx => {
      const where: Prisma.UserWhereInput = { ...(query.status ? { status: query.status } : { status: { not: 'DELETED' } }),
        ...(query.search ? { username: { contains: query.search.toLowerCase() } } : {}),
        ...(query.plan ? { subscriptions: { some: { plan: { name: query.plan }, status: 'ACTIVE' } } } : {}) };
      // Admin may view management summaries, but mutation rules remain stricter.
      const total = await tx.user.count({ where });
      const rows = await tx.user.findMany({ where, select: publicUserSelect, skip: (query.page-1)*query.pageSize, take:query.pageSize, orderBy:[{createdAt:'desc'},{id:'asc'}] });
      const ids=rows.map(row=>row.id), scope={userId:{in:ids}};
      const subscriptions=await tx.userSubscription.findMany({where:scope,include:{plan:true},orderBy:{createdAt:'desc'}});
      const snapshots=await tx.portfolioSnapshot.findMany({where:{...scope,tradingMode:'PAPER'},distinct:['userId'],orderBy:{recordedAt:'desc'},select:{userId:true,totalBalance:true}});
      const bots=await tx.tradingBot.findMany({where:scope,distinct:['userId'],select:{userId:true,status:true}});
      const binance=await tx.binanceConnection.findMany({where:scope,select:{userId:true,connectionStatus:true}});
      const telegram=await tx.telegramConnection.findMany({where:scope,select:{userId:true,connectionStatus:true}});
      const totals=await tx.trade.groupBy({by:['userId'],where:scope,_sum:{realizedProfit:true},_count:true});
      const wins=await tx.trade.groupBy({by:['userId'],where:{...scope,realizedProfit:{gt:0}},_count:true});
      const items=rows.map(user=>{
        const total=totals.find(row=>row.userId===user.id),won=wins.find(row=>row.userId===user.id);
        return {...user,subscription:subscriptions.find(row=>row.userId===user.id)??null,portfolioBalance:snapshots.find(row=>row.userId===user.id)?.totalBalance.toString()??'0',realizedPnl:total?._sum.realizedProfit?.toString()??'0',totalTrades:total?._count??0,winRate:total?._count?(won?._count??0)/total._count*100:0,botStatus:bots.find(row=>row.userId===user.id)?.status??'STOPPED',binanceConnected:binance.find(row=>row.userId===user.id)?.connectionStatus==='CONNECTED',telegramConnected:telegram.find(row=>row.userId===user.id)?.connectionStatus==='CONNECTED'};
      });
      return { items, total, page: query.page, pageSize: query.pageSize };
    });
  }
  detail(id: string) { return this.db.system(async tx => ({ ...await this.account(tx, id), trades: await tx.trade.findMany({ where: { userId: id }, take: 100, orderBy: { openedAt: 'desc' } }) })); }
  async create(actor: AuthContext, dto: CreateUserDto) {
    const password = generatePassword(); const passwordHash = await this.passwords.hash(password);
    const result = await this.db.system(async tx => {
      await this.manage(tx, actor, undefined, dto.role);
      if (dto.status === 'DELETED') throw new BadRequestException();
      const plan = await tx.subscriptionPlan.findUnique({ where: { id: dto.planId } }); if (!plan?.isActive) throw new BadRequestException();
      if (await tx.user.findUnique({ where: { username: dto.username } })) throw new ConflictException();
      const user = await tx.user.create({ data: { username: dto.username, fullName: dto.fullName?.trim() || dto.username, preferredLanguage: dto.preferredLanguage, passwordHash, role: dto.role, status: dto.status, notes: dto.notes, mustChangePassword: true }, select: publicUserSelect });
      const subscription = await tx.userSubscription.create({ data: { userId: user.id, planId: plan.id, startDate: new Date(), expirationDate: new Date(Date.now() + dto.durationDays * 86400000) } });
      await this.auth.audit(tx, 'USER_CREATED', actor.user.id, user.id, { role: user.role }); return { user, subscription };
    });
    return { ...result, generatedPassword: password, loginUrl: 'https://oxinvo.com' };
  }
  update(actor: AuthContext, id: string, dto: UpdateUserDto) {
    return this.db.system(async tx => {
      const target = (await this.manage(tx, actor, id, dto.role))!;
      const role = dto.role ?? target.role, status = dto.status ?? target.status;
      await this.protectLast(tx, target, role, status);
      const user = await tx.user.update({ where: { id }, data: { ...dto, ...(status === 'DELETED' ? { deletedAt: new Date() } : {}) }, select: publicUserSelect });
      if (status !== 'ACTIVE' || role !== target.role) await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      await this.auth.audit(tx, role !== target.role ? 'ROLE_CHANGED' : status === 'DELETED' ? 'USER_DELETED' : status === 'SUSPENDED' ? 'USER_SUSPENDED' : target.status !== status && status === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_UPDATED', actor.user.id, id, { role, status });
      return user;
    });
  }
  reset(actor: AuthContext, id: string) {
    return this.db.system(async tx => {
      await this.manage(tx, actor, id);
      const generatedPassword = generatePassword();
      await tx.user.update({ where: { id }, data: { passwordHash: await this.passwords.hash(generatedPassword), mustChangePassword: true } });
      await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      await this.auth.audit(tx, 'PASSWORD_RESET', actor.user.id, id); return { generatedPassword };
    });
  }
  revoke(actor: AuthContext, id: string) { return this.db.system(async tx => { await this.manage(tx, actor, id); await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }); await this.auth.audit(tx, 'SESSION_REVOKED', actor.user.id, id); return { ok: true }; }); }
  subscription(actor: AuthContext, id: string, dto: SubscriptionDto) {
    return this.db.system(async tx => {
      await this.manage(tx, actor, id);
      const existing = await tx.userSubscription.findFirst({ where: { userId: id }, orderBy: { createdAt: 'desc' } });
      if (!existing || (!dto.expirationDate && !dto.extendDays && !dto.planId)) throw new BadRequestException();
      if (dto.planId && !await tx.subscriptionPlan.findFirst({ where: { id: dto.planId, isActive: true } })) throw new BadRequestException();
      const expirationDate = dto.expirationDate ? new Date(dto.expirationDate) : dto.extendDays ? new Date(Math.max(Date.now(), existing.expirationDate.getTime()) + dto.extendDays * 86400000) : existing.expirationDate;
      if (expirationDate <= existing.startDate) throw new BadRequestException();
      await tx.userSubscription.updateMany({ where: { userId: id, status: 'ACTIVE', id: { not: existing.id } }, data: { status: 'CANCELLED' } });
      const updated = await tx.userSubscription.update({ where: { id: existing.id }, data: { planId: dto.planId, expirationDate, status: expirationDate > new Date() ? 'ACTIVE' : 'EXPIRED' } });
      if (expirationDate <= new Date()) await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      await this.auth.audit(tx, 'SUBSCRIPTION_CHANGED', actor.user.id, id, { expirationDate: expirationDate.toISOString() }); return updated;
    });
  }
  overview() { return this.db.system(async tx => ({ totalUsers: await tx.user.count({ where: { status: { not: 'DELETED' } } }), activeAccounts: await tx.user.count({ where: { status: 'ACTIVE' } }), runningBots: await tx.tradingBot.count({ where: { status: 'RUNNING' } }), activeTrades: await tx.trade.count({ where: { status: 'OPEN' } }) })); }
}
