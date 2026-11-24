import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { TRANSLATIONS } from './i18n/translations';
import { ACCOUNT_COPY } from './i18n/account';
import {
  AppRoute,
  AuditLogEntry,
  BinanceConnectionState,
  LanguageCode,
  NotificationItem,
  PortfolioPoint,
  PublicContactConfig,
  PublicRoute,
  RiskConfigState,
  StrategyMode,
  TelegramConnectionState,
  TimeframeKey,
  Trade,
  UserAccount,
} from './types';
import { api, clearApiSession, refreshCsrf, setCsrfToken } from './services/api';
import { mapAudit, mapTrade, mapUser, Plan, ServerUser } from './services/account-mappers';
import { ThemeProvider } from './components/ui/ThemeContext';
import { ToastProvider, useToast } from './components/ui/ToastProvider';
import { BootLoader } from './components/layout/BootLoader';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { AboutPage, ContactPage, LegalPage } from './pages/public/PublicPages';
import { CredentialsModal, OneTimeCredentials } from './components/ui/CredentialsModal';
import { MagneticButton } from './components/ui/MagneticButton';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { AITradingEnginePage } from './pages/dashboard/AITradingEnginePage';
import { MarketScannerPage } from './pages/dashboard/MarketScannerPage';
import { AIAnalysisPage } from './pages/dashboard/AIAnalysisPage';
import { TradesViewPage } from './pages/dashboard/TradesViewPage';
import { TradeDetailModal } from './pages/dashboard/TradeDetailModal';
import { AnalyticsPage, PortfolioPage } from './pages/dashboard/PortfolioAndAnalyticsPages';
import { ConnectionsPage } from './pages/dashboard/ConnectionsPage';
import { HelpCenterPage, NotificationsPage, SettingsPage } from './pages/dashboard/AccountSupportPages';
import { AffiliatePage, RiskManagementPage, SupportPage } from './pages/dashboard/RiskAffiliateSupportPages';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { CreateUserModal } from './pages/admin/CreateUserModal';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import {
  AdminActivityPage,
  AdminAnalyticsPage,
  AdminAuditLogsPage,
  AdminNotificationsPage,
} from './pages/admin/AdminOperationsPages';
import { AccountSecurity, ProviderSettings, SystemSettings } from './pages/admin/RealManagementPages';
import {
  AdminAffiliatePage,
  AdminBinanceStatusesPage,
  AdminRiskMonitoringPage,
  AdminSecurityPage,
  AdminSupportRequestsPage,
} from './pages/admin/AdminExtraPages';

const emptySeries: Record<TimeframeKey, PortfolioPoint[]> = {
  '1D': [],
  '1W': [],
  '1M': [],
  '3M': [],
  '1Y': [],
  ALL: [],
};

const emptyBinance: BinanceConnectionState = {
  connected: false,
  maskedApiKey: '—',
  maskedApiSecret: '—',
  lastSyncAt: '—',
  spotTradingEnabled: false,
  readInfoEnabled: false,
  withdrawalsDisabled: false,
  estimatedTotalUsd: 0,
  availableUsd: 0,
  balances: [],
};

const emptyTelegram: TelegramConnectionState = {
  connected: false,
  handle: '—',
  connectionCode: '',
  codeExpiresAt: 0,
  botUsername: '—',
  prefs: {
    buyExecuted: false,
    sellExecuted: false,
    profitNotification: false,
    lossNotification: false,
    balanceUpdate: false,
    aiOpportunityDetected: false,
    botStarted: false,
    botStopped: false,
    connectionErrors: false,
    dailyTradingSummary: false,
  },
};

const defaultRiskConfig: RiskConfigState = {
  riskLevel: 'BALANCED',
  stopLossPct: 2.5,
  takeProfitPct: 5.0,
  maxDailyLossPct: 4.0,
  tradeAmountUsd: 100,
  selectedPair: 'BTC/USDT',
  tradingMode: 'PAPER',
  realTradingEnabled: false,
};

const defaultContactConfig: PublicContactConfig = {
  whatsappUrl: '',
  telegramUrl: '',
  supportEmail: '',
  supportHandle: '',
};

const SUPPORTED_LANGS: LanguageCode[] = ['az', 'en', 'tr', 'ru'];
const PUBLIC_ROUTES: PublicRoute[] = ['login', 'about', 'contact', 'privacy', 'terms', 'risk'];

