import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  DEMO_ACTIVE_TRADES,
  DEMO_AI_PROVIDERS,
  DEMO_AUDIT_LOGS,
  DEMO_NOTIFICATIONS,
  DEMO_TRADE_HISTORY,
  DEMO_USERS,
} from './src/data/demoData';

const PORT = 3000;
const HOST = '0.0.0.0';
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('base64');
const SESSION_COOKIE = 'oxinvo_session';
const CSRF_COOKIE = 'oxinvo_csrf';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'DELETED';
type Language = 'AZ' | 'EN' | 'TR' | 'RU';
type RiskLevel = 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

interface PlanRecord {
  id: string;
  name: 'trial' | 'standard' | 'professional' | 'custom';
  durationDays: number;
  price: string;
  currency: string;
  isActive: boolean;
}

interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  expirationDate: string;
  createdAt: string;
}

interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  status: UserStatus;
  preferredLanguage: Language;
  mustChangePassword: boolean;
  passwordHash: string;
  notes: string;
  createdAt: string;
  lastLoginAt?: string;
  portfolioBalance: string;
  botStatus: 'STOPPED' | 'RUNNING' | 'PAUSED' | 'ERROR';
  binanceConnected: boolean;
  telegramConnected: boolean;
}

interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  rememberMe: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

interface TradeRecord {
  id: string;
  userId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: string;
  exitPrice: string | null;
  quantity: string;
  openedAt: string;
  closedAt: string | null;
  realizedProfit: string;
  realizedProfitPercentage: string;
  fees: string;
  status: 'OPEN' | 'CLOSED';
  entryReason: string;
  exitReason: string;
}

interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface AuditLogRecord {
  id: string;
  action: string;
  actorUserId: string | null;
  targetUserId: string | null;
  actorUsername: string;
  targetUsername: string;
  ipAddress: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

interface AIProviderRecord {
  id: string;
  providerName: 'OPENAI' | 'GEMINI' | 'GROK' | 'LOCAL';
  modelName: string;
  isEnabled: boolean;
  configuration: { priority: number };
  updatedAt: string;
}

interface RiskConfigRecord {
  riskLevel: RiskLevel;
  stopLossPct: number;
  takeProfitPct: number;
  maxDailyLossPct: number;
  tradeAmountUsd: number;
  selectedPair: string;
  tradingMode: 'PAPER';
  realTradingEnabled: false;
  updatedAt: string;
}

interface SupportTicketRecord {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  message: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

interface AuthedRequest extends Request {
  auth?: {
    user: UserRecord;
    session: SessionRecord;
  };
}

function hashToken(value: string): string {
  return createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(stored: string, password: string): boolean {
  if (!stored || !stored.includes(':')) return false;
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  return derived.length === keyBuf.length && timingSafeEqual(derived, keyBuf);
}

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    password.length <= 128 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(password)
  );
}

function generateStrongPassword(length = 18): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*-_=+?';
  const all = upper + lower + digits + symbols;
  const chars = [
    upper[randomBytes(1)[0]! % upper.length]!,
    lower[randomBytes(1)[0]! % lower.length]!,
    digits[randomBytes(1)[0]! % digits.length]!,
    symbols[randomBytes(1)[0]! % symbols.length]!,
  ];
  while (chars.length < length) {
    chars.push(all[randomBytes(1)[0]! % all.length]!);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0]! % (i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join('');
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function parseCookies(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = req.headers.cookie;
  if (!raw) return out;
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  }
  return out;
}

function isHttpsRequest(req: Request): boolean {
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string') return proto.split(',')[0]?.trim() === 'https';
  return req.secure;
}

function cookieOptions(req: Request, maxAge?: number) {
  const secure = isHttpsRequest(req);
  return {
    httpOnly: true,
    secure,
    sameSite: (secure ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

function isValidHttpUrlOrEmpty(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'https:') return u.toString();
    return null;
  } catch {
    return null;
  }
}

// --- Seeded In-Memory Preview Store (no hardcoded passwords!) ---
const plans: PlanRecord[] = [
  { id: '11111111-1111-4111-8111-111111111101', name: 'trial', durationDays: 14, price: '0', currency: 'USD', isActive: true },
  { id: '11111111-1111-4111-8111-111111111102', name: 'standard', durationDays: 30, price: '79', currency: 'USD', isActive: true },
  { id: '11111111-1111-4111-8111-111111111103', name: 'professional', durationDays: 30, price: '189', currency: 'USD', isActive: true },
  { id: '11111111-1111-4111-8111-111111111104', name: 'custom', durationDays: 365, price: '0', currency: 'USD', isActive: true },
];

const bootstrapEnvPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim() || '';
let requiresInitialSetup = !bootstrapEnvPassword;

const users: UserRecord[] = DEMO_USERS.map((u, idx) => ({
  id: `22222222-2222-4222-8222-22222222220${idx + 1}`,
  username: u.username.toLowerCase(),
  fullName: u.fullName,
  role: u.role.toUpperCase() as Role,
  status: u.status.toUpperCase() as UserStatus,
  preferredLanguage: 'AZ',
  mustChangePassword: false,
  // Only configured via explicit ADMIN_BOOTSTRAP_PASSWORD or one-time bootstrap flow; never hardcoded!
  passwordHash: u.role === 'super_admin' && bootstrapEnvPassword ? hashPassword(bootstrapEnvPassword) : '',
  notes: u.notes,
  createdAt: new Date(u.createdAt).toISOString(),
  lastLoginAt: undefined,
  portfolioBalance: '0',
  botStatus: 'STOPPED',
  binanceConnected: false,
  telegramConnected: false,
}));

const subscriptions: SubscriptionRecord[] = users.map((u, idx) => {
  const demo = DEMO_USERS[idx]!;
  const plan = plans.find((p) => p.name === demo.plan) ?? plans[0]!;
  return {
    id: `33333333-3333-4333-8333-33333333330${idx + 1}`,
    userId: u.id,
    planId: plan.id,
    status: u.status === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE',
    startDate: new Date(demo.createdAt).toISOString(),
    expirationDate: new Date(demo.expiresAt + 'T23:59:59Z').toISOString(),
    createdAt: new Date(demo.createdAt).toISOString(),
  };
});

const sessions: SessionRecord[] = [];

const firstUserId = users[0]!.id;
const trades: TradeRecord[] = [...DEMO_ACTIVE_TRADES, ...DEMO_TRADE_HISTORY].map((tr, idx) => ({
  id: `44444444-4444-4444-8444-${String(idx + 1).padStart(12, '0')}`,
  userId: firstUserId,
  symbol: tr.symbol,
  side: tr.side,
  entryPrice: String(tr.entryPrice),
  exitPrice: tr.exitPrice != null ? String(tr.exitPrice) : null,
  quantity: String(tr.quantity),
  openedAt: tr.openedAt,
  closedAt: tr.closedAt ?? null,
  realizedProfit: String(tr.pnlUsd),
  realizedProfitPercentage: String(tr.pnlPct),
  fees: String(tr.feesUsd),
  status: tr.status === 'active' ? 'OPEN' : 'CLOSED',
  entryReason: tr.openReason,
  exitReason: tr.closeReason ?? '',
}));

const notifications: NotificationRecord[] = DEMO_NOTIFICATIONS.map((n, idx) => ({
  id: `55555555-5555-4555-8555-${String(idx + 1).padStart(12, '0')}`,
  userId: firstUserId,
  type: 'SYSTEM',
  title: n.title,
  message: n.message,
  isRead: n.read,
  createdAt: new Date().toISOString(),
}));

const auditLogs: AuditLogRecord[] = DEMO_AUDIT_LOGS.map((a, idx) => ({
  id: `66666666-6666-4666-8666-${String(idx + 1).padStart(12, '0')}`,
  action: a.action,
  actorUserId: users[5]?.id ?? null,
  targetUserId: null,
  actorUsername: a.actor,
  targetUsername: a.target,
  ipAddress: a.ipMasked,
  createdAt: new Date().toISOString(),
  metadata: {},
}));

const aiProviders: AIProviderRecord[] = DEMO_AI_PROVIDERS.map((p, idx) => ({
  id: `77777777-7777-4777-8777-${String(idx + 1).padStart(12, '0')}`,
  providerName: p.id.toUpperCase() as AIProviderRecord['providerName'],
  modelName: p.selectedModel,
  isEnabled: false,
  configuration: { priority: idx + 1 },
  updatedAt: new Date().toISOString(),
}));

const userSettings = new Map<string, Record<string, unknown>>();
const userRiskConfigs = new Map<string, RiskConfigRecord>();
for (const u of users) {
  userSettings.set(u.id, { strategy: 'Adaptive Momentum', maxAllocation: 15, stopLoss: 3 });
  userRiskConfigs.set(u.id, {
    riskLevel: 'BALANCED',
    stopLossPct: 2.5,
    takeProfitPct: 5.0,
    maxDailyLossPct: 4.0,
    tradeAmountUsd: 100,
    selectedPair: 'BTC/USDT',
    tradingMode: 'PAPER',
    realTradingEnabled: false,
    updatedAt: new Date().toISOString(),
  });
}

const binanceConnections = new Map<string, { id: string; connectionStatus: string; lastSyncAt: string }>();
const supportTickets: SupportTicketRecord[] = [];

const systemSettings: Record<string, string> = {
  maintenanceMode: 'false',
  allowTrialSignups: 'true',
  enforceWithdrawalCheck: 'true',
  supportContact: process.env.PUBLIC_SUPPORT_HANDLE?.trim() || '',
  whatsappUrl: process.env.PUBLIC_WHATSAPP_URL?.trim() || '',
  telegramUrl: process.env.PUBLIC_TELEGRAM_URL?.trim() || '',
  supportEmail: process.env.PUBLIC_SUPPORT_EMAIL?.trim() || '',
};

function activeSubscriptionFor(userId: string) {
  const now = Date.now();
  const sub = subscriptions
    .filter((s) => s.userId === userId && s.status === 'ACTIVE' && new Date(s.expirationDate).getTime() > now)
    .sort((a, b) => new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime())[0];
  if (!sub) return null;
  const plan = plans.find((p) => p.id === sub.planId);
  return { ...sub, plan };
}

function latestSubscriptionFor(userId: string) {
  const sub = subscriptions
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (!sub) return null;
  const plan = plans.find((p) => p.id === sub.planId);
  return { ...sub, plan };
}

function sanitizeUser(u: UserRecord) {
  const userTrades = trades.filter((t) => t.userId === u.id);
  const wins = userTrades.filter((t) => Number(t.realizedProfit) > 0).length;
  const realizedPnl = userTrades.reduce((acc, t) => acc + Number(t.realizedProfit), 0);
  const sub = latestSubscriptionFor(u.id);
  return {
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    status: u.status,
    preferredLanguage: u.preferredLanguage,
    mustChangePassword: u.mustChangePassword,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    notes: u.notes,
    subscription: sub ?? undefined,
    portfolioBalance: u.portfolioBalance,
    realizedPnl: realizedPnl.toFixed(2),
    totalTrades: userTrades.length,
    winRate: userTrades.length ? (wins / userTrades.length) * 100 : 0,
    botStatus: u.botStatus,
    binanceConnected: u.binanceConnected,
    telegramConnected: u.telegramConnected,
  };
}

function addAudit(
  action: string,
  actor: UserRecord | null,
  target: UserRecord | null,
  ipAddress: string,
  metadata: Record<string, unknown> = {},
) {
  auditLogs.unshift({
    id: randomUUID(),
    action,
    actorUserId: actor?.id ?? null,
    targetUserId: target?.id ?? null,
    actorUsername: actor?.username ?? 'system',
    targetUsername: target?.username ?? '—',
    ipAddress,
    createdAt: new Date().toISOString(),
    metadata,
  });
}

function issueCsrfToken(sessionToken = ''): string {
  const payload = `${randomBytes(24).toString('base64url')}.${Date.now()}`;
  return `${payload}.${hashToken(`csrf:${payload}:${sessionToken}`)}`;
}

function verifyCsrfToken(token: string, sessionToken = ''): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const ts = Number(parts[1]);
  if (!Number.isFinite(ts) || ts > Date.now() + 30000 || Date.now() - ts > 7200000) return false;
  return safeEqual(parts[2]!, hashToken(`csrf:${parts[0]}.${parts[1]}:${sessionToken}`));
}

function authenticateReq(req: AuthedRequest): { user: UserRecord; session: SessionRecord } | null {
  const cookies = parseCookies(req);
  const rawToken = cookies[SESSION_COOKIE];
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);
  const session = sessions.find(
    (s) => s.tokenHash === tokenHash && !s.revokedAt && new Date(s.expiresAt).getTime() > Date.now(),
  );
  if (!session) return null;
  const user = users.find((u) => u.id === session.userId);
  if (!user || user.status !== 'ACTIVE') return null;
  if (user.role === 'USER' && !activeSubscriptionFor(user.id)) return null;
  return { user, session };
}

