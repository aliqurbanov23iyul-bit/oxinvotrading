import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LanguageCode } from '../../types';
import { ACCOUNT_COPY } from '../../i18n/account';
import { TRANSLATIONS } from '../../i18n/translations';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { useToast } from '../../components/ui/ToastProvider';

export function AccountSecurity({
  language,
  onChangePassword,
}: {
  language: LanguageCode;
  onChangePassword: () => void;
}) {
  const text = ACCOUNT_COPY[language];
  const t = TRANSLATIONS[language];
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState('');
  const load = () =>
    api
      .get<any[]>('/auth/sessions')
      .then(setRows)
      .catch(() => setError(t.auth.invalidError));
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="ox-card p-6 space-y-4">
      <h2 className="font-display font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{text.sessions}</h2>
      <MagneticButton onClick={onChangePassword}>{text.change}</MagneticButton>
      {error && (
        <p role="alert" className="text-sm text-[#DC2626] dark:text-[#F87171]">
          {error}
        </p>
      )}
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex flex-wrap justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#1B2942] py-3 text-sm"
        >
          <div>
            <p className="font-mono text-[#0A1428] dark:text-[#F1F5F9]">{row.ipAddress ?? '—'}</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {new Date(row.expiresAt).toLocaleString()}
            </p>
          </div>
          <MagneticButton
            variant="secondary"
            onClick={() =>
              void api
                .delete('/auth/sessions/' + row.id)
                .then(load)
                .catch(() => setError(t.auth.invalidError))
            }
          >
            {t.common.close} · Session
          </MagneticButton>
        </div>
      ))}
    </section>
  );
}

export function ProviderSettings({ language }: { language: LanguageCode }) {
  const t = TRANSLATIONS[language];
  const text = ACCOUNT_COPY[language];
  const [rows, setRows] = useState<any[]>([]);
  const [providerName, setProvider] = useState('LOCAL');
  const [modelName, setModel] = useState('');
  const [apiKey, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = () => api.get<any[]>('/admin/ai-providers').then(setRows);
  useEffect(() => {
    load().catch(() => setError(t.auth.invalidError));
  }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/admin/ai-providers', {
        body: { providerName, modelName, isEnabled: false, apiKey: apiKey || undefined },
      });
      setKey('');
      await load();
    } catch {
      setError(t.auth.invalidError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5">
      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{text.unavailable}</p>
      <div className="grid md:grid-cols-2 gap-5">
        {rows.map((row) => (
          <section key={row.id} className="ox-card p-6 space-y-4">
            <h2 className="font-display font-semibold text-[#0A1428] dark:text-[#F1F5F9]">
              {row.providerName} · {row.modelName}
            </h2>
            <MagneticButton
              variant="secondary"
              onClick={() =>
                void api
                  .post('/admin/ai-providers', {
                    body: { providerName: row.providerName, modelName: row.modelName, isEnabled: !row.isEnabled },
                  })
                  .then(load)
                  .catch(() => setError(t.auth.invalidError))
              }
            >
              {row.isEnabled ? t.statusLabels.stopped : t.statusLabels.active}
            </MagneticButton>
          </section>
        ))}
      </div>
      <form onSubmit={save} className="ox-card p-6 space-y-4 max-w-xl">
        <CustomSelect
          label="AI Provider"
          value={providerName}
          onChange={setProvider}
          options={['OPENAI', 'GEMINI', 'GROK', 'LOCAL'].map((value) => ({ value, label: value }))}
        />
        <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
          Model
          <input
            required
            value={modelName}
            onChange={(event) => setModel(event.target.value)}
            className="block w-full rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] p-3 mt-2 focus:outline-none focus:border-[#2563EB]"
          />
        </label>
        <CustomPasswordInput label="API key" value={apiKey} onChange={setKey} />
        {error && (
          <p role="alert" className="text-[#DC2626] dark:text-[#F87171] text-sm">
            {error}
          </p>
        )}
        <MagneticButton type="submit" loading={busy}>
          {t.common.save ?? t.account.saveChanges}
        </MagneticButton>
      </form>
    </div>
  );
}

export function SystemSettings({ language }: { language: LanguageCode }) {
  const t = TRANSLATIONS[language];
  const extra = EXTRA_COPY[language].adminExtra;
  const { showToast } = useToast();
  const [supportContact, setSupportContact] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get<{ key: string; value: string }[]>('/admin/settings').then((rows) => {
      const map = Object.fromEntries(rows.map((r) => [r.key, String(r.value ?? '')]));
      setSupportContact(map.supportContact ?? '');
      setWhatsappUrl(map.whatsappUrl ?? '');
      setTelegramUrl(map.telegramUrl ?? '');
      setSupportEmail(map.supportEmail ?? '');
    });

  useEffect(() => {
    load().catch(() => setError(t.auth.invalidError));
  }, []);

  const saveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await Promise.all([
        api.patch('/admin/settings', { body: { key: 'supportContact', value: supportContact } }),
        api.patch('/admin/settings', { body: { key: 'whatsappUrl', value: whatsappUrl } }),
        api.patch('/admin/settings', { body: { key: 'telegramUrl', value: telegramUrl } }),
        api.patch('/admin/settings', { body: { key: 'supportEmail', value: supportEmail } }),
      ]);
      showToast(t.common.updated, 'success');
      await load();
    } catch {
      setError(t.auth.invalidError);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'block rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] p-3 w-full mt-1.5 text-sm focus:outline-none focus:border-[#2563EB]';

  return (
    <form onSubmit={saveAll} className="ox-card p-6 max-w-xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {extra.contactSettingsTitle}
        </h2>
        <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">PAPER · LIVE disabled</span>
      </div>

      <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
        {extra.whatsappUrlLabel}
        <input
          type="url"
          placeholder="https://wa.me/..."
          className={`${inputClass} font-mono`}
          value={whatsappUrl}
          onChange={(event) => setWhatsappUrl(event.target.value)}
          maxLength={200}
        />
      </label>

      <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
        {extra.telegramUrlLabel}
        <input
          type="url"
          placeholder="https://t.me/..."
          className={`${inputClass} font-mono`}
          value={telegramUrl}
          onChange={(event) => setTelegramUrl(event.target.value)}
          maxLength={200}
        />
      </label>

      <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
        {extra.supportEmailLabel}
        <input
          type="email"
          className={inputClass}
          value={supportEmail}
          onChange={(event) => setSupportEmail(event.target.value)}
          maxLength={200}
        />
      </label>

      <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
        Support handle
        <input
          className={inputClass}
          value={supportContact}
          onChange={(event) => setSupportContact(event.target.value)}
          maxLength={200}
        />
      </label>

      {error && (
        <p role="alert" className="text-xs text-[#DC2626] dark:text-[#F87171]">
          {error}
        </p>
      )}
      <MagneticButton type="submit" loading={saving}>
        {t.account.saveChanges}
      </MagneticButton>
    </form>
  );
}
