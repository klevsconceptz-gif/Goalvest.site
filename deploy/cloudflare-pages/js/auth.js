/**
 * GoalVest Authentication Controller
 * Implements normal user signup/signin and Admin login with Admin@goal.vest credentials.
 */

function openAuthModal(mode = 'signin') {
  const backdrop = document.getElementById('auth-modal');
  if (!backdrop) return;
  backdrop.classList.add('open');
  renderAuthModalContent(mode);
}

function closeAuthModal() {
  const backdrop = document.getElementById('auth-modal');
  if (backdrop) backdrop.classList.remove('open');
}

function renderAuthModalContent(mode) {
  const container = document.getElementById('auth-modal-content');
  if (!container) return;

  if (mode === 'signin') {
    container.innerHTML = `
      <div class="modal-header">
        <div>
          <h3 style="font-size: 1.25rem;">SIGN IN</h3>
          <p style="font-size: 0.85rem; margin-top: 2px;">Access your personal GoalVest wealth vault</p>
        </div>
        <button onclick="closeAuthModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
      </div>
      <form id="signin-form" onsubmit="handleSignInSubmit(event)">
        <div class="modal-body">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.82rem; color: var(--text-muted);">
            <strong style="color: var(--accent-green-light);">Access Hint:</strong> Sign in with your registered username, or use <span style="color:#fff;">Admin</span> / <span style="color:#fff;">Admin@goal.vest</span> for Admin Console.
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Username or Email</label>
            <input type="text" id="signin-username" placeholder="e.g. AlexRivers or Admin" required autofocus />
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">Password</label>
              <a href="#" onclick="event.preventDefault(); renderAuthModalContent('forgot')" style="font-size: 0.78rem; color: var(--accent-cyan); font-weight: 500;">Forgot Password?</a>
            </div>
            <div style="position: relative;">
              <input type="password" id="signin-password" placeholder="••••••••" required />
              <button type="button" onclick="togglePasswordVisibility('signin-password', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">
                ${ICONS.eye}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="flex-direction: column; gap: 0.85rem;">
          <button type="submit" class="btn btn-primary btn-block">SIGN IN</button>
          <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Don't have an account? <a href="#" onclick="event.preventDefault(); renderAuthModalContent('signup')" style="color: var(--accent-green-light); font-weight: 600;">SIGN UP</a>
          </div>
        </div>
      </form>
    `;
  } else if (mode === 'signup') {
    container.innerHTML = `
      <div class="modal-header">
        <div>
          <h3 style="font-size: 1.25rem;">SIGN UP</h3>
          <p style="font-size: 0.85rem; margin-top: 2px;">Create your GoalVest account and unlock tier investing</p>
        </div>
        <button onclick="closeAuthModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
      </div>
      <form id="signup-form" onsubmit="handleSignUpSubmit(event)">
        <div class="modal-body">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Full Legal Name</label>
            <input type="text" id="signup-name" placeholder="e.g. Elena Rostova" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Username</label>
            <input type="text" id="signup-username" placeholder="e.g. ElenaR" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Email Address</label>
            <input type="email" id="signup-email" placeholder="elena@domain.com" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Initial Goal Plan Tier</label>
            <select id="signup-plan">
              <option value="Starter">Starter Tier ($100 – $999)</option>
              <option value="Builder">Builder Tier ($1,000 – $9,999)</option>
              <option value="Growth" selected>Growth Tier ($10,000 – $49,999)</option>
              <option value="Premium">Premium Tier ($50,000 – $249,999)</option>
              <option value="Wealth">Wealth Tier ($250,000 – $999,999)</option>
              <option value="Private">Private Tier ($1,000,000 – $10,000,000)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Create Secure Password</label>
            <div style="position: relative;">
              <input type="password" id="signup-password" placeholder="At least 8 characters" required />
              <button type="button" onclick="togglePasswordVisibility('signup-password', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">
                ${ICONS.eye}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="flex-direction: column; gap: 0.85rem;">
          <button type="submit" class="btn btn-primary btn-block">SIGN UP</button>
          <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Already have an account? <a href="#" onclick="event.preventDefault(); renderAuthModalContent('signin')" style="color: var(--accent-green-light); font-weight: 600;">SIGN IN</a>
          </div>
        </div>
      </form>
    `;
  } else if (mode === 'forgot') {
    container.innerHTML = `
      <div class="modal-header">
        <div>
          <h3 style="font-size: 1.25rem;">RESET PASSWORD</h3>
          <p style="font-size: 0.85rem; margin-top: 2px;">Enter your username or registered email</p>
        </div>
        <button onclick="closeAuthModal()" style="color: var(--text-dim); font-size: 1.2rem;">${ICONS.close}</button>
      </div>
      <form onsubmit="handlePasswordReset(event)">
        <div class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted);">
            Provide your registered username and we will generate a verified instant security reset token in your session.
          </p>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">Username or Email</label>
            <input type="text" id="reset-identity" placeholder="AlexRivers" required autofocus />
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);">New Password</label>
            <div style="position: relative;">
              <input type="password" id="reset-newpassword" placeholder="Enter new password" required />
              <button type="button" onclick="togglePasswordVisibility('reset-newpassword', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">
                ${ICONS.eye}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="flex-direction: column; gap: 0.85rem;">
          <button type="submit" class="btn btn-primary btn-block">UPDATE PASSWORD</button>
          <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Return to <a href="#" onclick="event.preventDefault(); renderAuthModalContent('signin')" style="color: var(--accent-green-light); font-weight: 600;">SIGN IN</a>
          </div>
        </div>
      </form>
    `;
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = ICONS.eyeOff;
  } else {
    input.type = 'password';
    btn.innerHTML = ICONS.eye;
  }
}