function requireAuth(allowPasswordChange = false) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const auth = authenticateReq(req);
    if (!auth) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (auth.user.mustChangePassword && !allowPasswordChange) {
      res.status(403).json({ code: 'PASSWORD_CHANGE_REQUIRED' });
      return;
    }
    req.auth = auth;
    next();
  };
}

function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}

function isSameOrigin(req: Request): boolean {
  const origin = req.get('Origin');
  if (!origin) return true;
  const host = (req.get('X-Forwarded-Host') || req.get('Host') || '').split(',')[0]?.trim().toLowerCase();
  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === host;
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  const api = express.Router();
  api.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  // Origin + CSRF check for mutations
  api.use((req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    if (!isSameOrigin(req)) {
      res.status(403).json({ error: 'Cross-origin mutation rejected' });
      return;
    }
    const cookies = parseCookies(req);
    const sessionToken = cookies[SESSION_COOKIE] ?? '';
    const headerToken = req.get('X-CSRF-Token') ?? '';
    const cookieToken = cookies[CSRF_COOKIE];
    if (!headerToken || !verifyCsrfToken(headerToken, sessionToken)) {
      res.status(403).json({ error: 'Invalid CSRF token' });
      return;
    }
    if (cookieToken && !safeEqual(headerToken, cookieToken)) {
      res.status(403).json({ error: 'CSRF mismatch' });
      return;
    }
    next();
  });

  // System health & Public config
  api.get('/health', (_req, res) => res.json({ status: 'ok' }));
  api.get('/health/database', (_req, res) => res.json({ status: 'ok' }));
  api.get('/version', (_req, res) => res.json({ application: 'OXINVO', version: '0.2.0', apiVersion: '1' }));

  api.get('/public/config', (_req, res) => {
    res.json({
      whatsappUrl: systemSettings.whatsappUrl || '',
      telegramUrl: systemSettings.telegramUrl || '',
      supportEmail: systemSettings.supportEmail || '',
      supportHandle: systemSettings.supportContact || '',
    });
  });

  api.post('/public/contact', (_req, res) => {
    // No mail relay or CRM webhook configured yet — fail honestly instead of faking delivery
    res.status(503).json({
      code: 'CONTACT_BACKEND_NOT_CONFIGURED',
      error: 'Contact delivery backend is not configured yet.',
    });
  });

  // Auth & One-Time Admin Bootstrap
  api.get('/auth/csrf', (req, res) => {
    const cookies = parseCookies(req);
    const sessionToken = cookies[SESSION_COOKIE] ?? '';
    const existing = cookies[CSRF_COOKIE];
    if (existing && verifyCsrfToken(existing, sessionToken)) {
      res.json({ csrfToken: existing });
      return;
    }
    const token = issueCsrfToken(sessionToken);
    res.cookie(CSRF_COOKIE, token, cookieOptions(req, 7200000));
    res.json({ csrfToken: token });
  });

  api.get('/auth/bootstrap-status', (_req, res) => {
    res.json({
      requiresInitialSetup,
      adminUsername: 'oxinvo.admin',
    });
  });

  api.post('/auth/bootstrap-admin', (req, res) => {
    if (!requiresInitialSetup) {
      res.status(409).json({ error: 'Administrator account is already initialized' });
      return;
    }
    const { password } = req.body ?? {};
    if (typeof password !== 'string' || !isStrongPassword(password)) {
      res.status(400).json({ error: 'Password does not meet security requirements' });
      return;
    }
    const adminUser = users.find((u) => u.username === 'oxinvo.admin' && u.role === 'SUPER_ADMIN');
    if (!adminUser) {
      res.status(500).json({ error: 'Admin user record missing' });
      return;
    }
    adminUser.passwordHash = hashPassword(password);
    adminUser.mustChangePassword = false;
    requiresInitialSetup = false;

    const rawToken = randomBytes(32).toString('base64url');
    const maxAge = 8 * 3600000;
    const session: SessionRecord = {
      id: randomUUID(),
      userId: adminUser.id,
      tokenHash: hashToken(rawToken),
      rememberMe: false,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.get('User-Agent')?.slice(0, 200) || 'Browser',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + maxAge).toISOString(),
      revokedAt: null,
    };
    sessions.push(session);
    adminUser.lastLoginAt = new Date().toISOString();
    addAudit('ADMIN_BOOTSTRAPPED', adminUser, adminUser, req.ip || '127.0.0.1');

    const csrfToken = issueCsrfToken(rawToken);
    res.cookie(SESSION_COOKIE, rawToken, cookieOptions(req));
    res.cookie(CSRF_COOKIE, csrfToken, cookieOptions(req, 7200000));
    res.json({ user: sanitizeUser(adminUser), csrfToken });
  });

  api.post('/auth/login', (req, res) => {
    const { username, password, rememberMe } = req.body ?? {};
    const cleanUser = typeof username === 'string' ? username.trim().toLowerCase() : '';
    const cleanPass = typeof password === 'string' ? password : '';
    const user = users.find((u) => u.username === cleanUser);
    if (
      !user ||
      !verifyPassword(user.passwordHash, cleanPass) ||
      user.status !== 'ACTIVE' ||
      (user.role === 'USER' && !activeSubscriptionFor(user.id))
    ) {
      addAudit('LOGIN_FAILURE', null, user ?? null, req.ip || '127.0.0.1');
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const rawToken = randomBytes(32).toString('base64url');
    const remember = Boolean(rememberMe);
    const maxAge = remember ? 30 * 86400000 : 8 * 3600000;
    const session: SessionRecord = {
      id: randomUUID(),
      userId: user.id,
      tokenHash: hashToken(rawToken),
      rememberMe: remember,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.get('User-Agent')?.slice(0, 200) || 'Browser',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + maxAge).toISOString(),
      revokedAt: null,
    };
    sessions.push(session);
    user.lastLoginAt = new Date().toISOString();
    addAudit('LOGIN_SUCCESS', user, user, req.ip || '127.0.0.1');

    const csrfToken = issueCsrfToken(rawToken);
    res.cookie(SESSION_COOKIE, rawToken, cookieOptions(req, remember ? maxAge : undefined));
    res.cookie(CSRF_COOKIE, csrfToken, cookieOptions(req, 7200000));
    res.json({ user: sanitizeUser(user), csrfToken });
  });

  api.get('/auth/me', requireAuth(true), (req: AuthedRequest, res) => {
    res.json({ user: sanitizeUser(req.auth!.user) });
  });

  api.post('/auth/logout', requireAuth(true), (req: AuthedRequest, res) => {
    req.auth!.session.revokedAt = new Date().toISOString();
    addAudit('LOGOUT', req.auth!.user, req.auth!.user, req.ip || '127.0.0.1');
    res.clearCookie(SESSION_COOKIE, cookieOptions(req));
    res.clearCookie(CSRF_COOKIE, cookieOptions(req));
    res.json({ ok: true });
  });

  api.post('/auth/change-password', requireAuth(true), (req: AuthedRequest, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      !isStrongPassword(newPassword) ||
      currentPassword === newPassword ||
      !verifyPassword(req.auth!.user.passwordHash, currentPassword)
    ) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const user = req.auth!.user;
    user.passwordHash = hashPassword(newPassword);
    user.mustChangePassword = false;
    for (const s of sessions) {
      if (s.userId === user.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
    }
    const rawToken = randomBytes(32).toString('base64url');
    const newSession: SessionRecord = {
      id: randomUUID(),
      userId: user.id,
      tokenHash: hashToken(rawToken),
      rememberMe: req.auth!.session.rememberMe,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.get('User-Agent')?.slice(0, 200) || 'Browser',
      createdAt: new Date().toISOString(),
      expiresAt: req.auth!.session.expiresAt,
      revokedAt: null,
    };
    sessions.push(newSession);
    addAudit('PASSWORD_CHANGED', user, user, req.ip || '127.0.0.1');
    const csrfToken = issueCsrfToken(rawToken);
    res.cookie(SESSION_COOKIE, rawToken, cookieOptions(req));
    res.cookie(CSRF_COOKIE, csrfToken, cookieOptions(req, 7200000));
    res.json({ ok: true, csrfToken });
  });

  api.get('/auth/sessions', requireAuth(), (req: AuthedRequest, res) => {
    const now = Date.now();
    res.json(
      sessions
        .filter((s) => s.userId === req.auth!.user.id && !s.revokedAt && new Date(s.expiresAt).getTime() > now)
        .map(({ id, ipAddress, userAgent, createdAt, expiresAt }) => ({ id, ipAddress, userAgent, createdAt, expiresAt })),
    );
  });

  api.delete('/auth/sessions/:id', requireAuth(), (req: AuthedRequest, res) => {
    const target = sessions.find((s) => s.id === req.params.id && s.userId === req.auth!.user.id);
    if (target) target.revokedAt = new Date().toISOString();
    addAudit('SESSION_REVOKED', req.auth!.user, req.auth!.user, req.ip || '127.0.0.1');
    res.json({ ok: true });
  });

  // Current User
  api.get('/users/me', requireAuth(), (req: AuthedRequest, res) => res.json(sanitizeUser(req.auth!.user)));
  api.patch('/users/me', requireAuth(), (req: AuthedRequest, res) => {
    const { fullName, preferredLanguage } = req.body ?? {};
    if (typeof fullName === 'string' && fullName.trim()) req.auth!.user.fullName = fullName.trim().slice(0, 160);
    if (typeof preferredLanguage === 'string' && ['AZ', 'EN', 'TR', 'RU'].includes(preferredLanguage)) {
      req.auth!.user.preferredLanguage = preferredLanguage as Language;
    }
    addAudit('USER_UPDATED', req.auth!.user, req.auth!.user, req.ip || '127.0.0.1');
    res.json(sanitizeUser(req.auth!.user));
  });

  api.get('/users/me/subscription', requireAuth(), (req: AuthedRequest, res) => {
    res.json({ subscription: latestSubscriptionFor(req.auth!.user.id) });
  });

  api.get('/users/me/overview', requireAuth(), (req: AuthedRequest, res) => {
    const userTrades = trades.filter((t) => t.userId === req.auth!.user.id);
    const totalProfit = userTrades.reduce((acc, t) => acc + Number(t.realizedProfit), 0);
    const activeTrades = userTrades.filter((t) => t.status === 'OPEN').length;
    res.json({
      totalBalance: req.auth!.user.portfolioBalance,
      totalProfit: totalProfit.toFixed(2),
      totalTrades: userTrades.length,
      activeTrades,
      tradingMode: 'PAPER',
      tradingAvailable: false,
      subscriptionActive: Boolean(activeSubscriptionFor(req.auth!.user.id)),
      binanceIntegrated: false,
      telegramIntegrated: false,
      botStatus: req.auth!.user.botStatus,
    });
  });

  api.get('/users/me/trades', requireAuth(), (req: AuthedRequest, res) => {
    res.json(
      trades
        .filter((t) => t.userId === req.auth!.user.id)
        .map((t) => ({ ...t, user: { username: req.auth!.user.username } })),
    );
  });

  api.get('/users/me/trades/:id', requireAuth(), (req: AuthedRequest, res) => {
    const row = trades.find((t) => t.id === req.params.id && t.userId === req.auth!.user.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  api.get('/users/me/orders', requireAuth(), (_req, res) => res.json([]));
  api.get('/users/me/bots', requireAuth(), (_req, res) => res.json([]));
  api.get('/users/me/portfolio', requireAuth(), (_req, res) => res.json([]));
  api.get('/users/me/ai-decisions', requireAuth(), (_req, res) => res.json([]));

  api.get('/users/me/risk', requireAuth(), (req: AuthedRequest, res) => {
    const config = userRiskConfigs.get(req.auth!.user.id);
    res.json(config ?? null);
  });

  api.patch('/users/me/risk', requireAuth(), (req: AuthedRequest, res) => {
    const existing = userRiskConfigs.get(req.auth!.user.id) ?? {
      riskLevel: 'BALANCED' as RiskLevel,
      stopLossPct: 2.5,
      takeProfitPct: 5.0,
      maxDailyLossPct: 4.0,
      tradeAmountUsd: 100,
      selectedPair: 'BTC/USDT',
      tradingMode: 'PAPER' as const,
      realTradingEnabled: false as const,
      updatedAt: new Date().toISOString(),
    };
    const { riskLevel, stopLossPct, takeProfitPct, maxDailyLossPct, tradeAmountUsd, selectedPair } = req.body ?? {};
    if (typeof riskLevel === 'string' && ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'].includes(riskLevel)) {
      existing.riskLevel = riskLevel as RiskLevel;
    }
    if (typeof stopLossPct === 'number' && Number.isFinite(stopLossPct) && stopLossPct >= 0.5 && stopLossPct <= 25) {
      existing.stopLossPct = stopLossPct;
    }
    if (typeof takeProfitPct === 'number' && Number.isFinite(takeProfitPct) && takeProfitPct >= 0.5 && takeProfitPct <= 50) {
      existing.takeProfitPct = takeProfitPct;
    }
    if (
      typeof maxDailyLossPct === 'number' &&
      Number.isFinite(maxDailyLossPct) &&
      maxDailyLossPct >= 1 &&
      maxDailyLossPct <= 30
    ) {
      existing.maxDailyLossPct = maxDailyLossPct;
    }
    if (typeof tradeAmountUsd === 'number' && Number.isFinite(tradeAmountUsd) && tradeAmountUsd >= 10 && tradeAmountUsd <= 100000) {
      existing.tradeAmountUsd = tradeAmountUsd;
    }
    if (typeof selectedPair === 'string' && /^[A-Z0-9]{2,10}\/[A-Z0-9]{2,10}$/.test(selectedPair)) {
      existing.selectedPair = selectedPair;
    }
    existing.updatedAt = new Date().toISOString();
    userRiskConfigs.set(req.auth!.user.id, existing);
    addAudit('RISK_CONFIG_UPDATED', req.auth!.user, req.auth!.user, req.ip || '127.0.0.1');
    res.json(existing);
  });

  api.get('/users/me/affiliate', requireAuth(), (req: AuthedRequest, res) => {
    res.json({
      referralCode: `OXV-${req.auth!.user.username.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8)}`,
      referralCount: 0,
      activeReferrals: 0,
      totalCommissionUsd: '0.00',
      commissionRatePct: 0,
      available: false,
    });
  });

  api.get('/users/me/support', requireAuth(), (req: AuthedRequest, res) => {
    res.json(supportTickets.filter((t) => t.userId === req.auth!.user.id));
  });

  api.post('/users/me/support', requireAuth(), (req: AuthedRequest, res) => {
    const { subject, category = 'general', message } = req.body ?? {};
    const cleanSubject = typeof subject === 'string' ? subject.trim().slice(0, 120) : '';
    const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 2000) : '';
    if (!cleanSubject || !cleanMessage) {
      res.status(400).json({ error: 'Subject and message are required' });
      return;
    }
    const ticket: SupportTicketRecord = {
      id: randomUUID(),
      userId: req.auth!.user.id,
      username: req.auth!.user.username,
      subject: cleanSubject,
      category: String(category).slice(0, 40),
      message: cleanMessage,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    supportTickets.unshift(ticket);
    addAudit('SUPPORT_TICKET_CREATED', req.auth!.user, null, req.ip || '127.0.0.1', { ticketId: ticket.id });
    res.status(201).json(ticket);
  });

  api.get('/users/me/notifications', requireAuth(), (req: AuthedRequest, res) => {
    res.json(notifications.filter((n) => n.userId === req.auth!.user.id));
  });

  api.patch('/users/me/notifications/:id/read', requireAuth(), (req: AuthedRequest, res) => {
    const note = notifications.find((n) => n.id === req.params.id && n.userId === req.auth!.user.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    note.isRead = true;
    res.json({ ok: true });
  });

  api.get('/users/me/binance', requireAuth(), (req: AuthedRequest, res) => {
    res.json({ connection: binanceConnections.get(req.auth!.user.id) ?? null, integrated: false });
  });

  api.patch('/users/me/binance', requireAuth(), (req: AuthedRequest, res) => {
    const { apiKey, apiSecret } = req.body ?? {};
    if (typeof apiKey !== 'string' || !apiKey || typeof apiSecret !== 'string' || !apiSecret) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    // Live exchange connection is intentionally disabled until exchange worker is deployed
    binanceConnections.set(req.auth!.user.id, {
      id: randomUUID(),
      connectionStatus: 'DISCONNECTED',
      lastSyncAt: new Date().toISOString(),
    });
    res.json({ saved: true, connected: false, integrated: false });
  });

  api.get('/users/me/telegram', requireAuth(), (_req, res) => res.json({ connection: null, integrated: false }));

  api.get('/users/me/settings', requireAuth(), (req: AuthedRequest, res) => {
    const map = userSettings.get(req.auth!.user.id) ?? {};
    res.json(Object.entries(map).map(([key, value]) => ({ key, value })));
  });

  api.patch('/users/me/settings', requireAuth(), (req: AuthedRequest, res) => {
    const existing = userSettings.get(req.auth!.user.id) ?? {};
    const { strategy, maxAllocation, stopLoss } = req.body ?? {};
    if (strategy !== undefined) existing.strategy = strategy;
    if (maxAllocation !== undefined) existing.maxAllocation = maxAllocation;
    if (stopLoss !== undefined) existing.stopLoss = stopLoss;
    userSettings.set(req.auth!.user.id, existing);
    res.json({ ok: true });
  });

  // Admin routes (RBAC enforced server-side)
  api.get('/admin/users', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req, res) => {
    const search = String(req.query.search ?? '').trim().toLowerCase();
    const status = String(req.query.status ?? '').trim().toUpperCase();
    const plan = String(req.query.plan ?? '').trim().toLowerCase();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize ?? 10)));

    const filtered = users.filter((u) => {
      if (status ? u.status !== status : u.status === 'DELETED') return false;
      if (search && !u.username.includes(search) && !u.fullName.toLowerCase().includes(search)) return false;
      if (plan) {
        const sub = latestSubscriptionFor(u.id);
        if (sub?.plan?.name !== plan) return false;
      }
      return true;
    });

    const slice = filtered.slice((page - 1) * pageSize, page * pageSize).map(sanitizeUser);
    res.json({ items: slice, total: filtered.length, page, pageSize });
  });

  api.post('/admin/users', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const {
      username,
      fullName,
      preferredLanguage = 'AZ',
      role = 'USER',
      status = 'ACTIVE',
      planId,
      durationDays = 30,
      notes = '',
    } = req.body ?? {};
    const cleanUsername = String(username ?? '').trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(cleanUsername)) return res.status(400).json({ error: 'Invalid username' });
    if (users.some((u) => u.username === cleanUsername)) return res.status(409).json({ error: 'Conflict' });
    if (req.auth!.user.role === 'ADMIN' && role !== 'USER') return res.status(403).json({ error: 'Forbidden' });
    const plan = plans.find((p) => p.id === planId) ?? plans[0]!;
    const generatedPassword = generateStrongPassword();
    const newUser: UserRecord = {
      id: randomUUID(),
      username: cleanUsername,
      fullName: String(fullName || cleanUsername).trim(),
      role: role as Role,
      status: status as UserStatus,
      preferredLanguage: preferredLanguage as Language,
      mustChangePassword: true,
      passwordHash: hashPassword(generatedPassword),
      notes: String(notes || ''),
      createdAt: new Date().toISOString(),
      portfolioBalance: '0',
      botStatus: 'STOPPED',
      binanceConnected: false,
      telegramConnected: false,
    };
    const sub: SubscriptionRecord = {
      id: randomUUID(),
      userId: newUser.id,
      planId: plan.id,
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + Number(durationDays) * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    subscriptions.push(sub);
    userSettings.set(newUser.id, { strategy: 'Adaptive Momentum', maxAllocation: 15, stopLoss: 3 });
    userRiskConfigs.set(newUser.id, {
      riskLevel: 'BALANCED',
      stopLossPct: 2.5,
      takeProfitPct: 5.0,
      maxDailyLossPct: 4.0,
      tradeAmountUsd: 100,
      selectedPair: 'BTC/USDT',
      tradingMode: 'PAPER',
      realTradingEnabled: false,
      updatedAt: new Date().toISOString(),
    });
    addAudit('USER_CREATED', req.auth!.user, newUser, req.ip || '127.0.0.1', { role: newUser.role });
    res.json({
      user: sanitizeUser(newUser),
      subscription: { ...sub, plan },
      generatedPassword,
      loginUrl: 'https://oxinvo.com',
    });
  });

  api.get('/admin/users/:id', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    const userTrades = trades
      .filter((t) => t.userId === target.id)
      .map((t) => ({ ...t, user: { username: target.username } }));
    res.json({ ...sanitizeUser(target), trades: userTrades });
  });

  api.patch('/admin/users/:id', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    const { fullName, notes, status, role } = req.body ?? {};
    if (req.auth!.user.role === 'ADMIN' && (target.role !== 'USER' || (role && role !== 'USER'))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const nextRole = (role ?? target.role) as Role;
    const nextStatus = (status ?? target.status) as UserStatus;
    if (
      target.role === 'SUPER_ADMIN' &&
      target.status === 'ACTIVE' &&
      (nextRole !== 'SUPER_ADMIN' || nextStatus !== 'ACTIVE')
    ) {
      const remaining = users.filter((u) => u.id !== target.id && u.role === 'SUPER_ADMIN' && u.status === 'ACTIVE').length;
      if (remaining === 0) return res.status(409).json({ error: 'Cannot remove last active SUPER_ADMIN' });
    }
    if (typeof fullName === 'string') target.fullName = fullName;
    if (typeof notes === 'string') target.notes = notes;
    target.role = nextRole;
    target.status = nextStatus;
    if (nextStatus !== 'ACTIVE' || role) {
      for (const s of sessions) {
        if (s.userId === target.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
      }
    }
    addAudit('USER_UPDATED', req.auth!.user, target, req.ip || '127.0.0.1', { role: nextRole, status: nextStatus });
    res.json(sanitizeUser(target));
  });

  api.delete('/admin/users/:id', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (
      target.role === 'SUPER_ADMIN' &&
      users.filter((u) => u.id !== target.id && u.role === 'SUPER_ADMIN' && u.status === 'ACTIVE').length === 0
    ) {
      return res.status(409).json({ error: 'Cannot delete last active SUPER_ADMIN' });
    }
    target.status = 'DELETED';
    for (const s of sessions) {
      if (s.userId === target.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
    }
    addAudit('USER_DELETED', req.auth!.user, target, req.ip || '127.0.0.1');
    res.json(sanitizeUser(target));
  });

  api.post('/admin/users/:id/reset-password', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    const generatedPassword = generateStrongPassword();
    target.passwordHash = hashPassword(generatedPassword);
    target.mustChangePassword = true;
    for (const s of sessions) {
      if (s.userId === target.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
    }
    addAudit('PASSWORD_RESET', req.auth!.user, target, req.ip || '127.0.0.1');
    res.json({ generatedPassword });
  });

  api.post('/admin/users/:id/suspend', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (
      target.role === 'SUPER_ADMIN' &&
      users.filter((u) => u.id !== target.id && u.role === 'SUPER_ADMIN' && u.status === 'ACTIVE').length === 0
    ) {
      return res.status(409).json({ error: 'Cannot suspend last SUPER_ADMIN' });
    }
    target.status = 'SUSPENDED';
    for (const s of sessions) {
      if (s.userId === target.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
    }
    addAudit('USER_SUSPENDED', req.auth!.user, target, req.ip || '127.0.0.1');
    res.json(sanitizeUser(target));
  });

  api.post('/admin/users/:id/activate', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    target.status = 'ACTIVE';
    addAudit('USER_ACTIVATED', req.auth!.user, target, req.ip || '127.0.0.1');
    res.json(sanitizeUser(target));
  });

  api.post('/admin/users/:id/revoke-sessions', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    for (const s of sessions) {
      if (s.userId === target.id && !s.revokedAt) s.revokedAt = new Date().toISOString();
    }
    addAudit('SESSION_REVOKED', req.auth!.user, target, req.ip || '127.0.0.1');
    res.json({ ok: true });
  });

  api.patch('/admin/users/:id/subscription', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const target = users.find((u) => u.id === req.params.id && u.status !== 'DELETED');
    if (!target) return res.status(404).json({ error: 'Not found' });
    const sub = latestSubscriptionFor(target.id);
    if (!sub) return res.status(400).json({ error: 'No subscription' });
    const { planId, expirationDate, extendDays } = req.body ?? {};
    const record = subscriptions.find((s) => s.id === sub.id)!;
    if (planId && plans.some((p) => p.id === planId)) record.planId = planId;
    if (expirationDate) record.expirationDate = new Date(expirationDate).toISOString();
    else if (extendDays) {
      const base = Math.max(Date.now(), new Date(record.expirationDate).getTime());
      record.expirationDate = new Date(base + Number(extendDays) * 86400000).toISOString();
    }
    record.status = new Date(record.expirationDate).getTime() > Date.now() ? 'ACTIVE' : 'EXPIRED';
    addAudit('SUBSCRIPTION_CHANGED', req.auth!.user, target, req.ip || '127.0.0.1', {
      expirationDate: record.expirationDate,
    });
    res.json(record);
  });

  api.get('/admin/overview', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    const nonDeleted = users.filter((u) => u.status !== 'DELETED');
    res.json({
      totalUsers: nonDeleted.length,
      activeAccounts: nonDeleted.filter((u) => u.status === 'ACTIVE').length,
      runningBots: nonDeleted.filter((u) => u.botStatus === 'RUNNING').length,
      activeTrades: trades.filter((t) => t.status === 'OPEN').length,
      openTickets: supportTickets.filter((t) => t.status === 'OPEN').length,
    });
  });

  api.get('/admin/trades', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json(
      trades.map((t) => ({
        ...t,
        user: { username: users.find((u) => u.id === t.userId)?.username ?? 'unknown' },
      })),
    );
  });

  api.get('/admin/analytics', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json(users.filter((u) => u.role === 'USER' && u.status !== 'DELETED').map(sanitizeUser));
  });

  api.get('/admin/risk', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json(
      users
        .filter((u) => u.status !== 'DELETED')
        .map((u) => ({
          userId: u.id,
          username: u.username,
          status: u.status,
          config: userRiskConfigs.get(u.id) ?? null,
        })),
    );
  });

  api.get('/admin/binance', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json(
      users
        .filter((u) => u.status !== 'DELETED')
        .map((u) => ({
          userId: u.id,
          username: u.username,
          binanceConnected: u.binanceConnected,
          connection: binanceConnections.get(u.id) ?? null,
          integrated: false,
        })),
    );
  });

  api.get('/admin/affiliate', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json({
      available: false,
      totalReferrals: 0,
      totalCommissionUsd: '0.00',
      records: [],
    });
  });

  api.get('/admin/support', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    res.json(supportTickets);
  });

  api.patch('/admin/support/:id', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const ticket = supportTickets.find((t) => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    const { status } = req.body ?? {};
    if (typeof status === 'string' && ['OPEN', 'IN_REVIEW', 'RESOLVED'].includes(status)) {
      ticket.status = status as SupportTicketRecord['status'];
      ticket.updatedAt = new Date().toISOString();
      addAudit('SUPPORT_TICKET_UPDATED', req.auth!.user, null, req.ip || '127.0.0.1', { ticketId: ticket.id, status });
    }
    res.json(ticket);
  });

  api.get('/admin/subscription-plans', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (_req, res) => {
    const now = Date.now();
    res.json(
      plans.map((p) => ({
        ...p,
        _count: {
          subscriptions: subscriptions.filter(
            (s) =>
              s.planId === p.id &&
              s.status === 'ACTIVE' &&
              new Date(s.expirationDate).getTime() > now &&
              users.some((u) => u.id === s.userId && u.status !== 'DELETED'),
          ).length,
        },
      })),
    );
  });

  api.get('/admin/audit-logs', requireAuth(), requireRole('SUPER_ADMIN'), (req, res) => {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize ?? 50)));
    const items = auditLogs.slice((page - 1) * pageSize, page * pageSize).map((a) => ({
      ...a,
      actor: { username: a.actorUsername },
      target: { username: a.targetUsername },
    }));
    res.json({ items, total: auditLogs.length });
  });

  api.get('/admin/ai-providers', requireAuth(), requireRole('SUPER_ADMIN'), (_req, res) => {
    res.json(aiProviders);
  });

  api.post('/admin/ai-providers', requireAuth(), requireRole('SUPER_ADMIN'), (req: AuthedRequest, res) => {
    const { providerName, modelName, isEnabled = false, priority = 0 } = req.body ?? {};
    let row = aiProviders.find((p) => p.providerName === providerName && p.modelName === modelName);
    if (row) {
      row.isEnabled = Boolean(isEnabled);
      row.configuration = { priority: Number(priority) };
      row.updatedAt = new Date().toISOString();
    } else {
      row = {
        id: randomUUID(),
        providerName,
        modelName: String(modelName || 'default'),
        isEnabled: Boolean(isEnabled),
        configuration: { priority: Number(priority) },
        updatedAt: new Date().toISOString(),
      };
      aiProviders.push(row);
    }
    addAudit('AI_PROVIDER_UPDATED', req.auth!.user, null, req.ip || '127.0.0.1');
    res.json(row);
  });

  api.get('/admin/settings', requireAuth(), requireRole('SUPER_ADMIN'), (_req, res) => {
    res.json(Object.entries(systemSettings).map(([key, value]) => ({ key, value })));
  });

  api.patch('/admin/settings', requireAuth(), requireRole('SUPER_ADMIN'), (req: AuthedRequest, res) => {
    const { key, value } = req.body ?? {};
    const allowedKeys = new Set([
      'maintenanceMode',
      'allowTrialSignups',
      'enforceWithdrawalCheck',
      'supportContact',
      'whatsappUrl',
      'telegramUrl',
      'supportEmail',
    ]);
    if (!allowedKeys.has(key)) return res.status(400).json({ error: 'Invalid key' });
    if (key === 'whatsappUrl' || key === 'telegramUrl') {
      const checked = isValidHttpUrlOrEmpty(value);
      if (checked === null) return res.status(400).json({ error: 'Invalid HTTPS URL' });
      systemSettings[key] = checked;
    } else {
      systemSettings[key] = String(value ?? '').slice(0, 200);
    }
    addAudit('SYSTEM_SETTING_UPDATED', req.auth!.user, null, req.ip || '127.0.0.1', { key });
    res.json({ key, value: systemSettings[key] });
  });

  api.post('/admin/notifications', requireAuth(), requireRole('SUPER_ADMIN', 'ADMIN'), (req: AuthedRequest, res) => {
    const { title, message } = req.body ?? {};
    const recipients = users.filter(
      (u) => u.status !== 'DELETED' && (req.auth!.user.role === 'ADMIN' ? u.role === 'USER' : true),
    );
    for (const u of recipients) {
      notifications.unshift({
        id: randomUUID(),
        userId: u.id,
        type: 'SYSTEM',
        title: String(title ?? ''),
        message: String(message ?? ''),
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
    addAudit('NOTIFICATION_BROADCAST', req.auth!.user, null, req.ip || '127.0.0.1', {
      recipients: recipients.length,
    });
    res.json({ recipients: recipients.length });
  });

  app.use('/api/v1', api);

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(express.static(distDir, { extensions: ['html'] }));
    app.get('*', (req, res) => {
      const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
      const localizedHtml = path.join(distDir, cleanPath, 'index.html');
      if (cleanPath && fs.existsSync(localizedHtml)) {
        res.sendFile(localizedHtml);
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`[OXINVO] Server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[OXINVO] Failed to start server:', err);
  process.exit(1);
});
