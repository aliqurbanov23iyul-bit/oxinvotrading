# OXINVO — Mərhələ 4: real Neon inteqrasiyası

## Faktiki nəticə

Təqdim edilmiş Neon resursuna TLS 1.3 və etibarlı server sertifikatı ilə
qoşulundu. SQL-dən alınan Neon project/endpoint kimliyi Vercel-in
`oxinvotrading` layihəsinə bağlı Marketplace resursu ilə müqayisə edildi.
Real credential-lər bu sənəddə və source fayllarda saxlanmır.

Mənbə database-də əvvəldən 9 Neon Auth cədvəli var idi. Həmin cədvəllərə və
onların məlumatlarına toxunulmadı. Real authentication bu layihəyə əlavə edilmədi.
Vercel environment-i və mövcud inteqrasiya dəyişdirilmədi.

## İzolyasiya və rollar

Mövcud Neon compute daxilində iki ayrı database yaradıldı:

| Məqsəd | Database | Rollar |
| --- | --- | --- |
| Lokal development | `oxinvo_development` | `oxinvo_dev_runtime`, `oxinvo_dev_migrator` |
| Real integration testləri | `oxinvo_test` | `oxinvo_test_runtime`, `oxinvo_test_migrator` |

Bu iki database eyni Neon branch/compute-dədir. Bunlar iki ayrı Neon branch
deyil. SQL credential-i ilə control-plane branch yaratmaq mümkün olmadı;
mövcud Vercel connector-u branch yaratma əməliyyatı vermir və Neon API açarı
təqdim edilməyib. Yeni paid compute, plan və ya xidmət aktivləşdirilmədi.
Gələcək production üçün ayrıca branch/protected environment hələ ayrıca işdir.

Runtime rolları NOINHERIT, NOSUPERUSER, NOCREATEDB, NOCREATEROLE,
NOREPLICATION və NOBYPASSRLS ilə yaradılıb. Onlarda schema CREATE hüququ və
Prisma migration tarixçəsinə çıxış yoxdur. Yalnız öz database-lərində public
schema istifadəsi və model cədvəlləri üçün DML hüquqları verilib. Runtime
rolunun digər OXINVO database-ə və mənbə database-ə çıxışı rədd edildi.
Migration rolları yalnız öz database-lərinin sahibidir; global admin deyillər.

Rol səviyyəsində database izolyasiyası və composite FK-lər real istifadəçi
authentication/row authorization əvəzi deyil. O hissə növbəti mərhələdə hazırlanacaq.

## Environment faylları

- `backend/.env`: development runtime üçün pooled, migration üçün direct URL.
- `backend/.env.test.local`: ayrıca test database/rolları və ayrıca test açarları.
- `backend/.env.neon-provision.local`: yalnız yaradılmış məhdud rolların lokal
  provisioning credential-ləri; backend bunu avtomatik yükləmir.
- Mövcud SESSION_SECRET və ENCRYPTION_KEY, eləcə də digər development
  environment dəyişənləri qorundu. Əvvəl/sonra hash müqayisəsi keçdi.
- Production environment faylı yaradılmadı və Vercel secret-ləri dəyişdirilmədi.

Bütün real env faylları Git ignore-dadır. Provisioning yalnız ilk dəfə owner
connection ilə işləmək üçündür; hazırkı migration rolu ilə təkrar provisioning
role reset etmir və təhlükəsiz şəkildə dayanır. Owner credential-i aktiv
backend runtime konfiqurasiyasında saxlanmır. Çatda paylaşılmış owner
credential-in gələcək production istifadəsindən əvvəl koordinasiyalı
rotasiyası tövsiyə olunur; Vercel/Neon Auth bağlantılarını poza biləcəyi üçün
bu mərhələdə avtomatik rotasiya edilmədi.

## Migration və schema

Hər iki ayrıca database-də aşağıdakılar tətbiq edildi:

1. `202611240001_initial`
2. `202611240002_safety_constraints`

Development üçün `npm run db:check`, `npm run db:migrate` və `npm run db:status`
uğurlu tamamlandı. Test database də eyni iki migration ilə hazırlanıb.
Prisma Client generasiya edildi. Mövcud schema və migration fayllarının
hash-ləri dəyişməzdir. Reset, truncate, destructive migration və baseline yoxdur.

Hər development/test database-də 20 tətbiq cədvəli və 1 Prisma migration
tarixçə cədvəli var: cəmi **21 cədvəl**. Yoxlanılan schema elementləri:

- 20 primary key;
- migration-larda açıq yaradılan 44 əlavə index, o cümlədən unique/partial index-lər;
- 21 foreign key;
- 21 CHECK constraint.

