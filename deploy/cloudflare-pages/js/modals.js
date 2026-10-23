/**
 * GoalVest Modals and Action Handlers
 * Covers Goal CRUD, Wallet Deposits/Withdrawals, User-to-User Transfers,
 * Admin Adjustments, Product/Property Modals, Trades, and Cart logic.
 */

// Global active chat user for Admin Desk
let currentAdminChatTarget = "AlexRivers";

// -------------------------------------------------------------
// MODAL RENDERERS
// -------------------------------------------------------------

function openGeneralModal(htmlContent, isLarge = false) {
  const backdrop = document.getElementById('general-modal');
  const card = document.getElementById('general-modal-card');
  if (!backdrop || !card) return;
  card.className = `modal-card ${isLarge ? 'modal-card-lg' : ''}`;
  card.innerHTML = htmlContent;
  backdrop.classList.add('open');
}

function closeGeneralModal() {
  const backdrop = document.getElementById('general-modal');
  if (backdrop) backdrop.classList.remove('open');
}

// -------------------------------------------------------------
// 1. GOAL CREATION, EDIT & DETAIL MODALS
// -------------------------------------------------------------
function openCreateGoalModal() {
  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Create New Financial Goal</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleCreateGoalSubmit(event)">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Goal Name</label>
          <input type="text" id="goal-name" placeholder="e.g. Model S Plaid Fund, Malibu Villa Down Payment" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Target Amount ($100 - $10M)</label>
            <input type="number" id="goal-target" min="100" max="10000000" step="50" placeholder="100000" required oninput="updateGoalTierPreview(this.value)" />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Initial Contribution ($)</label>
            <input type="number" id="goal-current" min="0" step="50" placeholder="5000" required />
          </div>
        </div>

        <!-- Calculated Tier Preview Banner -->
        <div id="goal-tier-preview" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--accent-green-light); font-weight: 600;">
          Assigned Tier: Premium Tier ($50,000 – $249,999)
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Monthly Contribution ($)</label>
            <input type="number" id="goal-monthly" min="10" step="10" placeholder="1500" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Target Date</label>
            <input type="date" id="goal-date" value="2028-12-31" required />
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Risk Profile</label>
          <select id="goal-risk">
            <option value="Conservative">Conservative (Capital Preservation focus)</option>
            <option value="Balanced">Balanced (Core Equities &amp; High Yield)</option>
            <option value="Growth" selected>Growth (Tech Equities, REITs &amp; EV Fund)</option>
            <option value="Aggressive">Aggressive (Frontier AI, Robotics &amp; Crypto)</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">CREATE GOAL</button>
      </div>
    </form>
  `);
}

function updateGoalTierPreview(val) {
  const el = document.getElementById('goal-tier-preview');
  if (!el) return;
  const num = Number(val) || 0;
  const tier = getTierForAmount(num);
  let range = "$100 – $999";
  if (tier === 'Builder') range = "$1,000 – $9,999";
  if (tier === 'Growth') range = "$10,000 – $49,999";
  if (tier === 'Premium') range = "$50,000 – $249,999";
  if (tier === 'Wealth') range = "$250,000 – $999,999";
  if (tier === 'Private') range = "$1,000,000 – $10,000,000";

  el.innerHTML = `Assigned Tier: <strong style="color: #fff;">${tier} Tier (${range})</strong>`;
}

function handleCreateGoalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('goal-name').value;
  const target = Number(document.getElementById('goal-target').value);
  const current = Number(document.getElementById('goal-current').value);
  const monthly = Number(document.getElementById('goal-monthly').value);
  const date = document.getElementById('goal-date').value;
  const risk = document.getElementById('goal-risk').value;

  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const tier = getTierForAmount(target);

  const newGoal = {
    id: `goal-${Date.now()}`,
    name,
    targetAmount: target,
    currentAmount: current,
    monthlyContribution: monthly,
    targetDate: date,
    riskProfile: risk,
    allocation: { "US Equity": 50, "Emerging Tech": 30, "Cash": 20 },
    tier
  };

  user.goals.push(newGoal);
  window.gvStore.updateUser(user);
  closeGeneralModal();
  showToast('Goal Activated', `Your ${name} goal is live under the ${tier} Tier!`, 'success');
  renderCurrentView();
}

function openEditGoalModal(goalId) {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goal = user.goals.find(g => g.id === goalId);
  if (!goal) return;

  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Edit Goal: ${goal.name}</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleEditGoalSubmit(event, '${goal.id}')">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Goal Name</label>
          <input type="text" id="edit-goal-name" value="${goal.name}" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Target Amount ($100 - $10M)</label>
            <input type="number" id="edit-goal-target" min="100" max="10000000" value="${goal.targetAmount}" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Current Funded ($)</label>
            <input type="number" id="edit-goal-current" min="0" value="${goal.currentAmount}" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Monthly Contribution ($)</label>
            <input type="number" id="edit-goal-monthly" min="10" value="${goal.monthlyContribution}" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Target Date</label>
            <input type="date" id="edit-goal-date" value="${goal.targetDate}" required />
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Risk Profile</label>
          <select id="edit-goal-risk">
            <option value="Conservative" ${goal.riskProfile === 'Conservative' ? 'selected' : ''}>Conservative</option>
            <option value="Balanced" ${goal.riskProfile === 'Balanced' ? 'selected' : ''}>Balanced</option>
            <option value="Growth" ${goal.riskProfile === 'Growth' ? 'selected' : ''}>Growth</option>
            <option value="Aggressive" ${goal.riskProfile === 'Aggressive' ? 'selected' : ''}>Aggressive</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
      </div>
    </form>
  `);
}

function handleEditGoalSubmit(e, goalId) {
  e.preventDefault();
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goal = user.goals.find(g => g.id === goalId);
  if (!goal) return;

  goal.name = document.getElementById('edit-goal-name').value;
  goal.targetAmount = Number(document.getElementById('edit-goal-target').value);
  goal.currentAmount = Number(document.getElementById('edit-goal-current').value);
  goal.monthlyContribution = Number(document.getElementById('edit-goal-monthly').value);
  goal.targetDate = document.getElementById('edit-goal-date').value;
  goal.riskProfile = document.getElementById('edit-goal-risk').value;
  goal.tier = getTierForAmount(goal.targetAmount);

  window.gvStore.updateUser(user);
  closeGeneralModal();
  showToast('Goal Updated', 'Goal changes saved successfully.', 'success');
  renderCurrentView();
}

