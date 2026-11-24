import React from 'react';
import { Cpu } from 'lucide-react';
import { AIProviderConfig } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomToggle } from '../../components/ui/CustomToggle';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AdminAIProvidersPageProps {
  t: TranslationDictionary;
  providers: AIProviderConfig[];
  onToggleProvider: (id: AIProviderConfig['id'], enabled: boolean) => void;
  onChangeModel: (id: AIProviderConfig['id'], model: string) => void;
}

export const AdminAIProvidersPage: React.FC<AdminAIProvidersPageProps> = ({
  t,
  providers,
  onToggleProvider,
  onChangeModel,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {providers.map((provider) => {
        const statusTone =
          provider.status === 'online'
            ? 'emerald'
            : provider.status === 'standby'
            ? 'slate'
            : 'amber';
        const statusLabel =
          provider.status === 'online'
            ? t.statusLabels.online
            : provider.status === 'standby'
            ? t.statusLabels.standby
            : t.statusLabels.degraded;

        return (
          <section key={provider.id} className="ox-card p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-base text-[#0F172A]">
                    {provider.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">{provider.vendor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone={statusTone} label={statusLabel} />
                <CustomToggle
                  checked={provider.enabled}
                  onChange={(val) => onToggleProvider(provider.id, val)}
                  ariaLabel={provider.name}
                />
              </div>
            </div>

            <CustomSelect
              label={t.admin.model}
              value={provider.selectedModel}
              onChange={(model) => onChangeModel(provider.id, model)}
              options={provider.availableModels.map((m) => ({ value: m, label: m }))}
            />

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[11px] text-[#64748B]">{t.admin.requests24h}</p>
                <p className="font-mono font-semibold text-sm text-[#0F172A] mt-0.5">
                  {provider.requests24h.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[11px] text-[#64748B]">{t.admin.latency}</p>
                <p className="font-mono font-semibold text-sm text-[#2563EB] mt-0.5">
                  {provider.avgLatencyMs} ms
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-[11px] text-[#64748B]">{t.admin.estCost}</p>
                <p className="font-mono font-semibold text-sm text-[#0F172A] mt-0.5">
                  ${provider.estimatedCostUsd.toFixed(2)}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
