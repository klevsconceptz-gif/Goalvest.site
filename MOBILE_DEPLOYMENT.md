# GoalVest Mobile & Fullstack Deployment Matrix
## Target Environments: Web (Cloudflare Pages / Node.js) & Mobile (Google Play Store & Apple iOS App Store)

---

### 1. Architecture Overview
- **Web**: Progressive Web Application (PWA) with Offline Caching (`sw.js`) and high-performance SPA routing.
- **Backend API**: Node.js microservice (`server/index.js`) supporting database sync, authentication validation, health checks, and mobile package configurations.
- **Android Google Play Store**: Trusted Web Activity (TWA) & Native WebView wrapper configured with `AndroidManifest.xml`, `twa-manifest.json`, and Digital Asset Links (`.well-known/assetlinks.json`).
- **Apple iOS App Store**: WKWebView native container configured with `Info.plist`, Universal App Links (`.well-known/apple-app-site-association`), and native status bar styling.

---

### 2. Google Play Store Deployment (Android)
- **App ID / Package**: `dev.goalvest.app`
- **Minimum SDK**: 24 (Android 7.0+)
- **Target SDK**: 34 (Android 14)
- **Play Store Console Setup**:
  1. Generate release signing key:
     ```bash
     keytool -genkey -v -keystore release.keystore -alias goalvest -keyalg RSA -keysize 2048 -validity 10000
     ```
  2. Build Android App Bundle (`.aab`):
     ```bash
     bubblewrap build --manifest=deploy/android/twa-manifest.json
     ```
  3. Digital Asset Links verification: Hosted at `https://goalvest.dev/.well-known/assetlinks.json` allows full-screen immersive launching without URL browser bars.
  4. Upload `.aab` to Google Play Console Internal / Production Track.

---

### 3. Apple iOS App Store Deployment (iOS)
- **Bundle ID**: `dev.goalvest.app`
- **Target iOS Version**: 16.0+
- **Apple Developer Portal Setup**:
  1. Register App ID `dev.goalvest.app` with Associated Domains capability enabled (`applinks:goalvest.dev`).
  2. Universal Links verification: Hosted at `https://goalvest.dev/.well-known/apple-app-site-association`.
  3. Xcode Archive:
     - Open workspace with `deploy/ios/Info.plist`.
     - Product -> Archive -> Distribute App -> App Store Connect.
  4. Submit to TestFlight / App Store Review.

---

### 4. Fullstack Node.js Backend & Cloudflare Web Deployment
- **Local Dev / Node Server**:
  ```bash
  npm run dev
  # Server listens on http://0.0.0.0:8080 with API endpoints /api/health, /api/auth/signin, /api/sync
  ```
- **Cloudflare Pages Static Production**:
  - Deploy directory: `deploy/cloudflare-pages/`
  - Headers: `_headers` configuring strict CSP, X-Frame-Options, and Cross-Origin Resource Policies.
