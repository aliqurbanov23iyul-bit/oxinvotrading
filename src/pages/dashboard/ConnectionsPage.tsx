import React, { useEffect, useState } from 'react';
import { Check, Copy, Link2, RefreshCw, Send, ShieldCheck, Unlink, Wallet } from 'lucide-react';
import { BinanceConnectionState, TelegramConnectionState, TelegramNotificationPrefs } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomTabs } from '../../components/ui/CustomTabs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { CustomToggle } from '../../components/ui/CustomToggle';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/ToastProvider';

interface ConnectionsPageProps {
  t: TranslationDictionary;
  initialTab?: 'binance' | 'telegram';
  binance: BinanceConnectionState;
  telegram: TelegramConnectionState;
  onSaveBinance: (apiKey: string, apiSecret: string) => void;
  onTestBinance: () => Promise<void>;
  onDisconnectBinance: () => void;
  onRegenerateTelegramCode: () => void;
  onSendTelegramTest: () => void;
  onToggleTelegramPref: (key: keyof TelegramNotificationPrefs, val: boolean) => void;
  onToggleTelegramConnected: () => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({
  t,
  initialTab = 'binance',
  binance,
  telegram,
  onSaveBinance,
  onTestBinance,
  onDisconnectBinance,
  onRegenerateTelegramCode,
  onSendTelegramTest,
  onToggleTelegramPref,
  onToggleTelegramConnected,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'binance' | 'telegram'>(initialTab);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [disconnectConfirm, setDisconnectConfirm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((telegram.codeExpiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((telegram.codeExpiresAt - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [telegram.codeExpiresAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const handleTest = async () => {
    setTesting(true);
    await onTestBinance();
    setTesting(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim() || !apiSecretInput.trim()) return;
    onSaveBinance(apiKeyInput.trim(), apiSecretInput.trim());
    setApiKeyInput('');
    setApiSecretInput('');
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(telegram.connectionCode);
    setCopiedCode(true);
    showToast(t.common.copied, 'success');
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  const alertKeys: (keyof TelegramNotificationPrefs)[] = [
    'buyExecuted',
    'sellExecuted',
    'profitNotification',
    'lossNotification',
    'balanceUpdate',
    'aiOpportunityDetected',
    'botStarted',
    'botStopped',
    'connectionErrors',
    'dailyTradingSummary',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CustomTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'binance', label: t.connections.binanceTab },
            { id: 'telegram', label: t.connections.telegramTab },
          ]}
        />
      </div>

      {activeTab === 'binance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Connection Form & Status */}
          <div className="lg:col-span-7 space-y-6">
            <section className="ox-card p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
                    <Link2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                      {t.connections.binanceTitle}
                    </h2>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                      {binance.connected ? binance.maskedApiKey : t.connections.notConnected}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  tone={binance.connected ? 'emerald' : 'slate'}
                  label={binance.connected ? t.connections.connected : t.connections.notConnected}
                />
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="bn-api-key" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
                    {t.connections.apiKey}
                  </label>
                  <input
                    id="bn-api-key"
                    type="text"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={binance.connected ? binance.maskedApiKey : 'Enter Binance API Key'}
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <CustomPasswordInput
                  id="bn-api-secret"
                  label={t.connections.apiSecret}
                  value={apiSecretInput}
                  onChange={setApiSecretInput}
                  placeholder={binance.connected ? binance.maskedApiSecret : '••••••••'}
                />

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <MagneticButton type="submit" disabled={!apiKeyInput.trim() || !apiSecretInput.trim()}>
                    <span>{t.connections.saveKeys}</span>
                  </MagneticButton>
                  <MagneticButton
                    type="button"
                    variant="secondary"
                    loading={testing}
                    onClick={handleTest}
                  >
                    <span>{t.connections.testConnection}</span>
                  </MagneticButton>
                  {binance.connected && (
                    <MagneticButton
                      type="button"
                      variant="danger"
                      onClick={() => setDisconnectConfirm(true)}
                    >
                      <Unlink className="w-4 h-4" />
                      <span>{t.connections.disconnect}</span>
                    </MagneticButton>
                  )}
                </div>
              </form>
            </section>

            {/* Synced Spot Balances */}
            <section className="ox-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {t.connections.spotBalances}
                </h3>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {t.connections.lastSync}: {binance.lastSyncAt}
                </span>
              </div>

              {binance.balances.length === 0 ? (
                <EmptyState
                  compact
                  icon={<Wallet className="w-5 h-5" />}
                  title={t.common.noData}
                />
              ) : (
                <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
                  {binance.balances.map((b) => (
                    <div key={b.asset} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <CoinIcon symbol={b.asset} size={24} />
                        <span className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{b.asset}</span>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <span className="text-[#0A1428] dark:text-[#F1F5F9] font-medium">
                          {b.free.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                        </span>
                        <span className="text-xs text-[#64748B] dark:text-[#94A3B8] ml-3">
                          ${b.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right: Security Checks & 5-Step Setup */}
          <div className="lg:col-span-5 space-y-6">
            <section className="ox-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {t.connections.permissionsCheck}
                </h3>
              </div>

              <div className="space-y-2.5 text-sm">
                {[
                  { label: t.connections.readEnabled, ok: binance.readInfoEnabled },
                  { label: t.connections.spotEnabled, ok: binance.spotTradingEnabled },
                  { label: t.connections.withdrawalsDisabled, ok: binance.withdrawalsDisabled },
                ].map((perm) => (
                  <div
                    key={perm.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]"
                  >
                    <span className="text-[#334155] dark:text-[#CBD5E1] font-medium">{perm.label}</span>
                    <StatusBadge
                      tone={perm.ok ? 'emerald' : 'slate'}
                      label={perm.ok ? t.statusLabels.active : t.connections.notConnected}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="ox-card p-6 space-y-3">
              <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {t.connections.connectSteps}
              </h3>
              <ol className="space-y-2.5 text-sm text-[#475569] dark:text-[#CBD5E1]">
                {[t.connections.step1, t.connections.step2, t.connections.step3, t.connections.step4, t.connections.step5].map(
                  (step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  )
                )}
              </ol>
            </section>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Telegram Link & Code */}
          <div className="lg:col-span-5 space-y-6">
            <section className="ox-card p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                    {t.connections.telegramTitle}
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{telegram.botUsername}</p>
                </div>
                <StatusBadge
                  tone={telegram.connected ? 'emerald' : 'slate'}
                  label={telegram.connected ? t.connections.connected : t.connections.notConnected}
                />
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <span>{t.connections.yourHandle}</span>
                  <span className="font-mono font-semibold text-[#0A1428] dark:text-[#F1F5F9]">
                    {telegram.connected ? telegram.handle : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <span>{t.connections.telegramBot}</span>
                  <span className="font-mono text-[#2563EB] dark:text-[#60A5FA]">{telegram.botUsername}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE] dark:border-[#1E3A8A] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E40AF] dark:text-[#93C5FD]">{t.connections.linkCode}</span>
                  <span className="font-mono text-[#2563EB] dark:text-[#60A5FA]">
                    {t.connections.expiresIn} {mins}:{secs}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono font-bold text-base text-[#0A1428] dark:text-[#F1F5F9] tracking-wider">
                    {telegram.connectionCode || '—'}
                  </code>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#070D19] border border-[#BFDBFE] dark:border-[#1E3A8A] text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#DBEAFE]/40"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{t.connections.copyCode}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onRegenerateTelegramCode}
                      aria-label={t.connections.newCode}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#070D19] border border-[#BFDBFE] dark:border-[#1E3A8A] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#DBEAFE]/40"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <MagneticButton onClick={onSendTelegramTest} className="flex-1">
                  <Send className="w-4 h-4" />
                  <span>{t.connections.sendTest}</span>
                </MagneticButton>
                <MagneticButton variant="secondary" onClick={onToggleTelegramConnected}>
                  <span>{telegram.connected ? t.connections.unlink : t.connections.saveKeys}</span>
                </MagneticButton>
              </div>
            </section>
          </div>

          {/* Right: 10 Alert Toggles */}
          <div className="lg:col-span-7">
            <section className="ox-card p-6">
              <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
                {t.connections.alertsTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {alertKeys.map((key) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] flex items-center justify-between"
                  >
                    <CustomToggle
                      checked={telegram.prefs[key]}
                      onChange={(val) => onToggleTelegramPref(key, val)}
                      label={t.connections.alerts[key]}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={disconnectConfirm}
        onClose={() => setDisconnectConfirm(false)}
        onConfirm={onDisconnectBinance}
        title={t.connections.disconnectTitle}
        description={t.connections.disconnectBody}
        confirmLabel={t.connections.disconnect}
        cancelLabel={t.common.cancel}
      />
    </div>
  );
};
