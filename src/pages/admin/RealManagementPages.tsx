import React, {useEffect,useState} from 'react';
import {api} from '../../services/api';
import {LanguageCode} from '../../types';
import {ACCOUNT_COPY} from '../../i18n/account';
import {TRANSLATIONS} from '../../i18n/translations';
import {MagneticButton} from '../../components/ui/MagneticButton';
import {CustomSelect} from '../../components/ui/CustomSelect';
import {CustomPasswordInput} from '../../components/ui/CustomPasswordInput';
export function AccountSecurity({language,onChangePassword}:{language:LanguageCode;onChangePassword:()=>void}){
 const text=ACCOUNT_COPY[language],t=TRANSLATIONS[language];const [rows,setRows]=useState<any[]>([]),[error,setError]=useState('');
 const load=()=>api.get<any[]>('/auth/sessions').then(setRows).catch(()=>setError(t.auth.invalidError));useEffect(()=>{load();},[]);
 return <section className="ox-card p-6 space-y-4"><h2 className="font-display font-semibold">{text.sessions}</h2><MagneticButton onClick={onChangePassword}>{text.change}</MagneticButton>{error&&<p role="alert">{error}</p>}{rows.map(row=><div key={row.id} className="flex flex-wrap justify-between gap-3 border-b border-[#E2E8F0] py-3 text-sm"><div><p>{row.ipAddress??'—'}</p><p className="text-xs text-[#64748B]">{new Date(row.expiresAt).toLocaleString()}</p></div><MagneticButton variant="secondary" onClick={()=>void api.delete('/auth/sessions/'+row.id).then(load).catch(()=>setError(t.auth.invalidError))}>{t.common.close} · Session</MagneticButton></div>)}</section>;
}
export function ProviderSettings({language}:{language:LanguageCode}){
 const t=TRANSLATIONS[language],text=ACCOUNT_COPY[language];const [rows,setRows]=useState<any[]>([]),[providerName,setProvider]=useState('LOCAL'),[modelName,setModel]=useState(''),[apiKey,setKey]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const load=()=>api.get<any[]>('/admin/ai-providers').then(setRows);useEffect(()=>{load().catch(()=>setError(t.auth.invalidError));},[]);
 async function save(event:React.FormEvent){event.preventDefault();setBusy(true);setError('');try{await api.post('/admin/ai-providers',{body:{providerName,modelName,isEnabled:false,apiKey:apiKey||undefined}});setKey('');await load();}catch{setError(t.auth.invalidError);}finally{setBusy(false);}}
 return <div className="space-y-5"><p className="text-sm text-[#64748B]">{text.unavailable}</p><div className="grid md:grid-cols-2 gap-5">{rows.map(row=><section key={row.id} className="ox-card p-6 space-y-4"><h2 className="font-display font-semibold">{row.providerName} · {row.modelName}</h2><MagneticButton variant="secondary" onClick={()=>void api.post('/admin/ai-providers',{body:{providerName:row.providerName,modelName:row.modelName,isEnabled:!row.isEnabled}}).then(load).catch(()=>setError(t.auth.invalidError))}>{row.isEnabled?t.statusLabels.stopped:t.statusLabels.active}</MagneticButton></section>)}</div><form onSubmit={save} className="ox-card p-6 space-y-4 max-w-xl"><CustomSelect label="AI Provider" value={providerName} onChange={setProvider} options={['OPENAI','GEMINI','GROK','LOCAL'].map(value=>({value,label:value}))}/><label className="block text-xs">Model<input required value={modelName} onChange={event=>setModel(event.target.value)} className="block w-full border border-[#E2E8F0] rounded-xl p-3 mt-2"/></label><CustomPasswordInput label="API key" value={apiKey} onChange={setKey}/>{error&&<p role="alert" className="text-red-600 text-sm">{error}</p>}<MagneticButton type="submit" loading={busy}>{t.common.save??t.account.saveChanges}</MagneticButton></form></div>;
}
export function SystemSettings({language}:{language:LanguageCode}){
 const t=TRANSLATIONS[language];const [rows,setRows]=useState<any[]>([]),[value,setValue]=useState(''),[error,setError]=useState('');const load=()=>api.get<any[]>('/admin/settings').then(setRows);useEffect(()=>{load().catch(()=>setError(t.auth.invalidError));},[]);
 return <section className="ox-card p-6 max-w-xl space-y-4"><h2 className="font-display font-semibold">{t.account.settingsTitle}</h2><p>PAPER · LIVE disabled</p>{rows.map(row=><p key={row.key} className="text-sm">{row.key}: {String(row.value)}</p>)}<label className="block text-xs">Support contact<input className="block rounded-xl border border-[#E2E8F0] p-3 w-full mt-2" value={value} onChange={event=>setValue(event.target.value)} maxLength={200}/></label><MagneticButton onClick={()=>void api.patch('/admin/settings',{body:{key:'supportContact',value}}).then(load).catch(()=>setError(t.auth.invalidError))}>{t.account.saveChanges}</MagneticButton>{error&&<p role="alert">{error}</p>}</section>;
}
