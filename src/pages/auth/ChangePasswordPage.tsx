import React, { useState } from 'react';
import { api, setCsrfToken } from '../../services/api';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { OxinvoLogo } from '../../components/ui/OxinvoLogo';
import { ACCOUNT_COPY } from '../../i18n/account';
import { LanguageCode } from '../../types';

export function ChangePasswordPage({
  language,
  onComplete,
}: {
  language: LanguageCode;
  onComplete: () => Promise<void>;
}) {
  const text = ACCOUNT_COPY[language];
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (next !== confirm) {
      setError(text.mismatch);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await api.post<{ csrfToken: string }>('/auth/change-password', {
        body: { currentPassword: current, newPassword: next },
      });
      setCurrent('');
      setNext('');
      setConfirm('');
      setCsrfToken(result.csrfToken);
      await onComplete();
    } catch {
      setError(text.mismatch);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-[#060B16] flex items-center justify-center p-6">
      <form onSubmit={submit} className="ox-card p-8 w-full max-w-md space-y-5">
        <OxinvoLogo />
        <h1 className="font-display text-xl font-bold text-[#0A1428] dark:text-[#F1F5F9]">{text.change}</h1>
        <CustomPasswordInput label={text.current} value={current} onChange={setCurrent} />
        <CustomPasswordInput label={text.next} value={next} onChange={setNext} />
        <CustomPasswordInput label={text.confirm} value={confirm} onChange={setConfirm} />
        {error && (
          <p role="alert" className="text-sm text-[#DC2626] dark:text-[#F87171]">
            {error}
          </p>
        )}
        <MagneticButton type="submit" loading={busy} className="w-full">
          {text.change}
        </MagneticButton>
      </form>
    </div>
  );
}