function handleDeleteGoal(goalId) {
  if (!confirm("Are you sure you want to delete this goal? Capital will remain in your wallet.")) return;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  user.goals = user.goals.filter(g => g.id !== goalId);
  window.gvStore.updateUser(user);
  showToast('Goal Deleted', 'The selected goal was removed.', 'info');
  renderCurrentView();
}

function openGoalDetailModal(goalId) {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goal = user.goals.find(g => g.id === goalId);
  if (!goal) return;

  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsRemaining = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">${goal.name}</h3>
        <span class="badge badge-green">${goal.tier} Tier &bull; ${goal.riskProfile}</span>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <!-- Big Projection Stat -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Funding Progress</div>
        <div style="font-size: 2.4rem; font-weight: 800; color: var(--accent-green-light); margin: 0.35rem 0;">${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}</div>
        <div style="background: rgba(148, 163, 184, 0.12); border-radius: var(--radius-full); height: 10px; overflow: hidden; margin: 0.75rem auto; max-width: 420px;">
          <div style="width: ${pct}%; background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); height: 100%;"></div>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${pct}% Completed &bull; Est. ${monthsRemaining} months to finish at current pace</div>
      </div>

      <!-- Projections & Expected Returns Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Expected Return</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-green-light); margin-top: 2px;">+11.4% APY</div>
        </div>
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Monthly Deposit</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 2px;">${formatCurrency(goal.monthlyContribution)}</div>
        </div>
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Compound Velocity</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan-light); margin-top: 2px;">High</div>
        </div>
      </div>

      <!-- Allocation Architecture -->
      <div>
        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Goal Asset Allocation</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${Object.entries(goal.allocation || {}).map(([asset, weight]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); padding: 0.65rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
              <span style="color: var(--text-muted);">${asset}</span>
              <strong style="color: #fff;">${weight}% Allocation</strong>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Close</button>
      <button class="btn btn-primary btn-sm" onclick="openFundGoalModal('${goal.id}')">Add Direct Funds</button>
    </div>
  `, true);
}

function openFundGoalModal(goalId) {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goal = user.goals.find(g => g.id === goalId);
  if (!goal) return;

  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Fund Goal: ${goal.name}</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleFundGoalSubmit(event, '${goal.id}')">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-dim);">Available Wallet Balance</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(user.wallet.availableBalance)}</div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Transfer Amount to Goal ($)</label>
          <input type="number" id="fund-goal-amount" min="10" max="${user.wallet.availableBalance}" step="10" placeholder="1000" required autofocus />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">CONFIRM TRANSFER</button>
      </div>
    </form>
  `);
}

function handleFundGoalSubmit(e, goalId) {
  e.preventDefault();
  const amt = Number(document.getElementById('fund-goal-amount').value);
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const goal = user.goals.find(g => g.id === goalId);

  if (amt > user.wallet.availableBalance) {
    showToast('Insufficient Funds', 'Transfer amount exceeds your available wallet balance.', 'error');
    return;
  }

  user.wallet.availableBalance -= amt;
  user.wallet.investmentValue += amt;
  goal.currentAmount += amt;

  window.gvStore.updateUser(user);
  window.gvStore.addActivity({
    id: `act-${Date.now()}`,
    type: "Investment",
    title: `Direct Fund: ${goal.name}`,
    amount: -amt,
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Investment"
  });

  closeGeneralModal();
  showToast('Goal Funded!', `${formatCurrency(amt)} successfully transferred to ${goal.name}.`, 'success');
  renderCurrentView();
}

// -------------------------------------------------------------
// 2. WALLET DEPOSIT & WITHDRAWAL (ADMIN AUTHENTICATED)
// -------------------------------------------------------------
function openDepositModal() {
  const methods = window.gvStore.getDepositMethods();
  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">Deposit Funds</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">Admin provides details; Admin authenticates all deposits.</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleDepositSubmit(event)">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Deposit Method (Provided by Admin)</label>
          <select id="deposit-method" onchange="updateDepositInstructions(this.value)">
            ${methods.map(m => `<option value="${m.name}" data-inst="${m.instructions}">${m.name}</option>`).join('')}
          </select>
        </div>

        <div id="deposit-instructions-box" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; font-size: 0.84rem; color: var(--accent-cyan-light); line-height: 1.5;">
          ${methods[0]?.instructions || 'Select a deposit method above'}
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Deposit Amount ($)</label>
          <input type="number" id="deposit-amount" min="50" step="50" placeholder="e.g. 15000" required />
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Bank Wire Reference / TX Hash / Receipt</label>
          <input type="text" id="deposit-details" placeholder="e.g. Fedwire Reference FED-992384 or TX hash" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">SUBMIT FOR ADMIN AUTHENTICATION</button>
      </div>
    </form>
  `);
}

function updateDepositInstructions(val) {
  const methods = window.gvStore.getDepositMethods();
  const m = methods.find(x => x.name === val);
  const box = document.getElementById('deposit-instructions-box');
  if (box && m) {
    box.innerText = m.instructions;
  }
}

function handleDepositSubmit(e) {
  e.preventDefault();
  const method = document.getElementById('deposit-method').value;
  const amount = Number(document.getElementById('deposit-amount').value);
  const details = document.getElementById('deposit-details').value;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  const reqs = window.gvStore.getPaymentRequests();
  const newReq = {
    id: `req-${Date.now()}`,
    username: user.username,
    type: "Deposit",
    amount,
    method,
    details,
    status: "Pending",
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  reqs.unshift(newReq);
  window.gvStore.savePaymentRequests(reqs);

  closeGeneralModal();
  showToast('Deposit Submitted', `Request for ${formatCurrency(amount)} recorded. Administrator will authenticate and credit your available wallet.`, 'info');
  renderCurrentView();
}

function openWithdrawModal() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">Request Withdrawal</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">User provides withdrawal details; Admin authenticates all payouts.</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleWithdrawSubmit(event)">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-dim);">Available for Payout</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(user.wallet.availableBalance)}</div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Withdrawal Amount ($)</label>
          <input type="number" id="withdraw-amount" min="50" max="${user.wallet.availableBalance}" step="10" placeholder="e.g. 5000" required />
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Payout Destination Details</label>
          <textarea id="withdraw-details" rows="3" placeholder="Bank Name, Routing Number, Account Number, or Crypto ERC-20 Address" required></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">REQUEST WITHDRAWAL</button>
      </div>
    </form>
  `);
}

