// =====================================================
// EVEX BCA Expertise — REP Form Logic
// =====================================================

let currentVehicle = null;
let currentSession = null;

document.addEventListener('DOMContentLoaded', () => {
  currentSession = EVEX_AUTH.requireAuth();
  if (!currentSession) return;

  const vid = parseInt(sessionStorage.getItem('evex_current_vehicle'));
  if (!vid) { window.location.href = 'dashboard.html'; return; }

  currentVehicle = getVehicle(vid);
  if (!currentVehicle) { window.location.href = 'dashboard.html'; return; }

  populateSidebar('dashboard');
  populateHeader();
  populateForm();
  initQualification();
  initCalculations();
});

function populateHeader() {
  const v = currentVehicle;
  document.querySelector('.vh-immat').textContent = v.immat;
  document.querySelector('.vh-brand').textContent = `${v.marque} ${v.modele}`;

  document.querySelectorAll('[data-vh]').forEach(el => {
    const key = el.getAttribute('data-vh');
    if (key === 'vin') el.textContent = v.vin;
    if (key === 'mec') el.textContent = v.mec;
    if (key === 'km') el.textContent = v.km.toLocaleString('fr-FR') + ' km';
    if (key === 'usage') el.textContent = v.usage || 'N/A';
    if (key === 'num') el.textContent = v.num;
  });

  // Status badge
  const statusWrap = document.querySelector('.vh-status-badge');
  if (statusWrap) {
    statusWrap.innerHTML = `<span class="badge ${getStatusBadge(v.status)}">${getStatusLabel2(v.status)}</span>`;
  }

  // Lock info
  if (v.lockedBy && v.lockedBy === currentSession.userId) {
    const lockEl = document.querySelector('.vh-lock');
    if (lockEl) lockEl.innerHTML = `<span class="lock-indicator">🔒 Pris par vous</span>`;
  }
}

function populateForm() {
  const v = currentVehicle;
  const r = v.rep;
  if (!r) return;

  // Taux
  setVal('#tauxDeb', r.tauxDeb);
  setVal('#tauxMO1', r.tauxMO1);
  setVal('#tauxMO2', r.tauxMO2);
  setVal('#tauxMOP', r.tauxMOP);

  // REP fields
  setVal('#montantDeb', r.montantDeb);
  setVal('#coutPieces', r.coutPieces);
  setVal('#detailPieces', r.detailPieces);
  setVal('#mo1', r.mo1);
  setVal('#mo2', r.mo2);
  setVal('#mo3', r.mo3);
  setVal('#mop', r.mop);
  setVal('#ing', r.ing);
  setVal('#remiseDeb', r.remiseDeb);
  setVal('#remisePieces', r.remisePiecesMO);

  // Facturation partenaire
  setVal('#factPartMontant', r.factPartenaire.montant);
  setVal('#factPartNum', r.factPartenaire.numero);
  setVal('#factPartDate', r.factPartenaire.date);

  // Facturation assuré
  setVal('#factAssureMontant', r.factAssure.montant);
  setVal('#factAssureNum', r.factAssure.numero);
  setVal('#factAssureDate', r.factAssure.date);

  // Compléments
  setVal('#commentaires', r.commentaires);
  setVal('#valeurAchat', r.valeurAchat);
  setVal('#depreciation', r.depreciation);

  // Set qualification
  setQualification(currentVehicle.status);

  // Calculate
  calculateMontant();
}

function setVal(selector, value) {
  const el = document.querySelector(selector);
  if (el && value !== null && value !== undefined) {
    el.value = value;
  }
}

function initQualification() {
  document.querySelectorAll('.qual-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      setQualification(status);
    });
  });
}

function setQualification(status) {
  document.querySelectorAll('.qual-btn').forEach(btn => {
    btn.classList.remove('active-none', 'active-grele', 'active-non');
  });
  const btn = document.querySelector(`.qual-btn[data-status="${status}"]`);
  if (btn) {
    if (status === 'none') btn.classList.add('active-none');
    if (status === 'grele') btn.classList.add('active-grele');
    if (status === 'non') btn.classList.add('active-non');
  }
  currentVehicle.status = status === 'none' ? 'active' : status;
}

