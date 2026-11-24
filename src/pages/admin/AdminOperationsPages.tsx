import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AuditLogEntry, Trade, UserAccount } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomToggle } from '../../components/ui/CustomToggle';
import { CustomSlider } from '../../components/ui/CustomSlider';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { useToast } from '../../components/ui/ToastProvider';

export const AdminActivityPage: React.FC<{ t: TranslationDictionary; trades: Trade[] }> = ({
  t,
  trades,
}) => {
  return (
    <section className="ox-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="font-display font-semibold text-base text-[#0F172A]">
          {t.admin.activityTitle}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              <th className="py-3.5 px-5">{t.admin.user}</th>
              <th className="py-3.5 px-4">{t.trades.pair}</th>
              <th className="py-3.5 px-4">{t.trades.strategy}</th>
              <th className="py-3.5 px-4 text-right">{t.trades.amount}</th>
              <th className="py-3.5 px-4 text-right">{t.trades.pnl}</th>
              <th className="py-3.5 px-5 text-right">{t.trades.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm">
            {trades.map((tr) => {
              const pos = tr.pnlUsd >= 0;
              return (
                <tr key={tr.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3.5 px-5 font-mono text-xs text-[#2563EB]">@{tr.username}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{tr.symbol}</td>
                  <td className="py-3.5 px-4 text-xs text-[#64748B]">{tr.strategy}</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#334155]">
                    ${tr.amountUsd.toLocaleString()}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono tabular-nums font-semibold ${
                      pos ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    }`}
                  >
                    {pos ? '+' : '-'}${Math.abs(tr.pnlUsd).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <StatusBadge
                      tone={tr.status === 'active' ? 'blue' : 'slate'}
                      label={tr.status === 'active' ? t.statusLabels.active : t.statusLabels.closed}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const AdminAnalyticsPage: React.FC<{ t: TranslationDictionary; users: UserAccount[] }> = ({
  t,
  users,
}) => {
  const chartData = users
    .filter((u) => u.role === 'user')
    .map((u) => ({ name: u.username, pnl: u.realizedPnl }));

  return (
    <section className="ox-card p-6 space-y-4">
      <h2 className="font-display font-semibold text-base text-[#0F172A]">
        {t.admin.analyticsTitle}
      </h2>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              formatter={(v) => `$${Number(v ?? 0).toFixed(2)}`}
            />
            <Bar dataKey="pnl" fill="#2563EB" radius={[8, 8, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export const AdminNotificationsPage: React.FC<{
  t: TranslationDictionary;
  onBroadcast: (title: string, message: string) => void;
}> = ({ t, onBroadcast }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    onBroadcast(title.trim(), message.trim());
    setTitle('');
    setMessage('');
  };

  return (
    <section className="ox-card p-6 max-w-xl space-y-5">
      <h2 className="font-display font-semibold text-base text-[#0F172A]">
        {t.admin.broadcastTitle}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5">
            {t.admin.messageTitle}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5">
            {t.admin.messageBody}
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          />
        </div>
        <MagneticButton type="submit">{t.admin.sendBroadcast}</MagneticButton>
      </form>
    </section>
  );
};

export const AdminAuditLogsPage: React.FC<{ t: TranslationDictionary; logs: AuditLogEntry[] }> = ({
  t,
  logs,
}) => {
  return (
    <section className="ox-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="font-display font-semibold text-base text-[#0F172A]">{t.admin.auditTitle}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              <th className="py-3.5 px-5">{t.admin.actor}</th>
              <th className="py-3.5 px-4">{t.admin.action}</th>
              <th className="py-3.5 px-4">{t.admin.target}</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">{t.admin.ip}</th>
              <th className="py-3.5 px-5 text-right">{t.trades.dateFilter}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F8FAFC]">
                <td className="py-3.5 px-5 font-mono text-xs text-[#2563EB]">{log.actor}</td>
                <td className="py-3.5 px-4 font-medium text-[#0F172A]">{log.action}</td>
                <td className="py-3.5 px-4 text-xs text-[#475569]">{log.target}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#64748B] hidden sm:table-cell">
                  {log.ipMasked}
                </td>
                <td className="py-3.5 px-5 text-right font-mono text-xs text-[#64748B]">
                  {log.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const AdminSettingsPage: React.FC<{ t: TranslationDictionary }> = ({ t }) => {
  const { showToast } = useToast();
  const [maintenance, setMaintenance] = useState(false);
  const [allowTrials, setAllowTrials] = useState(true);
  const [enforceWithdrawals, setEnforceWithdrawals] = useState(true);
  const [latencyCap, setLatencyCap] = useState(120);

  return (
    <section className="ox-card p-6 max-w-xl space-y-5">
      <h2 className="font-display font-semibold text-base text-[#0F172A]">{t.admin.settingsTitle}</h2>

      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <CustomToggle
            checked={maintenance}
            onChange={setMaintenance}
            label={t.admin.maintenanceMode}
          />
        </div>
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <CustomToggle
            checked={allowTrials}
            onChange={setAllowTrials}
            label={t.admin.allowTrialSignups}
          />
        </div>
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <CustomToggle
            checked={enforceWithdrawals}
            onChange={setEnforceWithdrawals}
            label={t.admin.enforceWithdrawalCheck}
          />
        </div>
      </div>

      <CustomSlider
        label={t.admin.defaultLatencyCap}
        value={latencyCap}
        min={50}
        max={500}
        step={10}
        valueSuffix=" ms"
        onChange={setLatencyCap}
      />

      <MagneticButton onClick={() => showToast(t.common.updated, 'success')}>
        {t.common.save}
      </MagneticButton>
    </section>
  );
};
