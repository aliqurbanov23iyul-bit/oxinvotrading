import React, { useEffect, useState } from 'react';
import { LifeBuoy, Link2, Lock, Share2, ShieldAlert } from 'lucide-react';
import { LanguageCode, RiskConfigState, SupportTicketItem } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TranslationDictionary } from '../../i18n/translations';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { useToast } from '../../components/ui/ToastProvider';
import { api } from '../../services/api';

export const AdminRiskMonitoringPage: React.FC<{ language: LanguageCode; t: TranslationDictionary }> = ({
  language,
  t,
}) => {
  const copy = EXTRA_COPY[language].adminExtra;
  const [rows, setRows] = useState<
    { userId: string; username: string; status: string; config: RiskConfigState | null }[]
  >([]);

  useEffect(() => {
    api.get<typeof rows>('/admin/risk').then(setRows).catch(() => {});
  }, []);

  return (
    <section className="ox-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1B2942] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {copy.riskTitle}
          </h2>
        </div>
        <StatusBadge tone="blue" label={copy.paperLocked} />
      </div>

      {rows.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={<ShieldAlert className="w-5 h-5" />} title={t.common.noData} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                <th className="py-3.5 px-5">{t.admin.user}</th>
                <th className="py-3.5 px-4">{EXTRA_COPY[language].botExtra.riskLevelLabel}</th>
                <th className="py-3.5 px-4">{EXTRA_COPY[language].botExtra.stopLossPct}</th>
                <th className="py-3.5 px-4">{EXTRA_COPY[language].botExtra.takeProfitPct}</th>
                <th className="py-3.5 px-5 text-right">{EXTRA_COPY[language].botExtra.maxDailyLossPct}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#16233B] text-sm">
              {rows.map((r) => (
                <tr key={r.userId} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629]">
                  <td className="py-3.5 px-5 font-mono text-xs text-[#2563EB] dark:text-[#60A5FA]">
                    @{r.username}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#334155] dark:text-[#CBD5E1]">
                    {r.config ? EXTRA_COPY[language].botExtra.riskLevels[r.config.riskLevel] : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#0A1428] dark:text-[#F1F5F9]">
                    {r.config ? `${r.config.stopLossPct}%` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#0A1428] dark:text-[#F1F5F9]">
                    {r.config ? `${r.config.takeProfitPct}%` : '—'}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-xs text-[#0A1428] dark:text-[#F1F5F9]">
                    {r.config ? `${r.config.maxDailyLossPct}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export const AdminBinanceStatusesPage: React.FC<{ language: LanguageCode; t: TranslationDictionary }> = ({
  language,
  t,
}) => {
  const copy = EXTRA_COPY[language].adminExtra;
  const [rows, setRows] = useState<
    { userId: string; username: string; binanceConnected: boolean; integrated: boolean }[]
  >([]);

  useEffect(() => {
    api.get<typeof rows>('/admin/binance').then(setRows).catch(() => {});
  }, []);

  return (
    <section className="ox-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1B2942] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link2 className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {copy.binanceTitle}
          </h2>
        </div>
        <StatusBadge tone="amber" label={t.connections.notConnected} />
      </div>
      {rows.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={<Link2 className="w-5 h-5" />} title={t.common.noData} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                <th className="py-3.5 px-5">{t.admin.user}</th>
                <th className="py-3.5 px-4">{t.admin.status}</th>
                <th className="py-3.5 px-5 text-right">{t.connections.permissionsCheck}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#16233B] text-sm">
              {rows.map((r) => (
                <tr key={r.userId} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629]">
                  <td className="py-3.5 px-5 font-mono text-xs text-[#2563EB] dark:text-[#60A5FA]">
                    @{r.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      tone={r.binanceConnected ? 'emerald' : 'slate'}
                      label={r.binanceConnected ? t.connections.connected : t.connections.notConnected}
                    />
                  </td>
                  <td className="py-3.5 px-5 text-right text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {r.integrated ? t.statusLabels.healthy : t.statusLabels.standby}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export const AdminAffiliatePage: React.FC<{ language: LanguageCode; t: TranslationDictionary }> = ({
  language,
  t,
}) => {
  const copy = EXTRA_COPY[language].adminExtra;
  const aff = EXTRA_COPY[language].affiliatePage;
  const [data, setData] = useState<{ available: boolean; totalReferrals: number; totalCommissionUsd: string } | null>(null);

  useEffect(() => {
    api.get<typeof data>('/admin/affiliate').then(setData).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <section className="ox-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
            <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {copy.affiliateTitle}
            </h2>
          </div>
          <StatusBadge tone="amber" label={t.statusLabels.standby} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{aff.totalReferrals}</p>
            <p className="font-mono font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9] mt-1">
              {data?.totalReferrals ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{aff.totalCommission}</p>
            <p className="font-mono font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9] mt-1">
              ${data?.totalCommissionUsd ?? '0.00'}
            </p>
          </div>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{aff.pendingBody}</p>
      </section>
    </div>
  );
};

export const AdminSupportRequestsPage: React.FC<{ language: LanguageCode; t: TranslationDictionary }> = ({
  language,
  t,
}) => {
  const copy = EXTRA_COPY[language].adminExtra;
  const supCopy = EXTRA_COPY[language].supportPage;
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);

  const load = () => {
    api.get<SupportTicketItem[]>('/admin/support').then(setTickets).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: SupportTicketItem['status']) => {
    try {
      await api.patch(`/admin/support/${id}`, { body: { status } });
      showToast(t.common.updated, 'success');
      load();
    } catch {
      showToast(t.auth.invalidError, 'error');
    }
  };

  return (
    <section className="ox-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1B2942] flex items-center gap-2.5">
        <LifeBuoy className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
        <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {copy.supportTitle}
        </h2>
      </div>
      {tickets.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={<LifeBuoy className="w-5 h-5" />} title={copy.noTickets} />
        </div>
      ) : (
        <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#2563EB] dark:text-[#60A5FA]">
                    @{ticket.username}
                  </span>
                  <StatusBadge
                    tone={ticket.status === 'RESOLVED' ? 'emerald' : ticket.status === 'IN_REVIEW' ? 'blue' : 'amber'}
                    label={supCopy.statuses[ticket.status]}
                  />
                </div>
                <p className="text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{ticket.subject}</p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{ticket.message}</p>
              </div>

              <select
                aria-label={copy.updateStatus}
                value={ticket.status}
                onChange={(e) => void updateStatus(ticket.id, e.target.value as SupportTicketItem['status'])}
                className="px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#070D19] text-xs font-medium text-[#0A1428] dark:text-[#F1F5F9]"
              >
                <option value="OPEN">{supCopy.statuses.OPEN}</option>
                <option value="IN_REVIEW">{supCopy.statuses.IN_REVIEW}</option>
                <option value="RESOLVED">{supCopy.statuses.RESOLVED}</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export const AdminSecurityPage: React.FC<{
  language: LanguageCode;
  onChangePassword: () => void;
}> = ({ language, onChangePassword }) => {
  const copy = EXTRA_COPY[language].adminExtra;
  return (
    <div className="space-y-6 max-w-3xl">
      <section className="ox-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {copy.securityTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] space-y-1">
            <p className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">HttpOnly + CSRF + Origin Guard</p>
            <p className="text-[#64748B] dark:text-[#94A3B8]">Active on all mutating routes</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] space-y-1">
            <p className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">RBAC & Real Trading Lock</p>
            <p className="text-[#64748B] dark:text-[#94A3B8]">{copy.paperLocked}</p>
          </div>
        </div>
        <MagneticButton onClick={onChangePassword}>
          <span>{EXTRA_COPY[language].riskPage.saveRisk ? 'Update Password' : 'Change Password'}</span>
        </MagneticButton>
      </section>
    </div>
  );
};
