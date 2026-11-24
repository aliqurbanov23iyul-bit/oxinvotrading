# OXINVO backend — Mərhələ 2

> Aktual Mərhələ 4 real Neon inteqrasiyası və test nəticələri:
> [NEON-INTEGRATION.md](../NEON-INTEGRATION.md).

> Mərhələ 3 yeniləməsi: cari arxitektura Windows NestJS + Neon PostgreSQL-dir.
> Cari Vercel/Neon/environment qaydaları [DEPLOYMENT.md](../DEPLOYMENT.md)-dədir.
> Aşağıdakı model və ilkin test qeydləri Mərhələ 2 tarixçəsini izah edir.

## Hazırkı vəziyyət

NestJS 11, TypeScript 5.9, Prisma 7.10.1, PostgreSQL adapteri, validation,
Swagger, təhlükəsizlik və logging infrastrukturu hazırdır. Node.js 24.21.0
üzərində yoxlanılıb. Prisma 8 RC-yə avtomatik keçid edilməyib.

Yalnız health/database/version HTTP endpoint-ləri mövcuddur. Digər modullar
qeydiyyatdan keçirilmiş boş NestJS modulları və TypeScript interfeysləridir;
işlək inteqrasiya, authentication, CRUD, scheduler və ya trading engine deyil.

## Struktur

```text
backend/
  prisma.config.ts
  prisma/schema.prisma
  prisma/migrations/
    202611240001_initial/migration.sql
    202611240002_safety_constraints/migration.sql
    migration_lock.toml
  scripts/                  # env:init, təhlükəsiz migrate, db:check
  src/
    main.ts, application.ts, app.module.ts, feature-modules.ts
    config/                 # environment validation
    common/
      http/                 # request ID, exception filter
      logging/              # structured Pino + redaction
      security/             # AES-GCM, Argon2id, tenant scope contract
    database/               # private Prisma client, read-only health probe
    system-health/          # yalnız üç sistem endpoint-i
    auth/, users/, admin/, subscriptions/
    binance/, telegram/, trading/, market-scanner/, ai-providers/
    portfolio/, analytics/, notifications/, audit-logs/, settings/
    generated/prisma/       # generasiya edilir; Git-ə daxil edilmir
  test/                     # environment, encryption, security, HTTP
  .env.example
```

## Database hazırlığı — Neon

Lokal PostgreSQL quraşdırılmayacaq. Neon resursunu istifadəçi Vercel Marketplace
vasitəsilə yaradacaq. Backend runtime pooled `DATABASE_URL`, migration CLI
direct `DATABASE_URL_UNPOOLED` istifadə edir. Development və production üçün
ayrı branch/credential və environment faylları seçilir. Ətraflı addımlar və
SSL qaydaları [DEPLOYMENT.md](../DEPLOYMENT.md)-dədir. Hazırda canlı Neon
bağlantısı və tətbiq edilmiş migration yoxdur. Reset/db push/baseline edilmir.

Migration helper production mühitində qəsdən işləmir. Production üçün ayrıca
nəzərdən keçirilmiş rollout, backup və migration səlahiyyət modeli lazımdır.
Health yoxlaması schema uyğunluğunu yoxlamır; migration status ayrıca yoxlanmalıdır.

## Modellər və texniki optimallaşdırmalar

İstifadəçinin istədiyi 19 model + 1 əlavə `IdempotencyRecord` modeli hazırlanıb:

- `User` → sessions, subscriptions, bağlantılar, Telegram tokenləri, botlar,
  trades, orders, portfolio snapshots, AI decisions, notifications, preferences.
- `SubscriptionPlan` → `UserSubscription`.
- `TradingBot` → `Trade`, `Order`, `AIDecision`.
- `Trade` → `Order` → `OrderFill`.
- `AuditLog` → actor və target User üçün ayrı, nullable foreign key-lər.
- `MarketSignal` ümumi bazar məlumatıdır; `AIProvider` və `SystemSetting`
  platforma konfiqurasiyasıdır. Bu cədvəllər istifadəçi balanslarını saxlamır.

Bütün maliyyə sahələri PostgreSQL NUMERIC/Prisma Decimal-dır; Float yoxdur.
Qiymət və miqdarlar `Decimal(38,18)`, plan qiyməti `Decimal(20,8)`-dir.
Gələcək API DTO-larında Decimal və Telegram BigInt dəyərləri string kimi
serializasiya edilməlidir; JS number ilə maliyyə hesablaması aparılmamalıdır.
Tarixlər UTC instant-larını qoruyan `timestamptz(3)`-dür.

