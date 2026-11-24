import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { TRANSLATIONS } from './i18n/translations';
import { ACCOUNT_COPY } from './i18n/account';
import { AppRoute, AuditLogEntry, LanguageCode, NotificationItem, StrategyMode, Trade, UserAccount, TimeframeKey, PortfolioPoint, BinanceConnectionState, TelegramConnectionState } from './types';
import { api, clearApiSession, refreshCsrf, setCsrfToken } from './services/api';
import { mapUser, mapTrade, mapAudit, Plan, ServerUser } from './services/account-mappers';
import { ToastProvider, useToast } from './components/ui/ToastProvider';
import { BootLoader } from './components/layout/BootLoader';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { CredentialsModal, OneTimeCredentials } from './components/ui/CredentialsModal';
import { MagneticButton } from './components/ui/MagneticButton';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { AITradingEnginePage } from './pages/dashboard/AITradingEnginePage';
import { MarketScannerPage } from './pages/dashboard/MarketScannerPage';
import { TradesViewPage } from './pages/dashboard/TradesViewPage';
import { TradeDetailModal } from './pages/dashboard/TradeDetailModal';
import { AnalyticsPage, PortfolioPage } from './pages/dashboard/PortfolioAndAnalyticsPages';
import { ConnectionsPage } from './pages/dashboard/ConnectionsPage';
import { HelpCenterPage, NotificationsPage, SettingsPage } from './pages/dashboard/AccountSupportPages';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { CreateUserModal } from './pages/admin/CreateUserModal';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import { AdminActivityPage, AdminAnalyticsPage, AdminAuditLogsPage, AdminNotificationsPage } from './pages/admin/AdminOperationsPages';
import { AccountSecurity, ProviderSettings, SystemSettings } from './pages/admin/RealManagementPages';
const emptySeries: Record<TimeframeKey, PortfolioPoint[]> = { '1D': [], '1W': [], '1M': [], '3M': [], '1Y': [], ALL: [] };
const emptyBinance: BinanceConnectionState = { connected: false, maskedApiKey: '—', maskedApiSecret: '—', lastSyncAt: '—', spotTradingEnabled: false, readInfoEnabled: false, withdrawalsDisabled: false, estimatedTotalUsd: 0, availableUsd: 0, balances: [] };
const emptyTelegram: TelegramConnectionState = { connected: false, handle: '—', connectionCode: '', codeExpiresAt: 0, botUsername: '—', prefs: { buyExecuted:false,sellExecuted:false,profitNotification:false,lossNotification:false,balanceUpdate:false,aiOpportunityDetected:false,botStarted:false,botStopped:false,connectionErrors:false,dailyTradingSummary:false } };
function Workspace() {
 const {showToast}=useToast(); const epoch=useRef(0);
 const [language,setLanguage]=useState<LanguageCode>(()=>{try{const value=localStorage.getItem('oxinvo_language');if(['en','az','tr','ru'].includes(value??''))return value as LanguageCode;}catch{}return 'en';});
 const t=TRANSLATIONS[language], text=ACCOUNT_COPY[language];
 const [loading,setLoading]=useState(true),[current,setCurrent]=useState<ServerUser|null>(null),[self,setSelf]=useState<UserAccount|null>(null),[route,setRoute]=useState<AppRoute>('overview'),[adminMode,setAdminMode]=useState(false),[changePassword,setChangePassword]=useState(false);
 const [users,setUsers]=useState<UserAccount[]>([]),[serverUsers,setServerUsers]=useState<ServerUser[]>([]),[plans,setPlans]=useState<Plan[]>([]),[total,setTotal]=useState(0),[query,setQuery]=useState({search:'',plan:'',status:'',page:1}),[audit,setAudit]=useState<AuditLogEntry[]>([]),[stats,setStats]=useState<any>(null);
 const [trades,setTrades]=useState<Trade[]>([]),[notifications,setNotifications]=useState<NotificationItem[]>([]),[selectedTrade,setSelectedTrade]=useState<Trade|null>(null),[selectedUser,setSelectedUser]=useState<UserAccount|null>(null),[userTrades,setUserTrades]=useState<Trade[]>([]),[createOpen,setCreateOpen]=useState(false),[credentials,setCredentials]=useState<OneTimeCredentials|null>(null),[strategy,setStrategy]=useState<StrategyMode>('Adaptive Momentum');
 const [adminTrades,setAdminTrades]=useState<Trade[]>([]),[analyticsUsers,setAnalyticsUsers]=useState<UserAccount[]>([]);
 const [overview,setOverview]=useState<any>(null),[binance,setBinance]=useState(emptyBinance),[health,setHealth]=useState('—');
 const isAdmin=current?.role==='SUPER_ADMIN'||current?.role==='ADMIN';
 const clear=useCallback(()=>{epoch.current++;clearApiSession();setCurrent(null);setSelf(null);setUsers([]);setServerUsers([]);setPlans([]);setTotal(0);setAudit([]);setAdminTrades([]);setAnalyticsUsers([]);setStats(null);setTrades([]);setNotifications([]);setSelectedTrade(null);setSelectedUser(null);setUserTrades([]);setCreateOpen(false);setCredentials(null);setOverview(null);setBinance(emptyBinance);setStrategy('Adaptive Momentum');setAdminMode(false);setChangePassword(false);setRoute('overview');setQuery({search:'',plan:'',status:'',page:1});},[]);
 const notifyError=useCallback(()=>showToast(t.auth.invalidError,'error'),[showToast,t]);
 function applyLanguage(user:ServerUser){const next=user.preferredLanguage.toLowerCase() as LanguageCode;if(['en','az','tr','ru'].includes(next)){setLanguage(next);try{localStorage.setItem('oxinvo_language',next);}catch{}}}
 async function loadMe(){const ticket=epoch.current;const value=await api.get<{user:ServerUser}>('/auth/me');if(ticket!==epoch.current)throw new Error('Session changed');applyLanguage(value.user);setCurrent(value.user);setSelf(mapUser(value.user));return value.user;}
 useEffect(()=>{const expired=()=>clear();window.addEventListener('oxinvo:unauthorized',expired);(async()=>{try{await refreshCsrf();const user=await loadMe();setAdminMode(user.role!=='USER');setRoute(user.role==='USER'?'overview':'admin-overview');}catch{}finally{setLoading(false);}})();return()=>window.removeEventListener('oxinvo:unauthorized',expired);},[clear]);
 async function loadUsers(){const ticket=epoch.current;const params=new URLSearchParams({search:query.search,plan:query.plan,status:query.status,page:String(query.page),pageSize:'10'});params.set('page',String(query.page));if(!query.status)params.delete('status');if(!query.plan)params.delete('plan');const result=await api.get<{items:ServerUser[];total:number}>('/admin/users?'+params);if(ticket!==epoch.current)return;setServerUsers(result.items);setUsers(result.items.map(mapUser));setTotal(result.total);}
 const changeQuery=useCallback((next:{search:string;plan:string;status:string})=>setQuery(previous=>({...previous,...next,page:1})),[]);
 useEffect(()=>{if(!current||current.mustChangePassword)return;const ticket=epoch.current;let cancelled=false;(async()=>{try{
  const [info,subscriptionResult,rows,notes,connection,settings]=await Promise.all([api.get<any>('/users/me/overview'),api.get<any>('/users/me/subscription'),api.get<any[]>('/users/me/trades'),api.get<any[]>('/users/me/notifications'),api.get<any>('/users/me/binance'),api.get<{key:string;value:unknown}[]>('/users/me/settings')]);if(cancelled||ticket!==epoch.current)return;
  const subscription=subscriptionResult.subscription;const savedStrategy=settings.find(row=>row.key==='strategy')?.value;if(typeof savedStrategy==='string')setStrategy(savedStrategy as StrategyMode);setOverview(info);setSelf(mapUser({...current,subscription,portfolioBalance:info.totalBalance,realizedPnl:info.totalProfit,totalTrades:info.totalTrades}));setTrades(rows.map(mapTrade));setNotifications(notes.map(row=>({id:row.id,title:row.title,message:row.message,category:'system',timestamp:row.createdAt,read:row.isRead})));setBinance({...emptyBinance,maskedApiKey:connection.connection?'••••••••':'—'});
  if(current.role!=='USER'){const [planRows,counts]=await Promise.all([api.get<Plan[]>('/admin/subscription-plans'),api.get<any>('/admin/overview')]);if(cancelled||ticket!==epoch.current)return;setPlans(planRows);setStats(counts);}
  if(current.role==='SUPER_ADMIN'){const logs=await api.get<{items:any[]}>('/admin/audit-logs?pageSize=50');if(!cancelled&&ticket===epoch.current)setAudit(logs.items.map(mapAudit));}
 }catch{if(!cancelled&&ticket===epoch.current)notifyError();}})();return()=>{cancelled=true;};},[current?.id,current?.mustChangePassword]);
 useEffect(()=>{if(isAdmin&&!current?.mustChangePassword)loadUsers().catch(notifyError);},[isAdmin,current?.mustChangePassword,JSON.stringify(query)]);
 async function login(username:string,password:string,rememberMe:boolean){try{await refreshCsrf();const result=await api.post<{user:ServerUser;csrfToken:string}>('/auth/login',{body:{username,password,rememberMe}});setCsrfToken(result.csrfToken);applyLanguage(result.user);setCurrent(result.user);setSelf(mapUser(result.user));setAdminMode(result.user.role!=='USER');setRoute(result.user.role==='USER'?'overview':'admin-overview');return {ok:true};}catch{return {ok:false,error:t.auth.invalidError};}}
 async function logout(){try{await api.post('/auth/logout');}catch{}finally{clear();}}
 function changeLanguage(next:LanguageCode){setLanguage(next);try{localStorage.setItem('oxinvo_language',next);}catch{}if(current&&!current.mustChangePassword)api.patch('/users/me',{body:{preferredLanguage:next.toUpperCase()}}).catch(notifyError);}
 const unavailable=()=>showToast(text.unavailable,'info');
 async function mutate(path:string,method:'post'|'patch'|'delete',body?:unknown){const ticket=epoch.current;try{const result=await api[method]<any>(path,{body});if(ticket!==epoch.current)throw new Error('Session changed');void loadUsers().catch(notifyError);void api.get('/admin/overview').then(value=>{if(ticket===epoch.current)setStats(value);}).catch(notifyError);showToast(t.common.updated,'success');return result;}catch(error){notifyError();throw error;}}
 async function selectUser(user:UserAccount){try{const ticket=epoch.current;const row=await api.get<ServerUser&{trades:any[]}>('/admin/users/'+user.id);if(ticket!==epoch.current)return;setSelectedUser(mapUser(row));setUserTrades(row.trades.map(mapTrade));setRoute('admin-user-detail');}catch{notifyError();}}
 async function resetPassword(id:string){const result=await mutate('/admin/users/'+id+'/reset-password','post');return result.generatedPassword as string;}
 async function saveUser(user:UserAccount){const existing=serverUsers.find(row=>row.id===user.id);await mutate('/admin/users/'+user.id,'patch',{fullName:user.fullName,notes:user.notes,status:user.status.toUpperCase()});const plan=plans.find(row=>row.name===user.plan);if(user.expiresAt!=='—')await mutate('/admin/users/'+user.id+'/subscription','patch',{planId:plan?.id,expirationDate:new Date(user.expiresAt+'T23:59:59Z').toISOString()});await selectUser(user);}
 useEffect(()=>{if(!isAdmin||current?.mustChangePassword)return;let cancelled=false;const ticket=epoch.current;(async()=>{try{if(route==='admin-activity'){const rows=await api.get<any[]>('/admin/trades?pageSize=50');if(!cancelled&&ticket===epoch.current)setAdminTrades(rows.map(mapTrade));}if(route==='admin-analytics'){const rows=await api.get<ServerUser[]>('/admin/analytics');if(!cancelled&&ticket===epoch.current)setAnalyticsUsers(rows.map(mapUser));}if(route==='admin-audit-logs'&&current?.role==='SUPER_ADMIN'){const rows=await api.get<{items:any[]}>('/admin/audit-logs?pageSize=50');if(!cancelled&&ticket===epoch.current)setAudit(rows.items.map(mapAudit));}}catch{if(!cancelled)notifyError();}})();return()=>{cancelled=true;};},[route,current?.id,current?.mustChangePassword]);
 const active=trades.filter(trade=>trade.status==='active'),history=trades.filter(trade=>trade.status==='closed');
 function render(){
  if(adminMode&&isAdmin){switch(route){
   case 'admin-users':return <AdminUsersPage t={t} users={users} onSelectUser={user=>void selectUser(user)} onOpenCreateUser={()=>setCreateOpen(true)} onToggleSuspend={id=>void mutate('/admin/users/'+id+'/'+(users.find(user=>user.id===id)?.status==='suspended'?'activate':'suspend'),'post').catch(()=>{})} onResetPassword={id=>void resetPassword(id).then(password=>setCredentials({username:users.find(user=>user.id===id)?.username??'',password,expirationDate:users.find(user=>user.id===id)?.expiresAt??'—'})).catch(()=>{})} onDeleteUser={id=>void mutate('/admin/users/'+id,'delete').catch(()=>{})} onQueryChange={changeQuery} page={query.page} total={total} onPageChange={page=>setQuery(previous=>({...previous,page}))}/>;
   case 'admin-user-detail':return selectedUser&&<div className="space-y-4"><div className="flex flex-wrap gap-2"><MagneticButton variant="secondary" onClick={()=>void mutate('/admin/users/'+selectedUser.id+'/revoke-sessions','post').catch(()=>{})}>{text.revoke}</MagneticButton><MagneticButton variant="secondary" onClick={()=>void mutate('/admin/users/'+selectedUser.id+'/subscription','patch',{extendDays:30}).then(()=>selectUser(selectedUser)).catch(()=>{})}>{text.extend}</MagneticButton>{current?.role==='SUPER_ADMIN'&&<select aria-label={text.role} className="rounded-xl border border-[#E2E8F0] px-3" value={selectedUser.role.toUpperCase()} onChange={event=>void mutate('/admin/users/'+selectedUser.id,'patch',{role:event.target.value}).then(()=>selectUser(selectedUser)).catch(()=>{})}>{['USER','ADMIN','SUPER_ADMIN'].map(role=><option key={role}>{role}</option>)}</select>}</div><AdminUserDetailPage key={selectedUser.id+selectedUser.expiresAt+selectedUser.status} t={t} user={selectedUser} userTrades={userTrades} onBack={()=>setRoute('admin-users')} onUpdateUser={user=>void saveUser(user).catch(()=>{})} onIssuePasswordReset={resetPassword}/></div>;
   case 'admin-activity':return <AdminActivityPage t={t} trades={adminTrades}/>;
   case 'admin-analytics':return <AdminAnalyticsPage t={t} users={analyticsUsers}/>;
   case 'admin-subscriptions':return <AdminSubscriptionsPage t={t} users={users} counts={Object.fromEntries(plans.map(plan=>[plan.name,plan._count?.subscriptions??0]))} tiers={plans.map(plan=>({id:plan.name as any,name:plan.name,audience:'',monthlyPriceLabel:'—',maxBots:0,maxPairs:0,aiProvidersAllowed:'—',telegramAlerts:false,priorityExecution:false}))}/>;
   case 'admin-ai-providers':return current?.role==='SUPER_ADMIN'?<ProviderSettings language={language}/>:<p>{t.auth.invalidError}</p>;
   case 'admin-system-health':return <div className="ox-card p-6 space-y-4"><h2>{t.admin.healthTitle}</h2><MagneticButton onClick={()=>api.get<{status:string}>('/health/database').then(row=>setHealth(row.status)).catch(()=>setHealth('unavailable'))}>Database</MagneticButton><p>{health}</p><p>{text.unavailable}: Trading engine / Telegram / AI</p></div>;
   case 'admin-notifications':return <AdminNotificationsPage t={t} onBroadcast={(title,message)=>void api.post('/admin/notifications',{body:{title,message}}).then(()=>showToast(t.common.updated,'success')).catch(notifyError)}/>;
   case 'admin-audit-logs':return current?.role==='SUPER_ADMIN'?<AdminAuditLogsPage t={t} logs={audit}/>:<p>{t.auth.invalidError}</p>;
   case 'admin-settings':return current?.role==='SUPER_ADMIN'?<SystemSettings language={language}/>:<p>{t.auth.invalidError}</p>;
   default:return <AdminOverviewPage t={t} users={users} auditLogs={audit} stats={stats}/>;
  }}
  switch(route){
   case 'ai-engine':return <AITradingEnginePage t={t} botStatus="stopped" strategy={strategy} assetsScanned={0} opportunitiesDetected={0} activeTradesCount={active.length} todayPnl={0} activityFeed={[]} decisions={[]} onBotStatusChange={unavailable} onStrategyChange={next=>{api.patch('/users/me/settings',{body:{strategy:next}}).then(()=>setStrategy(next)).catch(notifyError);}}/>;
   case 'scanner':return <MarketScannerPage t={t} assets={[]}/>;
   case 'trades':case 'live-trades':case 'trade-history':return <TradesViewPage t={t} initialMode={route==='trade-history'?'history':'active'} activeTrades={active} historyTrades={history} onSelectTrade={setSelectedTrade}/>;
   case 'portfolio':return <PortfolioPage t={t} balances={[]} totalValueUsd={Number(overview?.totalBalance??0)} availableUsd={0}/>;
   case 'analytics':return <AnalyticsPage t={t} activeTrades={active} historyTrades={history}/>;
   case 'connections':case 'binance':case 'telegram':return <ConnectionsPage t={t} initialTab={route==='telegram'?'telegram':'binance'} binance={binance} telegram={emptyTelegram} onSaveBinance={(apiKey,apiSecret)=>void api.patch('/users/me/binance',{body:{apiKey,apiSecret}}).then(()=>showToast(t.common.updated+' · '+text.unavailable,'info')).catch(notifyError)} onTestBinance={async()=>unavailable()} onDisconnectBinance={unavailable} onRegenerateTelegramCode={unavailable} onSendTelegramTest={unavailable} onToggleTelegramPref={unavailable} onToggleTelegramConnected={unavailable}/>;
   case 'notifications':return <NotificationsPage t={t} notifications={notifications} onMarkRead={id=>void api.patch('/users/me/notifications/'+id+'/read').then(()=>setNotifications(previous=>previous.map(row=>row.id===id?{...row,read:true}:row))).catch(notifyError)} onMarkAllRead={()=>void Promise.all(notifications.filter(row=>!row.read).map(row=>api.patch('/users/me/notifications/'+row.id+'/read'))).then(()=>setNotifications(previous=>previous.map(row=>({...row,read:true})))).catch(notifyError)}/>;
   case 'settings':return <div className="space-y-6"><SettingsPage t={t} user={self!} language={language} strategy={strategy} onLanguageChange={changeLanguage} onStrategyChange={next=>{api.patch('/users/me/settings',{body:{strategy:next}}).then(()=>setStrategy(next)).catch(notifyError);}}/><AccountSecurity language={language} onChangePassword={()=>setChangePassword(true)}/></div>;
   case 'help':return <HelpCenterPage t={t}/>;
   default:return <OverviewPage t={t} totalBalance={Number(overview?.totalBalance??0)} totalProfit={Number(overview?.totalProfit??0)} todayProfit={0} activeTrades={active} recentTrades={history} opportunities={[]} portfolioSeries={emptySeries} onNavigate={setRoute} onSelectTrade={setSelectedTrade}/>;
  }
 }
 if(loading)return <BootLoader visible label={t.tagline}/>;
 if(!current)return <LoginPage language={language} t={t} onLanguageChange={changeLanguage} onLogin={login}/>;
 if(current.mustChangePassword||changePassword)return <ChangePasswordPage language={language} onComplete={async()=>{setChangePassword(false);await loadMe();}}/>;
 return <><AppShell user={self??mapUser(current)} activeRoute={route} isAdminMode={adminMode} canAccessAdmin={Boolean(isAdmin)} unreadNotifications={notifications.filter(row=>!row.read).length} language={language} t={t} onLanguageChange={changeLanguage} onNavigate={setRoute} onToggleAdminMode={value=>{setAdminMode(value);setRoute(value?'admin-overview':'overview');}} onLogout={()=>void logout()}><p className="text-xs text-[#64748B] mb-4">PAPER · {text.unavailable} Binance / Telegram / AI</p>{render()}</AppShell><TradeDetailModal trade={selectedTrade} t={t} onClose={()=>setSelectedTrade(null)}/><CreateUserModal open={createOpen} t={t} language={language} plans={plans} canCreateAdmin={current.role==='SUPER_ADMIN'} onClose={()=>setCreateOpen(false)} onCreate={async data=>{const result=await mutate('/admin/users','post',data);setCreateOpen(false);setCredentials({username:result.user.username,password:result.generatedPassword,expirationDate:result.subscription.expirationDate.slice(0,10)});}}/><CredentialsModal value={credentials} language={language} onClose={()=>setCredentials(null)}/></>;
}
export default function App(){return <MotionConfig reducedMotion="user"><ToastProvider><Workspace/></ToastProvider></MotionConfig>;}

