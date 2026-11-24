import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  History,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  Lock,
  LogOut,
  Menu,
  PieChart,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { AppRoute, LanguageCode, UserAccount } from '../../types';
import { TranslationDictionary, translatePlan } from '../../i18n/translations';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { OxinvoLogo } from '../ui/OxinvoLogo';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeContext';

interface AppShellProps {
  user: UserAccount;
  activeRoute: AppRoute;
  isAdminMode: boolean;
  canAccessAdmin: boolean;
  unreadNotifications: number;
  language: LanguageCode;
  t: TranslationDictionary;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (route: AppRoute) => void;
  onToggleAdminMode: (admin: boolean) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  user,
  activeRoute,
  isAdminMode,
  canAccessAdmin,
  unreadNotifications,
  language,
  t,
  onLanguageChange,
  onNavigate,
  onToggleAdminMode,
  onLogout,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const extra = EXTRA_COPY[language];

  useEffect(() => {
    if (!profileOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  const userNav: NavItem[] = [
    { id: 'overview', label: t.nav.overview, icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'ai-engine', label: t.nav.aiBot, icon: <Bot className="w-[18px] h-[18px]" /> },
    { id: 'scanner', label: t.nav.markets, icon: <Globe className="w-[18px] h-[18px]" /> },
    { id: 'ai-analysis', label: extra.dashboardNav.aiAnalysis, icon: <BrainCircuit className="w-[18px] h-[18px]" /> },
    { id: 'live-trades', label: extra.dashboardNav.openTrades, icon: <ArrowLeftRight className="w-[18px] h-[18px]" /> },
    { id: 'trade-history', label: extra.dashboardNav.tradeHistory, icon: <History className="w-[18px] h-[18px]" /> },
    { id: 'portfolio', label: t.nav.portfolio, icon: <PieChart className="w-[18px] h-[18px]" /> },
    { id: 'risk', label: extra.dashboardNav.riskManagement, icon: <ShieldAlert className="w-[18px] h-[18px]" /> },
    { id: 'connections', label: extra.dashboardNav.binanceConnection, icon: <Link2 className="w-[18px] h-[18px]" /> },
    { id: 'affiliate', label: extra.dashboardNav.affiliate, icon: <Share2 className="w-[18px] h-[18px]" /> },
    {
      id: 'notifications',
      label: t.nav.notifications,
      icon: <Bell className="w-[18px] h-[18px]" />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    { id: 'support', label: extra.dashboardNav.support, icon: <LifeBuoy className="w-[18px] h-[18px]" /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin-overview', label: t.adminNav.overview, icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'admin-users', label: t.adminNav.users, icon: <Users className="w-[18px] h-[18px]" /> },
    { id: 'admin-subscriptions', label: t.adminNav.subscriptions, icon: <CreditCard className="w-[18px] h-[18px]" /> },
    { id: 'admin-activity', label: t.adminNav.activity, icon: <Activity className="w-[18px] h-[18px]" /> },
    { id: 'admin-analytics', label: t.adminNav.analytics, icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    { id: 'admin-risk', label: extra.adminExtraNav.riskMonitoring, icon: <ShieldAlert className="w-[18px] h-[18px]" /> },
    { id: 'admin-binance', label: extra.adminExtraNav.binanceStatuses, icon: <Link2 className="w-[18px] h-[18px]" /> },
    { id: 'admin-affiliate', label: extra.adminExtraNav.affiliate, icon: <Share2 className="w-[18px] h-[18px]" /> },
    { id: 'admin-support', label: extra.adminExtraNav.supportRequests, icon: <LifeBuoy className="w-[18px] h-[18px]" /> },
    { id: 'admin-ai-providers', label: t.adminNav.aiProviders, icon: <Cpu className="w-[18px] h-[18px]" /> },
    { id: 'admin-notifications', label: t.adminNav.notifications, icon: <Bell className="w-[18px] h-[18px]" /> },
    { id: 'admin-audit-logs', label: t.adminNav.auditLogs, icon: <FileText className="w-[18px] h-[18px]" /> },
    { id: 'admin-system-health', label: t.adminNav.systemHealth, icon: <Server className="w-[18px] h-[18px]" /> },
    { id: 'admin-security', label: extra.adminExtraNav.security, icon: <Lock className="w-[18px] h-[18px]" /> },
    { id: 'admin-settings', label: t.adminNav.settings, icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const navItems = isAdminMode ? adminNav : userNav;

  const isRouteSelected = (itemId: AppRoute): boolean => {
    if (activeRoute === itemId) return true;
    if (itemId === 'live-trades' && activeRoute === 'trades') return true;
    if (itemId === 'connections' && (activeRoute === 'binance' || activeRoute === 'telegram')) return true;
    if (itemId === 'admin-users' && activeRoute === 'admin-user-detail') return true;
    return false;
  };

  const resolvePageTitle = (): string => {
    if (activeRoute === 'notifications') return t.account.notificationsTitle;
    if (activeRoute === 'help') return t.account.helpTitle;
    if (activeRoute === 'analytics') return t.nav.analytics;
    if (activeRoute === 'admin-user-detail') return t.admin.usersTitle;
    const matched = navItems.find((item) => isRouteSelected(item.id));
    return matched ? matched.label : 'OXINVO';
  };

  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const handleSelectNav = (id: AppRoute) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#F6F8FC] text-[#0A1428] dark:bg-[#060B16] dark:text-[#F1F5F9]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white dark:bg-[#080F1D] border-r border-[#E2E8F0] dark:border-[#1B2942] transition-[width] duration-200 ease-out sticky top-0 h-screen ${
          collapsed ? 'w-[74px]' : 'w-[252px]'
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-[#E2E8F0] dark:border-[#1B2942] px-4 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate(isAdminMode ? 'admin-overview' : 'overview')}
            className="focus:outline-none"
            aria-label="OXINVO Home"
          >
            <OxinvoLogo size={28} showWordmark={!collapsed} compact />
          </button>
          {!collapsed && isAdminMode && (
            <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border border-[#BFDBFE] dark:border-[#1D4ED8] text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-mono font-semibold uppercase tracking-wider">
              {t.adminNav.adminBadge}
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isRouteSelected(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                title={collapsed ? item.label : undefined}
                className={`relative w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ox-app-nav-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/70 dark:border-[#1E3A8A]/70"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex items-center gap-3 min-w-0">
                  <span
                    className={`shrink-0 ${
                      active ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </span>
                {!collapsed && item.badge && (
                  <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-mono font-semibold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1B2942] space-y-1">
          {canAccessAdmin && (
            <button
              type="button"
              onClick={() => onToggleAdminMode(!isAdminMode)}
              title={collapsed ? (isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel) : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF]/75 dark:bg-[#111C33] hover:bg-[#EFF6FF] dark:hover:bg-[#172544] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Shield className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && (
                <span className="truncate">
                  {isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? t.nav.logout : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/20 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{t.nav.logout}</span>}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? t.nav.expand : t.nav.collapse}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px] shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{t.nav.collapse}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0A1428]/45 dark:bg-[#020617]/75 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-68 max-w-[84vw] h-full bg-white dark:bg-[#080F1D] border-r border-[#E2E8F0] dark:border-[#1B2942] flex flex-col shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0] dark:border-[#1B2942]">
              <OxinvoLogo size={26} compact />
              <button
                type="button"
                aria-label={t.common.close}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-[#F1F5F9] hover:bg-[#F1F5F9] dark:hover:bg-[#111C33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const active = isRouteSelected(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] font-semibold'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629]'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-mono tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1B2942] space-y-1">
              {canAccessAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleAdminMode(!isAdminMode);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#111C33]"
                >
                  <Shield className="w-[18px] h-[18px]" />
                  <span>{isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/20"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] dark:border-[#1B2942] ox-glass flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0A1428] dark:hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-display font-semibold text-base sm:text-lg text-[#0A1428] dark:text-[#F1F5F9] truncate">
              {resolvePageTitle()}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE] dark:border-[#1E3A8A]/70 text-[#2563EB] dark:text-[#60A5FA] text-[11px] font-mono font-semibold">
              PAPER
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle ariaLabel={extra.theme.toggleLabel} />
            <LanguageSelector language={language} onChange={onLanguageChange} />

            {/* Notifications Bell */}
            <button
              type="button"
              aria-label={t.nav.notifications}
              onClick={() => onNavigate(isAdminMode ? 'admin-notifications' : 'notifications')}
              className={`relative p-2 rounded-xl border transition-colors ${
                activeRoute === 'notifications' || activeRoute === 'admin-notifications'
                  ? 'bg-[#EFF6FF] dark:bg-[#111C33] border-[#BFDBFE] dark:border-[#1E3A8A] text-[#2563EB] dark:text-[#60A5FA]'
                  : 'bg-white dark:bg-[#0B1324] border-[#E2E8F0] dark:border-[#1B2942] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0A1428] dark:hover:text-white hover:border-[#CBD5E1] dark:hover:border-[#273A5C]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-md bg-[#2563EB] text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-label={t.nav.profile}
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942] hover:border-[#CBD5E1] dark:hover:border-[#273A5C] transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials || 'OX'}
                </span>
                <span className="hidden sm:block text-left max-w-[120px] truncate text-xs font-medium text-[#0A1428] dark:text-[#F1F5F9]">
                  {user.fullName}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942] shadow-[0_16px_40px_rgba(10,20,40,0.14)] dark:shadow-[0_18px_44px_rgba(2,6,23,0.7)] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-[#E2E8F0] dark:border-[#1B2942]">
                    <p className="text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9] truncate">{user.fullName}</p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate font-mono">
                      @{user.username} · {translatePlan(user.plan, t)}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate(isAdminMode ? 'admin-settings' : 'settings');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#111C33] hover:text-[#0A1428] dark:hover:text-white"
                    >
                      <Settings className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                      <span>{t.nav.settings}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate(isAdminMode ? 'admin-support' : 'support');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#111C33] hover:text-[#0A1428] dark:hover:text-white"
                    >
                      <HelpCircle className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                      <span>{t.nav.help}</span>
                    </button>

                    {canAccessAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onToggleAdminMode(!isAdminMode);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#EFF6FF] dark:hover:bg-[#111C33]"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel}</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#E2E8F0] dark:border-[#1B2942]">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Container with smooth route transition */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          <motion.div
            key={activeRoute + (isAdminMode ? '-admin' : '-user')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
