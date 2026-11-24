import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Request, Response } from 'express';
import { DatabaseService } from '../database/database.service';
import { PasswordService } from '../common/security/password.service';
import { Prisma } from '../generated/prisma/client';
import { AuthContext, publicUserSelect } from './auth.types';
import { LoginDto, ChangePasswordDto } from './auth.dto';

@Injectable()
export class AuthService {
  readonly sessionCookie: string;
  readonly csrfCookie: string;
  private readonly secure: boolean;
  private readonly secret: string;
  private readonly dummyHash: Promise<string>;
  constructor(private readonly db: DatabaseService, private readonly passwords: PasswordService, private readonly config: ConfigService) {
    this.secure = config.get('NODE_ENV') === 'production';
    this.sessionCookie = this.secure ? '__Host-oxinvo_session' : 'oxinvo_session';
    this.csrfCookie = this.secure ? '__Host-oxinvo_csrf' : 'oxinvo_csrf';
    this.secret = config.getOrThrow<string>('SESSION_SECRET');
    this.dummyHash = passwords.hash(randomBytes(32).toString('base64url'));
  }
  hash(value: string) { return createHmac('sha256', this.secret).update(value).digest('hex'); }
  cookie(req: Request, name: string): string | undefined {
    const matches = (req.headers.cookie ?? '').split(';').map(part => part.trim()).filter(part => part.startsWith(name + '='));
    if (matches.length !== 1) return undefined;
    try { return decodeURIComponent(matches[0]!.slice(name.length + 1)); } catch { return undefined; }
  }
  private equal(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
  private options() { return { httpOnly: true, secure: this.secure, sameSite: 'lax' as const, path: '/' }; }
  csrf(req: Request, res: Response, sessionToken = this.cookie(req, this.sessionCookie) ?? '') {
    const existing = this.cookie(req, this.csrfCookie);
    if (existing) {
      const parts = existing.split('.'), timestamp = Number(parts[1]);
      if (parts.length === 3 && timestamp <= Date.now() && Date.now() - timestamp < 7200000 && this.equal(parts[2]!, this.hash('csrf:' + parts.slice(0,2).join('.') + ':' + sessionToken))) return existing;
    }
    const payload = randomBytes(32).toString('base64url') + '.' + Date.now();
    const token = payload + '.' + this.hash('csrf:' + payload + ':' + sessionToken);
    res.cookie(this.csrfCookie, token, { ...this.options(), maxAge: 7200000 });
    return token;
  }
  verifyCsrf(req: Request) {
    if (req.get('Origin') !== this.config.get<string>('FRONTEND_URL') || req.get('Sec-Fetch-Site') === 'cross-site') throw new ForbiddenException();
    const token = req.get('X-CSRF-Token') ?? '', cookie = this.cookie(req, this.csrfCookie) ?? '';
    const parts = token.split('.'); const timestamp = Number(parts[1]);
    if (!token || token.length > 200 || !this.equal(token, cookie) || parts.length !== 3 || !Number.isFinite(timestamp) || timestamp > Date.now() + 30000 || Date.now() - timestamp > 7200000 || !this.equal(parts[2]!, this.hash('csrf:' + parts.slice(0, 2).join('.') + ':' + (this.cookie(req, this.sessionCookie) ?? '')))) throw new ForbiddenException();
  }
  async audit(tx: Prisma.TransactionClient, action: string, actorUserId: string | null, targetUserId: string | null, metadata: Prisma.InputJsonObject = {}, ipAddress?: string) {
    await tx.auditLog.create({ data: { action, actorUserId, targetUserId, resource: 'account', resourceId: targetUserId, metadata, ipAddress } });
  }
  async activeSubscription(tx: Prisma.TransactionClient, userId: string) {
    return tx.userSubscription.findFirst({ where: { userId, status: 'ACTIVE', startDate: { lte: new Date() }, expirationDate: { gt: new Date() } }, include: { plan: true }, orderBy: { expirationDate: 'desc' } });
  }
  async authenticate(req: Request): Promise<AuthContext | null> {
    const token = this.cookie(req, this.sessionCookie);
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    return this.db.system(async tx => {
      const session = await tx.session.findUnique({ where: { sessionTokenHash: this.hash(token) }, include: { user: { select: publicUserSelect } } });
      if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
      if (session.user.status !== 'ACTIVE' || (session.user.role === 'USER' && !await this.activeSubscription(tx, session.userId))) {
        await tx.session.updateMany({ where: { userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } }); return null;
      }
      return { user: session.user, sessionId: session.id, expiresAt: session.expiresAt, rememberMe: session.rememberMe };
    });
  }
  private async newSession(tx: Prisma.TransactionClient, userId: string, req: Request, rememberMe: boolean, expiresAt?: Date) {
    const token = randomBytes(32).toString('base64url');
    const session = await tx.session.create({ data: { userId, rememberMe, sessionTokenHash: this.hash(token), ipAddress: req.ip, userAgent: req.get('User-Agent')?.slice(0, 512), expiresAt: expiresAt ?? new Date(Date.now() + (rememberMe ? 30 * 86400000 : 8 * 3600000)) } });
    return { token, session };
  }
  async login(dto: LoginDto, req: Request, res: Response) {
    const username = dto.username.toLowerCase(); const key = this.hash('login:' + username);
    // Account lock is database-backed and serialized across processes. The hash
    // comparison and audit are included so parallel attempts cannot bypass it.
    const result = await this.db.system(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
      const throttle = await tx.loginThrottle.findUnique({ where: { key } });
      if (throttle?.lockedUntil && throttle.lockedUntil > new Date()) {
        await this.audit(tx, 'LOGIN_FAILURE', null, null, { reason: 'rate_limited' }, req.ip); return { limited: true } as const;
      }
      // Serialize password verification/session creation with admin account updates.
      await tx.$queryRaw`SELECT id FROM "User" WHERE username=${username} FOR UPDATE`;
      const user = await tx.user.findUnique({ where: { username } });
      const valid = await this.passwords.verify(user?.passwordHash ?? await this.dummyHash, dto.password);
      if (!user || !valid || user.status !== 'ACTIVE' || (user.role === 'USER' && !await this.activeSubscription(tx, user.id))) {
        const failures = throttle && Date.now() - throttle.windowStart.getTime() < 900000 ? throttle.failures + 1 : 1;
        await tx.loginThrottle.upsert({ where: { key }, create: { key, failures, lockedUntil: failures >= 5 ? new Date(Date.now() + 900000) : null }, update: { failures, windowStart: failures === 1 ? new Date() : throttle?.windowStart, lockedUntil: failures >= 5 ? new Date(Date.now() + 900000) : null } });
        await this.audit(tx, 'LOGIN_FAILURE', null, user?.id ?? null, { reason: 'invalid_credentials' }, req.ip); return { invalid: true } as const;
      }
      await tx.loginThrottle.deleteMany({ where: { key } });
      const next = await this.newSession(tx, user.id, req, dto.rememberMe);
      const safe = await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() }, select: publicUserSelect });
      await this.audit(tx, 'LOGIN_SUCCESS', user.id, user.id, {}, req.ip);
      return { user: safe, ...next };
    });
    if ('limited' in result) throw new HttpException('Too many requests', 429);
    if ('invalid' in result) throw new UnauthorizedException();
    res.cookie(this.sessionCookie, result.token, { ...this.options(), ...(dto.rememberMe ? { maxAge: 30 * 86400000 } : {}) });
    return { user: result.user, csrfToken: this.csrf(req, res, result.token) };
  }
  async logout(auth: AuthContext, res: Response, req: Request) {
    await this.db.system(async tx => { await tx.session.updateMany({ where: { id: auth.sessionId, userId: auth.user.id }, data: { revokedAt: new Date() } }); await this.audit(tx, 'LOGOUT', auth.user.id, auth.user.id, {}, req.ip); });
    res.clearCookie(this.sessionCookie, this.options()); res.clearCookie(this.csrfCookie, this.options());
    return { ok: true };
  }
  async changePassword(auth: AuthContext, dto: ChangePasswordDto, req: Request, res: Response) {
    const result = await this.db.system(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${auth.user.id}))`;
      await tx.$queryRaw`SELECT id FROM "User" WHERE id=${auth.user.id} FOR UPDATE`;
      const session = await tx.session.findUnique({where:{id:auth.sessionId}});
      const user = await tx.user.findUniqueOrThrow({ where: { id: auth.user.id } });
      if (!session || session.revokedAt || session.expiresAt <= new Date() || user.status !== 'ACTIVE' || (user.role === 'USER' && !await this.activeSubscription(tx,user.id))) throw new UnauthorizedException();
      if (!await this.passwords.verify(user.passwordHash, dto.currentPassword) || dto.currentPassword === dto.newPassword) throw new UnauthorizedException();
      await tx.user.update({ where: { id: user.id }, data: { passwordHash: await this.passwords.hash(dto.newPassword), mustChangePassword: false } });
      await tx.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
      const next = await this.newSession(tx, user.id, req, auth.rememberMe, auth.expiresAt);
      await this.audit(tx, 'PASSWORD_CHANGED', user.id, user.id, {}, req.ip);
      return next;
    });
    res.cookie(this.sessionCookie, result.token, { ...this.options(), ...(auth.rememberMe ? { maxAge: Math.max(0, auth.expiresAt.getTime() - Date.now()) } : {}) });
    return { ok: true, csrfToken: this.csrf(req, res, result.token) };
  }
}
