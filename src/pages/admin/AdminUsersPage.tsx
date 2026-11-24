import React, { useEffect, useMemo, useState } from 'react';
import { Eye, KeyRound, PauseCircle, PlayCircle, Plus, Trash2, Users } from 'lucide-react';
import { SubscriptionPlan, UserAccount, UserStatus } from '../../types';
import { TranslationDictionary, translatePlan, translateUserStatus } from '../../i18n/translations';
import { CustomSearchInput } from '../../components/ui/CustomSearchInput';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomContextMenu } from '../../components/ui/CustomContextMenu';
import { CustomPagination } from '../../components/ui/CustomPagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';

interface AdminUsersPageProps {
  t: TranslationDictionary;
  users: UserAccount[];
  onSelectUser: (user: UserAccount) => void;
  onOpenCreateUser: () => void;
  onToggleSuspend: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onQueryChange?: (query: { search: string; plan: string; status: string }) => void;
  page?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  t,
  users,
  onSelectUser,
  onOpenCreateUser,
  onToggleSuspend,
  onResetPassword,
  onDeleteUser,
  onQueryChange,
  page = 1,
  total = 0,
  onPageChange,
}) => {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | SubscriptionPlan>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);

  useEffect(() => {
    onQueryChange?.({
      search,
      plan: planFilter === 'ALL' ? '' : planFilter,
      status: statusFilter === 'ALL' ? '' : statusFilter.toUpperCase(),
    });
  }, [search, planFilter, statusFilter, onQueryChange]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const qMatch =
        !q || u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q);
      const planMatch = planFilter === 'ALL' || u.plan === planFilter;
      const statusMatch = statusFilter === 'ALL' || u.status === statusFilter;
      return qMatch && planMatch && statusMatch;
    });
  }, [users, search, planFilter, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="ox-card p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <CustomSearchInput
            value={search}
            onChange={setSearch}
            placeholder={t.admin.searchUsers}
          />
          <CustomSelect
            value={planFilter}
            onChange={(v) => setPlanFilter(v as 'ALL' | SubscriptionPlan)}
            options={[
              { value: 'ALL', label: t.admin.allPlans },
              { value: 'trial', label: t.statusLabels.trial },
              { value: 'standard', label: t.statusLabels.standard },
              { value: 'professional', label: t.statusLabels.professional },
              { value: 'custom', label: t.statusLabels.custom },
            ]}
          />
          <CustomSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as 'ALL' | UserStatus)}
            options={[
              { value: 'ALL', label: t.admin.allStatuses },
              { value: 'active', label: t.statusLabels.active },
              { value: 'suspended', label: t.statusLabels.suspended },
              { value: 'expired', label: t.statusLabels.expired },
            ]}
          />
        </div>

        <MagneticButton onClick={onOpenCreateUser}>
          <Plus className="w-4 h-4" />
          <span>{t.admin.createUser}</span>
        </MagneticButton>
      </div>

      <section className="ox-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={<Users className="w-5 h-5" />} title={t.common.noData} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  <th className="py-3.5 px-5">{t.admin.user}</th>
                  <th className="py-3.5 px-4">{t.admin.plan}</th>
                  <th className="py-3.5 px-4">{t.admin.status}</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{t.admin.expires}</th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">{t.admin.balance}</th>
                  <th className="py-3.5 px-4 text-right">{t.admin.pnl}</th>
                  <th className="py-3.5 px-5 text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#16233B] text-sm">
                {filtered.map((user) => {
                  const statusTone =
                    user.status === 'active'
                      ? 'emerald'
                      : user.status === 'suspended'
                      ? 'amber'
                      : 'red';
                  const pos = user.realizedPnl >= 0;
                  return (
                    <tr
                      key={user.id}
                      onClick={() => onSelectUser(user)}
                      className="hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{user.fullName}</p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">@{user.username}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-[#2563EB] dark:text-[#60A5FA]">
                        {translatePlan(user.plan, t)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge tone={statusTone} label={translateUserStatus(user.status, t)} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#64748B] dark:text-[#94A3B8] hidden md:table-cell">
                        {user.expiresAt}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#0A1428] dark:text-[#F1F5F9] hidden sm:table-cell">
                        ${user.portfolioBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono tabular-nums font-semibold ${
                          pos ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {pos ? '+' : '-'}${Math.abs(user.realizedPnl).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <CustomContextMenu
                          ariaLabel={t.admin.actions}
                          items={[
                            {
                              id: 'view',
                              label: t.admin.viewUser,
                              icon: <Eye className="w-3.5 h-3.5" />,
                              onClick: () => onSelectUser(user),
                            },
                            {
                              id: 'reset',
                              label: t.admin.resetPassword,
                              icon: <KeyRound className="w-3.5 h-3.5" />,
                              onClick: () => onResetPassword(user.id),
                            },
                            {
                              id: 'toggle',
                              label:
                                user.status === 'suspended' ? t.admin.activate : t.admin.suspend,
                              icon:
                                user.status === 'suspended' ? (
                                  <PlayCircle className="w-3.5 h-3.5" />
                                ) : (
                                  <PauseCircle className="w-3.5 h-3.5" />
                                ),
                              onClick: () => onToggleSuspend(user.id),
                            },
                            {
                              id: 'delete',
                              label: t.admin.delete,
                              icon: <Trash2 className="w-3.5 h-3.5" />,
                              danger: true,
                              onClick: () => setDeleteTarget(user),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDeleteUser(deleteTarget.id);
        }}
        title={t.admin.delete}
        description={t.admin.deleteConfirm}
        confirmLabel={t.admin.delete}
        cancelLabel={t.common.cancel}
      />
      {onPageChange && (
        <CustomPagination
          page={page}
          totalPages={Math.max(1, Math.ceil(total / 10))}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
