import React, { useState } from 'react';
import { LanguageCode, SubscriptionPlan } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomModal } from '../../components/ui/CustomModal';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { Plan } from '../../services/account-mappers';
import { ACCOUNT_COPY } from '../../i18n/account';

interface Props {
  open: boolean;
  t: TranslationDictionary;
  language: LanguageCode;
  plans: Plan[];
  canCreateAdmin: boolean;
  onClose: () => void;
  onCreate: (data: Record<string, unknown>) => Promise<void>;
}

export function CreateUserModal({
  open,
  t,
  language,
  plans,
  canCreateAdmin,
  onClose,
  onCreate,
}: Props) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [planId, setPlanId] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(language.toUpperCase());
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('ACTIVE');
  const [durationDays, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const text = ACCOUNT_COPY[language];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onCreate({
        username: username.toLowerCase().trim(),
        fullName: fullName.trim() || undefined,
        planId: planId || plans[0]?.id,
        preferredLanguage,
        role,
        status,
        durationDays,
        notes,
      });
      setUsername('');
      setFullName('');
      setNotes('');
      onClose();
    } catch {
      setError(t.auth.invalidError);
    } finally {
      setBusy(false);
    }
  }

  const input =
    'mt-1.5 w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]';
  const label = 'block text-xs font-medium text-[#475569] dark:text-[#94A3B8]';

  return (
    <CustomModal open={open} onClose={onClose} title={t.admin.createUserModal.title} maxWidthClass="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={label}>
            {t.auth.username}
            <input
              required
              className={input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className={label}>
            {t.admin.createUserModal.fullName}
            <input
              className={input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label={t.admin.createUserModal.plan}
            value={planId || plans[0]?.id || ''}
            onChange={setPlanId}
            options={plans.map((p) => ({
              value: p.id,
              label: t.statusLabels[p.name as SubscriptionPlan] ?? p.name,
            }))}
          />
          <label className={label}>
            {text.duration}
            <input
              type="number"
              min={1}
              max={3650}
              required
              className={input}
              value={durationDays}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label={t.account.language}
            value={preferredLanguage}
            onChange={setPreferredLanguage}
            options={['AZ', 'EN', 'TR', 'RU'].map((value) => ({ value, label: value }))}
          />
          <CustomSelect
            label={t.trades.status}
            value={status}
            onChange={setStatus}
            options={['ACTIVE', 'SUSPENDED', 'EXPIRED'].map((value) => ({
              value,
              label: t.statusLabels[value.toLowerCase() as keyof typeof t.statusLabels] ?? value,
            }))}
          />
        </div>

        {canCreateAdmin && (
          <CustomSelect
            label={text.role}
            value={role}
            onChange={setRole}
            options={['USER', 'ADMIN'].map((value) => ({ value, label: value }))}
          />
        )}

        <label className={label}>
          {t.admin.createUserModal.notes}
          <textarea
            className={input}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-[#DC2626] dark:text-[#F87171]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <MagneticButton type="button" variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </MagneticButton>
          <MagneticButton type="submit" loading={busy} disabled={!plans.length}>
            {t.admin.createUserModal.create}
          </MagneticButton>
        </div>
      </form>
    </CustomModal>
  );
}
