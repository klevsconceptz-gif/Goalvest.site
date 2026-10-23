/**
 * Cloudflare Pages Functions - Full-Stack Routing & Persistence Gateway
 * Handles:
 * /api/health
 * /api/db
 * /api/users
 * /api/auth/signin
 * /api/sync
 * /api/socials
 * /api/mobile/config
 */

import { SEED_DB } from '../db.js';

// In-memory cache for edge runtime lifecycle
let edgeDbCache = JSON.parse(JSON.stringify(SEED_DB));

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  // Load from Cloudflare KV if bound
  if (env && env.GOALVEST_KV) {
    try {
      const stored = await env.GOALVEST_KV.get('goalvest_db', 'json');
      if (stored) {
        edgeDbCache = stored;
      } else {
        await env.GOALVEST_KV.put('goalvest_db', JSON.stringify(edgeDbCache));
      }
    } catch (e) {
      // Continue with in-memory edge cache
    }
  }

  // Route: /api/health
  if (path === '/api/health' && request.method === 'GET') {
    return new Response(JSON.stringify({
      status: 'ok',
      platform: 'Cloudflare Pages Functions Edge Runtime',
      domain: 'https://goalvest.dev',
      system: edgeDbCache.system,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  // Route: /api/db
  if (path === '/api/db' && request.method === 'GET') {
    return new Response(JSON.stringify(edgeDbCache), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  // Route: /api/users
  if (path === '/api/users' && request.method === 'GET') {
    return new Response(JSON.stringify(edgeDbCache.users || []), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  // Route: /api/auth/signin
  if (path === '/api/auth/signin' && request.method === 'POST') {
    try {
      const { username, password } = await request.json();
      if (username && username.toLowerCase() === 'admin' && password === 'Admin@goal.vest') {
        return new Response(JSON.stringify({ success: true, role: 'admin', username: 'Admin' }), {
          status: 200,
          headers: CORS_HEADERS
        });
      }
      const user = (edgeDbCache.users || []).find(u => u.username.toLowerCase() === (username || '').toLowerCase() && u.password === password);
      if (user) {
        return new Response(JSON.stringify({ success: true, role: 'user', user }), {
          status: 200,
          headers: CORS_HEADERS
        });
      }
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
        status: 401,
        headers: CORS_HEADERS
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }
  }

  // Route: /api/sync
  if (path === '/api/sync' && request.method === 'POST') {
    try {
      const payload = await request.json();
      if (payload.users) edgeDbCache.users = payload.users;
      if (payload.paymentRequests) edgeDbCache.paymentRequests = payload.paymentRequests;
      if (payload.announcements) edgeDbCache.announcements = payload.announcements;
      if (payload.activity) edgeDbCache.activity = payload.activity;
      if (payload.chats) edgeDbCache.chats = payload.chats;
      if (payload.orders) edgeDbCache.orders = payload.orders;
      if (payload.depositMethods) edgeDbCache.depositMethods = payload.depositMethods;

      if (env && env.GOALVEST_KV) {
        await env.GOALVEST_KV.put('goalvest_db', JSON.stringify(edgeDbCache));
      }

      return new Response(JSON.stringify({ success: true, syncedAt: new Date().toISOString() }), {
        status: 200,
        headers: CORS_HEADERS
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid sync payload' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }
  }

  // Route: /api/socials
  if (path === '/api/socials' && request.method === 'GET') {
    return new Response(JSON.stringify({
      community: {
        telegramVIP: "https://t.me/GoalVestVIP",
        telegramSupport: "https://t.me/GoalVestSupport",
        xTwitter: "https://x.com/GoalVestApp",
        instagram: "https://instagram.com/GoalVestOfficial",
        threads: "https://threads.net/@GoalVestOfficial"
      },
      posts: edgeDbCache.socialPosts || []
    }), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  // Route: /api/mobile/config
  if (path === '/api/mobile/config' && request.method === 'GET') {
    return new Response(JSON.stringify({
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
    }), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found', path }), {
    status: 404,
    headers: CORS_HEADERS
  });
}
