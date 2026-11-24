import React, { useState } from 'react';
import { api, setCsrfToken } from '../../services/api';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { OxinvoLogo } from '../../components/ui/OxinvoLogo';
import { ACCOUNT_COPY } from '../../i18n/account';
import { LanguageCode } from '../../types';
export function ChangePasswordPage({ language, onComplete }: { language: LanguageCode; onComplete: () => Promise<void> }) {
  const text = ACCOUNT_COPY[language]; const [current, setCurrent] = useState(''), [next, setNext] = useState(''), [confirm, setConfirm] = useState(''); const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) { event.preventDefault(); if (next !== confirm) { setError(text.mismatch); return; } setBusy(true); setError(''); try { const result = await api.post<{ csrfToken: string }>('/auth/change-password', { body: { currentPassword: current, newPassword: next } }); setCurrent(''); setNext(''); setConfirm(''); setCsrfToken(result.csrfToken); await onComplete(); } catch { setError(text.mismatch); } finally { setBusy(false); } }
  return <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-6"><form onSubmit={submit} className="ox-card p-8 w-full max-w-md space-y-5"><OxinvoLogo /><h1 className="font-display text-xl font-bold">{text.change}</h1>
    <CustomPasswordInput label={text.current} value={current} onChange={setCurrent} /><CustomPasswordInput label={text.next} value={next} onChange={setNext} /><CustomPasswordInput label={text.confirm} value={confirm} onChange={setConfirm} />
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}<MagneticButton type="submit" loading={busy}>{text.change}</MagneticButton></form></div>;
}
