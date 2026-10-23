/**
 * Cloudflare Pages Build Script
 * Bundles static assets, headers, redirects, PWA manifests, and functions into deploy/cloudflare-pages/
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'deploy', 'cloudflare-pages');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('[GoalVest Build] Compiling bundle for Cloudflare Pages...');

// Ensure output dir
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Files to copy directly to root of pages deployment
const FILES_TO_COPY = [
  'index.html',
  '_headers',
  'manifest.json',
  'sw.js',
  'favicon.ico',
  'favicon.png',
  'robots.txt',
  'sitemap.xml',
  'package.json'
];

// Directories to copy
const DIRS_TO_COPY = [
  'assets',
  'css',
  'js',
  '.well-known'
];

FILES_TO_COPY.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT_DIR, file));
    console.log(`  ✓ Copied ${file}`);
  }
});

DIRS_TO_COPY.forEach(dir => {
  const src = path.join(ROOT_DIR, dir);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, path.join(OUT_DIR, dir));
    console.log(`  ✓ Synced ${dir}/`);
  }
});

// Copy server database as static fallback
if (fs.existsSync(path.join(ROOT_DIR, 'server', 'db.json'))) {
  fs.copyFileSync(path.join(ROOT_DIR, 'server', 'db.json'), path.join(OUT_DIR, 'db.json'));
  console.log(`  ✓ Synced server/db.json -> db.json`);
}

// Generate _redirects for Cloudflare Pages SPA client router fallback
const REDIRECTS_CONTENT = `
# SPA Fallbacks
/api/*      /api/:splat  200
/*          /index.html  200
`;
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), REDIRECTS_CONTENT.trim() + '\n');
fs.writeFileSync(path.join(ROOT_DIR, '_redirects'), REDIRECTS_CONTENT.trim() + '\n');
console.log(`  ✓ Generated _redirects for SPA and API routing`);

console.log('[GoalVest Build] Cloudflare Pages bundle completed successfully in deploy/cloudflare-pages/');
