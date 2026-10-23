/**
 * GoalVest Application State & Router Controller
 */

const AppState = {
  currentUser: null,       // null, User Object, or { username: 'Admin', role: 'admin' }
  isAdmin: false,
  currentRoute: 'home',    // home, dashboard, goals, portfolio, stocks, crypto, properties, shop, cart, activity, simulator, settings, admin
  cart: [],
  selectedGoal: null,
  selectedProperty: null,
  selectedProduct: null,
  stockFilter: { exchange: 'all', sector: 'all', focus: 'all', search: '', watchlistOnly: false },
  watchlist: ['TSLA', 'NVDA', 'PLTR', 'BTC', 'SOL'],
  cryptoFilter: { category: 'all', search: '', sortBy: 'marketCap' },
  propertyFilter: { type: 'all', beds: 'all', maxPrice: '', savedOnly: false, search: '' },
  shopFilter: { category: 'all', search: '', sort: 'featured' },
  activityFilter: { category: 'all', search: '' }
};

// SVG Icon Helper Library (Zero external fonts/icons dependency)
const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  trendingUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  shoppingBag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  logOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  dollarSign: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  arrowUpRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
  arrowDownLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  messageSquare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFill: `<svg viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.88 7.97-3.44 3.79-1.58 4.58-1.85 5.09-1.86.11 0 .37.03.53.17.14.12.18.28.2.45-.02.07-.02.19-.04.35z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  threads: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg>`
};

// Official Verified Project Community & Social Media Channels
const COMMUNITY_LINKS = {
  telegramVIP: "https://t.me/GoalVestVIP",
  telegramSupport: "https://t.me/GoalVestSupport",
  xTwitter: "https://x.com/GoalVestApp",
  instagram: "https://instagram.com/GoalVestOfficial",
  threads: "https://threads.net/@GoalVestOfficial"
};

// Toast notification display
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${title}</div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="color: var(--text-dim); padding: 4px;">&times;</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4500);
}

