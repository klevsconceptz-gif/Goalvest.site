# GoalVest - Full-Stack Cloudflare Pages & Mobile Store Deployment Guide

This guide details the full-stack deployment pipeline for **GoalVest** across Cloudflare Pages (with edge Cloudflare Pages Functions & KV persistence) and production mobile stores (Google Play Store & Apple iOS App Store).

---

## 1. Cloudflare Pages Deployment Architecture

GoalVest operates as a single-window full-stack financial platform on Cloudflare Pages:
- **Client Bundle**: `deploy/cloudflare-pages/` contains the static SPA, PWA manifest, service worker offline cache (`sw.js`), and pre-rendered assets.
- **Edge Functions**: `functions/api/[[catchall]].js` delivers serverless REST endpoints handling `/api/health`, `/api/db`, `/api/users`, `/api/auth/signin`, `/api/sync`, `/api/socials`, and `/api/mobile/config`.
- **Database & Persistence**: Reads and writes sync with Cloudflare KV (`GOALVEST_KV`) at the edge with fallback to `db.json` and client `localStorage`.
- **Custom Security Headers**: `_headers` enforces strict frame-ancestors, mime sniffing protection, strict-origin referrer policy, and security headers.
- **SPA Routing**: `_redirects` forwards `/api/*` to the Pages functions and `/*` to `/index.html` (200 status).

---

## 2. Dependencies & Build Scripts

Installed in `package.json`:
- `wrangler`: `^3.90.0` (Official Cloudflare developer CLI)

Run commands:
```bash
# 1. Build and compile production distribution bundle
npm run build

# 2. Test locally in Cloudflare Pages emulation runtime
npm run pages:preview

# 3. Deploy bundle directly to Cloudflare Pages
npm run pages:deploy
```

### Wrangler Configuration (`wrangler.toml`):
```toml
name = "goalvest"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "deploy/cloudflare-pages"

[vars]
ENVIRONMENT = "production"
PRODUCTION_DOMAIN = "https://goalvest.dev"
FALLBACK_DOMAIN = "https://goalvest.pages.dev"

[[kv_namespaces]]
binding = "GOALVEST_KV"
id = "goalvest_kv_prod"
preview_id = "goalvest_kv_preview"
```

---

## 3. Node.js Full-Stack Backend Server

For standalone Docker or VPS environments:
```bash
npm start
# or
node server/index.js
```
Listens on `0.0.0.0:8080` with built-in REST API routes and static asset serving.

---

## 4. Google Play Store & Android Deployment (TWA)

- **Manifest**: `manifest.json` configured with `dev.goalvest.app`.
- **AssetLinks**: `.well-known/assetlinks.json` configured with target package name `dev.goalvest.app` and SHA-256 fingerprint.
- **Android Configuration**:
  - `deploy/android/AndroidManifest.xml`
  - `deploy/android/twa-manifest.json`
- **Build with Bubblewrap**:
```bash
npx @bubblewrap/cli build
```

---

## 5. Apple iOS App Store Deployment

- **Universal Links**: `.well-known/apple-app-site-association` with app ID `<TEAM_ID>.dev.goalvest.app`.
- **Native iOS Configuration**:
  - `deploy/ios/Info.plist`
- **Packaging with Capacitor**:
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```
