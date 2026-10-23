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
  users: [
    {
      username: "AlexRivers",
      name: "Alex Rivers",
      email: "alex@rivers.capital",
      password: "Password123!",
      plan: "Growth",
      riskProfile: "Aggressive",
      autoInvest: true,
      roundUps: true,
      notifications: true,
      wallet: {
        availableBalance: 42850.75,
        investmentValue: 185600.00,
        earnings: 24350.20,
        totalInvested: 161249.80,
        deposits: 145000.00,
        withdrawals: 18000.00
      },
      goals: [
        {
          id: "goal-1",
          name: "Cybertruck & Clean Garage",
          targetAmount: 120000,
          currentAmount: 84500,
          monthlyContribution: 2500,
          targetDate: "2027-12-31",
          riskProfile: "Moderate Growth",
          allocation: { "US Equity": 40, "Emerging Tech": 30, "Fixed Income": 15, "Cash": 15 },
          tier: "Premium"
        },
        {
          id: "goal-2",
          name: "Pacific Villa Down Payment",
          targetAmount: 1380000,
          currentAmount: 490000,
          monthlyContribution: 12000,
          targetDate: "2029-06-30",
          riskProfile: "Aggressive",
          allocation: { "US Equity": 50, "Real Estate REITs": 30, "Crypto": 10, "Cash": 10 },
          tier: "Wealth"
        }
      ]
    }
  ],
  announcements: [
    {
      id: "anc-1",
      title: "GoalVest Q4 Asset Allocation & Tax Rebalancing Now Live",
      body: "Our portfolio intelligence engine has implemented tax-loss harvesting and autonomous sector weighting adjustments across all Tier accounts.",
      audience: "All users",
      level: "Important",
      author: "Admin",
      createdDate: "2026-10-22 10:00"
    }
  ],
  paymentRequests: [
    {
      id: "req-101",
      username: "AlexRivers",
      type: "Deposit",
      amount: 15000,
      method: "Bank Wire Transfer",
      details: "Ref: FED-992384 Wire from Chase Private Client",
      status: "Approved",
      timestamp: "2026-10-21 14:32:00"
    }
  ],
  activity: [
    { id: "act-1", username: "AlexRivers", type: "Deposit", title: "Bank Wire Deposit", amount: 15000, date: "2026-10-21", status: "Completed", category: "Deposit" }
  ]
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
