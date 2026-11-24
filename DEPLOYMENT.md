# OXINVO — Vercel frontend + Windows NestJS + Neon

> Mərhələ 4-də real Neon development/test inteqrasiyası tamamlanıb.
> Aktual database/migration/test nəticələri [NEON-INTEGRATION.md](NEON-INTEGRATION.md)-dədir.
> Aşağıdakı hazır-olmayan database qeydləri Mərhələ 3 tarixçəsinə aiddir.

Bu sənəd deployment hazırlığıdır. Deployment, GitHub push, domain/DNS,
Cloudflare Tunnel və ödənişli xidmət aktivləşdirilməsi aparılmayıb.
Mərhələ 5-də real authentication əlavə olunub; aktual qeydlər AUTHENTICATION.md faylındadır. Production deployment, ayrıca production database və HTTPS/tunnel yoxlamaları hələ aparılmayıb.

## Arxitektura

```text
Browser -> oxinvo.com (Vercel static Vite frontend)
        -> api.oxinvo.com (gələcək HTTPS Cloudflare Tunnel)
        -> Windows NestJS :4000 -> Neon pooled PostgreSQL
Windows migration CLI          -> Neon direct PostgreSQL
```

Trading engine, Telegram bot və AI provider prosesləri gələcəkdə Windows-da
ayrıca işləyəcək. Onlar bu mərhələdə implementasiya və ya deploy edilməyib.
`www.oxinvo.com` gələcəkdə `https://oxinvo.com`-a redirect olacaq. Domain alias,
redirect, DNS qeydi və tunnel yaradılmayıb.

## Vercel build

| Parametr | Dəyər |
| --- | --- |
| Root Directory | Layihənin kökü (`.`); backend deyil |
| Framework | Vite |
| Node.js | 24.x |
| Install Command | `npm ci --ignore-scripts` |
| Build Command | `npm run build:vercel` |
| Output Directory | `dist` |
| Public environment | `VITE_API_BASE_URL=https://api.oxinvo.com/api/v1` |

Bu build backend dependency-lərini quraşdırmır, Prisma generasiya/migration
etmir və NestJS/worker başlatmır. Backend qovluğu olmadan da frontend build
işləməlidir. `.vercelignore` CLI source upload üçün backend/local faylları
istisna edir; Git import zamanı ayrıca Vite root/build seçimi əsasdır.
Hazırkı səhifə keçidləri React state ilədir, URL router yoxdur; catch-all SPA
rewrite əlavə edilməyib. Frontend `/api` üçün production proxy deyil:
production API client birbaşa `https://api.oxinvo.com/api/v1` istifadə edir.

`vercel.json` içində `git.deploymentEnabled=false` avtomatik Git deploy-ları
bağlayır. Bu, manual deployment-i və import ekranındakı ilk Deploy düyməsini
bloklayan access control deyil. Hazırda Deploy düyməsinə basmayın. Sonradan
icazəli preview üçün əvvəl Deployment Protection aktivləşdirilməli və onun
bütün hədəf URL-lərini qoruduğu yoxlanmalıdır. Təkcə noindex təhlükəsizlik deyil.

Development və production eyni real authentication UI istifadə edir. Demo giriş düymələri və demo credential-lər aktiv tətbiqdən çıxarılıb. İlk girişdə şifrə dəyişikliyi tələb olunur. Production API/CORS/cookie davranışı üçün AUTHENTICATION.md-ə baxın.

## Neon-u Vercel Marketplace-dən yaratmaq

1. Vercel Marketplace-də **Neon** səhifəsini açın və **Install** seçin.
2. Vercel-managed yeni hesab seçimini və düzgün team-i seçin.
3. Region seçin. Göstərilən planı yoxlayın; yalnız pulsuz seçim uyğundursa
   davam edin. Ödəniş tələb olunarsa dayanın.
4. Auth və Realtime kimi əlavə imkanları söndürün; bizim auth ayrıca NestJS-də hazırlanacaq.
5. Resurs adını yoxlayıb database-i yaradın.
6. **Connect a Project** mərhələsini hazırda **Skip** edə bilərsiniz; frontend
   layihəsinin deploy olunması database yaratmaq üçün lazım deyil.
