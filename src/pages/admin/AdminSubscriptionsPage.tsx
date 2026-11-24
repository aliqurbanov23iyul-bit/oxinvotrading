import React from 'react';
import { SubscriptionTierInfo, UserAccount } from '../../types';
import { TranslationDictionary, translatePlan } from '../../i18n/translations';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AdminSubscriptionsPageProps {
  t: TranslationDictionary;
  tiers: SubscriptionTierInfo[];
  users: UserAccount[];
  counts?: Record<string,number>;
}

export const AdminSubscriptionsPage: React.FC<AdminSubscriptionsPageProps> = ({
  t,
  tiers,
  users, counts,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {tiers.map((tier) => {
        const subscriberCount = counts?.[tier.id] ?? users.filter((u) => u.plan === tier.id).length;
        return (
          <section key={tier.id} className="ox-card p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-lg text-[#0F172A]">
                  {translatePlan(tier.id, t)}
                </h3>
                <StatusBadge tone="blue" label={`${subscriberCount}`} />
              </div>
              <p className="text-xl font-display font-bold text-[#2563EB] mt-3">
                {tier.monthlyPriceLabel}
              </p>
            </div>

            <div className="space-y-2.5 text-xs pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">{t.admin.maxBots}</span>
                <span className="font-mono font-semibold text-[#0F172A]">{tier.maxBots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">{t.admin.maxPairs}</span>
                <span className="font-mono font-semibold text-[#0F172A]">{tier.maxPairs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">{t.admin.aiAccess}</span>
                <span className="font-medium text-[#334155] text-right">{tier.aiProvidersAllowed}</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
