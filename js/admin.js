// =====================================================
// EVEX BCA Expertise — Admin Logic
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const session = EVEX_AUTH.requireAuth();
  if (!session) return;

  populateSidebar('admin');
  renderAdminStats();
  renderProgressBar();
  renderExpertTable();
  renderActivityLog();
  initCodeBuilder();
  initImportZone();
});

function renderAdminStats() {
  const s = getStats();
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (s[key] !== undefined) el.textContent = s[key];
  });
  const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
  const pctEl = document.querySelector('.po-pct');
  if (pctEl) pctEl.textContent = pct + '%';
}

function renderProgressBar() {
  const s = getStats();
  const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
  const bar = document.querySelector('.po-bar-fill');
  if (bar) setTimeout(() => bar.style.width = pct + '%', 100);
}

function renderExpertTable() {
  const tbody = document.querySelector('#expert-tbody');
  if (!tbody) return;

  const experts = EVEX_DATA.users.filter(u => u.role === 'expert');
  const activeExperts = [2, 3]; // simulate active sessions

  tbody.innerHTML = experts.map(e => {
    const isOnline = activeExperts.includes(e.id);
    const lockedVehicle = EVEX_DATA.vehicles.find(v => v.lockedBy === e.id);
    const done = EVEX_DATA.vehicles.filter(v =>
      (v.status === 'grele' || v.status === 'non') && v.rep
    ).length;

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="expert-status-dot ${isOnline ? 'esd-online' : 'esd-offline'}"></span>
            <strong>${e.name}</strong>
          </div>
        </td>
        <td><span style="font-size:11px;color:${isOnline ? 'var(--status-grele)' : 'var(--text-muted)'}">${isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}</span></td>
        <td>${lockedVehicle ? `<span class="badge badge-active">${lockedVehicle.immat}</span>` : '<span style="color:var(--text-muted);font-size:11px">—</span>'}</td>
        <td style="font-weight:600">${done}</td>
        <td>
          ${lockedVehicle ? `<button class="btn btn-sm btn-danger" onclick="forceRelease(${lockedVehicle.id}, '${e.name}')">Libérer</button>` : ''}
        </td>
      </tr>`;
  }).join('');
}

function renderActivityLog() {
  const container = document.querySelector('.activity-log');
  if (!container) return;

  container.innerHTML = EVEX_DATA.activityLog.map(item => `
    <div class="activity-item">
      <div class="ai-dot ${item.type}"></div>
      <div>
        <div class="ai-time">${item.time}</div>
        <div class="ai-text">${item.text}</div>
      </div>
    </div>`).join('');
}

function forceRelease(vehicleId, expertName) {
  if (confirm(`Forcer la libération du véhicule pris par ${expertName} ?`)) {
    const vehicle = getVehicle(vehicleId);
    if (vehicle) {
      vehicle.lockedBy = null;
      vehicle.status = 'none';
      TOAST.show(`Véhicule libéré (${vehicle.immat})`, 'success');
      renderExpertTable();
    }
  }
}

function initCodeBuilder() {
  const yearSel = document.querySelector('#code-year');
  const typeSel = document.querySelector('#code-type');
  const occInput = document.querySelector('#code-occ');
  const countInput = document.querySelector('#code-count');

  if (!yearSel) return;

  function updateCode() {
    const year = yearSel.value;
    const type = typeSel.value;
    const occ = occInput.value || '1';
    const count = parseInt(countInput?.value) || 15;

    let code, desc;
    if (count < 10) {
      // CATNAT permanent
      code = `1${type}0`;
      desc = `Code CATNAT permanent (< 10 véhicules)`;
      document.querySelector('.catnat-warning').style.display = 'flex';
    } else {
      code = `${year}${type}${occ}`;
      desc = `${typeLabel(type)} ${yearLabel(year)} — Occurrence ${occ}`;
      document.querySelector('.catnat-warning').style.display = 'none';
    }

    const display = document.querySelector('.code-display');
    if (display) display.innerHTML = `<span>${year}</span>${type}<span style="color:rgba(255,255,255,.5)">${count < 10 ? '0' : occ}</span>`;

    const descEl = document.querySelector('.code-description');
    if (descEl) descEl.textContent = desc;
  }

  [yearSel, typeSel, occInput, countInput].forEach(el => {
    if (el) el.addEventListener('change', updateCode);
    if (el) el.addEventListener('input', updateCode);
  });

  updateCode();
}

function typeLabel(t) {
  const map = { G: 'Grêle', I: 'Inondation', T: 'Tempête', V: 'Vandalisme', F: 'Incendie' };
  return map[t] || t;
}
function yearLabel(y) {
  const base = 2020;
  return base + parseInt(y);
}

function initImportZone() {
  const zone = document.querySelector('.import-zone');
  if (!zone) return;

  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length) handleImportFile(files[0]);
  });
  zone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = e => { if (e.target.files[0]) handleImportFile(e.target.files[0]); };
    input.click();
  });
}

function handleImportFile(file) {
  const allowed = ['csv', 'xlsx', 'xls'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) {
    TOAST.show('Format non supporté. Utilisez CSV ou Excel.', 'error');
    return;
  }
  TOAST.show(`📂 Import de ${file.name}...`, 'info', 2000);
  setTimeout(() => {
    TOAST.show(`✅ ${file.name} importé Données disponibles en démo`, 'success');
  }, 2000);
}

function exportRapport() {
  TOAST.show('⏳ Génération du rapport Excel en cours...', 'info', 2000);
  setTimeout(() => {
    TOAST.show('✅ Rapport REP Téléchargement simulé', 'success');
  }, 2000);
}
