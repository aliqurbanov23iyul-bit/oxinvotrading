import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Bell, CheckCheck, ChevronDown, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LanguageCode, NotificationItem, StrategyMode, UserAccount } from '../../types';
import { TranslationDictionary, translatePlan } from '../../i18n/translations';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomSlider } from '../../components/ui/CustomSlider';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { CustomTabs } from '../../components/ui/CustomTabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/ToastProvider';

interface NotificationsPageProps {
  t: TranslationDictionary;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  t,
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const visible = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CustomTabs
          activeTab={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: t.account.all, count: notifications.length },
            { id: 'unread', label: t.account.unread, count: notifications.filter((n) => !n.read).length },
          ]}
        />
        <MagneticButton variant="secondary" onClick={onMarkAllRead}>
          <CheckCheck className="w-4 h-4" />
          <span>{t.account.markAllRead}</span>
        </MagneticButton>
      </div>

      <section className="ox-card overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Bell className="w-5 h-5" />}
              title={t.account.noNotifications}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
            {visible.map((item) => {
              const loc = t.demoNotifications[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onMarkRead(item.id)}
                  className={`w-full p-5 text-left flex items-start justify-between gap-4 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] ${
                    !item.read ? 'bg-[#EFF6FF]/45 dark:bg-[#111C33]/55' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        !item.read
                          ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#2563EB] dark:text-[#60A5FA]'
                          : 'bg-[#F1F5F9] dark:bg-[#070D19] text-[#64748B] dark:text-[#94A3B8]'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]">
                        {loc ? loc.title : item.title}
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        {loc ? loc.message : item.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#94A3B8] dark:text-[#64748B] shrink-0">
                    {loc ? loc.timestamp : item.timestamp}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

interface SettingsPageProps {
  t: TranslationDictionary;
  user: UserAccount;
  language: LanguageCode;
  strategy: StrategyMode;
  onLanguageChange: (lang: LanguageCode) => void;
  onStrategyChange: (strategy: StrategyMode) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  t,
  user,
  language,
  strategy,
  onLanguageChange,
  onStrategyChange,
}) => {
  const { showToast } = useToast();
  const [maxAllocation, setMaxAllocation] = useState(5);
  const [stopLoss, setStopLoss] = useState(3);
  useEffect(() => {
    api
      .get<{ key: string; value: unknown }[]>('/users/me/settings')
      .then((rows) => {
        const allocation = rows.find((row) => row.key === 'maxAllocation');
        const stop = rows.find((row) => row.key === 'stopLoss');
        if (allocation) setMaxAllocation(Number(allocation.value));
        if (stop) setStopLoss(Number(stop.value));
      })
      .catch(() => {});
  }, []);

  const strategyOptions: { value: StrategyMode; label: string }[] = [
    { value: 'Adaptive Momentum', label: t.aiBot.strategies.adaptive },
    { value: 'Breakout Volume Surge', label: t.aiBot.strategies.breakout },
    { value: 'Mean Reversion', label: t.aiBot.strategies.reversion },
    { value: 'Liquidity Impulse', label: t.aiBot.strategies.impulse },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl">
      <section className="ox-card p-6 lg:col-span-7 space-y-5">
        <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {t.account.settingsTitle}
        </h2>

        <CustomSelect
          label={t.account.language}
          value={language}
          onChange={(v) => onLanguageChange(v as LanguageCode)}
          options={[
            { value: 'az', label: 'Azərbaycanca' },
            { value: 'en', label: 'English' },
            { value: 'tr', label: 'Türkçe' },
            { value: 'ru', label: 'Русский' },
          ]}
        />

        <CustomSelect
          label={t.account.defaultStrategy}
          value={strategy}
          onChange={(v) => onStrategyChange(v as StrategyMode)}
          options={strategyOptions}
        />

        <CustomSlider
          label={t.account.maxAllocation}
          value={maxAllocation}
          min={1}
          max={15}
          valueSuffix="%"
          onChange={setMaxAllocation}
        />

        <CustomSlider
          label={t.account.stopLossLimit}
          value={stopLoss}
          min={1}
          max={10}
          valueSuffix="%"
          onChange={setStopLoss}
        />

        <div className="pt-2">
          <MagneticButton
            onClick={() =>
              void api
                .patch('/users/me/settings', { body: { strategy, maxAllocation, stopLoss } })
                .then(() => showToast(t.common.updated, 'success'))
                .catch(() => showToast(t.auth.invalidError, 'error'))
            }
          >
            {t.account.saveChanges}
          </MagneticButton>
        </div>
      </section>

      <section className="ox-card p-6 lg:col-span-5 space-y-4 h-fit">
        <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {t.account.accountSummary}
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9] dark:border-[#16233B]">
            <span className="text-[#64748B] dark:text-[#94A3B8]">{t.auth.username}</span>
            <span className="font-mono font-medium text-[#0A1428] dark:text-[#F1F5F9]">@{user.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9] dark:border-[#16233B]">
            <span className="text-[#64748B] dark:text-[#94A3B8]">{t.account.plan}</span>
            <span className="font-semibold text-[#2563EB] dark:text-[#60A5FA]">{translatePlan(user.plan, t)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-[#64748B] dark:text-[#94A3B8]">{t.account.expires}</span>
            <span className="font-mono text-[#0A1428] dark:text-[#F1F5F9]">{user.expiresAt}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export const HelpCenterPage: React.FC<{ t: TranslationDictionary }> = ({ t }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    { q: t.account.faq1Q, a: t.account.faq1A },
    { q: t.account.faq2Q, a: t.account.faq2A },
    { q: t.account.faq3Q, a: t.account.faq3A },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <section className="ox-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {t.account.faqTitle}
          </h2>
        </div>

        <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
          {faqs.map((item, idx) => {
            const expanded = openIdx === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenIdx(expanded ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0 transition-transform ${
                      expanded ? 'rotate-180 text-[#2563EB] dark:text-[#60A5FA]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pt-2.5 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed"
                    >
                      {item.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <div className="ox-card p-5 text-sm text-[#475569] dark:text-[#CBD5E1]">{t.account.contactSupport}</div>
    </div>
  );
};
