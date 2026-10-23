/**
 * GoalVest Views Renderer
 * Contains rich page templates and interactive views.
 */

function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const r = AppState.currentRoute;
  switch (r) {
    case 'home':
      container.innerHTML = getHomeView();
      break;
    case 'dashboard':
      container.innerHTML = getDashboardView();
      break;
    case 'goals':
      container.innerHTML = getGoalsView();
      break;
    case 'portfolio':
      container.innerHTML = getPortfolioView();
      break;
    case 'stocks':
      container.innerHTML = getStocksView();
      break;
    case 'crypto':
      container.innerHTML = getCryptoView();
      break;
    case 'properties':
      container.innerHTML = getPropertiesView();
      break;
    case 'shop':
      container.innerHTML = getShopView();
      break;
    case 'cart':
      container.innerHTML = getCartView();
      break;
    case 'activity':
      container.innerHTML = getActivityView();
      break;
    case 'simulator':
      container.innerHTML = getSimulatorView();
      break;
    case 'settings':
      container.innerHTML = getSettingsView();
      break;
    case 'admin':
      container.innerHTML = getAdminView();
      break;
    default:
      container.innerHTML = getHomeView();
  }
}

// -------------------------------------------------------------
// 1. HOME / LANDING PAGE VIEW
// -------------------------------------------------------------
function getHomeView() {
  const stocks = window.gvPricing.getStocks().slice(0, 4);
  const crypto = window.gvPricing.getCrypto().slice(0, 4);

  return `
    <div class="landing-page">
      <!-- Hero Section -->
      <section style="position: relative; padding: 5rem 2rem 4rem; max-width: 1300px; margin: 0 auto; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1.1rem; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 1.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green-light); box-shadow: 0 0 8px var(--accent-green);"></span>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-green-light); letter-spacing: 0.05em; text-transform: uppercase;">GOALVEST PLATFORM 2026</span>
        </div>
        
        <h1 style="font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; max-width: 950px; margin: 0 auto 1.5rem;">
          Goal-Based Investing, Real Assets &amp; <span style="background: linear-gradient(135deg, #10b981, #06b6d4, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Next-Gen Marketplace</span>
        </h1>
        
        <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: var(--text-muted); max-width: 760px; margin: 0 auto 2.5rem;">
          From $100 starter plans to $10,000,000 private wealth horizons. Allocate seamlessly across US tech equities, S&amp;P heatmaps, prime real estate REITs, top digital assets, Tesla mobility, and humanoid robotics.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem;">
          <button class="btn btn-primary btn-lg" onclick="openAuthModal('signup')">
            START INVESTING NOW
          </button>
          <button class="btn btn-secondary btn-lg" onclick="navigateTo('stocks')">
            EXPLORE STOCK MARKET
          </button>
        </div>

        <!-- Hero Platform Card Image Visual -->
        <div class="gv-card gv-card-glow" style="padding: 0; max-width: 1040px; margin: 0 auto; overflow: hidden; border-color: rgba(16, 185, 129, 0.3);">
          <img src="assets/images/cards/hero-preview.png" alt="GoalVest Ecosystem" style="width: 100%; height: auto; display: block;" />
        </div>
      </section>

      <!-- Live Market Bar Ticker -->
      <section style="background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 1rem 0;">
        <div style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; display: flex; gap: 2rem; overflow-x: auto; scrollbar-width: none; align-items: center;">
          ${stocks.map(s => `
            <div style="display: flex; align-items: center; gap: 0.75rem; white-space: nowrap; cursor: pointer;" onclick="navigateTo('stocks')">
              <span style="font-weight: 700; color: #fff;">${s.symbol}</span>
              <span style="color: var(--text-muted);">$${s.currentPrice.toFixed(2)}</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: ${s.changePct >= 0 ? 'var(--accent-green-light)' : '#f87171'};">
                ${s.changePct >= 0 ? '+' : ''}${s.changePct}%
              </span>
            </div>
          `).join('')}
          <div style="width: 1px; height: 24px; background: var(--border-subtle);"></div>
          ${crypto.map(c => `
            <div style="display: flex; align-items: center; gap: 0.75rem; white-space: nowrap; cursor: pointer;" onclick="navigateTo('crypto')">
              <span style="font-weight: 700; color: #fff;">${c.symbol}</span>
              <span style="color: var(--text-muted);">$${c.currentPrice < 1 ? c.currentPrice.toFixed(4) : c.currentPrice.toLocaleString()}</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: ${c.changePct >= 0 ? 'var(--accent-green-light)' : '#f87171'};">
                ${c.changePct >= 0 ? '+' : ''}${c.changePct}%
              </span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Direct Ecosystem Links -->
      <section style="max-width: 1300px; margin: 4.5rem auto 2rem; padding: 0 1.5rem;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <h2 style="font-size: 2.2rem;">Complete Financial &amp; Physical Asset Infrastructure</h2>
          <p style="margin-top: 0.5rem;">Everything you need to fund, protect, and amplify your lifestyle and wealth.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('dashboard')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.15); color: var(--accent-green-light); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.dashboard}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Personal Dashboard</h3>
            <p style="font-size: 0.9rem;">Real-time available wallet balance, investments, earnings, withdrawals, and deposit tracking.</p>
            <div style="margin-top: 1.2rem; color: var(--accent-green-light); font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Launch Dashboard ${ICONS.arrowUpRight}</div>
          </div>
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('goals')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan-light); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.target}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Tier Wealth Goals</h3>
            <p style="font-size: 0.9rem;">6 tailored investment tiers scaling from $100 up to $10,000,000 with algorithmic contributions.</p>
            <div style="margin-top: 1.2rem; color: var(--accent-cyan-light); font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Configure Goals ${ICONS.arrowUpRight}</div>
          </div>
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('stocks')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.15); color: var(--accent-blue-light); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.trendingUp}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Stock Market Hub</h3>
            <p style="font-size: 0.9rem;">S&amp;P 500 style tech heatmap, TSLA, NVDA, AMD, AAPL, MSFT and autonomy equities.</p>
            <div style="margin-top: 1.2rem; color: var(--accent-blue-light); font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Open Stock Market ${ICONS.arrowUpRight}</div>
          </div>
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('crypto')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.15); color: #fbbf24; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.cpu}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Crypto Trading</h3>
            <p style="font-size: 0.9rem;">Bitcoin, Ethereum, Solana, DOGE, real-time heatmaps, TVL, and market dominance metrics.</p>
            <div style="margin-top: 1.2rem; color: #fbbf24; font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Trade Digital Assets ${ICONS.arrowUpRight}</div>
          </div>
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('properties')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(139, 92, 246, 0.15); color: #c084fc; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.home}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Real Estate &amp; REITs</h3>
            <p style="font-size: 0.9rem;">Mortgages, luxury penthouses, high-yield rentals, short-term stays, and fractional REIT shares.</p>
            <div style="margin-top: 1.2rem; color: #c084fc; font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Search Properties ${ICONS.arrowUpRight}</div>
          </div>
          <div class="gv-card gv-card-glow" style="cursor: pointer;" onclick="navigateTo('shop')">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.15); color: #fb7185; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">${ICONS.shoppingBag}</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">EV &amp; Tech Marketplace</h3>
            <p style="font-size: 0.9rem;">Reserve Tesla Cybertrucks, Optimus robots, kinetic smart watches, tech apparel, and solar battery systems.</p>
            <div style="margin-top: 1.2rem; color: #fb7185; font-weight: 600; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">Browse Marketplace ${ICONS.arrowUpRight}</div>
          </div>
        </div>
      </section>

      <!-- Daily Financial and Lifestyle Advice Section -->
      <section id="advice-section" style="max-width: 1300px; margin: 4.5rem auto 2rem; padding: 0 1.5rem;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.85rem; border-radius: var(--radius-full); background: rgba(6, 182, 212, 0.1); color: var(--accent-cyan-light); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.75rem;">
            DAILY CURATED INTEL
          </div>
          <h2 style="font-size: 2.2rem;">Daily Financial &amp; Lifestyle Advice</h2>
          <p style="margin-top: 0.5rem; max-width: 650px; margin-left: auto; margin-right: auto;">
            Actionable wealth principles across investing, budgeting, lifestyle discipline, long-term wealth, emergency funds, asset allocation, and smart purchase decisions.
          </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          ${DAILY_ADVICE.map(adv => `
            <div class="gv-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="badge badge-green">${adv.category}</span>
                  <span style="font-size: 0.78rem; color: var(--text-dim);">${adv.readTime}</span>
                </div>
                <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: #fff;">${adv.title}</h3>
                <p style="font-size: 0.88rem; line-height: 1.6;">${adv.snippet}</p>
              </div>
              <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.78rem; color: var(--accent-green-light); font-weight: 600;">GoalVest Strategy Brief</span>
                <button class="btn btn-secondary btn-sm" onclick="showToast('Strategy Bookmarked', 'Added to your offline reading library.', 'info')">Save</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Goal Investment Tiers Section -->
      <section style="max-width: 1300px; margin: 4.5rem auto 2rem; padding: 0 1.5rem;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <h2 style="font-size: 2.2rem;">Goal-Based Investment Tiers ($100 – $10,000,000)</h2>
          <p style="margin-top: 0.5rem;">Structured wealth architecture scaled to your ambition and timeline.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          ${[
            { tier: 'Starter', range: '$100 – $999', fee: '0.00%', alloc: 'Core ETF & Cash Vault', color: 'badge-blue' },
            { tier: 'Builder', range: '$1,000 – $9,999', fee: '0.15%', alloc: 'Tech Titans & S&P Core', color: 'badge-cyan' },
            { tier: 'Growth', range: '$10,000 – $49,999', fee: '0.25%', alloc: 'Tech Equities, REITs & BTC', color: 'badge-green' },
            { tier: 'Premium', range: '$50,000 – $249,999', fee: '0.20%', alloc: 'Direct Stocks, REITs & EV Fund', color: 'badge-purple' },
            { tier: 'Wealth', range: '$250,000 – $999,999', fee: '0.15%', alloc: 'Multi-Class Properties & Hardware', color: 'badge-amber' },
            { tier: 'Private', range: '$1,000,000 – $10,000,000', fee: '0.10%', alloc: 'Dedicated Liquid Desk & Custom REITs', color: 'badge-red' }
          ].map(t => `
            <div class="gv-card" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge ${t.color}" style="margin-bottom: 0.75rem;">${t.tier} TIER</span>
                <div style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${t.range}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Platform fee: <strong style="color:#fff;">${t.fee}</strong></div>
                <p style="font-size: 0.85rem;">Allocation focus: ${t.alloc}</p>
              </div>
              <button class="btn btn-secondary btn-sm btn-block" style="margin-top: 1.5rem;" onclick="openAuthModal('signup')">Select Tier</button>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Frequent Community & Social Broadcast Feed -->
      <section id="socials-feed-section" style="max-width: 1300px; margin: 4.5rem auto 2rem; padding: 0 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.85rem; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.1); color: var(--accent-green-light); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.75rem;">
              FREQUENT SOCIAL BROADCASTS
            </div>
            <h2 style="font-size: 2.2rem;">Live Community &amp; Market Alpha</h2>
            <p style="margin-top: 0.35rem; color: var(--text-muted);">
              Daily market breakdowns, wealth strategies, and updates delivered across Telegram, X, Instagram &amp; Threads.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="${COMMUNITY_LINKS.telegramVIP}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: var(--accent-cyan-light);">
              <span style="width: 16px; height: 16px;">${ICONS.telegram}</span> Telegram VIP
            </a>
            <a href="${COMMUNITY_LINKS.xTwitter}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #fff;">
              <span style="width: 16px; height: 16px;">${ICONS.x}</span> X / Twitter
            </a>
            <a href="${COMMUNITY_LINKS.instagram}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #f43f5e;">
              <span style="width: 16px; height: 16px;">${ICONS.instagram}</span> Instagram
            </a>
            <a href="${COMMUNITY_LINKS.threads}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #e2e8f0;">
              <span style="width: 16px; height: 16px;">${ICONS.threads}</span> Threads
            </a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
          ${(window.gvSocialPosts || []).map(post => `
            <div class="gv-card gv-card-glow" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <span class="badge ${post.badge}">${post.channel}</span>
                  <span style="font-size: 0.78rem; color: var(--text-dim);">${post.date}</span>
                </div>
                <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.65rem; line-height: 1.35;">${post.headline}</h3>
                <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;">
                  ${post.content}
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                  ${post.tags.map(t => `<span style="font-size: 0.75rem; color: var(--accent-cyan-light); background: rgba(6, 182, 212, 0.08); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">${t}</span>`).join('')}
                </div>
              </div>

              <div style="padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-green-light);">${post.stat}</span>
                <div style="display: flex; gap: 0.4rem;">
                  <button class="btn btn-secondary btn-sm" onclick="handleCopySocialText('${post.id}')" title="Copy Post">
                    ${ICONS.copy} Copy
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="handleShareSocialPost('${post.id}')" title="Share Content">
                    ${ICONS.share2} Broadcast
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer Section -->
      <footer style="background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); padding: 4rem 2rem 2.5rem; margin-top: 5rem;">
        <div style="max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem;">
          <div>
            <div class="brand-logo" style="margin-bottom: 1rem;">
              <div class="brand-icon">G</div>
              <div class="brand-name">Goal<span>Vest</span></div>
            </div>
            <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
              GoalVest is the single-window wealth engine bridging goal-based personal portfolios, fractional real estate, equity tech markets, digital assets, and next-generation mobility.
            </p>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Production: <a href="https://goalvest.dev" style="color: var(--accent-green-light);">https://goalvest.dev</a></div>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 1.2rem; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">Ecosystem</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: var(--text-muted);">
              <li><a href="#dashboard" onclick="event.preventDefault(); navigateTo('dashboard')">User Dashboard</a></li>
              <li><a href="#goals" onclick="event.preventDefault(); navigateTo('goals')">Wealth Goals</a></li>
              <li><a href="#portfolio" onclick="event.preventDefault(); navigateTo('portfolio')">Holdings &amp; Allocation</a></li>
              <li><a href="#stocks" onclick="event.preventDefault(); navigateTo('stocks')">Stock Market Heatmap</a></li>
              <li><a href="#crypto" onclick="event.preventDefault(); navigateTo('crypto')">Crypto Trading Suite</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 1.2rem; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">Marketplace &amp; Assets</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: var(--text-muted);">
              <li><a href="#properties" onclick="event.preventDefault(); navigateTo('properties')">Properties &amp; REITs</a></li>
              <li><a href="#shop" onclick="event.preventDefault(); navigateTo('shop')">Electric Vehicles &amp; Robots</a></li>
              <li><a href="#simulator" onclick="event.preventDefault(); navigateTo('simulator')">Contribution Simulator</a></li>
              <li><a href="#activity" onclick="event.preventDefault(); navigateTo('activity')">Activity Ledger</a></li>
              <li><a href="#settings" onclick="event.preventDefault(); navigateTo('settings')">Security &amp; Settings</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 1.2rem; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">Community &amp; Socials</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              <li>
                <a href="${COMMUNITY_LINKS.telegramVIP}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-cyan-light);">
                  <span style="width: 18px; height: 18px; display: inline-block;">${ICONS.telegram}</span> Telegram VIP Channel
                </a>
              </li>
              <li>
                <a href="${COMMUNITY_LINKS.telegramSupport}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-green-light);">
                  <span style="width: 18px; height: 18px; display: inline-block;">${ICONS.telegram}</span> Telegram 24/7 Support Desk
                </a>
              </li>
              <li>
                <a href="${COMMUNITY_LINKS.xTwitter}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                  <span style="width: 18px; height: 18px; display: inline-block;">${ICONS.x}</span> X (@GoalVestApp)
                </a>
              </li>
              <li>
                <a href="${COMMUNITY_LINKS.instagram}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: #f43f5e;">
                  <span style="width: 18px; height: 18px; display: inline-block;">${ICONS.instagram}</span> Instagram (@GoalVestOfficial)
                </a>
              </li>
              <li>
                <a href="${COMMUNITY_LINKS.threads}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: #e2e8f0;">
                  <span style="width: 18px; height: 18px; display: inline-block;">${ICONS.threads}</span> Threads (@GoalVestOfficial)
                </a>
              </li>
            </ul>
            <button class="btn btn-secondary btn-sm btn-block" onclick="openAuthModal('signin')">ADMIN CONSOLE LOGIN</button>
          </div>
        </div>
        <div style="max-width: 1300px; margin: 3rem auto 0; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: var(--text-dim);">
          <div>&copy; 2026 GoalVest Ecosystem. All rights reserved. Built for high performance on Cloudflare Pages.</div>
          <div>Multi-Asset Architecture: Equities &bull; REITs &bull; Crypto &bull; Hardware</div>
        </div>
      </footer>
    </div>
  `;
}

// -------------------------------------------------------------
// 2. USER DASHBOARD VIEW
// -------------------------------------------------------------
function getDashboardView() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const wallet = user.wallet;
  const announcements = window.gvStore.getAnnouncements().filter(a => a.audience === 'All users' || a.audience === user.username);
  const chats = window.gvStore.getChats().filter(c => c.from === user.username || c.to === user.username);
  const paymentRequests = window.gvStore.getPaymentRequests().filter(p => p.username === user.username);
  const activity = window.gvStore.getActivity().filter(a => !a.username || a.username.toLowerCase() === user.username.toLowerCase()).slice(0, 5);

  const totalProgress = user.goals.length > 0
    ? Math.round((user.goals.reduce((acc, g) => acc + g.currentAmount, 0) / user.goals.reduce((acc, g) => acc + g.targetAmount, 1)) * 100)
    : 0;

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <button class="btn btn-secondary btn-sm" onclick="toggleMobileSidebar()" style="display: none;" id="mobile-menu-btn">&#9776;</button>
        <h2 class="topbar-title">Dashboard Overview</h2>
        <span class="badge badge-green">${user.plan} Tier</span>
      </div>
      <div class="topbar-right">
        <a href="${COMMUNITY_LINKS.telegramVIP}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Join Telegram VIP Channel" style="display: inline-flex; align-items: center; gap: 0.4rem; color: var(--accent-cyan-light);">
          <span style="width: 16px; height: 16px;">${ICONS.telegram}</span> VIP Channel
        </a>
        <a href="${COMMUNITY_LINKS.telegramSupport}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Live Telegram Support Desk" style="display: inline-flex; align-items: center; gap: 0.4rem; color: var(--accent-green-light);">
          <span style="width: 16px; height: 16px;">${ICONS.telegram}</span> Support Desk
        </a>
        <button class="btn btn-secondary btn-sm" onclick="openDepositModal()">${ICONS.arrowDownLeft} Deposit</button>
        <button class="btn btn-secondary btn-sm" onclick="openWithdrawModal()">${ICONS.arrowUpRight} Withdraw</button>
        <button class="btn btn-primary btn-sm" onclick="openTransferModal()">${ICONS.users} Transfer</button>
      </div>
    </div>

    <div class="app-container">
      <!-- High Priority Announcement Banner -->
      ${announcements.length > 0 ? `
        <div style="margin-bottom: 1.5rem; background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.12)); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;">
          <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div style="background: var(--accent-green-bg); color: var(--accent-green-light); padding: 8px; border-radius: var(--radius-md); font-size: 1.2rem;">
              ${ICONS.bell}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge badge-green">${announcements[0].level} Announcement</span>
                <span style="font-size: 0.78rem; color: var(--text-dim);">${announcements[0].createdDate} by ${announcements[0].author}</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem; color: #fff;">${announcements[0].title}</h4>
              <p style="font-size: 0.88rem; margin: 0;">${announcements[0].body}</p>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Top Financial Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Available Wallet</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(wallet.availableBalance)}</div>
          <div style="font-size: 0.78rem; color: var(--accent-green-light); font-weight: 600;">Liquid Cash Available for Orders</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Portfolio Value</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(wallet.investmentValue)}</div>
          <div style="font-size: 0.78rem; color: var(--accent-cyan-light); font-weight: 600;">Active Equities, REITs &amp; Crypto</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Total Invested</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(wallet.totalInvested)}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Principal Invested Capital</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Cumulative Earnings</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-green-light); margin: 0.4rem 0;">+${formatCurrency(wallet.earnings)}</div>
          <div style="font-size: 0.78rem; color: var(--accent-green-light); font-weight: 600;">Dividends, Returns &amp; Yields</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Overall Goal Progress</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${totalProgress}%</div>
          <div style="background: var(--bg-secondary); border-radius: var(--radius-full); height: 6px; overflow: hidden; margin-top: 0.5rem;">
            <div style="width: ${totalProgress}%; background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); height: 100%;"></div>
          </div>
        </div>
      </div>

      <!-- Secondary Row: Wallet Panel & Goals Summary Cards -->
      <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <!-- Wallet Management Panel -->
        <div class="gv-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.15rem;">GoalVest Wallet Panel</h3>
            <span class="badge badge-green">Authenticated</span>
          </div>

          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">Deposits (Admin-Auth)</span>
              <strong style="color: #fff;">${formatCurrency(wallet.deposits)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">Withdrawals</span>
              <strong style="color: #fff;">${formatCurrency(wallet.withdrawals)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">Active Investments</span>
              <strong style="color: #fff;">${formatCurrency(wallet.investmentValue)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.65rem; border-top: 1px solid var(--border-subtle); font-size: 0.95rem;">
              <span style="color: var(--accent-green-light); font-weight: 700;">Net Available Balance</span>
              <strong style="color: var(--accent-green-light); font-weight: 800;">${formatCurrency(wallet.availableBalance)}</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <button class="btn btn-secondary btn-sm" onclick="openDepositModal()">${ICONS.arrowDownLeft} Deposit Funds</button>
            <button class="btn btn-secondary btn-sm" onclick="openWithdrawModal()">${ICONS.arrowUpRight} Request Payout</button>
            <button class="btn btn-primary btn-sm" style="grid-column: span 2;" onclick="openTransferModal()">${ICONS.users} User-to-User Transfer</button>
          </div>
        </div>

        <!-- Goals Summary Cards -->
        <div class="gv-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.15rem;">Active Wealth Goals</h3>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('goals')">${ICONS.plus} Manage Goals</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${user.goals.map(g => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return `
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; cursor: pointer;" onclick="openGoalDetailModal('${g.id}')">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div>
                      <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">${g.name}</span>
                      <span class="badge badge-cyan" style="margin-left: 0.5rem; font-size: 0.68rem;">${g.tier} Tier</span>
                    </div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: var(--accent-green-light);">${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)}</div>
                  </div>
                  <div style="background: rgba(148, 163, 184, 0.1); border-radius: var(--radius-full); height: 8px; overflow: hidden; margin-bottom: 0.5rem;">
                    <div style="width: ${pct}%; background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); height: 100%;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-dim);">
                    <span>${pct}% Funded &bull; $${g.monthlyContribution}/mo auto-contribution</span>
                    <span>Target: ${g.targetDate}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Third Row: Chat with Admin & Recent Payment Requests -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <!-- Chat with Admin -->
        <div class="gv-card" style="display: flex; flex-direction: column; height: 380px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-green); box-shadow: 0 0 6px var(--accent-green);"></span>
              <h3 style="font-size: 1.1rem;">Direct Chat with Administrator</h3>
            </div>
            <a href="${COMMUNITY_LINKS.telegramSupport}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: var(--accent-cyan-light); display: inline-flex; align-items: center; gap: 0.3rem;">
              <span style="width: 14px; height: 14px;">${ICONS.telegram}</span> Live Telegram Support
            </a>
          </div>

          <div id="user-chat-box" style="flex: 1; overflow-y: auto; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.75rem;">
            ${chats.length === 0 ? `<div style="color: var(--text-dim); font-size: 0.85rem; text-align: center; margin-top: 3rem;">No messages yet. Send a message to Administrator below.</div>` : ''}
            ${chats.map(c => `
              <div style="align-self: ${c.from === user.username ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${c.from === user.username ? 'linear-gradient(135deg, var(--accent-green-dark), #047857)' : 'var(--bg-tertiary)'}; border-radius: var(--radius-md); padding: 0.65rem 0.9rem;">
                <div style="display: flex; justify-content: space-between; gap: 1rem; font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-bottom: 2px;">
                  <strong>${c.from === user.username ? 'You' : 'Admin'}</strong>
                  <span>${c.timestamp}</span>
                </div>
                <div style="font-size: 0.86rem; color: #fff; line-height: 1.4;">${c.text}</div>
              </div>
            `).join('')}
          </div>

          <form onsubmit="handleSendUserChat(event)" style="display: flex; gap: 0.5rem;">
            <input type="text" id="user-chat-input" placeholder="Ask Admin about wires, deposits, goals..." required style="flex: 1;" />
            <button type="submit" class="btn btn-primary btn-sm">SEND</button>
          </form>
        </div>

        <!-- Payment Requests & Settlement Status -->
        <div class="gv-card" style="display: flex; flex-direction: column; height: 380px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.1rem;">Deposit &amp; Withdrawal Status</h3>
            <span class="badge badge-cyan">${paymentRequests.length} Requests</span>
          </div>

          <div style="flex: 1; overflow-y: auto;">
            ${paymentRequests.length === 0 ? `
              <div style="color: var(--text-dim); font-size: 0.85rem; text-align: center; margin-top: 3rem;">No pending deposits or withdrawal requests.</div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${paymentRequests.map(req => `
                  <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-weight: 700; color: #fff; font-size: 0.9rem;">${req.type} &bull; ${formatCurrency(req.amount)}</span>
                      <span class="badge ${req.status === 'Approved' ? 'badge-green' : req.status === 'Rejected' ? 'badge-red' : 'badge-amber'}">${req.status}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${req.method} &bull; ${req.details}</div>
                    <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.35rem;">Submitted: ${req.timestamp}</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div style="padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm btn-block" onclick="openDepositModal()">${ICONS.plus} New Deposit</button>
            <button class="btn btn-secondary btn-sm btn-block" onclick="openWithdrawModal()">New Withdrawal</button>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table -->
      <div class="gv-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.15rem;">Recent Account Transactions</h3>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('activity')">View Full Ledger</button>
        </div>
        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Category</th>
                <th>Status</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${activity.map(a => `
                <tr>
                  <td><span class="badge ${a.amount >= 0 ? 'badge-green' : 'badge-blue'}">${a.type}</span></td>
                  <td style="font-weight: 600;">${a.title}</td>
                  <td style="color: var(--text-muted);">${a.date}</td>
                  <td>${a.category}</td>
                  <td><span class="badge badge-green">${a.status}</span></td>
                  <td style="text-align: right; font-weight: 700; color: ${a.amount > 0 ? 'var(--accent-green-light)' : a.amount < 0 ? '#fff' : 'var(--text-muted)'};">
                    ${a.amount !== 0 ? (a.amount > 0 ? '+' : '') + formatCurrency(a.amount) : 'Settled'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 3. GOALS VIEW
// -------------------------------------------------------------
function getGoalsView() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goals = user.goals || [];

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Financial Goals</h2>
        <span class="badge badge-green">Tiers $100 &ndash; $10,000,000</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-primary btn-sm" onclick="openCreateGoalModal()">${ICONS.plus} CREATE GOAL</button>
      </div>
    </div>

    <div class="app-container">
      <!-- Tier Explainer Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-blue">STARTER</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$100 &ndash; $999</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Liquid cash vault &amp; micro ETF auto-allocations.</div>
        </div>
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-cyan">BUILDER</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$1,000 &ndash; $9,999</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">S&amp;P core + semiconductor ETF accumulation.</div>
        </div>
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-green">GROWTH</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$10,000 &ndash; $49,999</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Diversified tech stocks, REIT dividends &amp; BTC.</div>
        </div>
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-purple">PREMIUM</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$50,000 &ndash; $249,999</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Direct equity ownership &amp; clean energy hardware.</div>
        </div>
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-amber">WEALTH</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$250,000 &ndash; $999,999</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Multi-unit property down payments &amp; fleet tech.</div>
        </div>
        <div class="gv-card" style="padding: 1rem;">
          <span class="badge badge-red">PRIVATE</span>
          <div style="font-weight: 700; color: #fff; margin: 0.35rem 0;">$1M &ndash; $10,000,000</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Custom institutional REIT mandates &amp; private equity.</div>
        </div>
      </div>

      <!-- User Goals Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
        ${goals.map(g => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          return `
            <div class="gv-card gv-card-glow" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                  <div>
                    <span class="badge badge-green">${g.tier} Tier</span>
                    <h3 style="font-size: 1.3rem; margin: 0.4rem 0 0.2rem; color: #fff;">${g.name}</h3>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${g.riskProfile} Risk Profile</div>
                  </div>
                  <div style="display: flex; gap: 0.35rem;">
                    <button class="btn btn-secondary btn-sm" onclick="openEditGoalModal('${g.id}')" title="Edit Goal">${ICONS.edit}</button>
                    <button class="btn btn-danger btn-sm" onclick="handleDeleteGoal('${g.id}')" title="Delete Goal">${ICONS.trash}</button>
                  </div>
                </div>

                <!-- Financial Progress Numbers -->
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.82rem; color: var(--text-muted);">Current Progress</span>
                    <span style="font-size: 1.3rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(g.currentAmount)}</span>
                  </div>
                  <div style="background: rgba(148, 163, 184, 0.12); border-radius: var(--radius-full); height: 10px; overflow: hidden; margin-bottom: 0.5rem;">
                    <div style="width: ${pct}%; background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); height: 100%;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim);">
                    <span>${pct}% of ${formatCurrency(g.targetAmount)} target</span>
                    <span>Target Date: ${g.targetDate}</span>
                  </div>
                </div>

                <!-- Monthly Contribution & Target -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
                  <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 0.75rem;">
                    <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Monthly Contribution</div>
                    <div style="font-size: 1rem; font-weight: 700; color: #fff;">${formatCurrency(g.monthlyContribution)}/mo</div>
                  </div>
                  <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 0.75rem;">
                    <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Expected Yield</div>
                    <div style="font-size: 1rem; font-weight: 700; color: var(--accent-cyan-light);">9.8% APY Proj.</div>
                  </div>
                </div>

                <!-- Allocation Split Chips -->
                <div style="margin-bottom: 1.25rem;">
                  <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700;">Asset Allocation</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                    ${Object.entries(g.allocation || {}).map(([asset, weight]) => `
                      <span style="font-size: 0.74rem; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); padding: 0.25rem 0.6rem; border-radius: var(--radius-full); color: var(--text-muted);">
                        ${asset}: <strong style="color: #fff;">${weight}%</strong>
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
                <button class="btn btn-secondary btn-sm btn-block" onclick="openGoalDetailModal('${g.id}')">View Full Detail &amp; Projections</button>
                <button class="btn btn-primary btn-sm btn-block" onclick="openFundGoalModal('${g.id}')">Fund Goal</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 4. PORTFOLIO VIEW
// -------------------------------------------------------------
function getPortfolioView() {
  const holdings = DEFAULT_PORTFOLIO_HOLDINGS;
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalGain = totalValue - totalCost;
  const gainPct = ((totalGain / totalCost) * 100).toFixed(2);

  // Asset class breakdown
  const classes = {};
  holdings.forEach(h => {
    classes[h.assetClass] = (classes[h.assetClass] || 0) + h.value;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Portfolio Holdings &amp; Asset Classes</h2>
        <span class="badge badge-green">+${gainPct}% All-Time Gain</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary btn-sm" onclick="showToast('Rebalance Simulated', 'Tax-advantaged rebalance executed across portfolio.', 'success')">Simulate Rebalance</button>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('stocks')">Buy Equities</button>
      </div>
    </div>

    <div class="app-container">
      <!-- Portfolio Overview Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Total Portfolio Value</div>
          <div style="font-size: 2rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(totalValue)}</div>
          <div style="font-size: 0.8rem; color: var(--accent-green-light); font-weight: 600;">+$${totalGain.toLocaleString()} Total Unrealized Return</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Total Cost Basis</div>
          <div style="font-size: 2rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(totalCost)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Net Deposited Capital Basis</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">YTD Blended Performance</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--accent-green-light); margin: 0.4rem 0;">+24.8%</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Outperforming S&amp;P 500 by +9.2%</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Asset Class Diversification</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--accent-cyan-light); margin: 0.4rem 0;">6 Classes</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">US Eq, Int Eq, REIT, Fixed, Comm, Cash</div>
        </div>
      </div>

      <!-- Visual Allocation Split Chart / Bar -->
      <div class="gv-card" style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">Asset Class Allocation Architecture</h3>
        <div style="display: flex; height: 16px; border-radius: var(--radius-full); overflow: hidden; margin-bottom: 1.25rem;">
          <div style="width: 55%; background: #10b981;" title="US Equity (55%)"></div>
          <div style="width: 13%; background: #06b6d4;" title="International Equity (13%)"></div>
          <div style="width: 15%; background: #8b5cf6;" title="Real Estate (15%)"></div>
          <div style="width: 9%; background: #3b82f6;" title="Fixed Income (9%)"></div>
          <div style="width: 5%; background: #f59e0b;" title="Commodities (5%)"></div>
          <div style="width: 3%; background: #64748b;" title="Cash (3%)"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; font-size: 0.82rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span> US Equity (55.5%)</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #06b6d4; border-radius: 2px;"></span> International Equity (13.2%)</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #8b5cf6; border-radius: 2px;"></span> Real Estate REITs (15.6%)</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span> Fixed Income (8.8%)</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 2px;"></span> Commodities (4.4%)</div>
          <div style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 10px; height: 10px; background: #64748b; border-radius: 2px;"></span> High-Yield Cash (2.7%)</div>
        </div>
      </div>

      <!-- Sortable Holdings Table -->
      <div class="gv-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-size: 1.15rem;">Portfolio Positions &amp; Expense Ratios</h3>
          <span style="font-size: 0.8rem; color: var(--text-dim);">${holdings.length} Active Positions</span>
        </div>

        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Holding Asset</th>
                <th>Asset Class</th>
                <th>Current Value</th>
                <th>Cost Basis</th>
                <th>Unrealized Gain/Loss</th>
                <th>YTD Return</th>
                <th>Expense Ratio</th>
              </tr>
            </thead>
            <tbody>
              ${holdings.map(h => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${h.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">${h.symbol}</div>
                  </td>
                  <td><span class="badge badge-cyan">${h.assetClass}</span></td>
                  <td style="font-weight: 700; color: #fff;">${formatCurrency(h.value)}</td>
                  <td style="color: var(--text-muted);">${formatCurrency(h.costBasis)}</td>
                  <td style="font-weight: 700; color: ${h.gainLoss >= 0 ? 'var(--accent-green-light)' : '#f87171'};">
                    ${h.gainLoss >= 0 ? '+' : ''}${formatCurrency(h.gainLoss)}
                  </td>
                  <td style="font-weight: 700; color: var(--accent-green-light);">${h.ytdReturn}</td>
                  <td style="color: var(--text-muted);">${h.expenseRatio}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 5. STOCK MARKET VIEW (Tech & Elon-related majorly)
// -------------------------------------------------------------
function getStocksView() {
  const stocks = window.gvPricing.getStocks();
  const f = AppState.stockFilter;

  // Filter stocks
  const filtered = stocks.filter(s => {
    if (f.exchange !== 'all' && s.exchange !== f.exchange) return false;
    if (f.sector !== 'all' && s.sector !== f.sector) return false;
    if (f.focus !== 'all' && !s.focus.toLowerCase().includes(f.focus.toLowerCase())) return false;
    if (f.watchlistOnly && !AppState.watchlist.includes(s.symbol)) return false;
    if (f.search && !s.symbol.toLowerCase().includes(f.search.toLowerCase()) && !s.name.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Stock Market</h2>
        <span class="badge badge-green">Live S&amp;P &amp; Tech Intelligence</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary btn-sm" onclick="toggleWatchlistMode()">
          ${f.watchlistOnly ? 'Show All Stocks' : 'Watchlist Only (' + AppState.watchlist.length + ')'}
        </button>
      </div>
    </div>

    <div class="app-container">
      <!-- Grid Manner Header Widgets -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div class="gv-card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">NASDAQ COMPOSITE</span>
            <span class="badge badge-green">+1.42%</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">18,518.61</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Volume: 5.2B shares</div>
        </div>

        <div class="gv-card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">S&amp;P 500 INDEX</span>
            <span class="badge badge-green">+0.88%</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">5,815.26</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Tech weighting: 34.2%</div>
        </div>

        <div class="gv-card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">AUTONOMY &amp; AI INDEX</span>
            <span class="badge badge-cyan">+2.84%</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">4,120.40</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">TSLA, NVDA, PLTR, TSM</div>
        </div>

        <div class="gv-card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">10-YR TREASURY</span>
            <span class="badge badge-amber">4.18%</span>
          </div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">-2.4 bps</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Macro stability anchor</div>
        </div>
      </div>

      <!-- S&P 500 Style Tech Heatmap -->
      <div class="gv-card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.2rem;">S&amp;P 500 Tech &amp; Autonomous Sector Heatmap</h3>
            <p style="font-size: 0.85rem; margin-top: 2px;">Visual performance mapping of tech titans, Elon-ecosystem, and mobility leaders.</p>
          </div>
          <span class="badge badge-green">Dynamic Real-Time</span>
        </div>

        <div class="heatmap-grid">
          ${stocks.map(s => {
            const chg = s.changePct;
            const cls = chg > 1.0 ? 'up-heavy' : chg > 0 ? 'up-mod' : chg < -1.0 ? 'down-heavy' : 'down-mod';
            return `
              <div class="heatmap-cell ${cls}" onclick="openStockOrderModal('${s.symbol}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="font-size: 1.05rem;">${s.symbol}</strong>
                  <span style="font-size: 0.72rem; opacity: 0.9;">${s.exchange}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                  <div style="font-size: 0.88rem; font-weight: 700;">$${s.currentPrice.toFixed(2)}</div>
                  <div style="font-size: 0.78rem; font-weight: 800;">${chg >= 0 ? '+' : ''}${chg}%</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Stock Filters & Search Bar -->
      <div class="gv-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Stock Search</label>
            <input type="text" placeholder="Search TSLA, NVDA, Apple..." value="${f.search}" oninput="handleStockSearch(this.value)" />
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Focus Category</label>
            <select onchange="handleStockFocusFilter(this.value)">
              <option value="all" ${f.focus === 'all' ? 'selected' : ''}>All Focus Equities</option>
              <option value="Elon" ${f.focus === 'Elon' ? 'selected' : ''}>Elon &amp; Mobility Focus</option>
              <option value="Tech" ${f.focus === 'Tech' ? 'selected' : ''}>Semiconductors &amp; AI Tech</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Exchange</label>
            <select onchange="handleStockExchangeFilter(this.value)">
              <option value="all" ${f.exchange === 'all' ? 'selected' : ''}>All Exchanges</option>
              <option value="NASDAQ" ${f.exchange === 'NASDAQ' ? 'selected' : ''}>NASDAQ</option>
              <option value="NYSE" ${f.exchange === 'NYSE' ? 'selected' : ''}>NYSE</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Watchlist</label>
            <button class="btn ${f.watchlistOnly ? 'btn-primary' : 'btn-secondary'} btn-block" onclick="toggleWatchlistMode()">
              ${f.watchlistOnly ? 'Filtering Watchlist' : 'Show All'}
            </button>
          </div>
        </div>
      </div>

      <!-- Equities Detailed Table -->
      <div class="gv-card">
        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Ticker / Asset</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume</th>
                <th>P/E</th>
                <th>Div Yield</th>
                <th>Beta</th>
                <th>7-Day Trend</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(s => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <button onclick="toggleWatchlistTicker('${s.symbol}')" style="color: ${AppState.watchlist.includes(s.symbol) ? '#f59e0b' : 'var(--text-dim)'};">
                        ${AppState.watchlist.includes(s.symbol) ? '★' : '☆'}
                      </button>
                      <div>
                        <div style="font-weight: 700; color: #fff;">${s.symbol}</div>
                        <div style="font-size: 0.75rem; color: var(--text-dim);">${s.name} &bull; ${s.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-weight: 700; color: #fff;">$${s.currentPrice.toFixed(2)}</td>
                  <td style="font-weight: 700; color: ${s.changePct >= 0 ? 'var(--accent-green-light)' : '#f87171'};">
                    ${s.changePct >= 0 ? '+' : ''}${s.changePct}%
                  </td>
                  <td style="color: var(--text-muted);">${s.marketCap}</td>
                  <td style="color: var(--text-muted);">${s.volume}</td>
                  <td style="color: var(--text-muted);">${s.pe > 0 ? s.pe : 'N/A'}</td>
                  <td style="color: var(--text-muted);">${s.divYield}</td>
                  <td style="color: var(--text-muted);">${s.beta}</td>
                  <td>${renderSparkline(s.sparkline, s.changePct >= 0)}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-primary btn-sm" onclick="openStockOrderModal('${s.symbol}')">Trade</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 6. CRYPTO TRADING VIEW
// -------------------------------------------------------------
function getCryptoView() {
  const crypto = window.gvPricing.getCrypto();
  const f = AppState.cryptoFilter;

  // Filter & sort
  let list = crypto.filter(c => {
    if (f.category !== 'all' && !c.category.toLowerCase().includes(f.category.toLowerCase())) return false;
    if (f.search && !c.symbol.toLowerCase().includes(f.search.toLowerCase()) && !c.name.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Crypto Trading Suite</h2>
        <span class="badge badge-amber">Layer 1s, DeFi &amp; TVL</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-primary btn-sm" onclick="openCryptoTradeModal('BTC')">Instant Swap</button>
      </div>
    </div>

    <div class="app-container">
      <!-- Crypto Heatmap Grid -->
      <div class="gv-card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.2rem;">Cryptocurrency Market Heatmap</h3>
            <p style="font-size: 0.85rem; margin-top: 2px;">Live price variation and dominance metrics for top global digital assets.</p>
          </div>
          <span class="badge badge-amber">24H Dynamic</span>
        </div>

        <div class="heatmap-grid">
          ${crypto.map(c => {
            const chg = c.changePct;
            const cls = chg > 1.0 ? 'up-heavy' : chg > 0 ? 'up-mod' : chg < -1.0 ? 'down-heavy' : 'down-mod';
            return `
              <div class="heatmap-cell ${cls}" onclick="openCryptoTradeModal('${c.symbol}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="font-size: 1.05rem;">${c.symbol}</strong>
                  <span style="font-size: 0.72rem; opacity: 0.85;">${c.dominance}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                  <div style="font-size: 0.85rem; font-weight: 700;">$${c.currentPrice < 1 ? c.currentPrice.toFixed(4) : c.currentPrice.toLocaleString()}</div>
                  <div style="font-size: 0.78rem; font-weight: 800;">${chg >= 0 ? '+' : ''}${chg}%</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="gv-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Search Crypto</label>
            <input type="text" placeholder="BTC, ETH, Solana..." value="${f.search}" oninput="handleCryptoSearch(this.value)" />
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Category</label>
            <select onchange="handleCryptoCategoryFilter(this.value)">
              <option value="all" ${f.category === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Layer 1" ${f.category === 'Layer 1' ? 'selected' : ''}>Layer 1 Blockchains</option>
              <option value="Ethereum L2" ${f.category === 'Ethereum L2' ? 'selected' : ''}>Ethereum L2 Rollups</option>
              <option value="DeFi" ${f.category === 'DeFi' ? 'selected' : ''}>DeFi Protocols</option>
              <option value="Stablecoin" ${f.category === 'Stablecoin' ? 'selected' : ''}>USD Stablecoins</option>
              <option value="Memecoin" ${f.category === 'Memecoin' ? 'selected' : ''}>Community &amp; Memecoins</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Crypto Table -->
      <div class="gv-card">
        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Digital Asset</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>24h Volume</th>
                <th>Dominance</th>
                <th>Total Value Locked</th>
                <th>Category</th>
                <th>Sparkline</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div>
                        <div style="font-weight: 700; color: #fff;">${c.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-dim);">${c.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-weight: 700; color: #fff;">$${c.currentPrice < 1 ? c.currentPrice.toFixed(5) : c.currentPrice.toLocaleString()}</td>
                  <td style="font-weight: 700; color: ${c.changePct >= 0 ? 'var(--accent-green-light)' : '#f87171'};">
                    ${c.changePct >= 0 ? '+' : ''}${c.changePct}%
                  </td>
                  <td style="color: var(--text-muted);">${c.marketCap}</td>
                  <td style="color: var(--text-muted);">${c.volume}</td>
                  <td style="color: var(--text-muted);">${c.dominance}</td>
                  <td style="color: var(--text-muted);">${c.tvl}</td>
                  <td><span class="badge badge-purple">${c.category}</span></td>
                  <td>${renderSparkline(c.sparkline, c.changePct >= 0)}</td>
                  <td style="text-align: right;">
                    <button class="btn btn-primary btn-sm" onclick="openCryptoTradeModal('${c.symbol}')">Trade</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 7. PROPERTIES VIEW
// -------------------------------------------------------------
function getPropertiesView() {
  const props = window.gvPricing.getProperties();
  const saved = window.gvStore.getSavedProperties();
  const f = AppState.propertyFilter;

  const filtered = props.filter(p => {
    if (f.type !== 'all' && p.type !== f.type) return false;
    if (f.savedOnly && !saved.includes(p.id)) return false;
    if (f.beds !== 'all' && p.beds !== Number(f.beds)) return false;
    if (f.maxPrice && p.price > Number(f.maxPrice)) return false;
    if (f.search && !p.name.toLowerCase().includes(f.search.toLowerCase()) && !p.city.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Properties &amp; Real Estate Hub</h2>
        <span class="badge badge-cyan">Mortgages, Rentals, Stays &amp; REITs</span>
      </div>
      <div class="topbar-right">
        <button class="btn ${f.savedOnly ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="toggleSavedPropertiesFilter()">
          ${f.savedOnly ? 'Viewing Saved (' + saved.length + ')' : 'Saved Properties (' + saved.length + ')'}
        </button>
      </div>
    </div>

    <div class="app-container">
      <!-- Search & Filters -->
      <div class="gv-card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Search City or Name</label>
            <input type="text" placeholder="Manhattan, Malibu, Aspen..." value="${f.search}" oninput="handlePropertySearch(this.value)" />
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Property Type</label>
            <select onchange="handlePropertyTypeFilter(this.value)">
              <option value="all" ${f.type === 'all' ? 'selected' : ''}>All Property Types</option>
              <option value="Mortgages" ${f.type === 'Mortgages' ? 'selected' : ''}>Mortgages</option>
              <option value="Rental spaces" ${f.type === 'Rental spaces' ? 'selected' : ''}>Rental Spaces</option>
              <option value="Short-term stays" ${f.type === 'Short-term stays' ? 'selected' : ''}>Short-Term Stays</option>
              <option value="REITs" ${f.type === 'REITs' ? 'selected' : ''}>REIT Portfolios</option>
              <option value="Sale Properties" ${f.type === 'Sale Properties' ? 'selected' : ''}>Sale Properties</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Bedrooms</label>
            <select onchange="handlePropertyBedsFilter(this.value)">
              <option value="all" ${f.beds === 'all' ? 'selected' : ''}>Any Beds</option>
              <option value="2" ${f.beds === '2' ? 'selected' : ''}>2 Beds</option>
              <option value="3" ${f.beds === '3' ? 'selected' : ''}>3 Beds</option>
              <option value="4" ${f.beds === '4' ? 'selected' : ''}>4 Beds</option>
              <option value="5" ${f.beds === '5' ? 'selected' : ''}>5+ Beds</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Max Price ($)</label>
            <input type="number" placeholder="e.g. 5000000" value="${f.maxPrice}" oninput="handlePropertyMaxPrice(this.value)" />
          </div>
        </div>
      </div>

      <!-- Properties Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.75rem;">
        ${filtered.map(p => {
          const isSaved = saved.includes(p.id);
          return `
            <div class="gv-card gv-card-glow" style="padding: 0; display: flex; flex-direction: column; overflow: hidden;">
              <!-- Property Visual Image (Unique Real File) -->
              <div style="position: relative; height: 220px; overflow: hidden; background: #0b1324;">
                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                <button onclick="handleToggleSaveProperty('${p.id}')" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                  ${isSaved ? ICONS.heartFill : ICONS.heart}
                </button>
                <div style="position: absolute; bottom: 12px; left: 12px;">
                  <span class="badge ${p.type === 'REITs' ? 'badge-amber' : p.type === 'Short-term stays' ? 'badge-purple' : 'badge-green'}">${p.type}</span>
                </div>
              </div>

              <!-- Property Content -->
              <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
                    <h3 style="font-size: 1.25rem; color: #fff;">${p.name}</h3>
                    <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-green-light);">
                      ${p.reitPrice ? `$${p.reitPrice.toFixed(2)} / sh` : formatCurrency(p.price)}
                    </div>
                  </div>
                  <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                    ${p.address}, ${p.city}, ${p.state}
                  </div>
                  <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;">
                    ${p.description}
                  </p>

                  <!-- Specs Grid -->
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 0.65rem 0.75rem; margin-bottom: 1.25rem; font-size: 0.78rem; text-align: center;">
                    ${p.beds ? `
                      <div><div style="color: var(--text-dim);">BEDS</div><strong style="color: #fff;">${p.beds}</strong></div>
                      <div><div style="color: var(--text-dim);">BATHS</div><strong style="color: #fff;">${p.baths}</strong></div>
                      <div><div style="color: var(--text-dim);">SQFT</div><strong style="color: #fff;">${p.sqft.toLocaleString()}</strong></div>
                    ` : `
                      <div><div style="color: var(--text-dim);">DIV YIELD</div><strong style="color: var(--accent-amber);">${p.reitYield}</strong></div>
                      <div><div style="color: var(--text-dim);">STATUS</div><strong style="color: #fff;">Liquid REIT</strong></div>
                      <div><div style="color: var(--text-dim);">PORTFOLIO</div><strong style="color: #fff;">Tech Infra</strong></div>
                    `}
                  </div>
                </div>

                <div style="display: flex; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
                  <button class="btn btn-secondary btn-sm btn-block" onclick="openPropertyDetailModal('${p.id}')">View Details &amp; Costs</button>
                  <button class="btn btn-primary btn-sm btn-block" onclick="openMatchGoalModal('${p.id}')">Match to Goal</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 8. SHOP / MARKETPLACE VIEW
// -------------------------------------------------------------
function getShopView() {
  const products = window.gvPricing.getShopProducts();
  const f = AppState.shopFilter;

  const filtered = products.filter(p => {
    if (f.category !== 'all' && p.category !== f.category) return false;
    if (f.search && !p.name.toLowerCase().includes(f.search.toLowerCase()) && !p.description.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Electric Vehicles &amp; Frontier Tech Shop</h2>
        <span class="badge badge-green">Tesla EVs, Humanoids, Wearables &amp; Energy</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('cart')">
          ${ICONS.shoppingBag} Cart (${AppState.cart.reduce((s, i) => s + i.quantity, 0)})
        </button>
      </div>
    </div>

    <div class="app-container">
      <!-- Category Chips -->
      <div style="display: flex; gap: 0.75rem; overflow-x: auto; scrollbar-width: none; margin-bottom: 1.5rem; padding-bottom: 0.5rem;">
        ${[
          { label: 'All Products', val: 'all' },
          { label: 'Electric Vehicles', val: 'Electric Vehicles' },
          { label: 'Humanoid Robots', val: 'Humanoid Robots' },
          { label: 'Wearables', val: 'Wearables' },
          { label: 'Apparel', val: 'Apparel' },
          { label: 'Emerging Tech', val: 'Emerging Tech' }
        ].map(cat => `
          <button class="btn ${f.category === cat.val ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="handleShopCategory('${cat.val}')">
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Search Bar -->
      <div class="gv-card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <input type="text" placeholder="Search Model S, Cybertruck, Optimus robot, kinetic watches, solar battery..." value="${f.search}" oninput="handleShopSearch(this.value)" />
      </div>

      <!-- Product Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem;">
        ${filtered.map(p => `
          <div class="gv-card gv-card-glow" style="padding: 0; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Real Visual Image -->
            <div style="position: relative; height: 230px; overflow: hidden; background: #0b1324;">
              <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 12px; left: 12px;">
                <span class="badge ${p.isReservation ? 'badge-purple' : 'badge-green'}">${p.category}</span>
              </div>
              ${p.isReservation ? `
                <div style="position: absolute; bottom: 12px; right: 12px;">
                  <span class="badge badge-amber">Reservation &bull; Deposit $${p.deposit.toLocaleString()}</span>
                </div>
              ` : ''}
            </div>

            <!-- Product Body -->
            <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                  <h3 style="font-size: 1.25rem; color: #fff;">${p.name}</h3>
                  <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(p.price)}</div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; margin-bottom: 0.75rem;">
                  <span style="color: #f59e0b;">★ ${p.rating}</span>
                  <span style="color: var(--text-dim);">(${p.reviews} verified reviews)</span>
                </div>

                <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;">
                  ${p.description}
                </p>

                <!-- Specs snippets -->
                <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; margin-bottom: 1.25rem; font-size: 0.78rem;">
                  ${Object.entries(p.specs || {}).slice(0, 2).map(([k, v]) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                      <span style="color: var(--text-dim);">${k}:</span>
                      <strong style="color: #fff;">${v}</strong>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
                <button class="btn btn-secondary btn-sm btn-block" onclick="openProductDetailModal('${p.id}')">View Specs</button>
                <button class="btn btn-primary btn-sm btn-block" onclick="handleAddToCart('${p.id}')">
                  ${p.isReservation ? 'Reserve Deposit' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 9. CART & CHECKOUT VIEW
// -------------------------------------------------------------
function getCartView() {
  const cart = AppState.cart;
  const recentOrders = window.gvStore.getOrders();

  let dueToday = 0;
  let balanceOnDelivery = 0;
  let shippingCost = cart.length > 0 ? 45.00 : 0;

  cart.forEach(item => {
    if (item.product.isReservation) {
      dueToday += item.product.deposit * item.quantity;
      balanceOnDelivery += (item.product.price - item.product.deposit) * item.quantity;
    } else {
      dueToday += item.product.price * item.quantity;
    }
  });

  const totalDueToday = dueToday + (cart.length > 0 ? shippingCost : 0);

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Cart &amp; Order Checkout</h2>
        <span class="badge badge-green">${cart.length} Cart Items</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('shop')">Continue Shopping</button>
      </div>
    </div>

    <div class="app-container">
      ${cart.length === 0 ? `
        <!-- Empty Cart + Recent Orders View -->
        <div class="gv-card" style="text-align: center; padding: 3rem 1.5rem; margin-bottom: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-green);">${ICONS.shoppingBag}</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Your GoalVest Cart is Empty</h3>
          <p style="max-width: 500px; margin: 0 auto 1.5rem;">
            Explore our electric vehicle reservations, humanoid robotics, kinetic timepieces, or energy storage hardware.
          </p>
          <button class="btn btn-primary btn-lg" onclick="navigateTo('shop')">EXPLORE MARKETPLACE</button>
        </div>

        <!-- Recent Orders Table -->
        ${recentOrders.length > 0 ? `
          <div class="gv-card">
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">Recent Orders &amp; Reservations</h3>
            <div class="table-responsive">
              <table class="gv-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Delivery Contact</th>
                    <th>Due Today</th>
                    <th>Balance on Delivery</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentOrders.map(o => `
                    <tr>
                      <td style="font-weight: 700; color: #fff;">${o.orderId}</td>
                      <td style="color: var(--text-muted);">${o.date}</td>
                      <td>${o.contactName} (${o.city}, ${o.state})</td>
                      <td style="font-weight: 700; color: var(--accent-green-light);">${formatCurrency(o.dueToday)}</td>
                      <td style="color: var(--text-muted);">${formatCurrency(o.balanceOnDelivery)}</td>
                      <td><span class="badge badge-cyan">${o.paymentMethod}</span></td>
                      <td><span class="badge badge-green">Confirmed</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      ` : `
        <!-- Active Cart + Full Checkout Form -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 2rem;">
          <!-- Left: Cart Items -->
          <div>
            <div class="gv-card" style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.2rem;">Review Selected Items</h3>
                <button class="btn btn-secondary btn-sm" onclick="handleClearCart()">Clear Cart</button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${cart.map((item, idx) => `
                  <div style="display: flex; gap: 1rem; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
                    <img src="${item.product.image}" alt="${item.product.name}" style="width: 80px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: #fff; font-size: 1.05rem;">${item.product.name}</div>
                      <div style="font-size: 0.8rem; color: var(--text-dim);">Variant: <strong style="color: #fff;">${item.variant}</strong></div>
                      ${item.product.isReservation ? `
                        <div style="font-size: 0.78rem; color: var(--accent-amber); margin-top: 2px;">
                          Reservation Deposit: $${item.product.deposit.toLocaleString()} (Total MSRP: ${formatCurrency(item.product.price)})
                        </div>
                      ` : ''}
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: 800; color: var(--accent-green-light); font-size: 1.1rem;">
                        ${formatCurrency(item.product.isReservation ? item.product.deposit * item.quantity : item.product.price * item.quantity)}
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; justify-content: flex-end;">
                        <button class="btn btn-secondary btn-sm" style="padding: 2px 8px;" onclick="handleUpdateCartQty(${idx}, -1)">-</button>
                        <span style="font-weight: 700;">${item.quantity}</span>
                        <button class="btn btn-secondary btn-sm" style="padding: 2px 8px;" onclick="handleUpdateCartQty(${idx}, 1)">+</button>
                        <button onclick="handleRemoveCartItem(${idx})" style="color: #f87171; margin-left: 0.5rem;">${ICONS.trash}</button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Checkout Flow Form -->
          <div>
            <div class="gv-card">
              <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Complete Checkout</h3>
              
              <form onsubmit="handleCompleteCheckout(event)">
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Contact Full Name</label>
                    <input type="text" id="checkout-name" value="${AppState.currentUser?.name || 'Alex Rivers'}" required />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Email Address</label>
                      <input type="email" id="checkout-email" value="${AppState.currentUser?.email || 'alex@rivers.capital'}" required />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Phone Number</label>
                      <input type="tel" id="checkout-phone" value="+1 (555) 384-9921" required />
                    </div>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Delivery Address</label>
                    <input type="text" id="checkout-address" value="530 W 56th St, Penthouse 48" required />
                  </div>

                  <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 0.75rem;">
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">City</label>
                      <input type="text" id="checkout-city" value="Manhattan" required />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">State</label>
                      <input type="text" id="checkout-state" value="NY" required />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">ZIP Code</label>
                      <input type="text" id="checkout-zip" value="10019" required />
                    </div>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Payment Method</label>
                    <select id="checkout-payment-method">
                      <option value="GoalVest Available Wallet Balance">GoalVest Available Wallet (${formatCurrency(AppState.currentUser?.wallet?.availableBalance || 0)})</option>
                      <option value="Bank Wire / Automated Clearing">Direct Bank Wire / ACH</option>
                      <option value="USDC / USDT Digital Currency">USDC / USDT (ERC-20)</option>
                    </select>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Order Notes / Reference</label>
                    <input type="text" id="checkout-notes" placeholder="Delivery gate codes or special handling instructions" />
                  </div>
                </div>

                <!-- Financial Calculation Summary Box -->
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Cart Subtotal (Due Now)</span>
                    <strong style="color: #fff;">${formatCurrency(dueToday)}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Expedited White-Glove Shipping</span>
                    <strong style="color: #fff;">${formatCurrency(shippingCost)}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 0.65rem; border-top: 1px solid var(--border-subtle); margin-bottom: 0.75rem;">
                    <span style="font-weight: 700; color: #fff;">DUE TODAY TOTAL</span>
                    <strong style="font-size: 1.35rem; color: var(--accent-green-light);">${formatCurrency(totalDueToday)}</strong>
                  </div>
                  ${balanceOnDelivery > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px dashed var(--border-subtle); font-size: 0.85rem; color: var(--accent-amber);">
                      <span>Balance on Delivery / Production:</span>
                      <strong>${formatCurrency(balanceOnDelivery)}</strong>
                    </div>
                  ` : ''}
                </div>

                <button type="submit" class="btn btn-primary btn-lg btn-block">COMPLETE CHECKOUT</button>
              </form>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

// -------------------------------------------------------------
// 10. SIMULATOR VIEW
// -------------------------------------------------------------
function getSimulatorView() {
  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Wealth &amp; Contribution Simulator</h2>
        <span class="badge badge-green">Algorithmic Projections</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('goals')">Apply to My Goal</button>
      </div>
    </div>

    <div class="app-container">
      <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 2rem;">
        <!-- Left: Contribution Inputs -->
        <div class="gv-card">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Simulation Parameters</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Starting Capital ($)</label>
              <input type="number" id="sim-start" min="100" max="10000000" step="500" value="10000" oninput="updateSimulation()" placeholder="10000" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Monthly Contribution ($)</label>
              <input type="number" id="sim-monthly" min="0" max="250000" step="50" value="1500" oninput="updateSimulation()" placeholder="1500" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Expected Annual Return (% APY)</label>
              <input type="number" id="sim-return" min="1" max="50" step="0.1" value="10.5" oninput="updateSimulation()" placeholder="10.5" />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Horizon Timeline (Years)</label>
              <input type="number" id="sim-years" min="1" max="50" step="1" value="10" oninput="updateSimulation()" placeholder="10" />
            </div>
          </div>
        </div>

        <!-- Right: Real-Time Projection Output -->
        <div class="gv-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Projected Future Wealth</h3>
            
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Estimated Portfolio Value</div>
              <div id="sim-total-result" style="font-size: 2.75rem; font-weight: 900; color: var(--accent-green-light); margin: 0.5rem 0;">$338,412</div>
              <div id="sim-breakdown" style="font-size: 0.88rem; color: var(--text-muted);">Total Principal Contributed: $190,000 &bull; Compound Earnings: +$148,412</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
              <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
                <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Starting Capital</div>
                <div id="sim-summary-start" style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-top: 4px;">$10,000</div>
              </div>
              <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
                <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Monthly Deposits</div>
                <div id="sim-summary-monthly" style="font-size: 1.2rem; font-weight: 800; color: var(--accent-green-light); margin-top: 4px;">$1,500/mo</div>
              </div>
              <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
                <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Return Rate</div>
                <div id="sim-summary-return" style="font-size: 1.2rem; font-weight: 800; color: var(--accent-cyan-light); margin-top: 4px;">10.5% APY</div>
              </div>
            </div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md); padding: 1rem; font-size: 0.85rem; color: var(--text-muted);">
            <strong style="color: #fff;">Insight:</strong> Increasing your monthly contribution by just $250 adds an estimated <span style="color: var(--accent-green-light); font-weight: 700;">$54,200</span> in net terminal wealth over this horizon.
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 11. ACTIVITY VIEW
// -------------------------------------------------------------
function getActivityView() {
  const acts = window.gvStore.getActivity();
  const user = AppState.currentUser;
  const f = AppState.activityFilter;

  // Filter by user if not admin
  const userActs = AppState.isAdmin
    ? acts
    : acts.filter(a => !a.username || (user && a.username.toLowerCase() === user.username.toLowerCase()));

  const filtered = userActs.filter(a => {
    if (f.category !== 'all' && a.category !== f.category) return false;
    if (f.search && !a.title.toLowerCase().includes(f.search.toLowerCase()) && !a.type.toLowerCase().includes(f.search.toLowerCase())) return false;
    return true;
  });

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Activity Ledger</h2>
        <span class="badge badge-green">Immutable Transaction Records</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary btn-sm" onclick="showToast('Export Ready', 'Activity statement generated as CSV ledger.', 'info')">Export CSV</button>
      </div>
    </div>

    <div class="app-container">
      <div class="gv-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
          <input type="text" placeholder="Search transactions, wires, dividends, rebalances..." value="${f.search}" oninput="handleActivitySearch(this.value)" />
          <select onchange="handleActivityCategoryFilter(this.value)">
            <option value="all" ${f.category === 'all' ? 'selected' : ''}>All Categories</option>
            <option value="Deposit" ${f.category === 'Deposit' ? 'selected' : ''}>Deposits</option>
            <option value="Investment" ${f.category === 'Investment' ? 'selected' : ''}>Investments</option>
            <option value="Earnings" ${f.category === 'Earnings' ? 'selected' : ''}>Earnings &amp; Dividends</option>
            <option value="Payment" ${f.category === 'Payment' ? 'selected' : ''}>Payments &amp; Transfers</option>
            <option value="Rebalance" ${f.category === 'Rebalance' ? 'selected' : ''}>Rebalances &amp; Adjustments</option>
          </select>
        </div>
      </div>

      <div class="gv-card">
        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Account</th>
                <th>Type</th>
                <th>Transaction Title</th>
                <th>Category</th>
                <th>Settlement Date</th>
                <th>Status</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(a => `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim);">${a.id}</td>
                  <td style="font-weight: 600; color: #fff;">@${a.username || 'System'}</td>
                  <td><span class="badge ${a.amount >= 0 ? 'badge-green' : 'badge-blue'}">${a.type}</span></td>
                  <td style="font-weight: 700; color: #fff;">${a.title}</td>
                  <td>${a.category}</td>
                  <td style="color: var(--text-muted);">${a.date}</td>
                  <td><span class="badge badge-green">${a.status}</span></td>
                  <td style="text-align: right; font-weight: 800; color: ${a.amount > 0 ? 'var(--accent-green-light)' : a.amount < 0 ? '#fff' : 'var(--text-muted)'};">
                    ${a.amount !== 0 ? (a.amount > 0 ? '+' : '') + formatCurrency(a.amount) : 'Settled'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 12. SETTINGS VIEW
// -------------------------------------------------------------
function getSettingsView() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Account Settings &amp; Preferences</h2>
        <span class="badge badge-cyan">${user.plan} Member</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-primary btn-sm" onclick="handleSaveUserSettings()">Save Changes</button>
      </div>
    </div>

    <div class="app-container">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- Left: Profile Info -->
        <div class="gv-card">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Personal Profile</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Legal Full Name</label>
              <input type="text" id="setting-name" value="${user.name}" />
            </div>

            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Registered Username</label>
              <input type="text" id="setting-username" value="${user.username}" disabled style="opacity: 0.6; cursor: not-allowed;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Email Address</label>
              <input type="email" id="setting-email" value="${user.email}" />
            </div>

            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Active Goal Tier Plan</label>
              <select id="setting-plan">
                <option value="Starter" ${user.plan === 'Starter' ? 'selected' : ''}>Starter Tier ($100 – $999)</option>
                <option value="Builder" ${user.plan === 'Builder' ? 'selected' : ''}>Builder Tier ($1,000 – $9,999)</option>
                <option value="Growth" ${user.plan === 'Growth' ? 'selected' : ''}>Growth Tier ($10,000 – $49,999)</option>
                <option value="Premium" ${user.plan === 'Premium' ? 'selected' : ''}>Premium Tier ($50,000 – $249,999)</option>
                <option value="Wealth" ${user.plan === 'Wealth' ? 'selected' : ''}>Wealth Tier ($250,000 – $999,999)</option>
                <option value="Private" ${user.plan === 'Private' ? 'selected' : ''}>Private Tier ($1,000,000 – $10,000,000)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Risk Profile</label>
              <select id="setting-risk">
                <option value="Conservative" ${user.riskProfile === 'Conservative' ? 'selected' : ''}>Conservative (Capital Preservation)</option>
                <option value="Balanced" ${user.riskProfile === 'Balanced' ? 'selected' : ''}>Balanced (Core ETF &amp; Real Estate)</option>
                <option value="Growth" ${user.riskProfile === 'Growth' ? 'selected' : ''}>Growth (Tech Equities &amp; Autonomy)</option>
                <option value="Aggressive" ${user.riskProfile === 'Aggressive' ? 'selected' : ''}>Aggressive (High-Conviction Equities &amp; Crypto)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Right: Automation Toggles -->
        <div class="gv-card">
          <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Automations &amp; Security</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <div>
                <div style="font-weight: 700; color: #fff;">Auto-Invest Monthly Contributions</div>
                <div style="font-size: 0.8rem; color: var(--text-dim);">Automatically execute goal contributions from available wallet balance.</div>
              </div>
              <input type="checkbox" id="setting-autoinvest" ${user.autoInvest ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: var(--accent-green);" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <div>
                <div style="font-weight: 700; color: #fff;">Round-Ups on Purchases</div>
                <div style="font-size: 0.8rem; color: var(--text-dim);">Round up shop orders to the nearest $10 and sweep spare change to goals.</div>
              </div>
              <input type="checkbox" id="setting-roundups" ${user.roundUps ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: var(--accent-green);" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
              <div>
                <div style="font-weight: 700; color: #fff;">Instant Push Notifications</div>
                <div style="font-size: 0.8rem; color: var(--text-dim);">Receive updates for admin deposits, wire authentications, and price alerts.</div>
              </div>
              <input type="checkbox" id="setting-notifications" ${user.notifications ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: var(--accent-green);" />
            </div>

            <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
              <button class="btn btn-primary btn-block" onclick="handleSaveUserSettings()">SAVE ALL PREFERENCES</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
