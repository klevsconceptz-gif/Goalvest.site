const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(__dirname, 'db.json');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

// Default seed database
const DEFAULT_DB = {
  system: {
    name: "GoalVest Fullstack Ecosystem",
    version: "2.4.0",
    status: "online",
    domain: "https://goalvest.dev",
    androidPackage: "dev.goalvest.app",
    iosBundleId: "dev.goalvest.app"
  },
  users: [],
  announcements: [
    {
      id: "anc-1",
      title: "GoalVest Global Wealth & Asset Infrastructure Live",
      body: "Our portfolio intelligence engine, multi-tier wealth architecture, automated contributions, and physical hardware reservations are officially operational.",
      audience: "All users",
      level: "Important",
      author: "Admin",
      createdDate: "2026-10-24 10:00"
    }
  ],
  paymentRequests: [],
  activity: [],
  community: {
    telegramVIP: "https://t.me/GoalVestVIP",
    telegramSupport: "https://t.me/GoalVestSupport",
    xTwitter: "https://x.com/GoalVestApp",
    instagram: "https://instagram.com/GoalVestOfficial",
    threads: "https://threads.net/@GoalVestOfficial"
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DB, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return DEFAULT_DB;
  }
}

function writeDb(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // Health & System Info
    if (pathname === '/api/health' && req.method === 'GET') {
      const db = readDb();
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), system: db.system, timestamp: new Date().toISOString() }));
      return;
    }

    // Get Users
    if (pathname === '/api/users' && req.method === 'GET') {
      const db = readDb();
      res.writeHead(200);
      res.end(JSON.stringify(db.users));
      return;
    }

    // Auth Signin verification
    if (pathname === '/api/auth/signin' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { username, password } = JSON.parse(body);
          if (username && username.toLowerCase() === 'admin' && password === 'Admin@goal.vest') {
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, role: 'admin', username: 'Admin' }));
            return;
          }
          const db = readDb();
          const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
          if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, role: 'user', user }));
          } else {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
        }
      });
      return;
    }

    // User Signup Endpoint
    if (pathname === '/api/auth/signup' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { username, name, email, password, plan } = JSON.parse(body);
          const db = readDb();
          if (username.toLowerCase() === 'admin') {
            res.writeHead(400); res.end(JSON.stringify({ error: 'Username reserved' })); return;
          }
          if (db.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            res.writeHead(409); res.end(JSON.stringify({ error: 'Username already exists' })); return;
          }
          const newUser = {
            username, name, email, password,
            plan: plan || 'Starter',
            riskProfile: 'Growth', autoInvest: true, roundUps: false, notifications: true,
            wallet: { availableBalance: 0, investmentValue: 0, earnings: 0, totalInvested: 0, deposits: 0, withdrawals: 0 },
            goals: [{
              id: `goal-${Date.now()}`,
              name: `${plan || 'Starter'} Wealth Horizon`,
              targetAmount: plan === 'Premium' ? 100000 : plan === 'Wealth' ? 500000 : plan === 'Builder' ? 5000 : plan === 'Growth' ? 25000 : 800,
              currentAmount: 0, monthlyContribution: 250, targetDate: "2028-12-31",
              riskProfile: "Balanced Growth",
              allocation: { "US Equity": 50, "Emerging Tech": 30, "Cash": 20 },
              tier: plan || 'Starter'
            }]
          };
          db.users.push(newUser);
          writeDb(db);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, user: newUser }));
        } catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: 'Malformed JSON payload' })); }
      });
      return;
    }

    // Get Full Database / Sync State
    if (pathname === '/api/db' && req.method === 'GET') {
      const db = readDb();
      res.writeHead(200);
      res.end(JSON.stringify(db));
      return;
    }

    // Sync Data
    if (pathname === '/api/sync' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const db = readDb();
          if (payload.users) db.users = payload.users;
          if (payload.paymentRequests) db.paymentRequests = payload.paymentRequests;
          if (payload.announcements) db.announcements = payload.announcements;
          if (payload.activity) db.activity = payload.activity;
          if (payload.chats) db.chats = payload.chats;
          if (payload.orders) db.orders = payload.orders;
          if (payload.depositMethods) db.depositMethods = payload.depositMethods;
          writeDb(db);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, syncedAt: new Date().toISOString() }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid sync payload' }));
        }
      });
      return;
    }

    // Social Posts & Feed API
    if (pathname === '/api/socials' && req.method === 'GET') {
      const db = readDb();
      res.writeHead(200);
      res.end(JSON.stringify({
        community: {
          telegramVIP: "https://t.me/GoalVestVIP",
          telegramSupport: "https://t.me/GoalVestSupport",
          xTwitter: "https://x.com/GoalVestApp",
          instagram: "https://instagram.com/GoalVestOfficial",
          threads: "https://threads.net/@GoalVestOfficial"
        },
        posts: db.socialPosts || []
      }));
      return;
    }

    // App Store and Play Store Manifest Config
    if (pathname === '/api/mobile/config' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        appId: "dev.goalvest.app",
        appName: "GoalVest",
        ios: {
          appStoreUrl: "https://apps.apple.com/app/goalvest/id6499823102",
          bundleId: "dev.goalvest.app",
          minimumOS: "16.0"
        },
        android: {
          playStoreUrl: "https://play.google.com/store/apps/details?id=dev.goalvest.app",
          packageName: "dev.goalvest.app",
          minSdkVersion: 24,
          targetSdkVersion: 34
        }
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API route not found' }));
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Fallback to index.html if route not file
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error reading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GoalVest Fullstack Server running on http://0.0.0.0:${PORT}`);
});