function handleWithdrawSubmit(e) {
  e.preventDefault();
  const amt = Number(document.getElementById('withdraw-amount').value);
  const details = document.getElementById('withdraw-details').value;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  if (amt > user.wallet.availableBalance) {
    showToast('Insufficient Balance', 'Withdrawal amount exceeds your available wallet balance.', 'error');
    return;
  }

  const reqs = window.gvStore.getPaymentRequests();
  const newReq = {
    id: `req-${Date.now()}`,
    username: user.username,
    type: "Withdrawal",
    amount: amt,
    method: "Bank / Wire Payout",
    details,
    status: "Pending",
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  reqs.unshift(newReq);
  window.gvStore.savePaymentRequests(reqs);

  closeGeneralModal();
  showToast('Withdrawal Queued', `Payout request for ${formatCurrency(amt)} submitted for Admin review.`, 'info');
  renderCurrentView();
}

// -------------------------------------------------------------
// 3. USER-TO-USER TRANSFERS
// -------------------------------------------------------------
function openTransferModal() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">User-to-User Wallet Transfer</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">Instant zero-fee transfer to any registered GoalVest username.</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleUserTransferSubmit(event)">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.5rem;">
          <div style="font-size: 0.8rem; color: var(--text-dim);">Your Available Balance</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(user.wallet.availableBalance)}</div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Recipient Registered Username</label>
          <input type="text" id="transfer-recipient" placeholder="Enter recipient username" required />
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Transfer Amount ($)</label>
          <input type="number" id="transfer-amount" min="1" max="${user.wallet.availableBalance}" step="1" placeholder="e.g. 500" required />
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Memo / Transfer Note</label>
          <input type="text" id="transfer-memo" placeholder="For project co-investment, shared deposit..." />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">SEND TRANSFER</button>
      </div>
    </form>
  `);
}

function handleUserTransferSubmit(e) {
  e.preventDefault();
  const recipientUsername = document.getElementById('transfer-recipient').value.trim();
  const amt = Number(document.getElementById('transfer-amount').value);
  const memo = document.getElementById('transfer-memo').value || 'User transfer';
  const sender = AppState.currentUser || window.gvStore.getUsers()[0];

  if (recipientUsername.toLowerCase() === sender.username.toLowerCase()) {
    showToast('Invalid Recipient', 'You cannot transfer funds to yourself.', 'error');
    return;
  }

  const recipient = window.gvStore.getUser(recipientUsername);
  if (!recipient) {
    showToast('Recipient Not Found', `No registered user found under "@${recipientUsername}". Please check username.`, 'error');
    return;
  }

  if (amt > sender.wallet.availableBalance) {
    showToast('Insufficient Balance', 'Transfer exceeds your available wallet balance.', 'error');
    return;
  }

  // Execute transfer
  sender.wallet.availableBalance -= amt;
  recipient.wallet.availableBalance += amt;

  window.gvStore.updateUser(sender);
  window.gvStore.updateUser(recipient);

  // Record activities
  window.gvStore.addActivity({
    id: `act-${Date.now()}`,
    type: "Transfer",
    title: `Transfer to @${recipient.username} (${memo})`,
    amount: -amt,
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Payment"
  });

  closeGeneralModal();
  showToast('Transfer Complete!', `Successfully sent ${formatCurrency(amt)} to @${recipient.username}.`, 'success');
  renderCurrentView();
}

// -------------------------------------------------------------
// 4. ADMIN DESK: WALLET ADJUSTMENT & PAYMENT AUTH
// -------------------------------------------------------------
function openAdminAdjustWalletModal(username) {
  const user = window.gvStore.getUser(username);
  if (!user) return;

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">Adjust User Wallet: @${user.username}</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">Direct add, subtract, or set balances in user dashboard.</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleAdminAdjustWalletSubmit(event, '${user.username}')">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.5rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--text-dim);">Current Available:</span>
            <strong style="color: #fff;">${formatCurrency(user.wallet.availableBalance)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--text-dim);">Investment Value:</span>
            <strong style="color: #fff;">${formatCurrency(user.wallet.investmentValue)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-dim);">Earnings:</span>
            <strong style="color: var(--accent-green-light);">+${formatCurrency(user.wallet.earnings)}</strong>
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Target Wallet Field</label>
          <select id="admin-wallet-field">
            <option value="availableBalance">Available Balance</option>
            <option value="investmentValue">Investment Value</option>
            <option value="earnings">Earnings</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Adjustment Mode</label>
          <select id="admin-wallet-op">
            <option value="add">Add Capital (+)</option>
            <option value="subtract">Subtract Capital (-)</option>
            <option value="set">Set Exact Amount (=)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Amount ($)</label>
          <input type="number" id="admin-wallet-amount" min="0" step="10" placeholder="e.g. 5000" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">APPLY ADJUSTMENT</button>
      </div>
    </form>
  `);
}

function handleAdminAdjustWalletSubmit(e, username) {
  e.preventDefault();
  const user = window.gvStore.getUser(username);
  if (!user) return;

  const field = document.getElementById('admin-wallet-field').value;
  const op = document.getElementById('admin-wallet-op').value;
  const amt = Number(document.getElementById('admin-wallet-amount').value);

  if (op === 'add') {
    user.wallet[field] += amt;
  } else if (op === 'subtract') {
    user.wallet[field] = Math.max(0, user.wallet[field] - amt);
  } else if (op === 'set') {
    user.wallet[field] = amt;
  }

  window.gvStore.updateUser(user);
  closeGeneralModal();
  showToast('Wallet Adjusted', `Updated @${user.username} ${field} to ${formatCurrency(user.wallet[field])}.`, 'success');
  renderCurrentView();
}

