// =====================================================
// EVEX BCA Expertise — Authentication
// =====================================================

const EVEX_AUTH = {
  SESSION_KEY: 'evex_session',

  login(email, password) {
    const user = EVEX_DATA.users.find(u =>
      u.email === email && u.password === password
    );
    if (user) {
      const session = { userId: user.id, role: user.role, name: user.name, initials: user.initials, loginAt: new Date().toISOString() };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, error: "Email ou mot de passe incorrect." };
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'index.html';
  },

  getSession() {
    const raw = sessionStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  requireAuth(redirectTo = 'index.html') {
    const session = this.getSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  },

  requireRole(role, redirectTo = 'dashboard.html') {
    const session = this.requireAuth();
    if (!session) return null;
    if (session.role !== role) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  },

  isAdmin() {
    const s = this.getSession();
    return s && s.role === 'admin';
  }
};

// ===== TOAST UTILITY =====
const TOAST = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();
    const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut .25s ease forwards';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }
};

// ===== SIDEBAR POPULATION =====
function populateSidebar(activeItem) {
  const session = EVEX_AUTH.getSession();
  if (!session) return;

  // User info
  const avatar = document.querySelector('.user-avatar');
  const userName = document.querySelector('.user-name');
  const userRole = document.querySelector('.user-role');
  if (avatar) avatar.textContent = session.initials;
  if (userName) userName.textContent = session.name;
  if (userRole) userRole.textContent = session.role === 'admin' ? 'Administrateur' : 'Expert';

  // Event info
  const evCode = document.querySelector('.ev-code');
  const evName = document.querySelector('.ev-name');
  if (evCode) evCode.textContent = EVEX_DATA.event.code;
  if (evName) evName.textContent = EVEX_DATA.event.name;

  // Stats badges
  const stats = getStats();
  const badgeTodo = document.querySelector('.badge-todo');
  const badgeActive = document.querySelector('.badge-active-nav');
  if (badgeTodo) badgeTodo.textContent = stats.none;
  if (badgeActive) badgeActive.textContent = stats.active;

  // Show admin nav items
  if (session.role === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = '');
  }

  // Active nav item
  if (activeItem) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = document.querySelector(`[data-nav="${activeItem}"]`);
    if (active) active.classList.add('active');
  }

  // Logout
  const logoutBtn = document.querySelector('.user-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => EVEX_AUTH.logout());
  }
}
