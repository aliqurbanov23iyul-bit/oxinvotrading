import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy } from 'lucide-react';
import { CustomModal } from './CustomModal';
import { MagneticButton } from './MagneticButton';
import { OxinvoLogo } from './OxinvoLogo';
import { LanguageCode } from '../../types';
import { ACCOUNT_COPY } from '../../i18n/account';
import { TRANSLATIONS } from '../../i18n/translations';

export interface OneTimeCredentials {
  username: string;
  password: string;
  expirationDate: string;
}

export function CredentialsModal({
  value,
  language,
  onClose,
}: {
  value: OneTimeCredentials | null;
  language: LanguageCode;
  onClose: () => void;
}) {
  const t = TRANSLATIONS[language];
  const text = ACCOUNT_COPY[language];
  const copyUsername = {
    az: 'İstifadəçi adını kopyala',
    en: 'Copy username',
    tr: 'Kullanıcı adını kopyala',
    ru: 'Скопировать имя',
  }[language];
  const copyPassword = {
    az: 'Şifrəni kopyala',
    en: 'Copy password',
    tr: 'Şifreyi kopyala',
    ru: 'Скопировать пароль',
  }[language];
  const copyAll = {
    az: 'Bütün giriş məlumatlarını kopyala',
    en: 'Copy all credentials',
    tr: 'Tüm giriş bilgilerini kopyala',
    ru: 'Скопировать все данные',
  }[language];

  async function copy(val: string) {
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      /* never log credentials */
    }
  }

  return (
    <CustomModal open={Boolean(value)} onClose={onClose} title={text.created} maxWidthClass="max-w-lg">
      {value && (
        <div className="space-y-5">
          <OxinvoLogo />
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            className="flex justify-center text-[#059669] dark:text-[#34D399]"
          >
            <CheckCircle2 className="w-14 h-14" />
          </motion.div>
          <div className="text-sm space-y-3">
            <p className="text-[#475569] dark:text-[#94A3B8] font-mono text-xs">https://oxinvo.com</p>
            <p className="font-mono font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{value.username}</p>
            <code className="block p-4 rounded-xl bg-[#EFF6FF] dark:bg-[#070D19] border border-[#BFDBFE] dark:border-[#1B2942] text-[#0A1428] dark:text-[#60A5FA] break-all select-all font-mono">
              {value.password}
            </code>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {text.expiry}: <span className="font-mono text-[#0A1428] dark:text-[#F1F5F9]">{value.expirationDate}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MagneticButton variant="secondary" onClick={() => void copy(value.username)}>
              <Copy className="w-4 h-4" />
              {copyUsername}
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={() => void copy(value.password)}>
              <Copy className="w-4 h-4" />
              {copyPassword}
            </MagneticButton>
            <MagneticButton
              onClick={() =>
                void copy(
                  `OXINVO Trading Platform\n\nWebsite: https://oxinvo.com\nUsername: ${value.username}\nPassword: ${value.password}\nSubscription expires: ${value.expirationDate}\n\nPlease change your password after your first login.`
                )
              }
            >
              <Copy className="w-4 h-4" />
              {copyAll}
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={onClose}>
              {t.common.close}
            </MagneticButton>
          </div>
        </div>
      )}
    </CustomModal>
  );
}
