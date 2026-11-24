import React from 'react';
import { SubscriptionTierInfo, UserAccount } from '../../types';
import { TranslationDictionary, translatePlan } from '../../i18n/translations';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AdminSubscriptionsPageProps {
  t: TranslationDictionary;
  tiers: SubscriptionTierInfo[];
  users: UserAccount[];
  counts?: Record<string, number>;
}

export const AdminSubscriptionsPage: React.FC<AdminSubscriptionsPageProps> = ({
  t,
  tiers,
  users,
  counts,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {tiers.map((tier) => {
        const subscriberCount = counts?.[tier.id] ?? users.filter((u) => u.plan === tier.id).length;
        return (
          <section key={tier.id} className="ox-card ox-card-hover p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-lg text-[#0A1428] dark:text-[#F1F5F9]">
                  {translatePlan(tier.id, t)}
                </h3>
                <StatusBadge tone="blue" label={`${subscriberCount}`} />
              </div>
              <p className="text-xl font-display font-bold text-[#2563EB] dark:text-[#60A5FA] mt-3">
                {tier.monthlyPriceLabel}
              </p>
            </div>

            <div className="space-y-2.5 text-xs pt-3 border-t border-[#E2E8F0] dark:border-[#1B2942]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">{t.admin.maxBots}</span>
                <span className="font-mono font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{tier.maxBots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">{t.admin.maxPairs}</span>
                <span className="font-mono font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{tier.maxPairs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">{t.admin.aiAccess}</span>
                <span className="font-medium text-[#334155] dark:text-[#CBD5E1] text-right">
                  {tier.aiProvidersAllowed}
                </span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
