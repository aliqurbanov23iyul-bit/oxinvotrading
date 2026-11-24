import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomModal } from '../../components/ui/CustomModal';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { Plan } from '../../services/account-mappers';
import { ACCOUNT_COPY } from '../../i18n/account';
import { LanguageCode } from '../../types';
interface Props { open: boolean; t: TranslationDictionary; language: LanguageCode; plans: Plan[]; canCreateAdmin: boolean; onClose: () => void; onCreate: (data: Record<string, unknown>) => Promise<void> }
export function CreateUserModal({ open,t,language,plans,canCreateAdmin,onClose,onCreate }: Props) {
 const [username,setUsername]=useState(''),[fullName,setFullName]=useState(''),[planId,setPlanId]=useState(''),[preferredLanguage,setPreferredLanguage]=useState(language.toUpperCase()),[role,setRole]=useState('USER'),[status,setStatus]=useState('ACTIVE'),[durationDays,setDuration]=useState(30),[notes,setNotes]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const text=ACCOUNT_COPY[language];
 async function submit(event:React.FormEvent){event.preventDefault();setBusy(true);setError('');try{await onCreate({username:username.toLowerCase().trim(),fullName:fullName.trim()||undefined,planId:planId||plans[0]?.id,preferredLanguage,role,status,durationDays,notes});setUsername('');setFullName('');setNotes('');onClose();}catch{setError(t.auth.invalidError);}finally{setBusy(false);}}
 const input='w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#2563EB]';
 return <CustomModal open={open} onClose={onClose} title={t.admin.createUserModal.title} maxWidthClass="max-w-lg"><form onSubmit={submit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs">{t.auth.username}<input required className={input} value={username} onChange={e=>setUsername(e.target.value)} autoComplete="off"/></label><label className="text-xs">{t.admin.createUserModal.fullName}<input className={input} value={fullName} onChange={e=>setFullName(e.target.value)}/></label></div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><CustomSelect label={t.admin.createUserModal.plan} value={planId||plans[0]?.id||''} onChange={setPlanId} options={plans.map(p=>({value:p.id,label:t.statusLabels[p.name as SubscriptionPlan]??p.name}))}/><label className="text-xs">{text.duration}<input type="number" min={1} max={3650} required className={input} value={durationDays} onChange={e=>setDuration(Number(e.target.value))}/></label></div>
 <div className="grid grid-cols-2 gap-4"><CustomSelect label={t.account.language} value={preferredLanguage} onChange={setPreferredLanguage} options={['AZ','EN','TR','RU'].map(value=>({value,label:value}))}/><CustomSelect label={t.trades.status} value={status} onChange={setStatus} options={['ACTIVE','SUSPENDED','EXPIRED'].map(value=>({value,label:t.statusLabels[value.toLowerCase() as keyof typeof t.statusLabels]??value}))}/></div>
 {canCreateAdmin&&<CustomSelect label={text.role} value={role} onChange={setRole} options={['USER','ADMIN'].map(value=>({value,label:value}))}/>}
 <label className="block text-xs">{t.admin.createUserModal.notes}<textarea className={input} value={notes} onChange={e=>setNotes(e.target.value)} maxLength={2000}/></label>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-2"><MagneticButton type="button" variant="secondary" onClick={onClose}>{t.common.cancel}</MagneticButton><MagneticButton type="submit" loading={busy} disabled={!plans.length}>{t.admin.createUserModal.create}</MagneticButton></div>
 </form></CustomModal>;
}
