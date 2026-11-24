import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SystemHealthMetrics } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AdminSystemHealthPageProps {
  t: TranslationDictionary;
  metrics: SystemHealthMetrics;
}

const TELEMETRY_SERIES = [
  { t: '10:00', cpu: 28, latency: 36 },
  { t: '10:10', cpu: 30, latency: 35 },
  { t: '10:20', cpu: 34, latency: 39 },
  { t: '10:30', cpu: 29, latency: 33 },
  { t: '10:40', cpu: 31, latency: 34 },
];

export const AdminSystemHealthPage: React.FC<AdminSystemHealthPageProps> = ({ t, metrics }) => {
  const ramPct = Math.round((metrics.ramUsedGb / metrics.ramTotalGb) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B]">{t.admin.cpu}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0F172A] font-mono">
            {metrics.cpuUsagePct}%
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B]">{t.admin.memory}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#2563EB] font-mono">
            {metrics.ramUsedGb} / {metrics.ramTotalGb} GB
          </p>
          <p className="text-xs text-[#64748B] mt-1">{ramPct}%</p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B]">{t.admin.wsStreams}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0F172A] font-mono">
            {metrics.wsConnections}
          </p>
          <p className="text-xs text-[#64748B] mt-1">{metrics.marketDataLatencyMs} ms</p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B]">{t.admin.uptime}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#16A34A] font-mono">
            {metrics.uptimeLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-8">
          <h2 className="font-display font-semibold text-base text-[#0F172A] mb-4">
            {t.admin.cpu} (%)
          </h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_SERIES} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="oxvHealthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#oxvHealthFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ox-card p-6 lg:col-span-4 space-y-3">
          <h2 className="font-display font-semibold text-base text-[#0F172A] mb-2">
            {t.admin.healthTitle}
          </h2>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-sm font-medium text-[#334155]">{t.admin.database}</span>
            <StatusBadge tone="emerald" label={t.statusLabels.healthy} />
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-sm font-medium text-[#334155]">{t.admin.worker}</span>
            <StatusBadge tone="blue" label={t.statusLabels.running} />
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-sm font-medium text-[#334155]">{t.admin.queue}</span>
            <span className="font-mono font-semibold text-sm text-[#0F172A]">
              {metrics.aiRequestQueue}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
