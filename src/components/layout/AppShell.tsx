import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  PieChart,
  Server,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { AppRoute, LanguageCode, UserAccount } from '../../types';
import { TranslationDictionary, translatePlan } from '../../i18n/translations';
import { OxinvoLogo } from '../ui/OxinvoLogo';
import { LanguageSelector } from '../ui/LanguageSelector';

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
    { id: 'trades', label: t.nav.trades, icon: <ArrowLeftRight className="w-[18px] h-[18px]" /> },
    { id: 'portfolio', label: t.nav.portfolio, icon: <PieChart className="w-[18px] h-[18px]" /> },
    { id: 'analytics', label: t.nav.analytics, icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    { id: 'connections', label: t.nav.connections, icon: <Link2 className="w-[18px] h-[18px]" /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin-overview', label: t.adminNav.overview, icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'admin-users', label: t.adminNav.users, icon: <Users className="w-[18px] h-[18px]" /> },
    { id: 'admin-activity', label: t.adminNav.activity, icon: <Activity className="w-[18px] h-[18px]" /> },
    { id: 'admin-analytics', label: t.adminNav.analytics, icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    { id: 'admin-subscriptions', label: t.adminNav.subscriptions, icon: <CreditCard className="w-[18px] h-[18px]" /> },
    { id: 'admin-ai-providers', label: t.adminNav.aiProviders, icon: <Cpu className="w-[18px] h-[18px]" /> },
    { id: 'admin-system-health', label: t.adminNav.systemHealth, icon: <Server className="w-[18px] h-[18px]" /> },
    { id: 'admin-notifications', label: t.adminNav.notifications, icon: <Bell className="w-[18px] h-[18px]" /> },
    { id: 'admin-audit-logs', label: t.adminNav.auditLogs, icon: <FileText className="w-[18px] h-[18px]" /> },
    { id: 'admin-settings', label: t.adminNav.settings, icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const navItems = isAdminMode ? adminNav : userNav;

  const isRouteSelected = (itemId: AppRoute): boolean => {
    if (activeRoute === itemId) return true;
    if (itemId === 'trades' && (activeRoute === 'live-trades' || activeRoute === 'trade-history')) return true;
    if (itemId === 'connections' && (activeRoute === 'binance' || activeRoute === 'telegram')) return true;
    if (itemId === 'admin-users' && activeRoute === 'admin-user-detail') return true;
    return false;
  };

  const resolvePageTitle = (): string => {
    if (activeRoute === 'notifications') return t.account.notificationsTitle;
    if (activeRoute === 'help') return t.account.helpTitle;
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
    <div className="min-h-screen flex bg-[#F4F7FC] text-[#0F172A]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#E2E8F0] transition-[width] duration-200 ease-out sticky top-0 h-screen ${
          collapsed ? 'w-[74px]' : 'w-[224px]'
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-[#E2E8F0] px-4 ${
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
            <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">
              {t.adminNav.adminBadge}
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isRouteSelected(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className={`shrink-0 ${active ? 'text-[#2563EB]' : 'text-[#64748B]'}`}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0] space-y-1">
          {canAccessAdmin && (
            <button
              type="button"
              onClick={() => onToggleAdminMode(!isAdminMode)}
              title={collapsed ? (isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel) : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#2563EB] bg-[#EFF6FF]/70 hover:bg-[#EFF6FF] transition-colors ${
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
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? t.nav.expand : t.nav.collapse}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors ${
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
            className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] h-full bg-white border-r border-[#E2E8F0] flex flex-col shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
              <OxinvoLogo size={26} compact />
              <button
                type="button"
                aria-label={t.common.close}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#E2E8F0] space-y-1">
              {canAccessAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleAdminMode(!isAdminMode);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#2563EB] bg-[#EFF6FF]"
                >
                  <Shield className="w-[18px] h-[18px]" />
                  <span>{isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2]"
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
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] ox-glass flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="font-display font-semibold text-base sm:text-lg text-[#0F172A] truncate">
              {resolvePageTitle()}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[11px] font-medium">
              PAPER
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <LanguageSelector language={language} onChange={onLanguageChange} />

            {/* Notifications Bell */}
            <button
              type="button"
              aria-label={t.nav.notifications}
              onClick={() => onNavigate(isAdminMode ? 'admin-notifications' : 'notifications')}
              className={`relative p-2 rounded-xl border transition-colors ${
                activeRoute === 'notifications' || activeRoute === 'admin-notifications'
                  ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                  : 'bg-white border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563EB] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
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
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <span className="hidden sm:block text-left max-w-[120px] truncate text-xs font-medium text-[#0F172A]">
                  {user.fullName}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_16px_40px_rgba(15,23,42,0.12)] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{user.fullName}</p>
                    <p className="text-xs text-[#64748B] truncate">
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
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <Settings className="w-4 h-4 text-[#64748B]" />
                      <span>{t.nav.settings}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('help');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#64748B]" />
                      <span>{t.nav.help}</span>
                    </button>

                    {canAccessAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onToggleAdminMode(!isAdminMode);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{isAdminMode ? t.adminNav.backToUser : t.nav.adminPanel}</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2]"
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

        {/* Workspace Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1380px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
