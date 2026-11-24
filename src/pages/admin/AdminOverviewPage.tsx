import React from 'react';
import { Activity, BarChart3, Bot, FileText, Users, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AuditLogEntry, UserAccount } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTheme } from '../../components/ui/ThemeContext';

interface AdminOverviewPageProps {
  t: TranslationDictionary;
  users: UserAccount[];
  auditLogs: AuditLogEntry[];
  stats?: { totalUsers: number; activeAccounts: number; runningBots: number };
}

const ADMIN_VOLUME_SERIES: { day: string; volume: number }[] = [];

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ t, users, auditLogs, stats }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const activeCount = users.filter((u) => u.status === 'active').length;
  const runningBots = users.filter((u) => u.botStatus === 'running').length;

  const cards = [
    {
      label: t.admin.totalUsers,
      value: stats?.totalUsers ?? users.length,
      prefix: '',
      decimals: 0,
      icon: <Users className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      bg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
    {
      label: t.admin.activeUsers,
      value: stats?.activeAccounts ?? activeCount,
      prefix: '',
      decimals: 0,
      icon: <Activity className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />,
      bg: 'bg-[#ECFDF5] dark:bg-[#064E3B]/40 border border-[#A7F3D0]/60 dark:border-[#047857]/60',
    },
    {
      label: t.admin.runningBots,
      value: stats?.runningBots ?? runningBots,
      prefix: '',
      decimals: 0,
      icon: <Bot className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      bg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
    {
      label: t.admin.volume24h,
      value: 0,
      prefix: '$',
      decimals: 0,
      icon: <Wallet className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      bg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="ox-card ox-card-hover p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{c.label}</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.bg}`}>
                {c.icon}
              </span>
            </div>
            <div className="mt-3 text-2xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] tabular-nums">
              <AnimatedNumber value={c.value} prefix={c.prefix} decimals={c.decimals} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-7">
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
            {t.admin.volume24h}
          </h2>
          <div className="h-[240px] w-full">
            {ADMIN_VOLUME_SERIES.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ADMIN_VOLUME_SERIES} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="oxvAdminBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDark ? '#3B82F6' : '#2563EB'} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={isDark ? '#0B1324' : '#FFFFFF'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1B2942' : '#E2E8F0'} vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                    tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0B1324' : '#FFFFFF',
                      borderColor: isDark ? '#1B2942' : '#E2E8F0',
                      borderRadius: '12px',
                      color: isDark ? '#F1F5F9' : '#0A1428',
                      fontSize: '12px',
                    }}
                    formatter={(v) => `$${Number(v ?? 0).toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke={isDark ? '#3B82F6' : '#2563EB'}
                    strokeWidth={2.5}
                    fill="url(#oxvAdminBlue)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                compact
                icon={<BarChart3 className="w-5 h-5" />}
                title={t.common.noData}
              />
            )}
          </div>
        </section>

        <section className="ox-card p-6 lg:col-span-5">
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
            {t.admin.recentActions}
          </h2>
          {auditLogs.length === 0 ? (
            <EmptyState
              compact
              icon={<FileText className="w-5 h-5" />}
              title={t.common.noData}
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0A1428] dark:text-[#F1F5F9] truncate">{log.action}</p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">
                      {log.actor} → {log.target}
                    </p>
                  </div>
                  <StatusBadge
                    tone={log.severity === 'warning' ? 'amber' : 'blue'}
                    label={log.timestamp.slice(0, 10)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
