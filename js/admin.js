/**
 * GoalVest Admin Console View & Capabilities
 * Implements full backend-style CRUD, user management, impersonation,
 * announcement broadcasting, chat replies, deposit/withdrawal authentication,
 * and direct wallet additions/subtractions.
 */

function getAdminView() {
  if (!AppState.isAdmin) {
    return `<div style="padding: 3rem; text-align: center;">Access Denied. Administrator authentication required.</div>`;
  }

  const users = window.gvStore.getUsers();
  const announcements = window.gvStore.getAnnouncements();
  const paymentRequests = window.gvStore.getPaymentRequests();
  const depositMethods = window.gvStore.getDepositMethods();
  const chats = window.gvStore.getChats();

  const totalUsersCount = users.length;
  const totalSystemCapital = users.reduce((sum, u) => sum + (u.wallet?.availableBalance || 0) + (u.wallet?.investmentValue || 0), 0);
  const pendingRequestsCount = paymentRequests.filter(p => p.status === 'Pending').length;

  return `
    <div class="app-topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Admin Console</h2>
        <span class="badge badge-green">Full CRUD &amp; Superuser Control</span>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary btn-sm" onclick="openCreateUserModal()">${ICONS.plus} CREATE USER</button>
        <button class="btn btn-secondary btn-sm" onclick="openCreateAnnouncementModal()">${ICONS.bell} POST ANNOUNCEMENT</button>
        <button class="btn btn-danger btn-sm" onclick="handleLogout()">${ICONS.logOut} LOGOUT ADMIN</button>
      </div>
    </div>

    <div class="app-container">
      <!-- Admin Overview Stat Badges -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Total Registered Users</div>
          <div style="font-size: 2rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${totalUsersCount}</div>
          <div style="font-size: 0.8rem; color: var(--accent-green-light); font-weight: 600;">Full Access &amp; Data Inspection</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">System Capital Managed</div>
          <div style="font-size: 2rem; font-weight: 800; color: #fff; margin: 0.4rem 0;">${formatCurrency(totalSystemCapital)}</div>
          <div style="font-size: 0.8rem; color: var(--accent-cyan-light); font-weight: 600;">Across All User Wallets</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Pending Authentications</div>
          <div style="font-size: 2rem; font-weight: 800; color: ${pendingRequestsCount > 0 ? 'var(--accent-amber)' : '#fff'}; margin: 0.4rem 0;">${pendingRequestsCount}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Deposits &amp; Payouts Requiring Review</div>
        </div>

        <div class="gv-card">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Broadcast Intel</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--accent-purple); margin: 0.4rem 0;">${announcements.length}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Active Global / Targeted Announcements</div>
        </div>
      </div>

      <!-- Section 1: User Management & CRUD Table -->
      <div class="gv-card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.2rem;">Registered Users &amp; Wallets</h3>
            <p style="font-size: 0.85rem; margin-top: 2px;">Inspect user dashboard data, edit credentials, adjust wallets, or impersonate sessions.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openCreateUserModal()">${ICONS.plus} Add New User</button>
        </div>

        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Goal Tier</th>
                <th>Available Balance</th>
                <th>Investment Value</th>
                <th>Earnings</th>
                <th>Goals Count</th>
                <th style="text-align: right;">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${u.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">@${u.username} &bull; ${u.email}</div>
                  </td>
                  <td><span class="badge badge-green">${u.plan}</span></td>
                  <td style="font-weight: 700; color: var(--accent-green-light);">${formatCurrency(u.wallet?.availableBalance || 0)}</td>
                  <td style="font-weight: 700; color: #fff;">${formatCurrency(u.wallet?.investmentValue || 0)}</td>
                  <td style="color: var(--accent-green-light);">+${formatCurrency(u.wallet?.earnings || 0)}</td>
                  <td><span class="badge badge-cyan">${u.goals?.length || 0} Goals</span></td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-secondary btn-sm" onclick="openAdminAdjustWalletModal('${u.username}')" title="Adjust Wallet">$ Adjust</button>
                      <button class="btn btn-secondary btn-sm" onclick="openEditUserModal('${u.username}')" title="Edit User">${ICONS.edit}</button>
                      <button class="btn btn-cyan btn-sm" onclick="handleImpersonateUser('${u.username}')" title="Inspect Dashboard">Inspect</button>
                      <button class="btn btn-danger btn-sm" onclick="handleAdminDeleteUser('${u.username}')" title="Delete User">${ICONS.trash}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Payment Authentication (Deposits & Withdrawals) -->
      <div class="gv-card" style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.2rem;">Payment Requests &amp; Authentication Desk</h3>
            <p style="font-size: 0.85rem; margin-top: 2px;">Authenticate deposits, approve withdrawals, or reject fraudulent submissions.</p>
          </div>
          <span class="badge badge-cyan">${paymentRequests.length} Total Requests</span>
        </div>

        <div class="table-responsive">
          <table class="gv-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Username</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Details &amp; Notes</th>
                <th>Status</th>
                <th style="text-align: right;">Decision</th>
              </tr>
            </thead>
            <tbody>
              ${paymentRequests.map(req => `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim);">${req.id}</td>
                  <td style="font-weight: 700; color: #fff;">@${req.username}</td>
                  <td><span class="badge ${req.type === 'Deposit' ? 'badge-green' : 'badge-amber'}">${req.type}</span></td>
                  <td style="font-weight: 800; font-size: 1.05rem; color: #fff;">${formatCurrency(req.amount)}</td>
                  <td style="color: var(--text-muted);">${req.method}</td>
                  <td style="font-size: 0.82rem; color: var(--text-muted); max-width: 250px;">${req.details}</td>
                  <td><span class="badge ${req.status === 'Approved' ? 'badge-green' : req.status === 'Rejected' ? 'badge-red' : 'badge-amber'}">${req.status}</span></td>
                  <td style="text-align: right;">
                    ${req.status === 'Pending' ? `
                      <div style="display: inline-flex; gap: 0.4rem;">
                        <button class="btn btn-primary btn-sm" onclick="handleAuthenticatePayment('${req.id}', 'Approved')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="handleAuthenticatePayment('${req.id}', 'Rejected')">Reject</button>
                      </div>
                    ` : `
                      <span style="font-size: 0.8rem; color: var(--text-dim);">Processed</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Announcements & Deposit Methods Management -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <!-- Manage Announcements -->
        <div class="gv-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.2rem;">Announcements Broadcast</h3>
            <button class="btn btn-primary btn-sm" onclick="openCreateAnnouncementModal()">${ICONS.plus} New Broadcast</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${announcements.map(a => `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                  <div>
                    <span class="badge badge-purple">${a.level}</span>
                    <span class="badge badge-cyan" style="margin-left: 0.4rem;">Audience: ${a.audience}</span>
                  </div>
                  <button class="btn btn-danger btn-sm" style="padding: 2px 6px;" onclick="handleDeleteAnnouncement('${a.id}')">${ICONS.trash}</button>
                </div>
                <h4 style="font-size: 1rem; color: #fff; margin-bottom: 0.35rem;">${a.title}</h4>
                <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.5rem;">${a.body}</p>
                <div style="font-size: 0.72rem; color: var(--text-dim);">${a.createdDate} by ${a.author}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Manage Deposit Methods -->
        <div class="gv-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.2rem;">Deposit Methods</h3>
            <button class="btn btn-secondary btn-sm" onclick="openAddDepositMethodModal()">${ICONS.plus} Add Method</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${depositMethods.map(m => `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.25rem;">${m.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${m.instructions}</div>
                </div>
                <button class="btn btn-danger btn-sm" style="padding: 4px 8px; margin-left: 0.75rem;" onclick="handleDeleteDepositMethod('${m.id}')">${ICONS.trash}</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Section 4: Chat with Users Desk -->
      <div class="gv-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.2rem;">Support &amp; User Chat Desk</h3>
            <p style="font-size: 0.85rem; margin-top: 2px;">Read inquiries from users and reply directly from the Admin console.</p>
          </div>
          <span class="badge badge-green">Connected</span>
        </div>

        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; height: 420px;">
          <!-- User Selector List -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow-y: auto; padding: 0.5rem;">
            ${users.map(u => `
              <div onclick="selectAdminChatUser('${u.username}')" id="chat-tab-${u.username}" class="admin-chat-tab" style="padding: 0.75rem; border-radius: var(--radius-sm); cursor: pointer; margin-bottom: 0.35rem; transition: background 0.2s; background: ${u.username === 'AlexRivers' ? 'var(--bg-tertiary)' : 'transparent'};">
                <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${u.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">@${u.username}</div>
              </div>
            `).join('')}
          </div>

          <!-- Active Chat Conversation -->
          <div style="display: flex; flex-direction: column; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
            <div style="padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle); font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 0.75rem;" id="admin-chat-header">
              Chatting with @AlexRivers
            </div>

            <div id="admin-chat-box" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.75rem;">
              ${chats.map(c => `
                <div style="align-self: ${c.from === 'Admin' ? 'flex-end' : 'flex-start'}; max-width: 80%; background: ${c.from === 'Admin' ? 'linear-gradient(135deg, var(--accent-green-dark), #047857)' : 'var(--bg-tertiary)'}; border-radius: var(--radius-md); padding: 0.65rem 0.9rem;">
                  <div style="display: flex; justify-content: space-between; gap: 1rem; font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-bottom: 2px;">
                    <strong>${c.from}</strong>
                    <span>${c.timestamp}</span>
                  </div>
                  <div style="font-size: 0.86rem; color: #fff;">${c.text}</div>
                </div>
              `).join('')}
            </div>

            <form onsubmit="handleSendAdminChat(event)" style="display: flex; gap: 0.5rem;">
              <input type="text" id="admin-chat-input" placeholder="Type message to user..." required style="flex: 1;" />
              <button type="submit" class="btn btn-primary btn-sm">REPLY</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}