7. Storage-dan **Open in Neon** ilə Neon Console-a keçin. Development və
   production üçün ayrı branch/endpoint və credential-lər ayırın. Development
   üçün boş, production məlumatı olmayan branch seçin. Preview-ni production
   database-ə avtomatik bağlamayın.
8. Neon **Connect** panelindən seçilmiş development branch üçün pooled və
   direct URL-ləri özünüz gizli şəkildə backend/.env-ə yazın. URL-ləri çata,
   Git-ə, screenshot-a və frontend VITE_* dəyişəninə qoymayın.

Rəsmi walkthrough: https://neon.com/docs/guides/vercel-managed-integration
İnterfeys və plan şərtləri dəyişə bilər; son təsdiq ekranındakı seçimi yoxlayın.

Marketplace bağlantısı Vercel project-ə `DATABASE_URL` və
`DATABASE_URL_UNPOOLED` əlavə edə bilər. Bunlar Windows NestJS prosesinə
avtomatik ötürülmür. Backend üçün Neon Connect panelindən ayrıca konfiqurasiya
edilməlidir. Secret dəyişənlərin dashboard/CLI-dən geri oxunması mümkün
olmaya bilər; bunun üçün onların məxfilik rejimini zəiflətməyin.

Frontend statikdir və database credential-lərinə ehtiyacı yoxdur. Sonradan
Vercel project bağlantısı edilərsə, həmin server secret-ləri prefikssiz qalsın.
Neon Auth-un `VITE_*` injection-unu aktivləşdirməyin; hazırkı build yalnız API URL
və Vercel-in public metadata dəyişənlərini qəbul edir.

## Environment sərhədləri

| Yer | Dəyişənlər |
| --- | --- |
| Root frontend `.env.example` | Yalnız public `VITE_API_BASE_URL`; development `/api/v1` |
| Vercel frontend Production | Yalnız public API base URL; database tələb olunmur |
| `backend/.env` | Development Neon pooled/direct, branch host, lokal keys, lokal frontend origin |
| `backend/.env.production.local` | Ayrı production Neon branch/keys, `FRONTEND_URL=https://oxinvo.com` |

`backend/.env.production.example` production şablonudur. Production faylı
yaradılmayıb və real secret əlavə edilməyib. `start:production:backend` onu
açıq şəkildə yükləyir; production-da development `.env` fallback yoxdur.
`NODE_ENV` və `DATABASE_ENV` eyni olmalıdır. Host yoxlaması iki URL-ni
`NEON_BRANCH_HOST` ilə bağlayır, amma uzaq branch-in biznes baxımından düzgün
seçildiyini yalnız Neon Console-da siz təsdiqləyə bilərsiniz.

Backend:

- `DATABASE_URL`: runtime app rolu, `-pooler` hostu.
- `DATABASE_URL_UNPOOLED`: migration rolu, direct host.
- `NEON_BRANCH_HOST`: həmin mühitin direct host adı; username/password yoxdur.
- `DATABASE_ENV`: development və ya production.
- `SESSION_SECRET`, `ENCRYPTION_KEY`: ayrı 32-byte random base64 açarlar.

Runtime app roluna yalnız lazım olan cədvəl/sequence hüquqları verilməlidir;
DDL və administrator hüquqları migration rolunda qalmalıdır. İlkin Neon owner
URL-si son production runtime rolu kimi qəbul edilməməlidir.

Runtime TLS üçün sertifikat/hostname yoxlaması məcburidir; `rejectUnauthorized`
deaktiv edilmir. Driver-də URL SSL override-ları təmizlənərək explicit verified
TLS verilir. Prisma CLI yalnız direct URL istifadə edir və `sslmode=verify-full`
seçir. Neon cold start üçün connection timeout 10 saniyə, pool max 5-dir.
Canlı Neon bağlantısı olmadığı üçün real TLS handshake yoxlanmayıb.

## Migration və lokal əmrlər

Mövcud Prisma schema və iki migration faylı dəyişdirilməyib. Database hazır olduqdan sonra:

```powershell
npm run prisma:validate
npm run db:validate
npm run db:check
npm run db:migrate
npm run db:status
```

İlk iki əmr offline işləyir. Digərləri konfiqurasiya edilmiş development Neon
branch tələb edir. Migration helper production mühitini, pooler URL-ni və
tanınmayan mövcud schema-nı rədd edir. Reset/db push/baseline yoxdur.
Production migration ayrıca təsdiqlənmiş rollout işi olmalıdır.

```powershell
npm run dev:all
npm run build:vercel
npm run build:backend
npm test
npm run check:repository-secrets
npm run check:frontend-secrets
```

Prisma generasiyası zamanı Windows watcher kilidi yaranarsa əvvəl həmin
layihənin dev prosesini dayandırın, build/test-i tamamlayıb yenidən başladın.

## Gələcək HTTPS və authentication

API client `credentials: include` istifadə edir, tokenləri localStorage-a
yazmır, redirect-ləri bloklayır və mutation retry etmir. Mutasiya üçün
in-memory CSRF token yoxdursa sorğu göndərilmir. Backend-də hazırda yalnız
GET biznes-siz endpoint-lər var; CSRF verifikasiyası hələ implementasiya edilməyib.

Real auth mərhələsində HttpOnly/Secure, host-only `api.oxinvo.com` session
cookie-si (`Path=/`, Domain təyin edilmədən, uyğun `__Host-` adı), SameSite,
CSRF token + Origin yoxlaması, RBAC və tenant scope birlikdə hazırlanmalıdır.
CORS yalnız dəqiq `FRONTEND_URL` origin-inə credential icazəsi verir; wildcard
və bütün preview hostlarına icazə yoxdur. Cloudflare Tunnel arxasında proxy
etibarı yalnız lokal origin-ə başqa yollar bağlandıqdan sonra ayrıca qurulmalıdır.
Hazırda trust proxy deaktivdir; tunnel/DNS/HTTPS konfiqurasiyası edilməyib.

## Git və yoxlamaların hüdudları

`.env*` secret faylları, `.vercel`, loglar, browser artefaktları, private key,
database dump və generated output-lar ignore-dadır; yalnız nümunə env faylları
istisnadır. Root hazırda Git repository deyil: push edilməyib, amma keçmiş
uzaq Git tarixçəsinin məxfi məlumatdan təmiz olduğunu iddia etmirik.

`check:repository-secrets` müvəqqəti izolə Git probe ilə ignore qaydalarını və
repository namizədi fayllarda məlum lokal secret dəyərlərini yoxlayır.
`build:vercel` çıxışında eyni secret dəyərləri və PostgreSQL URL-ləri üçün scan
aparır. Bu yoxlamalar naməlum secret-lər üçün tam audit deyil.

Qalan bloklar: Neon yaradılması/URL-lər, canlı TLS/database/migration testləri,
real authentication, qorunan preview icazəsi və gələcək tunnel/domain qurulması.

## Bu mərhələnin yoxlama nəticələri

- Frontend TypeScript, production build və 14 test keçdi.
- Backend TypeScript/production build və 13 test keçdi; HTTP testlərində database mock-dur.
- Prisma schema validation və ilkin migration-un offline schema uyğunluğu keçdi.
- Frontend/backend auditində 0 məlum dependency zəifliyi bildirildi.
- Ignore/known-secret və frontend output scan keçdi; public VITE_DATABASE_URL
  ilə build-in rədd edilməsi ayrıca yoxlanıldı.
- Lokal Chrome yoxlamasında production-da demo düymələri olmadı, input-lar
  əvvəlcə boş idi, demo credential-ləri giriş açmadı. Development demo paneli
  işləməyə davam etdi. JavaScript runtime exception qeydə alınmadı.
- Lokal frontend/proxy 200, backend database readiness 503 qaytardı.
- Neon bağlantısı, real TLS handshake, real migration və Vercel remote build/deployment
  yoxlanmayıb; database və deployment hələ yaradılmayıb.
- 3D vizualı saxlayan production chunk üçün 500 kB ölçü xəbərdarlığı qalır.