function handleAuthenticatePayment(reqId, status) {
  const reqs = window.gvStore.getPaymentRequests();
  const req = reqs.find(r => r.id === reqId);
  if (!req) return;

  req.status = status;
  window.gvStore.savePaymentRequests(reqs);

  // If approved, update user's wallet
  if (status === 'Approved') {
    const user = window.gvStore.getUser(req.username);
    if (user) {
      if (req.type === 'Deposit') {
        user.wallet.availableBalance += req.amount;
        user.wallet.deposits += req.amount;
      } else if (req.type === 'Withdrawal') {
        user.wallet.availableBalance = Math.max(0, user.wallet.availableBalance - req.amount);
        user.wallet.withdrawals += req.amount;
      }
      window.gvStore.updateUser(user);
    }
  }

  showToast('Payment Status Set', `Request ${req.id} set to ${status}.`, 'success');
  renderCurrentView();
}

function handleImpersonateUser(username) {
  const user = window.gvStore.getUser(username);
  if (!user) return;
  AppState.currentUser = user;
  sessionStorage.setItem('gv_current_user', user.username);
  showToast('User Impersonation Active', `Now inspecting @${user.username}'s personal dashboard.`, 'info');
  navigateTo('dashboard');
}

function handleAdminDeleteUser(username) {
  if (!confirm(`Are you sure you want to delete user @${username}?`)) return;
  let users = window.gvStore.getUsers();
  users = users.filter(u => u.username !== username);
  window.gvStore.saveUsers(users);
  showToast('User Deleted', `@${username} removed from system.`, 'info');
  renderCurrentView();
}

function openCreateUserModal() {
  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Create New Registered User</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleAdminCreateUser(event)">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Full Name</label>
          <input type="text" id="admin-user-name" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Username</label>
          <input type="text" id="admin-user-username" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Email</label>
          <input type="email" id="admin-user-email" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Initial Tier</label>
          <select id="admin-user-plan">
            <option value="Starter">Starter</option>
            <option value="Builder">Builder</option>
            <option value="Growth" selected>Growth</option>
            <option value="Premium">Premium</option>
            <option value="Wealth">Wealth</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Password</label>
          <input type="password" id="admin-user-pass" value="Password123!" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">CREATE USER</button>
      </div>
    </form>
  `);
}

function handleAdminCreateUser(e) {
  e.preventDefault();
  const name = document.getElementById('admin-user-name').value;
  const username = document.getElementById('admin-user-username').value.trim();
  const email = document.getElementById('admin-user-email').value;
  const plan = document.getElementById('admin-user-plan').value;
  const pass = document.getElementById('admin-user-pass').value;

  const users = window.gvStore.getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    showToast('Username Exists', 'User already exists.', 'error');
    return;
  }

  users.push({
    username,
    name,
    email,
    password: pass,
    plan,
    riskProfile: 'Growth',
    autoInvest: true,
    roundUps: false,
    notifications: true,
    wallet: {
      availableBalance: 5000,
      investmentValue: 0,
      earnings: 0,
      totalInvested: 0,
      deposits: 5000,
      withdrawals: 0
    },
    goals: []
  });

  window.gvStore.saveUsers(users);
  closeGeneralModal();
  showToast('User Created', `User @${username} is registered and active.`, 'success');
  renderCurrentView();
}

function openEditUserModal(username) {
  const user = window.gvStore.getUser(username);
  if (!user) return;

  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Edit User: @${user.username}</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleAdminEditUser(event, '${user.username}')">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Full Name</label>
          <input type="text" id="edit-user-name" value="${user.name}" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Email</label>
          <input type="email" id="edit-user-email" value="${user.email}" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Plan Tier</label>
          <select id="edit-user-plan">
            <option value="Starter" ${user.plan === 'Starter' ? 'selected' : ''}>Starter</option>
            <option value="Builder" ${user.plan === 'Builder' ? 'selected' : ''}>Builder</option>
            <option value="Growth" ${user.plan === 'Growth' ? 'selected' : ''}>Growth</option>
            <option value="Premium" ${user.plan === 'Premium' ? 'selected' : ''}>Premium</option>
            <option value="Wealth" ${user.plan === 'Wealth' ? 'selected' : ''}>Wealth</option>
            <option value="Private" ${user.plan === 'Private' ? 'selected' : ''}>Private</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">SAVE USER</button>
      </div>
    </form>
  `);
}

function handleAdminEditUser(e, username) {
  e.preventDefault();
  const user = window.gvStore.getUser(username);
  if (!user) return;

  user.name = document.getElementById('edit-user-name').value;
  user.email = document.getElementById('edit-user-email').value;
  user.plan = document.getElementById('edit-user-plan').value;

  window.gvStore.updateUser(user);
  closeGeneralModal();
  showToast('User Updated', `Changes saved for @${username}.`, 'success');
  renderCurrentView();
}

// Announcements CRUD
function openCreateAnnouncementModal() {
  const users = window.gvStore.getUsers();
  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Broadcast New Announcement</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleCreateAnnouncement(event)">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Title</label>
          <input type="text" id="anc-title" placeholder="e.g. Q4 Rebalancing & Dividend Schedule" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Audience Target</label>
          <select id="anc-audience">
            <option value="All users">All Users (Global Broadcast)</option>
            ${users.map(u => `<option value="${u.username}">Specific User: @${u.username}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Priority Level</label>
          <select id="anc-level">
            <option value="General">General Intel</option>
            <option value="Important" selected>Important Advisory</option>
            <option value="Exclusive">Exclusive Tier Notice</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Message Body</label>
          <textarea id="anc-body" rows="4" placeholder="Full announcement statement..." required></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">POST BROADCAST</button>
      </div>
    </form>
  `);
}

function handleCreateAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById('anc-title').value;
  const audience = document.getElementById('anc-audience').value;
  const level = document.getElementById('anc-level').value;
  const body = document.getElementById('anc-body').value;

  const ancs = window.gvStore.getAnnouncements();
  ancs.unshift({
    id: `anc-${Date.now()}`,
    title,
    body,
    audience,
    level,
    author: "Admin",
    createdDate: new Date().toISOString().substring(0, 16).replace('T', ' ')
  });
  window.gvStore.saveAnnouncements(ancs);

  closeGeneralModal();
  showToast('Broadcast Sent', 'Announcement published to target audience.', 'success');
  renderCurrentView();
}