function handleSignInSubmit(e) {
  e.preventDefault();
  const userField = document.getElementById('signin-username').value.trim();
  const passField = document.getElementById('signin-password').value;

  // 1. Admin Verification
  if (userField.toLowerCase() === 'admin' && passField === 'Admin@goal.vest') {
    AppState.isAdmin = true;
    AppState.currentUser = { username: 'Admin', role: 'admin' };
    sessionStorage.setItem('gv_current_user', 'Admin');
    closeAuthModal();
    showToast('Administrator Authenticated', 'Welcome back, Admin. Opening Admin Console.', 'success');
    navigateTo('admin');
    return;
  }

  // 2. Normal User Verification
  const user = window.gvStore.getUser(userField);
  if (user && user.password === passField) {
    AppState.isAdmin = false;
    AppState.currentUser = user;
    sessionStorage.setItem('gv_current_user', user.username);
    closeAuthModal();
    showToast('Signed In Successfully', `Welcome back, ${user.name}! Opening your personal dashboard.`, 'success');
    navigateTo('dashboard');
    return;
  }

  showToast('Authentication Failed', 'Invalid credentials. For Admin use Admin / Admin@goal.vest or test with AlexRivers / Password123!', 'error');
}

function handleSignUpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const plan = document.getElementById('signup-plan').value;
  const password = document.getElementById('signup-password').value;

  if (username.toLowerCase() === 'admin') {
    showToast('Reserved Username', 'The username "Admin" is reserved for platform operations.', 'error');
    return;
  }

  const existing = window.gvStore.getUser(username);
  if (existing) {
    showToast('Username Taken', 'Please choose a different unique username.', 'error');
    return;
  }

  const newUser = {
    username,
    name,
    email,
    password,
    plan,
    riskProfile: 'Growth',
    autoInvest: true,
    roundUps: false,
    notifications: true,
    wallet: {
      availableBalance: 1000.00,
      investmentValue: 0.00,
      earnings: 0.00,
      totalInvested: 0.00,
      deposits: 1000.00,
      withdrawals: 0.00
    },
    goals: [
      {
        id: `goal-${Date.now()}`,
        name: `${plan} Wealth Horizon`,
        targetAmount: plan === 'Starter' ? 800 : plan === 'Builder' ? 5000 : plan === 'Growth' ? 25000 : plan === 'Premium' ? 100000 : 500000,
        currentAmount: 1000,
        monthlyContribution: 250,
        targetDate: "2028-12-31",
        riskProfile: "Balanced Growth",
        allocation: { "US Equity": 50, "Emerging Tech": 30, "Cash": 20 },
        tier: plan
      }
    ]
  };

  const users = window.gvStore.getUsers();
  users.push(newUser);
  window.gvStore.saveUsers(users);

  // Sign in newly registered user
  AppState.isAdmin = false;
  AppState.currentUser = newUser;
  sessionStorage.setItem('gv_current_user', newUser.username);
  closeAuthModal();

  showToast('Account Created!', `Welcome to GoalVest, ${name}. Your $1,000 starter credit has been funded!`, 'success');
  navigateTo('dashboard');
}

function handlePasswordReset(e) {
  e.preventDefault();
  const identity = document.getElementById('reset-identity').value.trim();
  const newPass = document.getElementById('reset-newpassword').value;

  const user = window.gvStore.getUser(identity);
  if (!user) {
    showToast('User Not Found', `No user registered under "${identity}".`, 'error');
    return;
  }

  user.password = newPass;
  window.gvStore.updateUser(user);
  showToast('Password Updated', 'Your security password has been changed. Please SIGN IN.', 'success');
  renderAuthModalContent('signin');
}

function handleLogout() {
  AppState.currentUser = null;
  AppState.isAdmin = false;
  sessionStorage.removeItem('gv_current_user');
  showToast('Logged Out', 'You have been securely signed out.', 'info');
  navigateTo('home');
}
