import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy } from 'lucide-react';
import { CustomModal } from './CustomModal';
import { MagneticButton } from './MagneticButton';
import { OxinvoLogo } from './OxinvoLogo';
import { LanguageCode } from '../../types';
import { ACCOUNT_COPY } from '../../i18n/account';
import { TRANSLATIONS } from '../../i18n/translations';
export interface OneTimeCredentials { username: string; password: string; expirationDate: string }
export function CredentialsModal({ value, language, onClose }: { value: OneTimeCredentials | null; language: LanguageCode; onClose: () => void }) {
  const t = TRANSLATIONS[language], text = ACCOUNT_COPY[language];
  const copyUsername={az:'İstifadəçi adını kopyala',en:'Copy username',tr:'Kullanıcı adını kopyala',ru:'Скопировать имя'}[language];
  const copyPassword={az:'Şifrəni kopyala',en:'Copy password',tr:'Şifreyi kopyala',ru:'Скопировать пароль'}[language];
  const copyAll = {az:'Bütün giriş məlumatlarını kopyala',en:'Copy all credentials',tr:'Tüm giriş bilgilerini kopyala',ru:'Скопировать все данные'}[language];
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); } catch { /* never log credentials */ } }
  return <CustomModal open={Boolean(value)} onClose={onClose} title={text.created} maxWidthClass="max-w-lg">{value && <div className="space-y-5"><OxinvoLogo /><motion.div initial={{ scale: .6 }} animate={{ scale: 1 }} className="flex justify-center text-green-600"><CheckCircle2 className="w-14 h-14" /></motion.div>
    <div className="text-sm space-y-3"><p>https://oxinvo.com</p><p className="font-mono">{value.username}</p><code className="block p-4 rounded-xl bg-[#EFF6FF] break-all select-all">{value.password}</code><p>{text.expiry}: {value.expirationDate}</p></div>
    <div className="flex flex-wrap gap-2"><MagneticButton variant="secondary" onClick={() => copy(value.username)}><Copy className="w-4 h-4" />{copyUsername}</MagneticButton><MagneticButton variant="secondary" onClick={() => copy(value.password)}><Copy className="w-4 h-4" />{copyPassword}</MagneticButton>
    <MagneticButton onClick={() => copy(`OXINVO Trading Platform\n\nWebsite: https://oxinvo.com\nUsername: ${value.username}\nPassword: ${value.password}\nSubscription expires: ${value.expirationDate}\n\nPlease change your password after your first login.`)}><Copy className="w-4 h-4" />{copyAll}</MagneticButton><MagneticButton variant="secondary" onClick={onClose}>{t.common.close}</MagneticButton></div></div>}</CustomModal>;
}