Prisma CLI çıxışları connection URL və credential redaction wrapper-indən keçir.
Runtime rolunun `_prisma_migrations` cədvəlinə çıxışı ayrıca bağlanıb.

## Real database testləri

`npm run test:database` yalnız `OXINVO:test:v1` marker-li `oxinvo_test`
database-ni qəbul edir. Əsas development/mənbə/production database-də fixture
yazmır. Test məlumatları transaction daxilində yaradılır və rollback edilir;
heç bir fixture sətri saxlanmır. Admin hesabı yaradılmır.

9 test qrupu keçdi:

1. Bütün 20 model cədvəli, primary key, index, FK, CHECK və migration tarixçəsi.
2. Prisma ilə 20 modelin hər birinə create/read, Decimal dəqiqliyi, UTC,
   PAPER default-u və soft delete; bütöv transaction rollback.
3. Yanlış user/bot/trade/symbol əlaqələrinin bloklanması və bağlı istifadəçinin
   fiziki silinməsinin RESTRICT ilə rəddi.
4. LIVE yazılarının yeddi cədvəldə bloklanması; yanlış maliyyə, tarix və
   soft-delete dəyərlərinin rəddi.
5. Username, client/exchange order ID, fill ID, notification preference,
   aktiv subscription və idempotency unikallığı.
6. PostgreSQL NUMERIC-də dəqiq 0.1 + 0.2 = 0.3 və qeyri-UTC session timezone-da
   eyni UTC instant-ın qorunması.
7. Rollback-dən sonra bütün model cədvəllərinin sətir saylarının dəyişməməsi.
8. Runtime rolunun admin/DDL/migration hüququnun olmaması və cross-database rəddi.
9. Max=2 connection pool-da paralel sorğular/queue, qırılmış client socket-in
   atılması və növbəti bağlantının işləməsi.

Son test client bağlantısının kəsilməsini yoxlayır; Neon compute-ni dayandırmaq,
server qəzası və bütün region outage-i simulyasiya edilməyib.

İlkin test gözləntisində RESTRICT silmə xətası FK kodu ilə qarışdırılmışdı;
PostgreSQL-in faktiki `23001` RESTRICT koduna uyğunlaşdırıldı. Pooler-in
connection-level xətaları üçün yalnız bir SQLSTATE-ə bağlı olmayan, real
CONNECT hüququ və sorğunun rəddini yoxlayan test hazırlanıb. Bu düzəlişlər
database qorumasını zəiflətməyib; schema və constraint-lər dəyişdirilməyib.

## Digər yoxlamalar

| Yoxlama | Nəticə |
| --- | --- |
| Frontend TypeScript / production build | Keçdi |
| Backend TypeScript / production build | Keçdi |
| Frontend testləri | 14/14 |
| Backend unit/HTTP testləri | 13/13; readiness mock-u ayrıca, real DB testlərindən ayrıdır |
| Real Neon integration qrupları | 9/9 |
| Prisma validation / offline migration uyğunluğu | Keçdi |
| Dependency audit | Frontend və backend üçün 0 məlum zəiflik |
| Ignore və known-secret scan | Keçdi |
| Frontend output secret scan | Keçdi |
| /api/v1/health | 200 |
| /api/v1/health/database, real runtime role | 200 |
| /api/v1/version | 200 |
| Vite /api/v1/health/database proxy | 200 |

Frontend: http://127.0.0.1:3000

Backend: http://127.0.0.1:4000

Swagger, yalnız development: http://127.0.0.1:4000/api/docs

Serverlər `npm run dev:all` ilə ayrı proseslərdə işləyir. Yenidən real integration
testindən əvvəl backend build mövcud olmalıdır. Prisma generasiyasını ayrıca
icra edərkən Windows watcher kilidi yaranarsa əvvəl həmin layihənin dev prosesini
dayandırın; build/test-dən sonra yenidən başladın.

## Fayllar və qalan işlər

Yeni script-lər: provision-neon, prepare-test-database, finalize-database-access,
prisma-command, test-database. Mövcud migrate script-i və npm script-ləri
yenilənib. Frontend səhifələri, dizayn, animasiyalar və dillər dəyişdirilməyib.
Əlavə dependency/adapter tələb olunmadı: mövcud PrismaPg/pg uyğun gəldi.

Root hələ Git repository deyil; uzaq Git tarixçəsi barədə zəmanət verilmir.
Push, deployment, DNS, tunnel, lokal PostgreSQL, admin/bootstrap, real auth,
Binance/Telegram/AI inteqrasiyası və trading əməliyyatı aparılmayıb.

Qalan işlər: control-plane səlahiyyəti ilə ayrı Neon branch-ləri, gələcək
production environment/credential siyasəti və növbəti real authentication mərhələsi.
Frontenddə 3D vizualı saxlayan böyük chunk xəbərdarlığı qalır.
