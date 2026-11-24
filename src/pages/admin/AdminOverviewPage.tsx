import React from 'react';
import { Activity, Bot, Users, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AuditLogEntry, UserAccount } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AdminOverviewPageProps {
  t: TranslationDictionary;
  users: UserAccount[];
  auditLogs: AuditLogEntry[];
  stats?: { totalUsers: number; activeAccounts: number; runningBots: number };
}

const ADMIN_VOLUME_SERIES: { day: string; volume: number }[] = [];

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ t, users, auditLogs, stats }) => {
  const activeCount = users.filter((u) => u.status === 'active').length;
  const runningBots = users.filter((u) => u.botStatus === 'running').length;

  const cards = [
    {
      label: t.admin.totalUsers,
      value: stats?.totalUsers ?? users.length,
      prefix: '',
      decimals: 0,
      icon: <Users className="w-4 h-4 text-[#2563EB]" />,
      bg: 'bg-[#EFF6FF]',
    },
    {
      label: t.admin.activeUsers,
      value: stats?.activeAccounts ?? activeCount,
      prefix: '',
      decimals: 0,
      icon: <Activity className="w-4 h-4 text-[#16A34A]" />,
      bg: 'bg-[#F0FDF4]',
    },
    {
      label: t.admin.runningBots,
      value: stats?.runningBots ?? runningBots,
      prefix: '',
      decimals: 0,
      icon: <Bot className="w-4 h-4 text-[#2563EB]" />,
      bg: 'bg-[#EFF6FF]',
    },
    {
      label: t.admin.volume24h,
      value: 0,
      prefix: '$',
      decimals: 0,
      icon: <Wallet className="w-4 h-4 text-[#2563EB]" />,
      bg: 'bg-[#EFF6FF]',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="ox-card ox-card-hover p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B]">{c.label}</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.bg}`}>
                {c.icon}
              </span>
            </div>
            <div className="mt-3 text-2xl font-display font-bold text-[#0F172A]">
              <AnimatedNumber value={c.value} prefix={c.prefix} decimals={c.decimals} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-7">
          <h2 className="font-display font-semibold text-base text-[#0F172A] mb-4">
            {t.admin.volume24h}
          </h2>
          <div className="h-[240px] w-full">
            {ADMIN_VOLUME_SERIES.length ? <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_VOLUME_SERIES} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="oxvAdminBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(v) => `$${Number(v ?? 0).toLocaleString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#oxvAdminBlue)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-sm text-[#64748B]">{t.common.noData}</div>}
          </div>
        </section>

        <section className="ox-card p-6 lg:col-span-5">
          <h2 className="font-display font-semibold text-base text-[#0F172A] mb-4">
            {t.admin.recentActions}
          </h2>
          <div className="divide-y divide-[#F1F5F9]">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{log.action}</p>
                  <p className="text-xs text-[#64748B] truncate">
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
        </section>
      </div>
    </div>
  );
};