function handleDeleteAnnouncement(ancId) {
  let ancs = window.gvStore.getAnnouncements();
  ancs = ancs.filter(a => a.id !== ancId);
  window.gvStore.saveAnnouncements(ancs);
  showToast('Announcement Removed', 'Broadcast deleted.', 'info');
  renderCurrentView();
}

// Deposit Methods CRUD
function openAddDepositMethodModal() {
  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Add Deposit Method</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleAddDepositMethod(event)">
      <div class="modal-body">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Method Name</label>
          <input type="text" id="method-name" placeholder="e.g. European SEPA Instant Transfer" required />
        </div>
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Payment Instructions &amp; Details</label>
          <textarea id="method-instructions" rows="3" placeholder="IBAN, BIC/SWIFT, Beneficiary name and reference instructions" required></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">ADD METHOD</button>
      </div>
    </form>
  `);
}

function handleAddDepositMethod(e) {
  e.preventDefault();
  const name = document.getElementById('method-name').value;
  const instructions = document.getElementById('method-instructions').value;

  const methods = window.gvStore.getDepositMethods();
  methods.push({
    id: `dep-${Date.now()}`,
    name,
    instructions,
    active: true
  });
  window.gvStore.saveDepositMethods(methods);

  closeGeneralModal();
  showToast('Method Added', 'New deposit channel configured.', 'success');
  renderCurrentView();
}

function handleDeleteDepositMethod(methodId) {
  let methods = window.gvStore.getDepositMethods();
  methods = methods.filter(m => m.id !== methodId);
  window.gvStore.saveDepositMethods(methods);
  showToast('Method Removed', 'Deposit method deleted.', 'info');
  renderCurrentView();
}

// Admin Support Chat
function selectAdminChatUser(username) {
  currentAdminChatTarget = username;
  document.querySelectorAll('.admin-chat-tab').forEach(el => el.style.background = 'transparent');
  const targetTab = document.getElementById(`chat-tab-${username}`);
  if (targetTab) targetTab.style.background = 'var(--bg-tertiary)';

  const header = document.getElementById('admin-chat-header');
  if (header) header.innerText = `Chatting with @${username}`;

  const chats = window.gvStore.getChats().filter(c => c.from === username || c.to === username);
  const box = document.getElementById('admin-chat-box');
  if (box) {
    box.innerHTML = chats.map(c => `
      <div style="align-self: ${c.from === 'Admin' ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${c.from === 'Admin' ? 'linear-gradient(135deg, var(--accent-green-dark), #047857)' : 'var(--bg-tertiary)'}; border-radius: var(--radius-md); padding: 0.65rem 0.9rem;">
        <div style="display: flex; justify-content: space-between; gap: 1rem; font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-bottom: 2px;">
          <strong>${c.from}</strong>
          <span>${c.timestamp}</span>
        </div>
        <div style="font-size: 0.86rem; color: #fff;">${c.text}</div>
      </div>
    `).join('');
  }
}

function handleSendAdminChat(e) {
  e.preventDefault();
  const input = document.getElementById('admin-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const chats = window.gvStore.getChats();
  const newMsg = {
    id: `msg-${Date.now()}`,
    from: "Admin",
    to: currentAdminChatTarget,
    text,
    timestamp: new Date().toISOString().substring(11, 16)
  };

  chats.push(newMsg);
  window.gvStore.saveChats(chats);
  input.value = '';

  selectAdminChatUser(currentAdminChatTarget);
  showToast('Reply Sent', `Message delivered to @${currentAdminChatTarget}.`, 'success');
}

function handleSendUserChat(e) {
  e.preventDefault();
  const input = document.getElementById('user-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const chats = window.gvStore.getChats();
  const newMsg = {
    id: `msg-${Date.now()}`,
    from: user.username,
    to: "Admin",
    text,
    timestamp: new Date().toISOString().substring(11, 16)
  };

  chats.push(newMsg);
  window.gvStore.saveChats(chats);
  input.value = '';

  // Refresh user chat box
  renderCurrentView();
  showToast('Message Sent', 'Administrator notified. Expect priority response.', 'success');
}

// -------------------------------------------------------------
// 5. TRADING MODALS (STOCKS & CRYPTO)
// -------------------------------------------------------------
function openStockOrderModal(symbol) {
  const stock = window.gvPricing.getStocks().find(s => s.symbol === symbol);
  if (!stock) return;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">Trade Stock: ${stock.symbol}</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">${stock.name} &bull; ${stock.exchange}</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleExecuteStockTrade(event, '${stock.symbol}')">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Market Price</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">$${stock.currentPrice.toFixed(2)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-dim);">Available Cash</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-green-light);">${formatCurrency(user.wallet.availableBalance)}</div>
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Order Side</label>
          <select id="trade-side">
            <option value="buy">BUY ${stock.symbol}</option>
            <option value="sell">SELL ${stock.symbol}</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Shares Quantity</label>
          <input type="number" id="trade-shares" min="1" step="1" value="10" oninput="updateStockTotal(this.value, ${stock.currentPrice})" required />
        </div>

        <div style="display: flex; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: 0.9rem;">
          <span style="color: var(--text-muted);">Estimated Execution Cost:</span>
          <strong id="trade-total-display" style="color: var(--accent-green-light);">$${(stock.currentPrice * 10).toFixed(2)}</strong>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">SUBMIT ORDER</button>
      </div>
    </form>
  `);
}

function updateStockTotal(shares, price) {
  const el = document.getElementById('trade-total-display');
  if (el) {
    el.innerText = `$${(Number(shares) * price).toFixed(2)}`;
  }
}

