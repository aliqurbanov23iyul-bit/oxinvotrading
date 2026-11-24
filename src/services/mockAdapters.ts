import {
  AuthSession,
  BinanceConnectionState,
  BotStatus,
  TelegramConnectionState,
  UserAccount,
} from '../types';
import {
  DEMO_BINANCE_CONNECTION,
  DEMO_TELEGRAM_CONNECTION,
  DEMO_USERS,
} from '../data/demoData';
import { generateConnectionCode, maskCredential } from '../utils/security';

/**
 * Backend-ready authentication adapter interface.
 * In production, replace demo verification with POST /api/auth/login using HttpOnly cookies
 * and server-side bcrypt/argon2 password hash verification.
 */
export const authService = {
  async authenticateDemo(
    username: string,
    password: string,
    users: UserAccount[]
  ): Promise<{ ok: true; session: AuthSession } | { ok: false; reason: 'invalid' | 'suspended' }> {
    await new Promise((r) => setTimeout(r, 420));
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { ok: false, reason: 'invalid' };
    }

    const found = users.find((u) => u.username.toLowerCase() === cleanUser);
    if (!found) {
      return { ok: false, reason: 'invalid' };
    }
    if (found.status === 'suspended') {
      return { ok: false, reason: 'suspended' };
    }

    // Development demo access accepts explicit demo buttons or demo passwords >= 6 chars
    if (cleanPass.length < 6) {
      return { ok: false, reason: 'invalid' };
    }

    return {
      ok: true,
      session: {
        user: found,
        isDemoMode: true,
        authenticatedAt: new Date().toISOString(),
      },
    };
  },

  loginAsDemoRole(role: 'user' | 'admin', users: UserAccount[]): AuthSession {
    const target =
      role === 'admin'
        ? users.find((u) => u.role === 'super_admin' || u.role === 'admin') ?? DEMO_USERS[5]
        : users.find((u) => u.role === 'user' && u.status === 'active') ?? DEMO_USERS[0];

    return {
      user: target,
      isDemoMode: true,
      authenticatedAt: new Date().toISOString(),
    };
  },
};

/**
 * Backend-ready Binance Spot API integration adapter.
 * IMPORTANT: Never persists API secrets in localStorage.
 * Production backend will encrypt API credentials using AES-256-GCM at rest on the host server.
 */
export const binanceService = {
  getInitialState(): BinanceConnectionState {
    return { ...DEMO_BINANCE_CONNECTION };
  },

  async verifyAndConnect(apiKeyInput: string, apiSecretInput: string): Promise<BinanceConnectionState> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      ...DEMO_BINANCE_CONNECTION,
      connected: true,
      maskedApiKey: maskCredential(apiKeyInput, 4, 4),
      maskedApiSecret: maskCredential(apiSecretInput, 0, 4),
      lastSyncAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      spotTradingEnabled: true,
      readInfoEnabled: true,
      withdrawalsDisabled: true,
    };
  },

  async testConnection(current: BinanceConnectionState): Promise<{ ok: boolean; latencyMs: number; syncedAt: string }> {
    await new Promise((r) => setTimeout(r, 450));
    return {
      ok: current.connected,
      latencyMs: 38,
      syncedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    };
  },
};

/**
 * Backend-ready Telegram Bot integration adapter.
 */
export const telegramService = {
  getInitialState(): TelegramConnectionState {
    return {
      ...DEMO_TELEGRAM_CONNECTION,
      prefs: { ...DEMO_TELEGRAM_CONNECTION.prefs },
    };
  },

  regenerateCode(): { code: string; expiresAt: number } {
    return {
      code: generateConnectionCode('OXV'),
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
  },

  async simulateConnect(handle: string): Promise<{ connected: boolean; handle: string }> {
    await new Promise((r) => setTimeout(r, 450));
    const formatted = handle.trim() ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`) : '@trader_oxv';
    return { connected: true, handle: formatted };
  },
};

/**
 * Deterministic trading engine state adapter.
 */
export const tradingEngineService = {
  nextStatusLabel(status: BotStatus): string {
    if (status === 'running') return 'Active & Scanning';
    if (status === 'paused') return 'Paused (Monitoring Only)';
    return 'Stopped';
  },
};
