import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { LanguageCode, PublicContactConfig, PublicRoute } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { OxinvoLogo } from '../ui/OxinvoLogo';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeContext';
import { TelegramBrandButton, WhatsAppBrandButton } from './BrandSocialIcons';

interface PublicHeaderProps {
  language: LanguageCode;
  activeRoute: PublicRoute;
  onNavigate: (route: PublicRoute) => void;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  language,
  activeRoute,
  onNavigate,
  onLanguageChange,
}) => {
  const copy = EXTRA_COPY[language].publicNav;
  const themeCopy = EXTRA_COPY[language].theme;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (route: PublicRoute) =>
    `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
      activeRoute === route
        ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold'
        : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:bg-[#F1F5F9]/80 dark:hover:bg-[#111C33]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] dark:border-[#1B2942] ox-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="focus:outline-none shrink-0"
          aria-label="OXINVO"
        >
          <OxinvoLogo size={32} />
        </button>

        <nav className="hidden md:flex items-center gap-1.5" aria-label="Public navigation">
          {(['about', 'contact'] as PublicRoute[]).map((route) => {
            const active = activeRoute === route;
            const label = route === 'about' ? copy.about : copy.contact;
            return (
              <button
                key={route}
                type="button"
                onClick={() => onNavigate(route)}
                className={navLinkClass(route)}
              >
                <span>{label}</span>
                {active && (
                  <motion.span
                    layoutId="ox-pub-nav-underline"
                    className="absolute left-3 right-3 -bottom-[17px] h-[2px] rounded-full bg-[#2563EB] dark:bg-[#60A5FA]"
                  />
                )}
              </button>
            );
          })}
          {activeRoute !== 'login' && (
            <button type="button" onClick={() => onNavigate('login')} className={navLinkClass('login')}>
              {copy.login}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle ariaLabel={themeCopy.toggleLabel} />
          <LanguageSelector language={language} onChange={onLanguageChange} />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0A1428] dark:hover:text-white"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] px-4 py-3 space-y-1">
          {(['login', 'about', 'contact'] as PublicRoute[]).map((route) => {
            const label = route === 'login' ? copy.login : route === 'about' ? copy.about : copy.contact;
            return (
              <button
                key={route}
                type="button"
                onClick={() => {
                  onNavigate(route);
                  setMobileOpen(false);
                }}
                className={`w-full text-left block ${navLinkClass(route)}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

interface PublicFooterProps {
  language: LanguageCode;
  contactConfig: PublicContactConfig;
  onNavigate: (route: PublicRoute) => void;
  onContactChannelFallback?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  language,
  contactConfig,
  onNavigate,
  onContactChannelFallback,
}) => {
  const copy = EXTRA_COPY[language].publicNav;
  const loginExtra = EXTRA_COPY[language].loginExtra;

  return (
    <footer className="border-t border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#080F1D] text-[#475569] dark:text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="focus:outline-none"
              aria-label="OXINVO"
            >
              <OxinvoLogo size={28} compact />
            </button>
            <p className="text-xs text-[#64748B] dark:text-[#64748B]">{copy.poweredBy}</p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <button type="button" onClick={() => onNavigate('about')} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              {copy.about}
            </button>
            <button type="button" onClick={() => onNavigate('contact')} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              {copy.contact}
            </button>
            <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              {copy.privacy}
            </button>
            <button type="button" onClick={() => onNavigate('terms')} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              {copy.terms}
            </button>
            <button type="button" onClick={() => onNavigate('risk')} className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
              {copy.risk}
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <WhatsAppBrandButton
              size="sm"
              href={contactConfig.whatsappUrl || undefined}
              label={loginExtra.whatsappLabel}
              onFallbackClick={onContactChannelFallback ?? (() => onNavigate('contact'))}
            />
            <TelegramBrandButton
              size="sm"
              href={contactConfig.telegramUrl || undefined}
              label={loginExtra.telegramLabel}
              onFallbackClick={onContactChannelFallback ?? (() => onNavigate('contact'))}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] dark:border-[#132038] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#94A3B8] dark:text-[#64748B] font-mono">
          <span>{copy.copyright}</span>
          <span>oxinvo.com</span>
        </div>
      </div>
    </footer>
  );
};
