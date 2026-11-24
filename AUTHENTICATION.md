# OXINVO — Authentication və administrator idarəetməsi

24 noyabr 2026. Mərhələ 5. Frontend görünüşü və dörd dil qorunub; aktiv tətbiq demo adapterlərini import etmir.

## Giriş və ilkin administrator

Lokal frontend: http://127.0.0.1:3000. Backend: http://127.0.0.1:4000.
Username `oxinvo.admin` üçün bootstrap yalnız lokal interaktiv terminaldan işləyir:

```powershell
npm run build:backend
npm run bootstrap:admin
```

İlk yaradılmada 24 simvolluq təsadüfi şifrə bir dəfə həmin terminalda göstərilir. Heç bir fayla və adi loga yazılmır. Terminalı yalnız şifrəni təhlükəsiz köçürdükdən sonra bağlayın. Təkrar bootstrap hesabı və şifrəni dəyişmir. İlk giriş məcburi şifrə dəyişikliyi ekranına aparır. Mövcud şifrə API-dən geri alınmır; reset yeni şifrə yaradır və sessiyaları ləğv edir. Açıq qeydiyyat yoxdur.

## Sessiyalar və səlahiyyətlər

Argon2id: 64 MiB, 3 iterasiya, parallelism 1, müstəqil salt. 32 bayt təsadüfi opaque session token yalnız HttpOnly cookie-dədir; database-də SESSION_SECRET ilə HMAC-SHA256 hash saxlanılır. Remember me seçilmədikdə cookie brauzer sessiyası üçündür və server müddəti 8 saatdır; seçildikdə 30 gündür. Müddətlər absolute-dır, avtomatik uzanmır.

Production `__Host-oxinvo_session` və `__Host-oxinvo_csrf`: Secure, HttpOnly, SameSite=Lax, Path=/, Domain yoxdur. Development HTTP üçün Secure deaktivdir. CSRF tokeni sessiyaya bağlı HMAC, nonce və timestamp ilə imzalanır; 2 saat qüvvədədir. Token frontend yaddaşında saxlanılır, uyğun cookie HttpOnly-dir. Bütün dəyişdirici sorğular exact Origin, X-CSRF-Token və matching cookie tələb edir; cross-site sorğular rədd edilir. Login də CSRF ilə qorunur. CORS yalnız FRONTEND_URL origin-inə credential icazəsi verir. Frontend secrets/session tokenləri localStorage-a yazmır; yalnız dil seçimi saxlanılır.

Naməlum username və yanlış password eyni 401 cavabıdır. 5 uğursuz cəhd/15 dəqiqə database-backed hesab kilidi tətbiq edilir; login IP limiti 30/dəqiqədir. Ümumi HTTP limiti 240/dəqiqədir. Production çoxprosesli IP limitinin paylaşılması ayrıca infrastruktur tələb edir; hesab kilidi database-də paylaşılır. Yanlış username üçün də Argon2 dummy yoxlaması aparılır.

SUPER_ADMIN bütün hesabları və rolları, audit, sistem və AI konfiqurasiyasını idarə edir. ADMIN yalnız USER hesablarını dəyişə/yarada bilir. USER yalnız server sessiyasından götürülən öz userId-si ilə məlumat oxuyur/yazır. Məcburi şifrə dəyişikliyi bitməyən hesab üçün yalnız me/logout/change-password açıqdır. Status və abunəlik hər authenticated sorğuda yoxlanılır; bloklama, reset, rol dəyişikliyi, abunəlik bitməsi və admin revoke sessiyaları ləğv edir. Şifrə dəyişikliyi cari sessiyanı da rotasiya edir, bütün əvvəlkiləri ləğv edir. Son aktiv SUPER_ADMIN API kilidi və database trigger ilə qorunur.

TRUST_PROXY=false default-dur. Cloudflare Tunnel gələcəkdə yalnız loopback-dən qoşulduqda, forwarded header-lərin etibarlılığı yoxlanıldıqdan sonra TRUST_PROXY=loopback istifadə edilə bilər. Bütün proxy-lərə ümumi etibar yoxdur. Hazırkı backend yalnız 127.0.0.1-də dinləyir. Real tunnel/HTTPS/deployment yoxlaması bu mərhələdə aparılmır.

## Database və tenant izolyasiyası

Yeni `202611240003_authentication` additive migration: Session.rememberMe; UserSetting və LoginThrottle. Cəmi 22 Prisma modeli. Əvvəlki iki migration dəyişdirilməyib. Reset/destructive migration yoxdur.