function initCalculations() {
  const fields = ['#montantDeb', '#coutPieces', '#mo1', '#mo2', '#mo3', '#mop', '#ing',
                  '#tauxMO1', '#tauxMO2', '#tauxMOP', '#remiseDeb', '#remisePieces'];
  fields.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('input', calculateMontant);
  });
}

function calculateMontant() {
  const get = sel => parseFloat(document.querySelector(sel)?.value) || 0;

  const deb = get('#montantDeb');
  const pieces = get('#coutPieces');
  const mo1 = get('#mo1'), txMO1 = get('#tauxMO1');
  const mo2 = get('#mo2'), txMO2 = get('#tauxMO2');
  const mo3 = get('#mo3'), txMO3 = 50; // default
  const mop = get('#mop'), txMOP = get('#tauxMOP');
  const remDeb = get('#remiseDeb') / 100;
  const remPieces = get('#remisePieces') / 100;

  // Formula: =(((Deb)*(1-RemDeb))+((Pieces+(MO1*TxMO1)+(MO2*TxMO2)+(MO3*TxMO3)+(MOP*TxMOP))*(1-RemPieces)))
  const montant = (
    (deb * (1 - remDeb)) +
    ((pieces + (mo1 * txMO1) + (mo2 * txMO2) + (mo3 * txMO3) + (mop * txMOP)) * (1 - remPieces))
  );

  const display = document.querySelector('.montant-value');
  if (display) {
    display.textContent = montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  // Store in vehicle
  if (currentVehicle.rep) {
    currentVehicle.rep.montantReparation = montant;
  }
}

function saveRep() {
  if (!currentVehicle.rep) currentVehicle.rep = {};
  const get = sel => { const el = document.querySelector(sel); return el ? el.value : ''; };
  const getNum = sel => parseFloat(get(sel)) || 0;

  currentVehicle.rep = {
    tauxDeb: getNum('#tauxDeb'), tauxMO1: getNum('#tauxMO1'),
    tauxMO2: getNum('#tauxMO2'), tauxMOP: getNum('#tauxMOP'),
    montantDeb: getNum('#montantDeb'), coutPieces: getNum('#coutPieces'),
    detailPieces: get('#detailPieces'),
    mo1: getNum('#mo1'), mo2: getNum('#mo2'), mo3: getNum('#mo3'),
    mop: getNum('#mop'), ing: getNum('#ing'),
    remiseDeb: getNum('#remiseDeb'), remisePiecesMO: getNum('#remisePieces'),
    factPartenaire: { montant: getNum('#factPartMontant'), numero: get('#factPartNum'), date: get('#factPartDate') },
    factAssure: { montant: getNum('#factAssureMontant'), numero: get('#factAssureNum'), date: get('#factAssureDate') },
    commentaires: get('#commentaires'),
    valeurAchat: getNum('#valeurAchat'), depreciation: getNum('#depreciation')
  };

  TOAST.show('✅ Saisie enregistrée', 'success');
}

function closeVehicle() {
  const status = document.querySelector('.qual-btn.active-grele') ? 'grele' :
                 document.querySelector('.qual-btn.active-non') ? 'non' : null;

  if (!status) {
    TOAST.show('Veuillez qualifier le véhicule (Grêlé ou Non grêlé) avant de clôturer', 'warning');
    return;
  }

  saveRep();
  currentVehicle.status = status;
  currentVehicle.lockedBy = null;

  TOAST.show(`✅ Dossier ${currentVehicle.immat} clôturé — ${status === 'grele' ? 'Grêlé' : 'Non grêlé'}`, 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}

function releaseVehicle() {
  if (confirm(`Libérer le véhicule ${currentVehicle.immat} sans enregistrer ?`)) {
    currentVehicle.lockedBy = null;
    currentVehicle.status = 'none';
    window.location.href = 'dashboard.html';
  }
}
