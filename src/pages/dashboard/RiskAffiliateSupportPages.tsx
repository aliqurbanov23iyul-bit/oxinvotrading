import React, { useEffect, useState } from 'react';
import { Check, Copy, LifeBuoy, Send, Share2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { LanguageCode, RiskConfigState, SupportTicketItem } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomSlider } from '../../components/ui/CustomSlider';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/ToastProvider';
import { api } from '../../services/api';

export const RiskManagementPage: React.FC<{
  language: LanguageCode;
  riskConfig: RiskConfigState;
  onSave: (next: Partial<RiskConfigState>) => Promise<void>;
}> = ({ language, riskConfig, onSave }) => {
  const copy = EXTRA_COPY[language].riskPage;
  const botExtra = EXTRA_COPY[language].botExtra;
  const [riskLevel, setRiskLevel] = useState<RiskConfigState['riskLevel']>(riskConfig.riskLevel);
  const [stopLossPct, setStopLossPct] = useState(riskConfig.stopLossPct);
  const [takeProfitPct, setTakeProfitPct] = useState(riskConfig.takeProfitPct);
  const [maxDailyLossPct, setMaxDailyLossPct] = useState(riskConfig.maxDailyLossPct);
  const [tradeAmountUsd, setTradeAmountUsd] = useState(riskConfig.tradeAmountUsd);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRiskLevel(riskConfig.riskLevel);
    setStopLossPct(riskConfig.stopLossPct);
    setTakeProfitPct(riskConfig.takeProfitPct);
    setMaxDailyLossPct(riskConfig.maxDailyLossPct);
    setTradeAmountUsd(riskConfig.tradeAmountUsd);
  }, [riskConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ riskLevel, stopLossPct, takeProfitPct, maxDailyLossPct, tradeAmountUsd });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-7 ox-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">{copy.title}</h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.subtitle}</p>
          </div>
        </div>

        <CustomSelect
          label={copy.profileLabel}
          value={riskLevel}
          onChange={(v) => setRiskLevel(v as RiskConfigState['riskLevel'])}
          options={[
            { value: 'CONSERVATIVE', label: botExtra.riskLevels.CONSERVATIVE },
            { value: 'BALANCED', label: botExtra.riskLevels.BALANCED },
            { value: 'AGGRESSIVE', label: botExtra.riskLevels.AGGRESSIVE },
          ]}
        />

        <CustomSlider
          label={copy.stopLossLabel}
          value={stopLossPct}
          min={0.5}
          max={15}
          step={0.5}
          valueSuffix="%"
          onChange={setStopLossPct}
        />

        <CustomSlider
          label={copy.takeProfitLabel}
          value={takeProfitPct}
          min={1}
          max={30}
          step={0.5}
          valueSuffix="%"
          onChange={setTakeProfitPct}
        />

        <CustomSlider
          label={copy.maxDailyLossLabel}
          value={maxDailyLossPct}
          min={1}
          max={20}
          step={0.5}
          valueSuffix="%"
          onChange={setMaxDailyLossPct}
        />

        <div>
          <label htmlFor="risk-trade-size" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
            {copy.tradeSizeLabel}
          </label>
          <input
            id="risk-trade-size"
            type="number"
            min={10}
            max={100000}
            step={10}
            value={tradeAmountUsd}
            onChange={(e) => setTradeAmountUsd(Math.max(10, Number(e.target.value) || 10))}
            className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <MagneticButton type="submit" loading={saving}>
          <span>{copy.saveRisk}</span>
        </MagneticButton>
      </form>

      <section className="lg:col-span-5 ox-card p-6 space-y-4 h-fit">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {copy.guardrailsTitle}
          </h3>
        </div>
        <ul className="space-y-3">
          {copy.guardrails.map((rule) => (
            <li
              key={rule}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed"
            >
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const AffiliatePage: React.FC<{
  language: LanguageCode;
  t: TranslationDictionary;
}> = ({ language, t }) => {
  const copy = EXTRA_COPY[language].affiliatePage;
  const { showToast } = useToast();
  const [data, setData] = useState<{
    referralCode: string;
    referralCount: number;
    activeReferrals: number;
    totalCommissionUsd: string;
    available: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get<typeof data>('/users/me/affiliate')
      .then(setData)
      .catch(() => {});
  }, []);

  const code = data?.referralCode ?? '—';

  const handleCopy = () => {
    if (!code || code === '—') return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    showToast(t.common.copied, 'success');
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <section className="ox-card p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">{copy.title}</h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.subtitle}</p>
            </div>
          </div>
          <StatusBadge tone="amber" label={t.statusLabels.standby} />
        </div>

        <div className="p-4 rounded-2xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE] dark:border-[#1E3A8A] flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#1E40AF] dark:text-[#93C5FD]">{copy.referralCode}</p>
            <p className="font-mono font-bold text-lg text-[#0A1428] dark:text-[#F1F5F9] mt-0.5">{code}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#070D19] border border-[#BFDBFE] dark:border-[#1E3A8A] text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#DBEAFE]/40 dark:hover:bg-[#1E3A8A]/40"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{t.connections.copyCode}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.totalReferrals}</p>
            <p className="font-mono font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9] mt-1 tabular-nums">
              {data?.referralCount ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.activeReferrals}</p>
            <p className="font-mono font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9] mt-1 tabular-nums">
              {data?.activeReferrals ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.totalCommission}</p>
            <p className="font-mono font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9] mt-1 tabular-nums">
              ${data?.totalCommissionUsd ?? '0.00'}
            </p>
          </div>
        </div>
      </section>

      <section className="ox-card p-6 bg-gradient-to-r from-[#FFFBEB] to-white dark:from-[#451A03]/35 dark:to-[#0B1324] border-[#FDE68A] dark:border-[#78350F] space-y-1.5">
        <h3 className="font-display font-semibold text-sm text-[#92400E] dark:text-[#FCD34D]">{copy.pendingTitle}</h3>
        <p className="text-xs text-[#78350F] dark:text-[#FDE68A]/85 leading-relaxed">{copy.pendingBody}</p>
      </section>
    </div>
  );
};

export const SupportPage: React.FC<{
  language: LanguageCode;
  t: TranslationDictionary;
}> = ({ language, t }) => {
  const copy = EXTRA_COPY[language].supportPage;
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = () => {
    api
      .get<SupportTicketItem[]>('/users/me/support')
      .then(setTickets)
      .catch(() => {});
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/users/me/support', {
        body: { subject: subject.trim(), category, message: message.trim() },
      });
      setSubject('');
      setMessage('');
      showToast(copy.ticketSubmitted, 'success');
      loadTickets();
    } catch {
      showToast(t.auth.invalidError, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-6 ox-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {copy.newTicketTitle}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{copy.subtitle}</p>
          </div>
        </div>

        <div>
          <label htmlFor="sup-subject" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
            {copy.subjectLabel}
          </label>
          <input
            id="sup-subject"
            type="text"
            required
            maxLength={120}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <CustomSelect
          label={copy.categoryLabel}
          value={category}
          onChange={setCategory}
          options={[
            { value: 'general', label: copy.categories.general },
            { value: 'technical', label: copy.categories.technical },
            { value: 'security', label: copy.categories.security },
            { value: 'account', label: copy.categories.account },
          ]}
        />

        <div>
          <label htmlFor="sup-message" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
            {copy.messageLabel}
          </label>
          <textarea
            id="sup-message"
            rows={4}
            required
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <MagneticButton type="submit" loading={submitting}>
          <Send className="w-4 h-4" />
          <span>{copy.submitTicket}</span>
        </MagneticButton>
      </form>

      <section className="lg:col-span-6 ox-card p-6 space-y-4">
        <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {copy.ticketsListTitle}
        </h2>
        {tickets.length === 0 ? (
          <EmptyState
            compact
            icon={<LifeBuoy className="w-5 h-5" />}
            title={copy.noTickets}
          />
        ) : (
          <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{ticket.subject}</p>
                  <StatusBadge
                    tone={
                      ticket.status === 'RESOLVED' ? 'emerald' : ticket.status === 'IN_REVIEW' ? 'blue' : 'amber'
                    }
                    label={copy.statuses[ticket.status]}
                  />
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{ticket.message}</p>
                <p className="text-[11px] font-mono text-[#94A3B8] dark:text-[#64748B]">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
