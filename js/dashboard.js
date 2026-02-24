// =====================================================
// EVEX BCA Expertise — Dashboard Logic
// =====================================================

let currentFilter = 'all';
let searchQuery = '';
let currentPage = 1;
const PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', () => {
  const session = EVEX_AUTH.requireAuth();
  if (!session) return;
  populateSidebar('dashboard');
  renderStats();
  renderTable();
  initFilters();
  initAddVehicle(session);

  // Auto-refresh every 30s (simulated)
  setInterval(() => {
    renderTable();
    renderStats();
  }, 30000);
});

function renderStats() {
  const s = getStats();
  const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;

  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (s[key] !== undefined) el.textContent = s[key];
  });

  const bar = document.querySelector('.progress-bar');
  if (bar) bar.style.width = pct + '%';
  const pctEl = document.querySelector('.progress-pct');
  if (pctEl) pctEl.textContent = pct + '%';
}

function getFilteredVehicles() {
  return EVEX_DATA.vehicles.filter(v => {
    const matchStatus = currentFilter === 'all' || v.status === currentFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || [v.immat, v.vin, v.marque, v.modele]
      .some(field => field && field.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });
}

function renderTable() {
  const session = EVEX_AUTH.getSession();
  const filtered = getFilteredVehicles();
  const tbody = document.querySelector('#vehicle-tbody');
  const countEl = document.querySelector('.results-count');
  if (!tbody) return;

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (currentPage - 1) * PER_PAGE;
  const page = filtered.slice(start, start + PER_PAGE);

  if (countEl) countEl.textContent = `${total} véhicule${total > 1 ? 's' : ''}`;

  if (page.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-text">Aucun véhicule trouvé</div>
        </div>
      </td></tr>`;
    renderPagination(0, 0, 0);
    return;
  }

  tbody.innerHTML = page.map(v => {
    const locker = v.lockedBy ? getUser(v.lockedBy) : null;
    const isMyLock = v.lockedBy === session.userId;
    const badge = `<span class="badge ${getStatusBadge(v.status)}">${getStatusLabel2(v.status)}</span>`;
    const lockInfo = v.lockedBy && !isMyLock
      ? `<div class="lock-indicator" style="margin-top:4px">🔒 ${locker?.name}</div>` : '';

    const canOpen = v.status !== 'active' || isMyLock || session.role === 'admin';
    const actionBtn = canOpen
      ? `<button class="btn btn-sm btn-primary" onclick="openVehicle(${v.id})">Ouvrir</button>`
      : `<button class="btn btn-sm btn-secondary" disabled title="Verrouillé par ${locker?.name}">🔒 Verrouillé</button>`;

    return `
      <tr class="${v.status === 'active' ? 'locked' : ''}" onclick="openVehicle(${v.id})">
        <td class="row-status-bar"><div class="rsb-${v.status}"></div></td>
        <td class="td-num">${v.num}</td>
        <td>
          <div class="td-immat">${v.immat}</div>
          <div class="td-vin">${v.vin}</div>
        </td>
        <td class="td-brand">${v.marque}</td>
        <td>${v.modele}</td>
        <td>${v.mec}</td>
        <td>${badge}${lockInfo}</td>
        <td class="td-actions" onclick="event.stopPropagation()">
          ${actionBtn}
        </td>
      </tr>`;
  }).join('');

  renderPagination(currentPage, totalPages, total);
}

function renderPagination(current, total, count) {
  const wrap = document.querySelector('.page-btns');
  const info = document.querySelector('.page-info');
  if (!wrap) return;

  if (info) {
    const start = count === 0 ? 0 : (current - 1) * PER_PAGE + 1;
    const end = Math.min(current * PER_PAGE, count);
    info.textContent = count === 0 ? '' : `${start}–${end} sur ${count}`;
  }

  const pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);

  wrap.innerHTML = `
    <button class="page-btn" onclick="changePage(${current - 1})" ${current <= 1 ? 'disabled' : ''}>‹</button>
    ${pages.map(p => `<button class="page-btn ${p === current ? 'active' : ''}" onclick="changePage(${p})">${p}</button>`).join('')}
    <button class="page-btn" onclick="changePage(${current + 1})" ${current >= total ? 'disabled' : ''}>›</button>`;
}

function changePage(p) {
  const filtered = getFilteredVehicles();
  const total = Math.ceil(filtered.length / PER_PAGE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderTable();
}

function openVehicle(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;
  const session = EVEX_AUTH.getSession();

  // If locked by someone else and not admin
  if (vehicle.lockedBy && vehicle.lockedBy !== session.userId && session.role !== 'admin') {
    const locker = getUser(vehicle.lockedBy);
    TOAST.show(`🔒 Ce véhicule est pris en charge par ${locker?.name}`, 'warning');
    return;
  }

  // Lock if not already locked
  if (!vehicle.lockedBy) {
    vehicle.lockedBy = session.userId;
    vehicle.status = 'active';
    TOAST.show(`✅ Vous avez pris en charge ${vehicle.immat}`, 'success');
    renderTable();
    renderStats();
  }

  // Navigate to REP form
  sessionStorage.setItem('evex_current_vehicle', id);
  window.location.href = 'rep.html';
}

function initFilters() {
  // Search
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  // Status filter select
  const filterSelect = document.querySelector('#status-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  // Legend filter dots
  document.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const filter = item.getAttribute('data-filter');
      currentFilter = currentFilter === filter ? 'all' : filter;
      currentPage = 1;
      renderTable();
    });
  });
}

function initAddVehicle(session) {
  const addBtn = document.querySelector('#add-vehicle-btn');
  if (!addBtn) return;
  addBtn.addEventListener('click', () => showAddModal());
}

function showAddModal() {
  const modal = document.querySelector('#add-vehicle-modal');
  if (modal) modal.style.display = 'flex';
}

function closeAddModal() {
  const modal = document.querySelector('#add-vehicle-modal');
  if (modal) modal.style.display = 'none';
}

function submitAddVehicle() {
  const immat = document.querySelector('#new-immat').value.trim();
  const vin = document.querySelector('#new-vin').value.trim();
  const marque = document.querySelector('#new-marque').value.trim();
  const modele = document.querySelector('#new-modele').value.trim();

  if (!immat || !marque || !modele) {
    TOAST.show('Immatriculation, marque et modèle sont obligatoires', 'error');
    return;
  }

  const newId = Math.max(...EVEX_DATA.vehicles.map(v => v.id)) + 1;
  const newNum = Math.max(...EVEX_DATA.vehicles.map(v => v.num)) + 1;

  EVEX_DATA.vehicles.push({
    id: newId, num: newNum,
    immat: immat.toUpperCase(), vin: vin || 'N/A',
    marque: marque.toUpperCase(), modele: modele.toUpperCase(),
    mec: document.querySelector('#new-mec').value || 'N/A',
    km: parseInt(document.querySelector('#new-km').value) || 0,
    usage: document.querySelector('#new-usage').value || 'Véh confié',
    locataire: null, element: null, contrat: EVEX_DATA.event.sinistre,
    status: 'none', lockedBy: null, rep: null
  });

  closeAddModal();
  TOAST.show(`✅ Véhicule ${immat.toUpperCase()} ajouté au parc`, 'success');
  renderTable();
  renderStats();

  // Clear form
  ['#new-immat','#new-vin','#new-marque','#new-modele','#new-mec','#new-km'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.value = '';
  });
}