function handleExecuteStockTrade(e, symbol) {
  e.preventDefault();
  const stock = window.gvPricing.getStocks().find(s => s.symbol === symbol);
  const shares = Number(document.getElementById('trade-shares').value);
  const side = document.getElementById('trade-side').value;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  const totalCost = shares * stock.currentPrice;

  if (side === 'buy') {
    if (totalCost > user.wallet.availableBalance) {
      showToast('Insufficient Cash', 'Order total exceeds your available wallet balance.', 'error');
      return;
    }
    user.wallet.availableBalance -= totalCost;
    user.wallet.investmentValue += totalCost;
    user.wallet.totalInvested += totalCost;
  } else {
    user.wallet.availableBalance += totalCost;
    user.wallet.investmentValue = Math.max(0, user.wallet.investmentValue - totalCost);
  }

  window.gvStore.updateUser(user);
  window.gvStore.addActivity({
    id: `act-${Date.now()}`,
    type: "Trade",
    title: `${side.toUpperCase()} ${shares} sh ${stock.symbol} @ $${stock.currentPrice.toFixed(2)}`,
    amount: side === 'buy' ? -totalCost : totalCost,
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Investment"
  });

  closeGeneralModal();
  showToast('Order Executed', `Filled ${shares} shares of ${stock.symbol} at market price.`, 'success');
  renderCurrentView();
}

function openCryptoTradeModal(symbol) {
  const crypto = window.gvPricing.getCrypto().find(c => c.symbol === symbol);
  if (!crypto) return;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">Trade Crypto: ${crypto.name} (${crypto.symbol})</h3>
        <p style="font-size: 0.82rem; margin-top: 2px;">Category: ${crypto.category}</p>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleExecuteCryptoTrade(event, '${crypto.symbol}')">
      <div class="modal-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Asset Price</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">$${crypto.currentPrice < 1 ? crypto.currentPrice.toFixed(5) : crypto.currentPrice.toLocaleString()}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-dim);">Available Balance</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-green-light);">${formatCurrency(user.wallet.availableBalance)}</div>
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Trade Action</label>
          <select id="crypto-trade-side">
            <option value="buy">BUY ${crypto.symbol}</option>
            <option value="sell">SELL ${crypto.symbol}</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">USD Value to Trade</label>
          <input type="number" id="crypto-trade-usd" min="10" step="10" value="1000" required />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">EXECUTE TRADE</button>
      </div>
    </form>
  `);
}

function handleExecuteCryptoTrade(e, symbol) {
  e.preventDefault();
  const amtUsd = Number(document.getElementById('crypto-trade-usd').value);
  const side = document.getElementById('crypto-trade-side').value;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  if (side === 'buy') {
    if (amtUsd > user.wallet.availableBalance) {
      showToast('Insufficient Balance', 'Amount exceeds available wallet balance.', 'error');
      return;
    }
    user.wallet.availableBalance -= amtUsd;
    user.wallet.investmentValue += amtUsd;
  } else {
    user.wallet.availableBalance += amtUsd;
    user.wallet.investmentValue = Math.max(0, user.wallet.investmentValue - amtUsd);
  }

  window.gvStore.updateUser(user);
  window.gvStore.addActivity({
    id: `act-${Date.now()}`,
    type: "Crypto",
    title: `${side.toUpperCase()} $${amtUsd.toLocaleString()} ${symbol}`,
    amount: side === 'buy' ? -amtUsd : amtUsd,
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Investment"
  });

  closeGeneralModal();
  showToast('Crypto Trade Settled', `Filled $${amtUsd.toLocaleString()} ${symbol} successfully.`, 'success');
  renderCurrentView();
}

// -------------------------------------------------------------
// 6. PROPERTY DETAIL & GOAL MATCH MODAL
// -------------------------------------------------------------
function openPropertyDetailModal(propId) {
  const prop = window.gvPricing.getProperties().find(p => p.id === propId);
  if (!prop) return;

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">${prop.name}</h3>
        <span class="badge badge-green">${prop.type} &bull; ${prop.city}, ${prop.state}</span>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <div style="height: 240px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem;">
        <img src="${prop.image}" alt="${prop.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--accent-green-light);">
          ${prop.reitPrice ? `$${prop.reitPrice.toFixed(2)} / share` : formatCurrency(prop.price)}
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${prop.address}</div>
      </div>

      <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.25rem;">
        ${prop.description}
      </p>

      <!-- Financial Metrics & Carrying Costs -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.8rem;">
        ${prop.mortgageMonthly ? `
          <div><div style="color: var(--text-dim);">EST. MORTGAGE</div><strong style="color: #fff;">$${prop.mortgageMonthly.toLocaleString()}/mo</strong></div>
          <div><div style="color: var(--text-dim);">RENTAL INCOME</div><strong style="color: var(--accent-green-light);">$${prop.rentalMonthly.toLocaleString()}/mo</strong></div>
          <div><div style="color: var(--text-dim);">SHORT-TERM NIGHTLY</div><strong style="color: var(--accent-cyan-light);">$${prop.nightlyEst}/night</strong></div>
        ` : `
          <div><div style="color: var(--text-dim);">REIT PRICE</div><strong style="color: #fff;">$${prop.reitPrice.toFixed(2)}</strong></div>
          <div><div style="color: var(--text-dim);">DIVIDEND YIELD</div><strong style="color: var(--accent-green-light);">${prop.reitYield}</strong></div>
          <div><div style="color: var(--text-dim);">MINIMUM LOT</div><strong style="color: #fff;">10 Shares</strong></div>
        `}
      </div>

      <!-- Down Payment Options -->
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.5rem;">Down Payment Structuring</div>
        <div style="display: flex; gap: 0.75rem;">
          ${(prop.downPaymentOptions || [20]).map(pct => `
            <div style="flex: 1; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem; text-align: center;">
              <div style="font-weight: 700; color: #fff;">${pct}% Down</div>
              <div style="font-size: 0.78rem; color: var(--accent-cyan-light);">${formatCurrency(prop.price * (pct / 100))}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Close</button>
      <button class="btn btn-primary btn-sm" onclick="openMatchGoalModal('${prop.id}')">Attach to Wealth Goal</button>
    </div>
  `, true);
}

function openMatchGoalModal(propId) {
  const prop = window.gvPricing.getProperties().find(p => p.id === propId);
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  openGeneralModal(`
    <div class="modal-header">
      <h3 style="font-size: 1.25rem;">Match Property to Goal</h3>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <form onsubmit="handleAttachPropertyGoalSubmit(event, '${prop.id}')">
      <div class="modal-body">
        <p style="font-size: 0.88rem; color: var(--text-muted);">
          Attach <strong>${prop.name}</strong> (${prop.reitPrice ? `$${prop.reitPrice}/sh` : formatCurrency(prop.price)}) to one of your active goals or instantiate a targeted acquisition goal.
        </p>

        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Select Target Goal</label>
          <select id="match-goal-select">
            <option value="new">+ Create Dedicated Goal for this Property</option>
            ${user.goals.map(g => `<option value="${g.id}">${g.name} (${formatCurrency(g.currentAmount)} / ${formatCurrency(g.targetAmount)})</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">ATTACH TO GOAL</button>
      </div>
    </form>
  `);
}

