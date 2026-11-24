# OXINVO

Mərhələ 5: real NestJS/Neon authentication və admin idarəetməsi.
Aktual təhlükəsizlik, endpoint və yoxlama qeydləri: [AUTHENTICATION.md](AUTHENTICATION.md).
Neon qurulmasının tarixçəsi: [NEON-INTEGRATION.md](NEON-INTEGRATION.md).

Frontend dizaynı saxlanılıb. Demo girişləri çıxarılıb; bütün hesablar server sessiyası ilə yoxlanılır.
Binance, Telegram, AI sorğuları və trading icrası hələ inteqrasiya edilməyib.

## Windows üzərində ilkin hazırlıq

Node.js 24 LTS istifadə edin. Docker, Redis və Python tələb olunmur.

```powershell
npm ci --ignore-scripts
npm ci --prefix backend --ignore-scripts
npm run backend:env
npm run prisma:generate
```

`backend:env` mövcud `.env` faylının üzərinə yazmır; iki müstəqil təsadüfi açar
yaradır, onları ekrana çıxarmır. `backend/.env` daxilində `DATABASE_URL` ayrıca
Neon development branch üçün konfiqurasiya edilməlidir. Lokal PostgreSQL quraşdırılmır.
Mövcud frontend üçün Gemini açarı lazım deyil.

## Əsas əmrlər

| Əmr | Nəticə |
| --- | --- |
| `npm run dev:frontend` | Frontend: http://127.0.0.1:3000 |
| `npm run dev:backend` | Backend watch: http://127.0.0.1:4000 |
| `npm run dev:all` | İki ayrı proses birlikdə; Ctrl+C hər ikisini dayandırır |
| `npm run start:backend` | Hazır backend production build-i başladır |
| `npm run build` | Frontend və backend production build |
| `npm run build:frontend` / `npm run build:backend` | Ayrı build |
| `npm run build:vercel` | Yalnız frontend build + çıxış secret scan |
| `npm run check:repository-secrets` | Ignore qaydaları və məlum lokal secret-lər |
| `npm test` | Frontend və backend testləri |
| `npm run lint` / `npm run typecheck:backend` | TypeScript yoxlamaları |
| `npm run prisma:validate` | Schema yoxlaması; database lazım deyil |
| `npm run prisma:generate` | Prisma Client generasiyası |
| `npm run db:check` | Konfiqurasiya edilmiş database üçün read-only probe |
| `npm run db:migrate` | Boş və ya tanınmış development schema üçün migration deploy |
| `npm run db:validate` | Offline schema generasiyası və migration model əhatəsi |
| `npm run db:status` | Prisma migration status |
| `npm run clean` | Yalnız dist, backend/dist və backend/.test-build təmizlənir |

`build`, `dev:backend` və backend testləri Prisma Client-i avtomatik generasiya edir.
Quraşdırma skriptləri deaktivdir; Prisma engine/client generasiyası ayrıca,
açıq əmr ilə aparılır. Argon2 üçün paketdə olan Windows prebuilt binary istifadə olunur.

## Lokal endpoint-lər

- `GET http://127.0.0.1:4000/api/v1/health`
- `GET http://127.0.0.1:4000/api/v1/health/database`
- `GET http://127.0.0.1:4000/api/v1/version`
- Swagger yalnız development: http://127.0.0.1:4000/api/docs
- Vite `/api` sorğularını lokal backend-ə ötürür. UI real session/admin/user API-lərinə bağlıdır.

`health` prosesin işlədiyini göstərir. `health/database` database əlçatmazdırsa
`503` qaytarır; bu vəziyyətdə server sağlam database varmış kimi davranmır.
`200` cavabı yalnız `SELECT 1` bağlantı yoxlamasıdır, migration-ların tətbiqini
təsdiqləmir; bunun üçün ayrıca `db:status` istifadə edin.

Database Vercel Marketplace vasitəsilə Neon-da yaradılıb və lokal development
backend-ə qoşulub. Pooled/direct və
development/production konfiqurasiyası üçün [deployment təlimatına](DEPLOYMENT.md)
baxın. Development/test database-ləri və məhdud rollar qorunur.

`npm run bootstrap:admin` yalnız lokal interaktiv terminalda işləyir. İlk şifrəni bir dəfə göstərir; mövcud SUPER_ADMIN hesabını dəyişmir.
`npm run test:auth` yalnız `oxinvo_test` üzərində işləyir və test üçün 4000 portunu tələb edir.
