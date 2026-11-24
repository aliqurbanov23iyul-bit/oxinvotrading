import React, { useState } from 'react';
import { Activity, ArrowLeft, KeyRound, Pause, Play, Square } from 'lucide-react';
import { BotStatus, SubscriptionPlan, Trade, UserAccount, UserStatus } from '../../types';
import {
  TranslationDictionary,
  translateBotStatus,
  translateUserStatus,
} from '../../i18n/translations';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomDatePicker } from '../../components/ui/CustomDatePicker';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomModal } from '../../components/ui/CustomModal';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';

interface AdminUserDetailPageProps {
  t: TranslationDictionary;
  user: UserAccount;
  userTrades: Trade[];
  onBack: () => void;
  onUpdateUser: (updated: UserAccount) => void;
  onIssuePasswordReset: (userId: string) => Promise<string>;
}

export const AdminUserDetailPage: React.FC<AdminUserDetailPageProps> = ({
  t,
  user,
  userTrades,
  onBack,
  onUpdateUser,
  onIssuePasswordReset,
}) => {
  const [plan, setPlan] = useState<SubscriptionPlan>(user.plan);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [expiresAt, setExpiresAt] = useState<string>(user.expiresAt);
  const [notes, setNotes] = useState<string>(user.notes);
  const [issuedPassword, setIssuedPassword] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateUser({ ...user, plan, status, expiresAt, notes });
  };

  const handleBotChange = (nextStatus: BotStatus) => {
    onUpdateUser({ ...user, botStatus: nextStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-[#F1F5F9]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.admin.userDetail.back}</span>
        </button>

        <MagneticButton
          variant="secondary"
          onClick={async () => {
            try {
              setIssuedPassword(await onIssuePasswordReset(user.id));
            } catch {
              /* parent displays the safe error */
            }
          }}
        >
          <KeyRound className="w-4 h-4" />
          <span>{t.admin.resetPassword}</span>
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#1B2942]">
            <div>
              <h2 className="font-display font-bold text-xl text-[#0A1428] dark:text-[#F1F5F9]">
                {user.fullName}
              </h2>
              <p className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">@{user.username}</p>
            </div>
            <StatusBadge
              tone={user.status === 'active' ? 'emerald' : user.status === 'suspended' ? 'amber' : 'red'}
              label={translateUserStatus(user.status, t)}
            />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            {t.admin.userDetail.editPlan}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label={t.admin.plan}
              value={plan}
              onChange={(v) => setPlan(v as SubscriptionPlan)}
              options={[
                { value: 'trial', label: t.statusLabels.trial },
                { value: 'standard', label: t.statusLabels.standard },
                { value: 'professional', label: t.statusLabels.professional },
                { value: 'custom', label: t.statusLabels.custom },
              ]}
            />
            <CustomSelect
              label={t.admin.status}
              value={status}
              onChange={(v) => setStatus(v as UserStatus)}
              options={[
                { value: 'active', label: t.statusLabels.active },
                { value: 'suspended', label: t.statusLabels.suspended },
                { value: 'expired', label: t.statusLabels.expired },
              ]}
            />
          </div>

          <CustomDatePicker
            label={t.admin.createUserModal.expiresAt}
            value={expiresAt}
            onChange={setExpiresAt}
            clearLabel={t.common.clear}
          />

          <div>
            <label className="block text-xs font-medium text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              {t.admin.createUserModal.notes}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <MagneticButton onClick={handleSave}>{t.admin.userDetail.saveUser}</MagneticButton>
        </section>

        <div className="lg:col-span-5 space-y-6">
          <section className="ox-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {t.admin.userDetail.botControl}
              </h3>
              <StatusBadge
                tone={
                  user.botStatus === 'running'
                    ? 'blue'
                    : user.botStatus === 'paused'
                    ? 'amber'
                    : 'slate'
                }
                label={translateBotStatus(user.botStatus, t)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MagneticButton
                disabled
                variant={user.botStatus === 'running' ? 'primary' : 'secondary'}
                onClick={() => handleBotChange('running')}
                className="px-2 py-2 text-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t.aiBot.start}</span>
              </MagneticButton>
              <MagneticButton
                disabled
                variant={user.botStatus === 'paused' ? 'primary' : 'secondary'}
                onClick={() => handleBotChange('paused')}
                className="px-2 py-2 text-xs"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>{t.aiBot.pause}</span>
              </MagneticButton>
              <MagneticButton
                disabled
                variant={user.botStatus === 'stopped' ? 'danger' : 'secondary'}
                onClick={() => handleBotChange('stopped')}
                className="px-2 py-2 text-xs"
              >
                <Square className="w-3.5 h-3.5" />
                <span>{t.aiBot.stop}</span>
              </MagneticButton>
            </div>
          </section>

          <section className="ox-card p-6 space-y-3">
            <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {t.admin.userDetail.connections}
            </h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
              <span className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
                {t.admin.userDetail.binance}
              </span>
              <StatusBadge
                tone={user.binanceConnected ? 'emerald' : 'slate'}
                label={user.binanceConnected ? t.connections.connected : t.connections.notConnected}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
              <span className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
                {t.admin.userDetail.telegram}
              </span>
              <StatusBadge
                tone={user.telegramConnected ? 'emerald' : 'slate'}
                label={user.telegramConnected ? t.connections.connected : t.connections.notConnected}
              />
            </div>
          </section>
        </div>
      </div>

      <section className="ox-card p-6">
        <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
          {t.admin.userDetail.userTrades}
        </h3>
        {userTrades.length === 0 ? (
          <EmptyState compact icon={<Activity className="w-5 h-5" />} title={t.common.noData} />
        ) : (
          <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
            {userTrades.slice(0, 5).map((tr) => {
              const pos = tr.pnlUsd >= 0;
              return (
                <div key={tr.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <CoinIcon symbol={tr.symbol} size={24} />
                    <div>
                      <span className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{tr.symbol}</span>
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8] ml-2">{tr.strategy}</span>
                    </div>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      pos ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                    }`}
                  >
                    {pos ? '+' : '-'}${Math.abs(tr.pnlUsd).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <CustomModal
        open={Boolean(issuedPassword)}
        onClose={() => setIssuedPassword(null)}
        title={t.admin.userDetail.newTempPassword}
        maxWidthClass="max-w-sm"
      >
        {issuedPassword && (
          <div className="space-y-4">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.admin.createUserModal.passwordNote}</p>
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE] dark:border-[#1E3A8A] font-mono text-sm font-bold text-[#0A1428] dark:text-[#F1F5F9] text-center">
              {issuedPassword}
            </div>
            <div className="flex justify-end">
              <MagneticButton onClick={() => setIssuedPassword(null)}>{t.common.close}</MagneticButton>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};