Əlavələr/dəyişikliklər:

- `User.notes` frontend qeydləri üçün; `deletedAt` soft-delete üçün.
  DELETED statusu ilə deletedAt uyğunluğu SQL CHECK ilə məcburidir.
- Username unikal, kiçik hərfli, 3–64 simvolluq canonical formadadır.
- Bot, trade, order, fill, snapshot, AI decision və idempotency üçün PAPER
  default-dur. SQL CHECK-lər LIVE yazılmasını bloklayır. LIVE enum dəyəri
  gələcək üçün mövcuddur; aktivləşdirmək ayrıca reviewed migration tələb edir.
- Order/OrderFill/AIDecision/IdempotencyRecord-a rejim, fill-ə userId və
  symbol əlavə edilib. Composite foreign key-lər istifadəçi, bot, rejim və
  uyğun yerdə symbol eyniliyini qoruyur.
- `clientOrderId` user+mode üzrə; exchange order/trade ID-ləri user+mode+symbol
  üzrə unikaldır. Binance order/trade ID-si təkbaşına qlobal unikal sayılmır.
  Bu ilkin modeldə hər istifadəçinin bir Binance bağlantısı var; gələcəkdə
  birdən çox exchange hesabı əlavə olunarsa bu açarlara connectionId daxil edilməlidir.
- `PortfolioSnapshot.valuationCurrency` bütün yekunların eyni valyutada olmasını bildirir.
- Bir istifadəçi üçün bir aktiv abunəlik partial unique index ilə qorunur.
- Notification preference user+type üzrə unikaldır.
- Sessiya və Telegram tokeninin yalnız hash-i üçün sütun var; raw token saxlanmır.
- `AIProvider` provider+model üzrə unikaldır; lokal model üçün API açarı nullable-dır.
- `IdempotencyRecord` user+mode+scope+key üzrə unikal idempotency rezervasiyasıdır.
  İcra mexanizmi hələ yoxdur. Gələcək icra transaction daxilində açarı atomik
  rezervasiya etməli, requestHash fərqlidirsə rədd etməli, eyni clientOrderId-ni
  saxlamalı və timeout zamanı exchange reconciliation aparmalıdır. Sadəcə bu
  cədvəlin olması exactly-once execution zəmanəti vermir.
- Audit resourceId və idempotency resourceId müxtəlif resurs növlərini göstərən
  opaque identifikatorlardır; müəyyən modelə birbaşa FK deyillər. Audit-in
  actor/target və bütün konkret sahiblik əlaqələri FK ilə qorunur.

Bütün əlaqələrdə onDelete RESTRICT seçilib. User silinməsi maliyyə tarixçəsini
cascade ilə məhv etmir. Hesab silmə/anonimləşdirmə siyasəti authentication
mərhələsində ayrıca hazırlanmalıdır. Balans və P&L user cədvəlinə təkrarlanmayıb;
tarixçə və snapshots üzərindən hesablamaq üçün saxlanılıb.

## Təhlükəsizlik sərhədləri

- Environment class-validator/class-transformer ilə yoxlanır; yanlış/mövcud
  olmayan açarlar startup-ı dayandırır. İki müstəqil 32-byte base64 açar lazımdır.
- Helmet, body limit 32 KB, dəqiq bir FRONTEND_URL üçün credentialed CORS,
  whitelist + forbidNonWhitelisted global validation, URI API versioning.
- Trust proxy deaktivdir. Lokal proses yalnız 127.0.0.1-də dinləyir.
- Hər request üçün server UUID yaradır; müştərinin request ID-si etibar edilmir.
- Exception cavablarında stack, SQL, credentials və raw exception message yoxdur.
- Pino JSON loglarında UTC vaxt, event, method, status, duration və request ID var.
  Body, query URL, cookie, Authorization və connection string loglanmır.
  Nested secret sahələri redaktə olunur; Error obyektindən message/stack atılır.
- Rate limiting bir proses üçün IP üzrə 60 request/dəqiqədir. In-memory-dir;
  distributed limit deyil. Redis bu mərhələdə quraşdırılmayıb.