User, Session, UserSubscription, BinanceConnection, TelegramConnection, TelegramConnectionToken, TradingBot, Trade, Order, OrderFill, PortfolioSnapshot, AIDecision, Notification, NotificationPreference, UserSetting üçün FORCE RLS aktivdir. Tenant və admin konteksti yalnız interactive transaction daxilində set_config(...,true) ilə verilir; pooled bağlantıda növbəti transaction-a qalmır. Raw Prisma client private-dır. Adi endpoint-lərdə ayrıca userId filterləri saxlanılır. RLS tətbiqdə unudulmuş filterə qarşı əlavə müdafiədir; runtime credential-in tam ələ keçirilməsinə və arbitrary SQL injection-a qarşı ayrıca rol təhlükəsizlik sərhədi deyil, çünki trusted server system konteksti qura bilir.

Runtime/migrator rolları ayrıdır; runtime superuser, BYPASSRLS, DDL və migration tarixçəsi oxuma hüququ daşımır. Development və test müxtəlif database və rollardır, hazırda eyni Neon branch daxilindədir. Ayrı branch üçün Neon control-plane səlahiyyəti tələb olunur. Production database konfiqurasiya və deploy edilməyib. `neondb` Neon Auth obyektlərinə toxunulmur.

## İşləyən UI və API

Bütün yollar `/api/v1` prefiksi altındadır. Development Swagger: http://127.0.0.1:4000/api/docs. Production Swagger bağlıdır.

| Sahə | Endpoint-lər |
| --- | --- |
| Authentication | GET auth/csrf; POST auth/login, auth/logout, auth/change-password; GET auth/me, auth/sessions; DELETE auth/sessions/:id |
| Admin hesablar | GET/POST admin/users; GET/PATCH/DELETE admin/users/:id; POST admin/users/:id/reset-password, suspend, activate, revoke-sessions; PATCH admin/users/:id/subscription |
| Admin məlumatları | GET admin/overview, admin/subscription-plans, admin/trades, admin/analytics; POST admin/notifications |
| SUPER_ADMIN | GET admin/audit-logs; GET/POST admin/ai-providers; GET/PATCH admin/settings |
| Öz hesabı | GET/PATCH users/me; GET users/me/subscription, overview, trades, trades/:id, orders, bots, portfolio, ai-decisions, notifications, telegram; GET/PATCH users/me/binance, users/me/settings; PATCH users/me/notifications/:id/read |
| Proses | GET health, health/database, version |

Admin siyahısında server axtarışı, status/plan filterləri, pagination, məlumat redaktəsi, aktivləşdirmə/dayandırma/soft delete, reset, sessiya ləğvi, abunəlik müddətini dəyişmə/uzatma, tarixlər işləyir. Create User yalnız serverdə generasiya edilmiş şifrəni bir dəfə qaytarır. Modal loqo, uğur animasiyası, tarix, username/password və üç copy düyməsini saxlayır. Modal bağlandıqda şifrə state-dən çıxarılır. API cavablarında passwordHash və session hash yoxdur; no-store tətbiq edilir.

Yeni istifadəçidə balans/qazanc/əməliyyat sayı sıfır, Binance və Telegram bağlı deyil, bot STOPPED, rejim PAPER-dir. Qrafiklər real data olmadıqda boş vəziyyətdir. Bildirişlər Neon-dan oxunur və oxunmuş kimi qeyd olunur. Dil, strategiya və risk parametrləri saxlanılır. AI provider açarı yalnız encrypted config kimi saxlanılır; provider çağırışı yoxdur. Binance açarı encrypted saxlanılsa belə connected kimi göstərilmir və heç bir xarici sorğu edilmir. Telegram token/link yaratmaq, bot işə salmaq və bazar analizi hələ mümkün deyil. Subscription plan qiymətləri billing konfiqurasiyası olmayan access label-lardır; real ödəniş yoxdur.

Audit hadisələri: LOGIN_SUCCESS/FAILURE, LOGOUT, USER_CREATED/UPDATED/SUSPENDED/ACTIVATED/DELETED, PASSWORD_CHANGED/RESET, SESSION_REVOKED, SUBSCRIPTION_CHANGED, ROLE_CHANGED, UNAUTHORIZED_ACCESS. Actor/target, UTC vaxt və təhlükəsiz metadata saxlanılır. Password/API secret/session token auditə verilmir.

## Yoxlama əmrləri

```powershell
npm run lint
npm run typecheck:backend
npm run build:vercel
npm run build:backend
npm test
npm run prisma:validate
npm run db:validate
npm run db:status
npm run test:database
npm run test:auth
npm audit
npm audit --prefix backend
npm run check:repository-secrets
```

`test:auth` hazır backend build tələb edir, yalnız .env.test.local ilə oxinvo_test-ə qoşulur, 4000 portunda müvəqqəti test serveri açır. Test hesablarını yalnız test database-də saxlayır; development-ə test fixture yazmır. Eyni database üzərində row-count rollback testini authentication testləri ilə eyni vaxtda işlətməyin. Browser hissəsi OXINVO_BROWSER_TEST=true və ayrıca Chrome remote debugging 9225 tələb edir. Şifrələr browser test runner yaddaşında qalır, screenshot yalnız credential modalı bağlandıqdan sonra çəkilir. .verification faylları Git ignore-dadır.