// Sparkline SVG generator
function renderSparkline(points, isPositive = true, width = 90, height = 28) {
  if (!points || points.length < 2) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      <polyline fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${coords}" />
    </svg>
  `;
}

// Format numbers
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: val % 1 === 0 ? 0 : 2 }).format(val || 0);
}

function getTierForAmount(amount) {
  if (amount >= 1000000) return 'Private';
  if (amount >= 250000) return 'Wealth';
  if (amount >= 50000) return 'Premium';
  if (amount >= 10000) return 'Growth';
  if (amount >= 1000) return 'Builder';
  return 'Starter';
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Check if session stored
  const savedUser = sessionStorage.getItem('gv_current_user');
  if (savedUser) {
    if (savedUser === 'Admin') {
      AppState.isAdmin = true;
      AppState.currentUser = { username: 'Admin', role: 'admin' };
    } else {
      AppState.currentUser = window.gvStore.getUser(savedUser) || null;
    }
  }

  // Handle URL hash changes
  window.addEventListener('hashchange', handleHashRouting);

  // Initial Route Check
  if (window.location.hash) {
    handleHashRouting();
  } else {
    if (AppState.isAdmin) {
      navigateTo('admin');
    } else if (AppState.currentUser) {
      navigateTo('dashboard');
    } else {
      navigateTo('home');
    }
  }

  // Refresh pricing tickers every 3 seconds smoothly on live market views
  setInterval(() => {
    // Only re-render if user is not actively typing into an input field or modal is not open
    const isModalOpen = document.querySelector('.modal-backdrop.open');
    const isTyping = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (!isModalOpen && !isTyping && ['home', 'stocks', 'crypto'].includes(AppState.currentRoute)) {
      renderCurrentView();
    }
  }, 3000);
});

function handleHashRouting() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash, false);
}

function navigateTo(route, updateHash = true) {
  // Protect authenticated routes
  const authRoutes = ['dashboard', 'goals', 'portfolio', 'activity', 'settings'];
  if (authRoutes.includes(route) && !AppState.currentUser && !AppState.isAdmin) {
    showToast('Sign In Required', 'Please SIGN IN to access your GoalVest dashboard and portfolio.', 'info');
    openAuthModal('signin');
    return;
  }
  // Protect admin
  if (route === 'admin' && !AppState.isAdmin) {
    showToast('Admin Access Restricted', 'Please SIGN IN with administrator credentials to open Admin Console.', 'error');
    openAuthModal('signin');
    return;
  }

  AppState.currentRoute = route;
  if (updateHash) {
    window.location.hash = route;
  }

  renderAppShell();
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAppShell() {
  const isAuthView = AppState.currentRoute !== 'home';
  const navContainer = document.getElementById('nav-container');
  const sidebarContainer = document.getElementById('sidebar-container');
  const bottomNavContainer = document.getElementById('bottom-nav-container');

  if (!isAuthView) {
    // Show Public Nav
    navContainer.style.display = 'flex';
    sidebarContainer.style.display = 'none';
    bottomNavContainer.style.display = 'none';
    document.getElementById('main-viewport').style.marginLeft = '0';
    renderPublicNav();
  } else {
    // Show Authenticated Sidebar & Bottom Nav
    navContainer.style.display = 'none';
    sidebarContainer.style.display = 'flex';
    bottomNavContainer.style.display = 'flex';
    if (window.innerWidth > 768) {
      document.getElementById('main-viewport').style.marginLeft = 'var(--sidebar-width)';
    } else {
      document.getElementById('main-viewport').style.marginLeft = '0';
    }
    renderSidebar();
    renderBottomNav();
  }
}

function renderPublicNav() {
  const el = document.getElementById('nav-container');
  const user = AppState.currentUser;
  el.innerHTML = `
    <div class="brand-logo" onclick="navigateTo('home')" style="cursor: pointer;">
      <div class="brand-icon">G</div>
      <div class="brand-name">Goal<span>Vest</span></div>
    </div>
    <ul class="public-menu">
      <li><a href="#home" class="${AppState.currentRoute === 'home' ? 'active' : ''}">Overview</a></li>
      <li><a href="#stocks" onclick="event.preventDefault(); navigateTo('stocks');">Stock Market</a></li>
      <li><a href="#crypto" onclick="event.preventDefault(); navigateTo('crypto');">Crypto Trading</a></li>
      <li><a href="#properties" onclick="event.preventDefault(); navigateTo('properties');">Properties</a></li>
      <li><a href="#shop" onclick="event.preventDefault(); navigateTo('shop');">Shop</a></li>
      <li><a href="#advice" onclick="event.preventDefault(); scrollToSection('advice-section');">Daily Advice</a></li>
      <li><a href="#simulator" onclick="event.preventDefault(); navigateTo('simulator');">Simulator</a></li>
    </ul>
    <div class="public-auth-btns">
      ${AppState.isAdmin ? `
        <button class="btn btn-primary btn-sm" onclick="navigateTo('admin')">ADMIN CONSOLE</button>
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">LOGOUT</button>
      ` : user ? `
        <button class="btn btn-primary btn-sm" onclick="navigateTo('dashboard')">MY DASHBOARD</button>
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">LOGOUT</button>
      ` : `
        <button class="btn btn-secondary btn-sm" onclick="openAuthModal('signin')">SIGN IN</button>
        <button class="btn btn-primary btn-sm" onclick="openAuthModal('signup')">SIGN UP</button>
      `}
    </div>
  `;
}

function renderSidebar() {
  const el = document.getElementById('sidebar-container');
  const user = AppState.currentUser;
  const isAdmin = AppState.isAdmin;
  const r = AppState.currentRoute;

  el.innerHTML = `
    <div class="sidebar-header" style="justify-content: space-between;">
      <div class="brand-logo" onclick="navigateTo('home')" style="cursor: pointer;">
        <div class="brand-icon">G</div>
        <div class="brand-name">Goal<span>Vest</span></div>
      </div>
      <button class="mobile-close-btn" onclick="toggleMobileSidebar()" style="display: none; font-size: 1.4rem; color: var(--text-muted);">&times;</button>
    </div>
    <div class="sidebar-nav">
      <div class="sidebar-nav-title">App Workspace</div>
      <a class="sidebar-link ${r === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">${ICONS.dashboard} Dashboard</a>
      <a class="sidebar-link ${r === 'goals' ? 'active' : ''}" onclick="navigateTo('goals')">${ICONS.target} Goals</a>
      <a class="sidebar-link ${r === 'portfolio' ? 'active' : ''}" onclick="navigateTo('portfolio')">${ICONS.briefcase} Portfolio</a>
      <a class="sidebar-link ${r === 'stocks' ? 'active' : ''}" onclick="navigateTo('stocks')">${ICONS.trendingUp} Stock Market</a>
      <a class="sidebar-link ${r === 'crypto' ? 'active' : ''}" onclick="navigateTo('crypto')">${ICONS.cpu} Crypto Trading</a>
      <a class="sidebar-link ${r === 'properties' ? 'active' : ''}" onclick="navigateTo('properties')">${ICONS.home} Properties</a>
      <a class="sidebar-link ${r === 'shop' || r === 'cart' ? 'active' : ''}" onclick="navigateTo('shop')">
        ${ICONS.shoppingBag} Shop
        ${AppState.cart.length > 0 ? `<span class="badge badge-green" style="margin-left: auto;">${AppState.cart.length}</span>` : ''}
      </a>
      <a class="sidebar-link ${r === 'activity' ? 'active' : ''}" onclick="navigateTo('activity')">${ICONS.activity} Activity</a>
      <a class="sidebar-link ${r === 'simulator' ? 'active' : ''}" onclick="navigateTo('simulator')">${ICONS.sliders} Simulator</a>
      <a class="sidebar-link ${r === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">${ICONS.settings} Settings</a>

      ${isAdmin ? `
        <div class="sidebar-nav-title" style="color: var(--accent-green); margin-top: 1rem;">Administrator</div>
        <a class="sidebar-link ${r === 'admin' ? 'active' : ''}" onclick="navigateTo('admin')" style="color: var(--accent-green-light); font-weight: 700;">
          ${ICONS.shield} Admin Console
        </a>
      ` : ''}

      <div class="sidebar-nav-title" style="color: var(--text-dim); margin-top: 1rem;">Official Community</div>
      <a href="${COMMUNITY_LINKS.telegramVIP}" target="_blank" rel="noopener noreferrer" class="sidebar-link" style="color: var(--accent-cyan-light);">
        <span style="width: 20px; height: 20px;">${ICONS.telegram}</span> Telegram VIP
      </a>
      <a href="${COMMUNITY_LINKS.telegramSupport}" target="_blank" rel="noopener noreferrer" class="sidebar-link" style="color: var(--accent-green-light);">
        <span style="width: 20px; height: 20px;">${ICONS.telegram}</span> Telegram Support
      </a>
      <a href="${COMMUNITY_LINKS.xTwitter}" target="_blank" rel="noopener noreferrer" class="sidebar-link" style="color: #fff;">
        <span style="width: 20px; height: 20px;">${ICONS.x}</span> X (@GoalVestApp)
      </a>
      <a href="${COMMUNITY_LINKS.instagram}" target="_blank" rel="noopener noreferrer" class="sidebar-link" style="color: #f43f5e;">
        <span style="width: 20px; height: 20px;">${ICONS.instagram}</span> Instagram
      </a>
      <a href="${COMMUNITY_LINKS.threads}" target="_blank" rel="noopener noreferrer" class="sidebar-link" style="color: #e2e8f0;">
        <span style="width: 20px; height: 20px;">${ICONS.threads}</span> Threads
      </a>
    </div>
    <div class="sidebar-footer">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="user-avatar-badge">${isAdmin ? 'A' : (user?.name?.[0] || 'U')}</div>
        <div>
          <div style="font-size: 0.88rem; font-weight: 700; color: #fff;">${isAdmin ? 'System Admin' : (user?.name || 'Guest User')}</div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${isAdmin ? 'Root Superuser' : (user?.plan + ' Tier')}</div>
        </div>
      </div>
      <button onclick="handleLogout()" title="Logout" style="color: var(--text-dim); padding: 4px;">
        ${ICONS.logOut}
      </button>
    </div>
  `;
}

function renderBottomNav() {
  const el = document.getElementById('bottom-nav-container');
  const r = AppState.currentRoute;
  el.innerHTML = `
    <div class="mobile-nav-item ${r === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">
      ${ICONS.dashboard}
      <span>Home</span>
    </div>
    <div class="mobile-nav-item ${r === 'goals' ? 'active' : ''}" onclick="navigateTo('goals')">
      ${ICONS.target}
      <span>Goals</span>
    </div>
    <div class="mobile-nav-item ${r === 'stocks' ? 'active' : ''}" onclick="navigateTo('stocks')">
      ${ICONS.trendingUp}
      <span>Stocks</span>
    </div>
    <div class="mobile-nav-item ${r === 'crypto' ? 'active' : ''}" onclick="navigateTo('crypto')">
      ${ICONS.cpu}
      <span>Crypto</span>
    </div>
    <div class="mobile-nav-item ${r === 'shop' ? 'active' : ''}" onclick="navigateTo('shop')">
      ${ICONS.shoppingBag}
      <span>Shop</span>
    </div>
    ${AppState.isAdmin ? `
      <div class="mobile-nav-item ${r === 'admin' ? 'active' : ''}" onclick="navigateTo('admin')">
        ${ICONS.shield}
        <span>Admin</span>
      </div>
    ` : ''}
  `;
}

function toggleMobileSidebar() {
  const sb = document.getElementById('sidebar-container');
  sb.classList.toggle('mobile-open');
}

function scrollToSection(id) {
  if (AppState.currentRoute !== 'home') {
    navigateTo('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