function handleAttachPropertyGoalSubmit(e, propId) {
  e.preventDefault();
  const selectVal = document.getElementById('match-goal-select').value;
  const prop = window.gvPricing.getProperties().find(p => p.id === propId);
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  if (selectVal === 'new') {
    const downPayment = prop.price * 0.2;
    const newGoal = {
      id: `goal-${Date.now()}`,
      name: `${prop.name} Down Payment`,
      targetAmount: prop.reitPrice ? 50000 : downPayment,
      currentAmount: 1000,
      monthlyContribution: 2500,
      targetDate: "2029-12-31",
      riskProfile: "Balanced Growth",
      allocation: { "US Equity": 40, "Real Estate REITs": 40, "Cash": 20 },
      tier: getTierForAmount(downPayment)
    };
    user.goals.push(newGoal);
    window.gvStore.updateUser(user);
    showToast('Property Goal Created', `Created dedicated ${newGoal.name} goal under ${newGoal.tier} Tier!`, 'success');
  } else {
    showToast('Property Attached', `Targeting ${prop.name} inside selected wealth goal.`, 'success');
  }

  closeGeneralModal();
  renderCurrentView();
}

// -------------------------------------------------------------
// 7. PRODUCT DETAIL & CART OPERATIONS
// -------------------------------------------------------------
function openProductDetailModal(prodId) {
  const prod = window.gvPricing.getShopProducts().find(p => p.id === prodId);
  if (!prod) return;

  openGeneralModal(`
    <div class="modal-header">
      <div>
        <h3 style="font-size: 1.25rem;">${prod.name}</h3>
        <span class="badge ${prod.isReservation ? 'badge-purple' : 'badge-green'}">${prod.category}</span>
      </div>
      <button onclick="closeGeneralModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <div style="height: 240px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem;">
        <img src="${prod.image}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--accent-green-light);">${formatCurrency(prod.price)}</div>
        ${prod.isReservation ? `<span class="badge badge-amber">Reservation Deposit: $${prod.deposit.toLocaleString()}</span>` : ''}
      </div>

      <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.25rem;">
        ${prod.description}
      </p>

      <!-- Technical Specifications -->
      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Technical Specifications</h4>
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem;">
          ${Object.entries(prod.specs || {}).map(([k, v]) => `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.35rem;">
              <span style="color: var(--text-dim);">${k}</span>
              <strong style="color: #fff;">${v}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Select Variant -->
      <div>
        <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); margin-bottom: 0.35rem; text-transform: uppercase;">Available Variants</label>
        <select id="modal-product-variant">
          ${prod.variants.map(v => `<option value="${v}">${v}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeGeneralModal()">Close</button>
      <button class="btn btn-primary btn-sm" onclick="handleAddToCart('${prod.id}', document.getElementById('modal-product-variant').value)">
        ${prod.isReservation ? 'Reserve with Deposit' : 'Add to Cart'}
      </button>
    </div>
  `, true);
}

function handleAddToCart(prodId, chosenVariant = null) {
  const prod = window.gvPricing.getShopProducts().find(p => p.id === prodId);
  if (!prod) return;

  const variant = chosenVariant || prod.variants[0];
  const existing = AppState.cart.find(item => item.product.id === prod.id && item.variant === variant);

  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      product: prod,
      variant,
      quantity: 1
    });
  }

  closeGeneralModal();
  renderSidebar();
  showToast('Added to Cart', `${prod.name} (${variant}) added to order summary.`, 'success');
  if (AppState.currentRoute === 'cart') {
    renderCurrentView();
  }
}

function handleUpdateCartQty(idx, delta) {
  if (AppState.cart[idx]) {
    AppState.cart[idx].quantity += delta;
    if (AppState.cart[idx].quantity <= 0) {
      AppState.cart.splice(idx, 1);
    }
  }
  renderSidebar();
  renderCurrentView();
}

function handleRemoveCartItem(idx) {
  AppState.cart.splice(idx, 1);
  renderSidebar();
  renderCurrentView();
  showToast('Item Removed', 'Product removed from cart.', 'info');
}

function handleClearCart() {
  AppState.cart = [];
  renderSidebar();
  renderCurrentView();
  showToast('Cart Cleared', 'All items removed.', 'info');
}

function handleCompleteCheckout(e) {
  e.preventDefault();
  const name = document.getElementById('checkout-name').value;
  const email = document.getElementById('checkout-email').value;
  const phone = document.getElementById('checkout-phone').value;
  const address = document.getElementById('checkout-address').value;
  const city = document.getElementById('checkout-city').value;
  const state = document.getElementById('checkout-state').value;
  const zip = document.getElementById('checkout-zip').value;
  const payMethod = document.getElementById('checkout-payment-method').value;
  const notes = document.getElementById('checkout-notes').value;

  let dueToday = 0;
  let balanceOnDelivery = 0;
  AppState.cart.forEach(item => {
    if (item.product.isReservation) {
      dueToday += item.product.deposit * item.quantity;
      balanceOnDelivery += (item.product.price - item.product.deposit) * item.quantity;
    } else {
      dueToday += item.product.price * item.quantity;
    }
  });

  const shippingCost = 45.00;
  const totalDueToday = dueToday + shippingCost;
  const user = AppState.currentUser || window.gvStore.getUsers()[0];

  // If paid via available balance, deduct
  if (payMethod.includes('Available Wallet')) {
    if (totalDueToday > user.wallet.availableBalance) {
      showToast('Insufficient Wallet Balance', 'Your available balance is insufficient. Deposit funds or select Bank Wire.', 'error');
      return;
    }
    user.wallet.availableBalance -= totalDueToday;
    window.gvStore.updateUser(user);
  }

  const orderId = `GV-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    orderId,
    date: new Date().toISOString().split('T')[0],
    contactName: name,
    email,
    phone,
    deliveryAddress: `${address}, ${city}, ${state} ${zip}`,
    city,
    state,
    items: [...AppState.cart],
    dueToday: totalDueToday,
    balanceOnDelivery,
    paymentMethod: payMethod,
    notes,
    status: "Confirmed"
  };

  const orders = window.gvStore.getOrders();
  orders.unshift(newOrder);
  window.gvStore.saveOrders(orders);

  // Clear cart
  AppState.cart = [];
  renderSidebar();

  // Record Activity
  window.gvStore.addActivity({
    id: `act-${Date.now()}`,
    type: "Purchase",
    title: `Order #${orderId} (${payMethod})`,
    amount: -totalDueToday,
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Purchase"
  });

  showToast('Order Placed Successfully!', `Order ${orderId} confirmed. View details in recent orders.`, 'success');
  renderCurrentView();
}