`db:validate` offline schema generasiyasını və bütün modellərin migration SQL-də olmasını yoxlayır; tətbiq olunmuş schema ekvivalentliyi iddiası deyil. Real catalog/index/FK/CHECK testləri ayrıca test database-də işləyir. Connection recovery sınağı client socket-in qırılmasıdır; Neon serverinin dayandırılması deyil.

## Neon owner credential rotation planı

1. Neon/Vercel sahibinin nəzarətində bütün owner istifadəçilərini və Marketplace/Neon Auth asılılıqlarını inventarlaşdırın. Plaintext credential-i inventara yazmayın.
2. Hər consumer-in hansı rol/database-dən istifadə etdiyini və secret yenilənmə prosedurunu müəyyən edin. Cari Windows runtime və migrator rolları owner-dən ayrıdır; onları qoruyun.
3. Ayrı icazəli dəyişiklik pəncərəsində Neon idarəetmə panelindən owner credential-i rotasiya edin. Marketplace tərəfindən idarə olunan credential üçün onun rəsmi yeniləmə yolunu istifadə edin; kor-koranə ALTER ROLE etməyin.
4. Vercel-in istifadə etdiyi server secret-ləri, Neon Auth consumer-ləri və yalnız provision üçün lokal məxfi faylı koordinasiyalı yeniləyin. Heç bir DATABASE/owner secret VITE_* olmamalıdır.
5. İcazəli preview/staging-də Neon Auth və digər mövcud consumer-ləri yoxlayın; Windows runtime/migrator bağlantılarını və migration statusunu yenidən yoxlayın.
6. Köhnə credential-in keçərsiz olduğunu yoxlayın, paylaşılmış plaintext nüsxələrini və clipboard-u idarə olunan qaydada təmizləyin. Auditdə yalnız tarix və nəticəni saxlayın.

Bu mərhələdə owner credential rotasiyası icra edilmir; mövcud Marketplace və Neon Auth əlaqələri dəyişdirilmir.

## Bu sessiyada təsdiqlənmiş nəticələr və qalan iş

Mərhələ 5 hələ tam başa çatmayıb. Son real test əmri avtomatik icazə yoxlaması xidmətinin istifadə limiti səbəbindən icra edilmədi. Bu, təhlükəsizlik üzrə rədd qərarı deyil; təsdiq xidməti yoxlamanı tamamlaya bilmədi.

- Frontend 14/14 və backend 15/15 test keçib. Son lokal TypeScript və build yoxlamaları keçib.
- Neon oxinvo_test üzərində 9/9 database test keçib: 22 model, 22 primary key, 46 index, 22 FK, 21 CHECK. Rollback fixture məlumat saxlamayıb.
- Üç migration development-də up-to-date olaraq yoxlanıb; real test catalog/history də üçünü təsdiqləyib.
- Real authentication sınağında ilk 13 qrup keçib: bootstrap idempotency, CSRF, giriş/ilk şifrə dəyişikliyi, cookies/Remember me, admin hesab yaratması, boş user hesabı, RBAC, IDOR, RLS/pool isolation, şifrə dəyişikliyi, reset/status/revoke, abunəlik/session expiry/soft delete, son SUPER_ADMIN qorunması.
- Brauzerdə admin login/refresh, user yaratma, birdəfəlik modal, modal bağlanması, logout, yeni user login və məcburi şifrə dəyişikliyi panelə qədər müşahidə edilib. Son assertion CSS uppercase mətnini case-sensitive müqayisə etdiyindən uğursuz olub. Test textContent ilə düzəldilib; düzəlişdən sonra bütöv browser ssenarisi təkrar icra olunmayıb. Screenshot və yekun browser-pass iddiası yoxdur.
- Brute-force/audit tam integration qrupu və paralel son-SUPER_ADMIN demotion qrupu hələ yekun icra edilməyib. Database-backed brute-force və rol kilidi kodu mövcuddur; bunu test keçdi kimi təqdim etmirik.
- Hər iki npm audit nəticəsi: 0 vulnerability. Məlum lokal secret və repository-ignore yoxlamaları keçib. Git repository aşkarlanmadığı üçün tracked-file/remote-history barədə iddia yoxdur.
- Frontend bundle böyükdür (təxminən 1.58 MB JS, 432 kB gzip); Vite chunk-size xəbərdarlığı verir.
- Development üçün real oxinvo.admin bootstrap bu sessiyada hələ icra edilməyib. İlkin şifrə yaradılmayıb/göstərilməyib. Test bootstrap yalnız oxinvo_test üzərində işləyib.
- Qalan əməliyyatlar: tam real authentication/browser testini yenidən icra etmək, son nəticələri təsdiqləmək, development serveri bərpa etmək, real bootstrap-u görünən lokal interaktiv terminalda bir dəfə işə salmaq və yalnız təhlükəsiz account metadata ilə nəticəni yoxlamaq.
