# OXINVO preview deployment — 24 November 2026

This repository contains the recovered local Stage 5 source. Stage 5 is incomplete.

The Vercel deployment is a frontend preview only. All frontend API requests use the same-origin /api/v1 path, which returns HTTP 503 PREVIEW_API_DISABLED. No production API, database, exchange credentials or trading workers are connected. Login is intentionally unavailable. /health.json reports frontend availability and explicitly reports backend as not deployed and live trading as disabled.

The backend source is included for continued development but is excluded from Vercel uploads and builds. Binance integration is currently a scaffold. Do not interpret frontend availability as backend, database or trading readiness.

Build: npm ci --ignore-scripts, then npm run build:vercel. Output: dist. Node: 24.x. Automatic Git deployments remain disabled in vercel.json. Use a manual preview deployment; do not promote or enable live trading.

Local secrets, database credentials, logs, generated code and dependencies are excluded by .gitignore and .vercelignore. Configure secrets privately in the intended server environment when backend deployment is separately prepared.