function parseInitialPublicLocation(): { route: PublicRoute; langFromPath: LanguageCode | null } {
  if (typeof window === 'undefined') return { route: 'login', langFromPath: null };
  const segments = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
  let langFromPath: LanguageCode | null = null;
  let routeSeg = segments[0] ?? '';
  if (SUPPORTED_LANGS.includes(routeSeg as LanguageCode)) {
    langFromPath = routeSeg as LanguageCode;
    routeSeg = segments[1] ?? '';
  }
  const route: PublicRoute = PUBLIC_ROUTES.includes(routeSeg as PublicRoute)
    ? (routeSeg as PublicRoute)
    : 'login';
  return { route, langFromPath };
}

function Workspace() {
  const { showToast } = useToast();
  const epoch = useRef(0);
  const initialLoc = useRef(parseInitialPublicLocation());

  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (initialLoc.current.langFromPath) return initialLoc.current.langFromPath;
    try {
      const value = localStorage.getItem('oxinvo_language');
      if (SUPPORTED_LANGS.includes(value as LanguageCode)) return value as LanguageCode;
    } catch {}
    return 'az';
  });

  const t = TRANSLATIONS[language];
  const text = ACCOUNT_COPY[language];

  const [loading, setLoading] = useState(true);
  const [publicRoute, setPublicRoute] = useState<PublicRoute>(initialLoc.current.route);
  const [contactConfig, setContactConfig] = useState<PublicContactConfig>(defaultContactConfig);

  const [current, setCurrent] = useState<ServerUser | null>(null);
  const [self, setSelf] = useState<UserAccount | null>(null);
  const [route, setRoute] = useState<AppRoute>('overview');
  const [adminMode, setAdminMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [serverUsers, setServerUsers] = useState<ServerUser[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({ search: '', plan: '', status: '', page: 1 });
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userTrades, setUserTrades] = useState<Trade[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [credentials, setCredentials] = useState<OneTimeCredentials | null>(null);
  const [strategy, setStrategy] = useState<StrategyMode>('Adaptive Momentum');
  const [riskConfig, setRiskConfig] = useState<RiskConfigState>(defaultRiskConfig);
  const [adminTrades, setAdminTrades] = useState<Trade[]>([]);
  const [analyticsUsers, setAnalyticsUsers] = useState<UserAccount[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [binance, setBinance] = useState(emptyBinance);
  const [health, setHealth] = useState('—');

  const isAdmin = current?.role === 'SUPER_ADMIN' || current?.role === 'ADMIN';

  const navigatePublic = useCallback((next: PublicRoute) => {
    setPublicRoute(next);
    if (typeof window !== 'undefined') {
      const nextPath = next === 'login' ? '/' : `/${next}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ publicRoute: next }, '', nextPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseInitialPublicLocation();
      setPublicRoute(parsed.route);
      if (parsed.langFromPath) {
        setLanguage(parsed.langFromPath);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const clear = useCallback(() => {
    epoch.current++;
    clearApiSession();
    setCurrent(null);
    setSelf(null);
    setUsers([]);
    setServerUsers([]);
    setPlans([]);
    setTotal(0);
    setAudit([]);
    setAdminTrades([]);
    setAnalyticsUsers([]);
    setStats(null);
    setTrades([]);
    setNotifications([]);
    setSelectedTrade(null);
    setSelectedUser(null);
    setUserTrades([]);
    setCreateOpen(false);
    setCredentials(null);
    setOverview(null);
    setBinance(emptyBinance);
    setStrategy('Adaptive Momentum');
    setRiskConfig(defaultRiskConfig);
    setAdminMode(false);
    setChangePassword(false);
    setRoute('overview');
    setQuery({ search: '', plan: '', status: '', page: 1 });
  }, []);

  const notifyError = useCallback(() => showToast(t.auth.invalidError, 'error'), [showToast, t]);

  function applyLanguage(user: ServerUser) {
    const next = user.preferredLanguage.toLowerCase() as LanguageCode;
    if (SUPPORTED_LANGS.includes(next)) {
      setLanguage(next);
      try {
        localStorage.setItem('oxinvo_language', next);
      } catch {}
    }
  }

  async function loadMe() {
    const ticket = epoch.current;
    const value = await api.get<{ user: ServerUser }>('/auth/me');
    if (ticket !== epoch.current) throw new Error('Session changed');
    applyLanguage(value.user);
    setCurrent(value.user);
    setSelf(mapUser(value.user));
    return value.user;
  }

  useEffect(() => {
    const expired = () => clear();
    window.addEventListener('oxinvo:unauthorized', expired);
    (async () => {
      try {
        await Promise.allSettled([
          api.get<PublicContactConfig>('/public/config').then((cfg) => setContactConfig(cfg)),
          refreshCsrf().then(async () => {
            const user = await loadMe();
            setAdminMode(user.role !== 'USER');
            setRoute(user.role === 'USER' ? 'overview' : 'admin-overview');
          }),
        ]);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
    return () => window.removeEventListener('oxinvo:unauthorized', expired);
  }, [clear]);

  async function loadUsers() {
    const ticket = epoch.current;
    const params = new URLSearchParams({
      search: query.search,
      plan: query.plan,
      status: query.status,
      page: String(query.page),
      pageSize: '10',
    });
    params.set('page', String(query.page));
    if (!query.status) params.delete('status');
    if (!query.plan) params.delete('plan');
    const result = await api.get<{ items: ServerUser[]; total: number }>('/admin/users?' + params);
    if (ticket !== epoch.current) return;
    setServerUsers(result.items);
    setUsers(result.items.map(mapUser));
    setTotal(result.total);
  }

  const changeQuery = useCallback(
    (next: { search: string; plan: string; status: string }) =>
      setQuery((previous) => ({ ...previous, ...next, page: 1 })),
    [],
  );

  useEffect(() => {
    if (!current || current.mustChangePassword) return;
    const ticket = epoch.current;
    let cancelled = false;
    (async () => {
      try {
        const [info, subscriptionResult, rows, notes, connection, settings, riskResult] = await Promise.all([
          api.get<any>('/users/me/overview'),
          api.get<any>('/users/me/subscription'),
          api.get<any[]>('/users/me/trades'),
          api.get<any[]>('/users/me/notifications'),
          api.get<any>('/users/me/binance'),
          api.get<{ key: string; value: unknown }[]>('/users/me/settings'),
          api.get<RiskConfigState | null>('/users/me/risk').catch(() => null),
        ]);
        if (cancelled || ticket !== epoch.current) return;
        const subscription = subscriptionResult.subscription;
        const savedStrategy = settings.find((row) => row.key === 'strategy')?.value;
        if (typeof savedStrategy === 'string') setStrategy(savedStrategy as StrategyMode);
        if (riskResult) setRiskConfig(riskResult);
        setOverview(info);
        setSelf(
          mapUser({
            ...current,
            subscription,
            portfolioBalance: info.totalBalance,
            realizedPnl: info.totalProfit,
            totalTrades: info.totalTrades,
          }),
        );
        setTrades(rows.map(mapTrade));
        setNotifications(
          notes.map((row) => ({
            id: row.id,
            title: row.title,
            message: row.message,
            category: 'system',
            timestamp: row.createdAt,
            read: row.isRead,
          })),
        );
        setBinance({ ...emptyBinance, maskedApiKey: connection.connection ? '••••••••' : '—' });

        if (current.role !== 'USER') {
          const [planRows, counts] = await Promise.all([
            api.get<Plan[]>('/admin/subscription-plans'),
            api.get<any>('/admin/overview'),
          ]);
          if (cancelled || ticket !== epoch.current) return;
          setPlans(planRows);
          setStats(counts);
        }
        if (current.role === 'SUPER_ADMIN') {
          const logs = await api.get<{ items: any[] }>('/admin/audit-logs?pageSize=50');
          if (!cancelled && ticket === epoch.current) setAudit(logs.items.map(mapAudit));
        }
      } catch {
        if (!cancelled && ticket === epoch.current) notifyError();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [current?.id, current?.mustChangePassword]);

  useEffect(() => {
    if (isAdmin && !current?.mustChangePassword) loadUsers().catch(notifyError);
  }, [isAdmin, current?.mustChangePassword, JSON.stringify(query)]);

  async function login(username: string, password: string, rememberMe: boolean) {
    try {
      await refreshCsrf();
      const result = await api.post<{ user: ServerUser; csrfToken: string }>('/auth/login', {
        body: { username, password, rememberMe },
      });
      setCsrfToken(result.csrfToken);
      applyLanguage(result.user);
      setCurrent(result.user);
      setSelf(mapUser(result.user));
      setAdminMode(result.user.role !== 'USER');
      setRoute(result.user.role === 'USER' ? 'overview' : 'admin-overview');
      return { ok: true };
    } catch {
      return { ok: false, error: t.auth.invalidError };
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      clear();
    }
  }

  function changeLanguage(next: LanguageCode) {
    setLanguage(next);
    try {
      localStorage.setItem('oxinvo_language', next);
    } catch {}
    if (current && !current.mustChangePassword) {
      api.patch('/users/me', { body: { preferredLanguage: next.toUpperCase() } }).catch(notifyError);
    }
  }

  const unavailable = () => showToast(text.unavailable, 'info');

  async function saveRiskConfig(next: Partial<RiskConfigState>) {
    try {
      const updated = await api.patch<RiskConfigState>('/users/me/risk', { body: next });
      setRiskConfig(updated);
      showToast(t.common.updated, 'success');
    } catch {
      notifyError();
    }
  }

  async function mutate(path: string, method: 'post' | 'patch' | 'delete', body?: unknown) {
    const ticket = epoch.current;
    try {
      const result = await api[method]<any>(path, { body });
      if (ticket !== epoch.current) throw new Error('Session changed');
      void loadUsers().catch(notifyError);
      void api
        .get('/admin/overview')
        .then((value) => {
          if (ticket === epoch.current) setStats(value);
        })
        .catch(notifyError);
      showToast(t.common.updated, 'success');
      return result;
    } catch (error) {
      notifyError();
      throw error;
    }
  }

  async function selectUser(user: UserAccount) {
    try {
      const ticket = epoch.current;
      const row = await api.get<ServerUser & { trades: any[] }>('/admin/users/' + user.id);
      if (ticket !== epoch.current) return;
      setSelectedUser(mapUser(row));
      setUserTrades(row.trades.map(mapTrade));
      setRoute('admin-user-detail');
    } catch {
      notifyError();
    }
  }

  async function resetPassword(id: string) {
    const result = await mutate('/admin/users/' + id + '/reset-password', 'post');
    return result.generatedPassword as string;
  }

  async function saveUser(user: UserAccount) {
    await mutate('/admin/users/' + user.id, 'patch', {
      fullName: user.fullName,
      notes: user.notes,
      status: user.status.toUpperCase(),
    });
    const plan = plans.find((row) => row.name === user.plan);
    if (user.expiresAt !== '—') {
      await mutate('/admin/users/' + user.id + '/subscription', 'patch', {
        planId: plan?.id,
        expirationDate: new Date(user.expiresAt + 'T23:59:59Z').toISOString(),
      });
    }
    await selectUser(user);
  }

  useEffect(() => {
    if (!isAdmin || current?.mustChangePassword) return;
    let cancelled = false;
    const ticket = epoch.current;
    (async () => {
      try {
        if (route === 'admin-activity') {
          const rows = await api.get<any[]>('/admin/trades?pageSize=50');
          if (!cancelled && ticket === epoch.current) setAdminTrades(rows.map(mapTrade));
        }
        if (route === 'admin-analytics') {
          const rows = await api.get<ServerUser[]>('/admin/analytics');
          if (!cancelled && ticket === epoch.current) setAnalyticsUsers(rows.map(mapUser));
        }
        if (route === 'admin-audit-logs' && current?.role === 'SUPER_ADMIN') {
          const rows = await api.get<{ items: any[] }>('/admin/audit-logs?pageSize=50');
          if (!cancelled && ticket === epoch.current) setAudit(rows.items.map(mapAudit));
        }
      } catch {
        if (!cancelled) notifyError();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [route, current?.id, current?.mustChangePassword]);

  const active = trades.filter((trade) => trade.status === 'active');
  const history = trades.filter((trade) => trade.status === 'closed');

  function render() {
    if (adminMode && isAdmin) {
      switch (route) {
        case 'admin-users':
          return (
            <AdminUsersPage
              t={t}
              users={users}
              onSelectUser={(user) => void selectUser(user)}
              onOpenCreateUser={() => setCreateOpen(true)}
              onToggleSuspend={(id) =>
                void mutate(
                  '/admin/users/' +
                    id +
                    '/' +
                    (users.find((user) => user.id === id)?.status === 'suspended' ? 'activate' : 'suspend'),
                  'post',
                ).catch(() => {})
              }
              onResetPassword={(id) =>
                void resetPassword(id)
                  .then((password) =>
                    setCredentials({
                      username: users.find((user) => user.id === id)?.username ?? '',
                      password,
                      expirationDate: users.find((user) => user.id === id)?.expiresAt ?? '—',
                    }),
                  )
                  .catch(() => {})
              }
              onDeleteUser={(id) => void mutate('/admin/users/' + id, 'delete').catch(() => {})}
              onQueryChange={changeQuery}
              page={query.page}
              total={total}
              onPageChange={(page) => setQuery((previous) => ({ ...previous, page }))}
            />
          );
        case 'admin-user-detail':
          return (
            selectedUser && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <MagneticButton
                    variant="secondary"
                    onClick={() => void mutate('/admin/users/' + selectedUser.id + '/revoke-sessions', 'post').catch(() => {})}
                  >
                    {text.revoke}
                  </MagneticButton>
                  <MagneticButton
                    variant="secondary"
                    onClick={() =>
                      void mutate('/admin/users/' + selectedUser.id + '/subscription', 'patch', { extendDays: 30 })
                        .then(() => selectUser(selectedUser))
                        .catch(() => {})
                    }
                  >
                    {text.extend}
                  </MagneticButton>
                  {current?.role === 'SUPER_ADMIN' && (
                    <select
                      aria-label={text.role}
                      className="rounded-xl border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] text-[#0A1428] dark:text-[#F1F5F9] px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2563EB]"
                      value={selectedUser.role.toUpperCase()}
                      onChange={(event) =>
                        void mutate('/admin/users/' + selectedUser.id, 'patch', { role: event.target.value })
                          .then(() => selectUser(selectedUser))
                          .catch(() => {})
                      }
                    >
                      {['USER', 'ADMIN', 'SUPER_ADMIN'].map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </div>
                <AdminUserDetailPage
                  key={selectedUser.id + selectedUser.expiresAt + selectedUser.status}
                  t={t}
                  user={selectedUser}
                  userTrades={userTrades}
                  onBack={() => setRoute('admin-users')}
                  onUpdateUser={(user) => void saveUser(user).catch(() => {})}
                  onIssuePasswordReset={resetPassword}
                />
              </div>
            )
          );
        case 'admin-activity':
          return <AdminActivityPage t={t} trades={adminTrades} />;
        case 'admin-analytics':
          return <AdminAnalyticsPage t={t} users={analyticsUsers} />;
        case 'admin-subscriptions':
          return (
            <AdminSubscriptionsPage
              t={t}
              users={users}
              counts={Object.fromEntries(plans.map((plan) => [plan.name, plan._count?.subscriptions ?? 0]))}
              tiers={plans.map((plan) => ({
                id: plan.name as any,
                name: plan.name,
                audience: '',
                monthlyPriceLabel: '—',
                maxBots: 0,
                maxPairs: 0,
                aiProvidersAllowed: '—',
                telegramAlerts: false,
                priorityExecution: false,
              }))}
            />
          );
        case 'admin-risk':
          return <AdminRiskMonitoringPage language={language} t={t} />;
        case 'admin-binance':
          return <AdminBinanceStatusesPage language={language} t={t} />;
        case 'admin-affiliate':
          return <AdminAffiliatePage language={language} t={t} />;
        case 'admin-support':
          return <AdminSupportRequestsPage language={language} t={t} />;
        case 'admin-security':
          return <AdminSecurityPage language={language} onChangePassword={() => setChangePassword(true)} />;
        case 'admin-ai-providers':
          return current?.role === 'SUPER_ADMIN' ? <ProviderSettings language={language} /> : <p className="text-sm text-[#DC2626] dark:text-[#F87171]">{t.auth.invalidError}</p>;
        case 'admin-system-health':
          return (
            <div className="ox-card p-6 space-y-4">
              <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">{t.admin.healthTitle}</h2>
              <MagneticButton
                onClick={() =>
                  api
                    .get<{ status: string }>('/health/database')
                    .then((row) => setHealth(row.status))
                    .catch(() => setHealth('unavailable'))
                }
              >
                {t.admin.database}
              </MagneticButton>
              <p className="font-mono text-sm text-[#0A1428] dark:text-[#F1F5F9]">{health}</p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{text.unavailable}: Trading engine / Telegram / AI</p>
            </div>
          );
        case 'admin-notifications':
          return (
            <AdminNotificationsPage
              t={t}
              onBroadcast={(title, message) =>
                void api
                  .post('/admin/notifications', { body: { title, message } })
                  .then(() => showToast(t.common.updated, 'success'))
                  .catch(notifyError)
              }
            />
          );
        case 'admin-audit-logs':
          return current?.role === 'SUPER_ADMIN' ? <AdminAuditLogsPage t={t} logs={audit} /> : <p className="text-sm text-[#DC2626] dark:text-[#F87171]">{t.auth.invalidError}</p>;
        case 'admin-settings':
          return current?.role === 'SUPER_ADMIN' ? <SystemSettings language={language} /> : <p className="text-sm text-[#DC2626] dark:text-[#F87171]">{t.auth.invalidError}</p>;
        default:
          return <AdminOverviewPage t={t} users={users} auditLogs={audit} stats={stats} />;
      }
    }

    switch (route) {
      case 'ai-engine':
        return (
          <AITradingEnginePage
            language={language}
            t={t}
            botStatus="stopped"
            strategy={strategy}
            riskConfig={riskConfig}
            assetsScanned={0}
            opportunitiesDetected={0}
            activeTradesCount={active.length}
            todayPnl={0}
            activityFeed={[]}
            decisions={[]}
            onBotStatusChange={unavailable}
            onStrategyChange={(next) => {
              api
                .patch('/users/me/settings', { body: { strategy: next } })
                .then(() => {
                  setStrategy(next);
                  showToast(t.common.updated, 'success');
                })
                .catch(notifyError);
            }}
            onSaveRiskConfig={saveRiskConfig}
          />
        );
      case 'scanner':
        return <MarketScannerPage t={t} assets={[]} />;
      case 'ai-analysis':
        return <AIAnalysisPage language={language} onOpenConnections={() => setRoute('connections')} />;
      case 'trades':
      case 'live-trades':
      case 'trade-history':
        return (
          <TradesViewPage
            t={t}
            initialMode={route === 'trade-history' ? 'history' : 'active'}
            activeTrades={active}
            historyTrades={history}
            onSelectTrade={setSelectedTrade}
          />
        );
      case 'portfolio':
        return <PortfolioPage t={t} balances={[]} totalValueUsd={Number(overview?.totalBalance ?? 0)} availableUsd={0} />;
      case 'analytics':
        return <AnalyticsPage t={t} activeTrades={active} historyTrades={history} />;
      case 'risk':
        return <RiskManagementPage language={language} riskConfig={riskConfig} onSave={saveRiskConfig} />;
      case 'connections':
      case 'binance':
      case 'telegram':
        return (
          <ConnectionsPage
            t={t}
            initialTab={route === 'telegram' ? 'telegram' : 'binance'}
            binance={binance}
            telegram={emptyTelegram}
            onSaveBinance={(apiKey, apiSecret) =>
              void api
                .patch('/users/me/binance', { body: { apiKey, apiSecret } })
                .then(() => showToast(t.common.updated + ' · ' + text.unavailable, 'info'))
                .catch(notifyError)
            }
            onTestBinance={async () => unavailable()}
            onDisconnectBinance={unavailable}
            onRegenerateTelegramCode={unavailable}
            onSendTelegramTest={unavailable}
            onToggleTelegramPref={unavailable}
            onToggleTelegramConnected={unavailable}
          />
        );
      case 'affiliate':
        return <AffiliatePage language={language} t={t} />;
      case 'notifications':
        return (
          <NotificationsPage
            t={t}
            notifications={notifications}
            onMarkRead={(id) =>
              void api
                .patch('/users/me/notifications/' + id + '/read')
                .then(() => setNotifications((previous) => previous.map((row) => (row.id === id ? { ...row, read: true } : row))))
                .catch(notifyError)
            }
            onMarkAllRead={() =>
              void Promise.all(
                notifications.filter((row) => !row.read).map((row) => api.patch('/users/me/notifications/' + row.id + '/read')),
              )
                .then(() => setNotifications((previous) => previous.map((row) => ({ ...row, read: true }))))
                .catch(notifyError)
            }
          />
        );
      case 'support':
        return (
          <div className="space-y-6">
            <SupportPage language={language} t={t} />
            <HelpCenterPage t={t} />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <SettingsPage
              t={t}
              user={self!}
              language={language}
              strategy={strategy}
              onLanguageChange={changeLanguage}
              onStrategyChange={(next) => {
                api
                  .patch('/users/me/settings', { body: { strategy: next } })
                  .then(() => setStrategy(next))
                  .catch(notifyError);
              }}
            />
            <AccountSecurity language={language} onChangePassword={() => setChangePassword(true)} />
          </div>
        );
      case 'help':
        return <HelpCenterPage t={t} />;
      default:
        return (
          <OverviewPage
            language={language}
            t={t}
            totalBalance={Number(overview?.totalBalance ?? 0)}
            totalProfit={Number(overview?.totalProfit ?? 0)}
            todayProfit={0}
            botStatus={(overview?.botStatus?.toLowerCase() ?? 'stopped') as UserAccount['botStatus']}
            riskConfig={riskConfig}
            binanceConnected={Boolean(overview?.binanceIntegrated)}
            activeTrades={active}
            recentTrades={history}
            opportunities={[]}
            portfolioSeries={emptySeries}
            onNavigate={setRoute}
            onSelectTrade={setSelectedTrade}
          />
        );
    }
  }

  if (loading) return <BootLoader visible label={t.tagline} />;

  if (!current) {
    if (publicRoute === 'about') {
      return (
        <AboutPage
          language={language}
          contactConfig={contactConfig}
          onNavigate={navigatePublic}
          onLanguageChange={changeLanguage}
        />
      );
    }
    if (publicRoute === 'contact') {
      return (
        <ContactPage
          language={language}
          contactConfig={contactConfig}
          onNavigate={navigatePublic}
          onLanguageChange={changeLanguage}
        />
      );
    }
    if (publicRoute === 'privacy' || publicRoute === 'terms' || publicRoute === 'risk') {
      return (
        <LegalPage
          language={language}
          contactConfig={contactConfig}
          doc={publicRoute}
          onNavigate={navigatePublic}
          onLanguageChange={changeLanguage}
        />
      );
    }
    return (
      <LoginPage
        language={language}
        t={t}
        contactConfig={contactConfig}
        onLanguageChange={changeLanguage}
        onNavigatePublic={navigatePublic}
        onLogin={login}
      />
    );
  }

  if (current.mustChangePassword || changePassword) {
    return (
      <ChangePasswordPage
        language={language}
        onComplete={async () => {
          setChangePassword(false);
          await loadMe();
        }}
      />
    );
  }

  return (
    <>
      <AppShell
        user={self ?? mapUser(current)}
        activeRoute={route}
        isAdminMode={adminMode}
        canAccessAdmin={Boolean(isAdmin)}
        unreadNotifications={notifications.filter((row) => !row.read).length}
        language={language}
        t={t}
        onLanguageChange={changeLanguage}
        onNavigate={setRoute}
        onToggleAdminMode={(value) => {
          setAdminMode(value);
          setRoute(value ? 'admin-overview' : 'overview');
        }}
        onLogout={() => void logout()}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EFF6FF]/75 dark:bg-[#0B1324] border border-[#BFDBFE]/70 dark:border-[#1B2942] text-xs font-mono text-[#1E3A8A] dark:text-[#93C5FD] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]" />
          <span>PAPER · {text.unavailable} Binance / Telegram / AI</span>
        </div>
        {render()}
      </AppShell>
      <TradeDetailModal trade={selectedTrade} t={t} onClose={() => setSelectedTrade(null)} />
      <CreateUserModal
        open={createOpen}
        t={t}
        language={language}
        plans={plans}
        canCreateAdmin={current.role === 'SUPER_ADMIN'}
        onClose={() => setCreateOpen(false)}
        onCreate={async (data) => {
          const result = await mutate('/admin/users', 'post', data);
          setCreateOpen(false);
          setCredentials({
            username: result.user.username,
            password: result.generatedPassword,
            expirationDate: result.subscription.expirationDate.slice(0, 10),
          });
        }}
      />
      <CredentialsModal value={credentials} language={language} onClose={() => setCredentials(null)} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <Workspace />
        </ToastProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
