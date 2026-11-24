import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { AICoreCanvas } from '../../components/three/AICoreCanvas';
import { OxinvoLogo } from '../../components/ui/OxinvoLogo';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { CustomCheckbox } from '../../components/ui/CustomCheckbox';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { CustomModal } from '../../components/ui/CustomModal';
import { MagneticButton } from '../../components/ui/MagneticButton';

interface LoginPageProps {
  language: LanguageCode;
  t: TranslationDictionary;
  onLanguageChange: (lang: LanguageCode) => void;
  onLogin: (username: string, password: string, rememberMe: boolean) => Promise<{ ok: boolean; error?: string }>;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  t,
  onLanguageChange,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const result = await onLogin(username.trim(), password, rememberMe);
    setSubmitting(false);
    if (!result.ok) {
      setErrorMsg(result.error ?? t.auth.invalidError);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F4F7FC] text-[#0F172A]">
      {/* Left Side: Animated Blue AI Sphere & Fluid Gradient Stage */}
      <section className="relative lg:w-[54%] min-h-[360px] lg:min-h-screen ox-blue-stage overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#E2E8F0]">
        {/* Ambient soft blue gradient orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#60A5FA]/20 blur-3xl ox-fluid-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-0 w-[420px] h-[420px] rounded-full bg-[#2563EB]/14 blur-3xl ox-fluid-blob"
          style={{ animationDelay: '-5s' }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <OxinvoLogo size={34} />
          <div className="lg:hidden">
            <LanguageSelector language={language} onChange={onLanguageChange} />
          </div>
        </div>

        {/* 3D Glass Blue AI Sphere */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-4">
          <div className="w-full max-w-[440px] h-[280px] sm:h-[360px] lg:h-[420px]">
            <AICoreCanvas status="running" interactive variant="hero" />
          </div>
        </div>

        {/* Minimal Tagline Copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            {t.auth.heroTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 leading-relaxed">
            {t.auth.heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Right Side: Minimalist Login Form */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white">
        <div className="hidden lg:flex justify-end">
          <LanguageSelector language={language} onChange={onLanguageChange} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm mx-auto my-auto py-8"
        >
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
              {t.auth.title}
            </h1>
            <p className="text-sm text-[#64748B] mt-1.5">{t.auth.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-xs font-medium text-[#475569] mb-1.5">
                {t.auth.username}
              </label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
              />
            </div>

            <CustomPasswordInput
              id="login-password"
              label={t.auth.password}
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-1">
              <CustomCheckbox
                id="login-remember"
                checked={rememberMe}
                onChange={setRememberMe}
                label={t.auth.rememberMe}
              />
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="px-3.5 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#DC2626]"
              >
                {errorMsg}
              </div>
            )}

            <MagneticButton
              type="submit"
              loading={submitting}
              className="w-full py-3 mt-2"
            >
              <span>{submitting ? t.auth.signingIn : t.auth.signIn}</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              {t.auth.contactAdmin}
            </button>
          </div>


        </motion.div>

        <div className="text-center text-xs text-[#94A3B8]">
          OXINVO · {t.tagline}
        </div>
      </section>

      <CustomModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={t.auth.adminTitle}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-sm text-[#334155] leading-relaxed">{t.auth.adminBody}</p>
          </div>
          <p className="text-sm font-medium text-[#0F172A]">{t.auth.telegramDesk}</p>
          <div className="flex justify-end">
            <MagneticButton variant="secondary" onClick={() => setContactOpen(false)}>
              {t.auth.close}
            </MagneticButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
