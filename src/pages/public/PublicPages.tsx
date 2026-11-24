import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Cpu,
  Database,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode, PublicContactConfig, PublicRoute } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TradingIntelligenceEngine } from '../../components/three/TradingIntelligenceEngine';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { PublicFooter, PublicHeader } from '../../components/public/PublicShell';
import { TelegramBrandButton, WhatsAppBrandButton } from '../../components/public/BrandSocialIcons';
import { api } from '../../services/api';

interface PublicPageBaseProps {
  language: LanguageCode;
  contactConfig: PublicContactConfig;
  onNavigate: (route: PublicRoute) => void;
  onLanguageChange: (lang: LanguageCode) => void;
}

const PIPELINE_ICONS = [Database, Radar, Activity, BrainCircuit, ShieldCheck, Cpu];

export const AboutPage: React.FC<PublicPageBaseProps> = ({
  language,
  contactConfig,
  onNavigate,
  onLanguageChange,
}) => {
  const copy = EXTRA_COPY[language].about;
  const pipeline = EXTRA_COPY[language].pipeline;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#060B16] text-[#0A1428] dark:text-[#F1F5F9]">
      <PublicHeader
        language={language}
        activeRoute="about"
        onNavigate={onNavigate}
        onLanguageChange={onLanguageChange}
      />

      <main className="flex-1">
        {/* Institutional Hero Split */}
        <section className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#080F1D]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6 px-5 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center space-y-6"
            >
              <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/35 border border-[#BFDBFE] dark:border-[#1D4ED8]/50 text-[11px] font-mono font-semibold tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {copy.eyebrow}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#0A1428] dark:text-[#F8FAFC] tracking-tight leading-[1.12]">
                {copy.title}
              </h1>
              <p className="text-base text-[#475569] dark:text-[#94A3B8] max-w-xl leading-relaxed">
                {copy.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <MagneticButton onClick={() => onNavigate('login')}>
                  <span>{copy.ctaLogin}</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
                <MagneticButton variant="secondary" onClick={() => onNavigate('contact')}>
                  <span>{copy.ctaContact}</span>
                </MagneticButton>
              </div>
            </motion.div>

            <div className="lg:col-span-6 min-h-[340px] lg:min-h-[420px] border-t lg:border-t-0 lg:border-l border-[#E2E8F0] dark:border-[#1B2942]">
              <TradingIntelligenceEngine language={language} compact />
            </div>
          </div>
        </section>

        {/* 6-Stage Trading Intelligence Architecture Pipeline */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB] dark:text-[#60A5FA]">
              {pipeline.eyebrow}
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0A1428] dark:text-[#F8FAFC] tracking-tight">
              {pipeline.title}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{pipeline.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            {pipeline.steps.map((step, idx) => {
              const Icon = PIPELINE_ICONS[idx % PIPELINE_ICONS.length];
              const isSelected = activeStage === idx;
              return (
                <motion.button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  onMouseEnter={() => setActiveStage(idx)}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18 }}
                  className={`relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#070D19] dark:bg-[#0E1B34] border-[#2563EB] text-white shadow-[0_14px_34px_rgba(37,99,235,0.22)]'
                      : 'ox-card text-[#0A1428] dark:text-[#F1F5F9] hover:border-[#2563EB]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="font-mono text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-sm">{step.title}</h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-[#CBD5E1]' : 'text-[#64748B] dark:text-[#94A3B8]'
                      }`}
                    >
                      {step.detail}
                    </p>
                  </div>
                  {idx < pipeline.steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="hidden lg:block w-3.5 h-3.5 text-[#3B82F6] absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-[#F6F8FC] dark:bg-[#060B16] rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Core Architecture Pillars + Transparency & FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 space-y-12">
          <div className="space-y-6">
            <h2 className="font-display font-bold text-2xl text-[#0A1428] dark:text-[#F8FAFC]">
              {copy.pillarsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {copy.pillars.map((pillar, idx) => {
                const Icons = [Lock, ShieldCheck, Layers, Globe];
                const PillarIcon = Icons[idx % Icons.length];
                return (
                  <motion.article
                    key={pillar.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="ox-card ox-card-hover p-6 space-y-3"
                  >
                    <span className="inline-flex w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] items-center justify-center">
                      <PillarIcon className="w-4 h-4" />
                    </span>
                    <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{pillar.body}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-5 ox-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 text-[#0A1428] dark:text-[#F1F5F9]">
                <Lock className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                <h2 className="font-display font-bold text-lg">{copy.honestTitle}</h2>
              </div>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">{copy.honestBody}</p>
              <ul className="space-y-2.5 pt-2">
                {copy.honestItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#334155] dark:text-[#CBD5E1]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#60A5FA] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lg:col-span-7 ox-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
                <h2 className="font-display font-bold text-lg text-[#0A1428] dark:text-[#F1F5F9]">
                  {copy.faqTitle}
                </h2>
              </div>
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1B2942]">
                {copy.faqs.map((faq, idx) => {
                  const open = openFaq === idx;
                  return (
                    <div key={faq.q} className="py-3.5">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0 transition-transform ${
                            open ? 'rotate-180 text-[#2563EB] dark:text-[#60A5FA]' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="mt-2.5 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed overflow-hidden"
                          >
                            {faq.a}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </main>

      <PublicFooter language={language} contactConfig={contactConfig} onNavigate={onNavigate} />
    </div>
  );
};

export const ContactPage: React.FC<PublicPageBaseProps> = ({
  language,
  contactConfig,
  onNavigate,
  onLanguageChange,
}) => {
  const copy = EXTRA_COPY[language].contact;
  const loginExtra = EXTRA_COPY[language].loginExtra;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      await api.post('/public/contact', {
        body: { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() },
      });
    } catch {
      setNotice(copy.backendUnavailableNotice);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls =
    'w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:ring-3 focus:ring-[#2563EB]/15 transition-all';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#060B16] text-[#0A1428] dark:text-[#F1F5F9]">
      <PublicHeader
        language={language}
        activeRoute="contact"
        onNavigate={onNavigate}
        onLanguageChange={onLanguageChange}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl space-y-3"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB] dark:text-[#60A5FA]">
            {copy.eyebrow}
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0A1428] dark:text-[#F8FAFC] tracking-tight">
            {copy.title}
          </h1>
          <p className="text-base text-[#475569] dark:text-[#94A3B8]">{copy.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* WhatsApp */}
          <div className="ox-card ox-card-hover p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {copy.whatsappTitle}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  {contactConfig.whatsappUrl ? contactConfig.whatsappUrl : copy.notConfiguredText}
                </p>
              </div>
              <WhatsAppBrandButton
                href={contactConfig.whatsappUrl || undefined}
                label={loginExtra.whatsappLabel}
              />
            </div>
            {!contactConfig.whatsappUrl && (
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] rounded-md px-2.5 py-1 w-fit">
                {copy.notConfiguredBadge}
              </span>
            )}
          </div>

          {/* Telegram */}
          <div className="ox-card ox-card-hover p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {copy.telegramTitle}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  {contactConfig.telegramUrl
                    ? contactConfig.telegramUrl
                    : contactConfig.supportHandle || copy.notConfiguredText}
                </p>
              </div>
              <TelegramBrandButton
                href={contactConfig.telegramUrl || undefined}
                label={loginExtra.telegramLabel}
              />
            </div>
            {!contactConfig.telegramUrl && (
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] rounded-md px-2.5 py-1 w-fit">
                {copy.notConfiguredBadge}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="ox-card ox-card-hover p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {copy.emailTitle}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  {contactConfig.supportEmail ? contactConfig.supportEmail : copy.notConfiguredText}
                </p>
              </div>
              <span className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </span>
            </div>
            {!contactConfig.supportEmail ? (
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] rounded-md px-2.5 py-1 w-fit">
                {copy.notConfiguredBadge}
              </span>
            ) : (
              <a
                href={`mailto:${contactConfig.supportEmail}`}
                className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
              >
                {copy.openChannel}
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 ox-card p-6 sm:p-7 space-y-5">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0A1428] dark:text-[#F1F5F9]">
                {copy.formTitle}
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">{copy.formSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
                    {copy.nameLabel}
                  </label>
                  <input id="c-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
                    {copy.emailLabel}
                  </label>
                  <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} />
                </div>
              </div>

              <div>
                <label htmlFor="c-subject" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
                  {copy.subjectLabel}
                </label>
                <input id="c-subject" type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldCls} />
              </div>

              <div>
                <label htmlFor="c-message" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
                  {copy.messageLabel}
                </label>
                <textarea id="c-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} className={fieldCls} />
              </div>

              {notice && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#78350F]/35 border border-[#FDE68A] dark:border-[#92400E] text-xs font-medium text-[#92400E] dark:text-[#FDE68A] leading-relaxed"
                >
                  {notice}
                </div>
              )}

              <MagneticButton type="submit" loading={submitting}>
                <MessageSquare className="w-4 h-4" />
                <span>{copy.sendButton}</span>
              </MagneticButton>
            </form>
          </section>

          <div className="lg:col-span-5 space-y-6">
            <section className="ox-card p-6 space-y-3 border-[#BFDBFE] dark:border-[#1D4ED8]/50 bg-[#EFF6FF]/50 dark:bg-[#0D1A35]">
              <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {copy.supportTitle}
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">{copy.supportBody}</p>
              <MagneticButton variant="secondary" onClick={() => onNavigate('login')}>
                <span>{EXTRA_COPY[language].publicNav.login}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </section>

            <section className="ox-card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {copy.faqTitle}
              </h2>
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1B2942]">
                {copy.faqs.map((faq, idx) => {
                  const open = openFaq === idx;
                  return (
                    <div key={faq.q} className="py-3">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : idx)}
                        className="w-full flex items-center justify-between gap-3 text-left text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0 transition-transform ${
                            open ? 'rotate-180 text-[#2563EB] dark:text-[#60A5FA]' : ''
                          }`}
                        />
                      </button>
                      {open && <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{faq.a}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter language={language} contactConfig={contactConfig} onNavigate={onNavigate} />
    </div>
  );
};

export const LegalPage: React.FC<PublicPageBaseProps & { doc: 'privacy' | 'terms' | 'risk' }> = ({
  language,
  contactConfig,
  doc,
  onNavigate,
  onLanguageChange,
}) => {
  const legal = EXTRA_COPY[language].legal;
  const content = legal[doc];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#060B16] text-[#0A1428] dark:text-[#F1F5F9]">
      <PublicHeader
        language={language}
        activeRoute={doc}
        onNavigate={onNavigate}
        onLanguageChange={onLanguageChange}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{legal.backToLogin}</span>
        </button>

        <article className="ox-card p-7 sm:p-10 space-y-6">
          <div className="border-b border-[#E2E8F0] dark:border-[#1B2942] pb-5">
            <p className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">{legal.updatedLabel}</p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0A1428] dark:text-[#F8FAFC] mt-1">
              {content.title}
            </h1>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-2 leading-relaxed">{content.intro}</p>
          </div>

          <div className="space-y-6">
            {content.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                  {section.heading}
                </h2>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </main>

      <PublicFooter language={language} contactConfig={contactConfig} onNavigate={onNavigate} />
    </div>
  );
};
