// =====================================================
// EVEX BCA Expertise — Mock Data
// =====================================================

const EVEX_DATA = {
  // Current event
  event: {
    code: "5G1",
    name: "Grêle Anglet — Juin 2025",
    date: "24/06/2025",
    type: "Grêle",
    sinistre: "0000017482771973",
    refGE: "23127309"
  },

  // Users
  users: [
    { id: 1, email: "admin@bca.fr",     password: "admin",   role: "admin",  name: "Julien Jouvrot",    initials: "JJ" },
    { id: 2, email: "expert@bca.fr",   password: "expert",  role: "expert", name: "Antoine Biet",   initials: "AB" },
    { id: 3, email: "expert1@bca.fr",   password: "expert1",  role: "expert", name: "Nicolas Baran",   initials: "NB" },
    { id: 4, email: "expert2@bca.fr",   password: "expert2",  role: "expert", name: "Julie André",    initials: "JA" },
    { id: 5, email: "expert3@bca.fr",   password: "expert3",  role: "expert", name: "Mathieu Bruggeman",  initials: "MB" }
  ],

  // Vehicles
  vehicles: [
    {
      id: 1, num: 51,
      immat: "CN271VZ", vin: "1J4GAC49X8L582618",
      marque: "JEEP", modele: "WRANGLER",
      mec: "24/06/2008", km: 118624,
      usage: "Véh confié", locataire: null,
      element: "Ordre de réparation 191857",
      contrat: "0000017482771973",
      status: "grele",
      lockedBy: null,
      rep: {
        tauxDeb: 45, tauxMO1: 50, tauxMO2: 55, tauxMOP: 65,
        montantDeb: 1850, coutPieces: 320,
        detailPieces: "Pare-brise ARD, enjoliveur sup ARD",
        mo1: 3.5, mo2: 0, mo3: 0, mop: 2.0, ing: 0.8,
        remiseDeb: 5, remisePiecesMO: 10,
        factPartenaire: { montant: 1757.5, numero: "FAC-2025-0892", date: "25/06/2025" },
        factAssure: { montant: 0, numero: "", date: "" },
        commentaires: "",
        valeurAchat: 18500, depreciation: 0
      }
    },
    {
      id: 2, num: 52,
      immat: "GP334DC", vin: "1C4RJYE65P8720616",
      marque: "JEEP", modele: "GRAND CHEROKEE",
      mec: "23/06/2023", km: 40033,
      usage: "Véh confié", locataire: null,
      element: "Commande de travaux 192520",
      contrat: "0000017482771973",
      status: "grele",
      lockedBy: null,
      rep: {
        tauxDeb: 45, tauxMO1: 50, tauxMO2: 55, tauxMOP: 65,
        montantDeb: 2100, coutPieces: 580,
        detailPieces: "Custode ARD, Lécheur ARD, Enjoliveur sup D, Lécheur AVD, Barre toit D",
        mo1: 4.0, mo2: 1.0, mo3: 0, mop: 2.5, ing: 1.0,
        remiseDeb: 5, remisePiecesMO: 10,
        factPartenaire: { montant: 1995, numero: "FAC-2025-0901", date: "25/06/2025" },
        factAssure: { montant: 0, numero: "", date: "" },
        commentaires: "",
        valeurAchat: 55000, depreciation: 0
      }
    },
    {
      id: 3, num: 53,
      immat: "GL701YT", vin: "ZACPJFCW2PPS19963",
      marque: "JEEP", modele: "COMPASS",
      mec: "15/03/2023", km: 22450,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "active", lockedBy: 2,
      rep: null
    },
    {
      id: 4, num: 54,
      immat: "BM817WB", vin: "WDD2040011A555052",
      marque: "Mercedes", modele: "CLASSE C",
      mec: "10/05/2021", km: 67800,
      usage: "Véh appartenant", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "grele", lockedBy: null,
      rep: null
    },
    {
      id: 5, num: 55,
      immat: "FW605AW", vin: "ZACNJCBSXLPR08616",
      marque: "JEEP", modele: "COMPASS",
      mec: "08/11/2020", km: 48900,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "grele", lockedBy: null,
      rep: null
    },
    {
      id: 6, num: 56,
      immat: "GC019VF", vin: "W1N2476871W067754",
      marque: "Mercedes", modele: "GLB",
      mec: "22/09/2022", km: 31200,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "none", lockedBy: null,
      rep: null
    },
    {
      id: 7, num: 57,
      immat: "GQ183CP", vin: "WDB2037081A627999",
      marque: "Mercedes", modele: "CLASSE C",
      mec: "14/04/2022", km: 55600,
      usage: "Véh appartenant", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "none", lockedBy: null,
      rep: null
    },
    {
      id: 8, num: 58,
      immat: "GP316JT", vin: "1C4BU0000LPL95413",
      marque: "JEEP", modele: "RENEGADE",
      mec: "07/07/2020", km: 88300,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "non", lockedBy: null,
      rep: null
    },
    {
      id: 9, num: 59,
      immat: "GD621LA", vin: "1C4NJCD37MPM45907",
      marque: "JEEP", modele: "RENEGADE",
      mec: "19/02/2021", km: 74100,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "none", lockedBy: null,
      rep: null
    },
    {
      id: 10, num: 60,
      immat: "FK058FM", vin: "WDD2132171A691284",
      marque: "Mercedes", modele: "CLASSE E",
      mec: "30/01/2019", km: 135000,
      usage: "Véh appartenant", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "grele", lockedBy: null,
      rep: null
    },
    {
      id: 11, num: 61,
      immat: "AK331XW", vin: "WDD2193571A133139",
      marque: "Mercedes", modele: "CLS",
      mec: "12/06/2017", km: 210500,
      usage: "Véh appartenant", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "none", lockedBy: null,
      rep: null
    },
    {
      id: 12, num: 62,
      immat: "CV019GE", vin: "WDC1660731A201118",
      marque: "Mercedes", modele: "GLE",
      mec: "03/11/2021", km: 42800,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "active", lockedBy: 3,
      rep: null
    },
    {
      id: 13, num: 63,
      immat: "FT149AX", vin: "W1K1186121N102681",
      marque: "Mercedes", modele: "CLA",
      mec: "28/08/2022", km: 18700,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "none", lockedBy: null,
      rep: null
    },
    {
      id: 14, num: 64,
      immat: "AD622EG", vin: "WDB2304581F146392",
      marque: "Mercedes", modele: "SL350",
      mec: "15/05/2015", km: 89200,
      usage: "Véh appartenant", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "grele", lockedBy: null,
      rep: null
    },
    {
      id: 15, num: 65,
      immat: "GY275RQ", vin: "ZACNJECA0RPS91575",
      marque: "JEEP", modele: "RENEGADE",
      mec: "11/01/2024", km: 8900,
      usage: "Véh confié", locataire: null,
      element: null, contrat: "0000017482771973",
      status: "non", lockedBy: null,
      rep: null
    }
  ],

  // Activity log
  activityLog: [
    { time: "14:32", type: "done",  text: "<strong>Mathieu Polmart</strong> a clôturé <strong>CN271VZ</strong> : Grêlé" },
    { time: "14:28", type: "lock",  text: "<strong>MARTINEZ Cyril</strong> a pris en charge <strong>GLE CV019GE</strong>" },
    { time: "14:20", type: "lock",  text: "<strong>LE BRAS Marc</strong> a pris en charge <strong>COMPASS GL701YT</strong>" },
    { time: "14:15", type: "done",  text: "<strong>SIBILEAU Timothee</strong> a clôturé <strong>GP334DC</strong> : Grêlé" },
    { time: "14:10", type: "done",  text: "<strong>Mathieu Bruggeman</strong> a clôturé <strong>GP316JT</strong> : Non grêlé" },
    { time: "14:05", type: "admin", text: "<strong>Yann Julieno (Admin)</strong> a importé le fichier Parc  15 véhicules" },
    { time: "13:58", type: "admin", text: "Événement <strong>5G1</strong> créé  Grêle Anglet Juin 2025" }
  ]
};

// ===== HELPERS =====
function getUser(id) {
  return EVEX_DATA.users.find(u => u.id === id);
}
function getVehicle(id) {
  return EVEX_DATA.vehicles.find(v => v.id === id);
}
function getStatusLabel(status) {
  const labels = { none: "Pas encore vu", active: "En cours", grele: "Grêlé", non: "Non grêlé" };
  return labels[status] || "Inconnu";
}
function getStatusBadge(status) {
  const map = { none: "badge-none", active: "badge-active", grele: "badge-grele", non: "badge-non" };
  return map[status] || "badge-none";
}
function getStatusLabel2(status) {
  const labels = { none: "Pas encore vu", active: "En cours", grele: "Grêlé", non: "Non grêlé" };
  return labels[status] || "";
}
function getStats() {
  const v = EVEX_DATA.vehicles;
  return {
    total:  v.length,
    none:   v.filter(x => x.status === "none").length,
    active: v.filter(x => x.status === "active").length,
    grele:  v.filter(x => x.status === "grele").length,
    non:    v.filter(x => x.status === "non").length,
    done:   v.filter(x => x.status === "grele" || x.status === "non").length
  };
}