// -------------------------------------------------------------
// 8. SIMULATOR LOGIC
// -------------------------------------------------------------
function updateSimulation() {
  const startEl = document.getElementById('sim-start');
  const monthlyEl = document.getElementById('sim-monthly');
  const returnEl = document.getElementById('sim-return');
  const yearsEl = document.getElementById('sim-years');

  if (!startEl) return;

  const P = Number(startEl.value);
  const PMT = Number(monthlyEl.value);
  const r = Number(returnEl.value) / 100;
  const years = Number(yearsEl.value);
  const n = 12;
  const t = years;

  document.getElementById('sim-start-val').innerText = formatCurrency(P);
  document.getElementById('sim-monthly-val').innerText = `${formatCurrency(PMT)}/mo`;
  document.getElementById('sim-return-val').innerText = `${(r * 100).toFixed(1)}% APY`;
  document.getElementById('sim-years-val').innerText = `${years} Years`;

  // Compound formula: FV = P*(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
  const rateMonthly = r / n;
  const totalMonths = n * t;
  const compoundMultiplier = Math.pow(1 + rateMonthly, totalMonths);
  const fvPrincipal = P * compoundMultiplier;
  const fvContributions = PMT * ((compoundMultiplier - 1) / rateMonthly);
  const totalFV = Math.round(fvPrincipal + fvContributions);
  const totalDeposited = Math.round(P + (PMT * totalMonths));
  const compoundGain = Math.max(0, totalFV - totalDeposited);
  const gainPct = Math.round((compoundGain / totalFV) * 100);

  document.getElementById('sim-total-result').innerText = formatCurrency(totalFV);
  document.getElementById('sim-breakdown').innerHTML = `Total Principal Contributed: <strong style="color:#fff;">${formatCurrency(totalDeposited)}</strong> &bull; Compound Earnings: <strong style="color:var(--accent-green-light);">+${formatCurrency(compoundGain)}</strong>`;
  document.getElementById('sim-interest-pct').innerText = `${gainPct}% of terminal wealth from Compounding`;

  const barPrin = document.getElementById('sim-bar-principal');
  const barInt = document.getElementById('sim-bar-interest');
  if (barPrin && barInt) {
    barPrin.style.width = `${100 - gainPct}%`;
    barInt.style.width = `${gainPct}%`;
  }
}

// -------------------------------------------------------------
// 9. FILTERS & EVENT HANDLERS
// -------------------------------------------------------------
function handleStockSearch(val) {
  AppState.stockFilter.search = val;
  renderCurrentView();
}
function handleStockFocusFilter(val) {
  AppState.stockFilter.focus = val;
  renderCurrentView();
}
function handleStockExchangeFilter(val) {
  AppState.stockFilter.exchange = val;
  renderCurrentView();
}
function toggleWatchlistMode() {
  AppState.stockFilter.watchlistOnly = !AppState.stockFilter.watchlistOnly;
  renderCurrentView();
}
function toggleWatchlistTicker(sym) {
  if (AppState.watchlist.includes(sym)) {
    AppState.watchlist = AppState.watchlist.filter(s => s !== sym);
  } else {
    AppState.watchlist.push(sym);
  }
  renderCurrentView();
}

function handleCryptoSearch(val) {
  AppState.cryptoFilter.search = val;
  renderCurrentView();
}
function handleCryptoCategoryFilter(val) {
  AppState.cryptoFilter.category = val;
  renderCurrentView();
}

function handlePropertySearch(val) {
  AppState.propertyFilter.search = val;
  renderCurrentView();
}
function handlePropertyTypeFilter(val) {
  AppState.propertyFilter.type = val;
  renderCurrentView();
}
function handlePropertyBedsFilter(val) {
  AppState.propertyFilter.beds = val;
  renderCurrentView();
}
function handlePropertyMaxPrice(val) {
  AppState.propertyFilter.maxPrice = val;
  renderCurrentView();
}
function toggleSavedPropertiesFilter() {
  AppState.propertyFilter.savedOnly = !AppState.propertyFilter.savedOnly;
  renderCurrentView();
}
function handleToggleSaveProperty(id) {
  window.gvStore.toggleSaveProperty(id);
  renderCurrentView();
}

function handleShopCategory(val) {
  AppState.shopFilter.category = val;
  renderCurrentView();
}
function handleShopSearch(val) {
  AppState.shopFilter.search = val;
  renderCurrentView();
}

function handleActivitySearch(val) {
  AppState.activityFilter.search = val;
  renderCurrentView();
}
function handleActivityCategoryFilter(val) {
  AppState.activityFilter.category = val;
  renderCurrentView();
}

function handleSaveUserSettings() {
  const user = AppState.currentUser || window.gvStore.getUsers()[0];
  user.name = document.getElementById('setting-name').value;
  user.email = document.getElementById('setting-email').value;
  user.plan = document.getElementById('setting-plan').value;
  user.riskProfile = document.getElementById('setting-risk').value;
  user.autoInvest = document.getElementById('setting-autoinvest').checked;
  user.roundUps = document.getElementById('setting-roundups').checked;
  user.notifications = document.getElementById('setting-notifications').checked;

  window.gvStore.updateUser(user);
  showToast('Settings Saved', 'Profile preferences updated successfully.', 'success');
  renderSidebar();
}
