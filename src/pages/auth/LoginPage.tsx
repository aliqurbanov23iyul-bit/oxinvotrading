import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { LanguageCode, PublicContactConfig, PublicRoute } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TradingIntelligenceEngine } from '../../components/three/TradingIntelligenceEngine';
import { CustomCheckbox } from '../../components/ui/CustomCheckbox';
import { CustomPasswordInput } from '../../components/ui/CustomPasswordInput';
import { CustomModal } from '../../components/ui/CustomModal';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { PublicFooter, PublicHeader } from '../../components/public/PublicShell';
import { TelegramBrandButton, WhatsAppBrandButton } from '../../components/public/BrandSocialIcons';

interface LoginPageProps {
  language: LanguageCode;
  t: TranslationDictionary;
  contactConfig: PublicContactConfig;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigatePublic: (route: PublicRoute) => void;
  onLogin: (username: string, password: string, rememberMe: boolean) => Promise<{ ok: boolean; error?: string }>;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  t,
  contactConfig,
  onLanguageChange,
  onNavigatePublic,
  onLogin,
}) => {
  const extra = EXTRA_COPY[language].loginExtra;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const result = await onLogin(username.trim(), password, rememberMe);
    setSubmitting(false);
    if (!result.ok) {
      setErrorMsg(result.error ?? t.auth.invalidError);
    } else {
      setLoginSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#060B16] text-[#0A1428] dark:text-[#F1F5F9]">
      <PublicHeader
        language={language}
        activeRoute="login"
        onNavigate={onNavigatePublic}
        onLanguageChange={onLanguageChange}
      />

      {/* Split Fintech Screen: Mobile prioritizes Login Form; Desktop balances Form + 3D Trading Intelligence Engine */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12">
        {/* Left: Compact Institutional Sign In Panel */}
        <section className="order-1 lg:col-span-5 flex flex-col justify-center px-5 py-9 sm:px-10 lg:px-12 xl:px-16 bg-white dark:bg-[#0B1324] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] dark:border-[#1B2942] relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 ox-light-grid-bg opacity-45" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[380px] mx-auto space-y-6"
          >
            <div className="space-y-1.5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB] dark:text-[#60A5FA]">
                OXINVO TERMINAL
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-[28px] text-[#0A1428] dark:text-[#F8FAFC] tracking-tight">
                {t.auth.title}
              </h1>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{t.auth.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5"
                >
                  {extra.usernameOrEmail}
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] dark:group-focus-within:text-[#60A5FA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                  <input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username@oxinvo.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:ring-3 focus:ring-[#2563EB]/15 dark:focus:ring-[#3B82F6]/20 transition-all"
                  />
                </div>
              </div>

              <CustomPasswordInput
                id="login-password"
                label={t.auth.password}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <CustomCheckbox
                  id="login-remember"
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label={t.auth.rememberMe}
                />
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] transition-colors"
                >
                  {extra.forgotPassword}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    role="alert"
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/35 border border-[#FECACA] dark:border-[#991B1B] text-xs font-medium text-[#DC2626] dark:text-[#FCA5A5]"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
                {loginSuccess && !errorMsg && (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#ECFDF5] dark:bg-[#064E3B]/45 border border-[#A7F3D0] dark:border-[#065F46] text-xs font-medium text-[#047857] dark:text-[#34D399]"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t.auth.signingIn}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <MagneticButton type="submit" loading={submitting} className="w-full py-3 mt-1">
                <span>{submitting ? t.auth.signingIn : t.auth.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </form>

            {/* Support channels for prospective users */}
            <div className="pt-5 border-t border-[#E2E8F0] dark:border-[#1B2942] text-center space-y-3">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{extra.noAccountPrompt}</p>
              <div className="flex items-center justify-center gap-3.5">
                <WhatsAppBrandButton
                  href={contactConfig.whatsappUrl || undefined}
                  label={extra.whatsappLabel}
                  onFallbackClick={() => setContactOpen(true)}
                />
                <TelegramBrandButton
                  href={contactConfig.telegramUrl || undefined}
                  label={extra.telegramLabel}
                  onFallbackClick={() => setContactOpen(true)}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right: OXINVO Trading Intelligence Engine (3D Perspective Candlesticks + Telemetry HUD) */}
        <section className="order-2 lg:col-span-7 min-h-[430px] lg:min-h-[calc(100vh-4rem)] flex">
          <TradingIntelligenceEngine language={language} />
        </section>
      </main>

      <PublicFooter
        language={language}
        contactConfig={contactConfig}
        onNavigate={onNavigatePublic}
        onContactChannelFallback={() => setContactOpen(true)}
      />

      {/* Forgot Password Modal */}
      <CustomModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title={extra.forgotTitle}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#1D4ED8]/50">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">{extra.forgotBody}</p>
          </div>
          <div className="flex justify-end gap-2">
            <MagneticButton
              variant="secondary"
              onClick={() => {
                setForgotOpen(false);
                onNavigatePublic('contact');
              }}
            >
              {extra.openContactPage}
            </MagneticButton>
            <MagneticButton onClick={() => setForgotOpen(false)}>{t.auth.close}</MagneticButton>
          </div>
        </div>
      </CustomModal>

      {/* Contact Desk Modal when WhatsApp/Telegram URL not yet configured */}
      <CustomModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={t.auth.adminTitle}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#1D4ED8]/50">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-[#0A1428] dark:text-[#F1F5F9]">{extra.contactNotConfigured}</p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">{extra.contactConfigureHint}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <MagneticButton
              variant="secondary"
              onClick={() => {
                setContactOpen(false);
                onNavigatePublic('contact');
              }}
            >
              {extra.openContactPage}
            </MagneticButton>
            <MagneticButton onClick={() => setContactOpen(false)}>{t.auth.close}</MagneticButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