- Swagger yalnız NODE_ENV=development olduqda var. Swagger öz route-larının
  development sənədləşdirməsidir; əlavə biznes endpoint-i yaratmır.
- Argon2id: 64 MiB memory, 3 iteration, parallelism 1 və random salt.
  Bu yalnız service-dir; login/session/password reset hələ yoxdur.
- AES-256-GCM: 32-byte env key, hər şifrələmə üçün random 12-byte nonce,
  16-byte authentication tag, versioned envelope və owner/resource/field AAD.
  Yanlış sahiblik konteksti, yanlış açar və dəyişdirilmiş ciphertext açılmır.
  Açar database-də saxlanmır. v1 envelope key rotation sistemi deyil; gələcəkdə
  key ID/keyring və kontrollu re-encryption hazırlanmalıdır. Mövcud açarı
  backupsız dəyişmək gələcək şifrəli məlumatı əlçatmaz edə bilər.
- DatabaseService raw client-i digər modullara açmır. TenantScope interfeysi
  authentication deyil. Növbəti mərhələdə scope yalnız verified session-dan
  yaradılmalı, hər repository query-si userId ilə məhdudlaşdırılmalıdır.
  Composite FK read authorization-u əvəz etmir. PostgreSQL RLS bu mərhələdə
  tətbiq edilməyib; onun siyasətləri real auth/admin modeli ilə birlikdə qiymətləndirilməlidir.
- Config/marketData/audit metadata JSON-larına secret yazmaq qadağandır.
  Gələcək writer-lər allowlist DTO/projection tətbiq etməlidir.

`.env` Git ignore-dadır, real açarlar yalnız lokal yaradılıb. Default SUPER_ADMIN,
sabit şifrə, seed hesabı və qorunmayan user/admin CRUD endpoint-i yoxdur.

## Yoxlama nəticələri — 24 noyabr 2026

| Yoxlama | Nəticə |
| --- | --- |
| Backend production build və typecheck | Keçdi |
| Prisma schema validate və client generate | Keçdi |
| From-empty SQL migration generasiyası və schema uyğunluğu (`db:validate`) | Keçdi; serverə tətbiq edilməyib |
| Environment/encryption/Argon2id/logging/tenant/HTTP testləri | 11/11 keçdi |
| Frontend typecheck/build/test | Keçdi; 11/11 test |
| Backend dependency audit | 0 məlum zəiflik |
| Frontend dependency audit | 0 məlum zəiflik |
| Real /health, /version, dev Swagger | 200 |
| Vite /api/v1/health proxy | 200 |
| Real /health/database | 503; PostgreSQL əlçatmazdır |
| Canlı database bağlantısı və migration tətbiqi | Aparılmayıb; PostgreSQL yoxdur |
| SQL constraint-lərinin canlı PostgreSQL testi | Aparılmayıb; PostgreSQL yoxdur |

HTTP testlərində database readiness üçün mock istifadə olunur; bu, real
database testinin əvəzi deyil. Prisma schema validation və SQL generasiyası
SQL constraint-lərinin canlı PostgreSQL-də icrasını təsdiqləmir.

Prisma CLI-nin dolayı `effect` dependency-sindəki
[GHSA-7589-6fvf-x4pw](https://github.com/advisories/GHSA-7589-6fvf-x4pw)
üçün eyni major daxilində `effect: 3.22.2` override seçilib. Prisma CLI
validate/generate/diff bu versiya ilə yoxlanılıb. `npm audit fix --force`
işlədilməyib. Audit tam təhlükəsizlik zəmanəti deyil.

Frontenddə əvvəlki ~1.6 MB bundle və Vite __dirname xəbərdarlıqları qalır;
dizayn və source səhifələrə toxunulmayıb.

## Növbəti mərhələ

Əvvəlcə Neon development branch-i yaradıb orada iki migration-u,
tenant FK-ləri, unikallığı, Decimal dəqiqliyini, soft-delete və PAPER-only
CHECK-ləri yoxlayın. Sonra təhlükəsiz bir dəfəlik SUPER_ADMIN bootstrap,
server sessiyaları, RBAC, CSRF, session revocation, password change/reset,
tenant repositories və admin üçün secret-siz DTO-lar hazırlanmalıdır.
Frontend demo authentication yalnız bu axın hazır olduqdan sonra dəyişdirilməlidir.
