/* ============================================================
   DATA.JS — Single source of truth for all hiker & trail data
   Fixes #11: previously hiker data was split across tracking.js,
   modals.js, main.js, alerts.js and index.html with no link.
   TauSu Guard KZ
   ============================================================ */

// ── TRAIL WAYPOINTS ──
// Approximate GPS coords for Ile-Alatau / Shymbulak area.
// ⚠ These are manually estimated — verify against official
// Ile-Alatau National Park trail data before any production use.
export const TRAILS = Object.freeze({
  A: Object.freeze([
    [43.090,76.985],[43.096,76.980],[43.103,76.975],[43.110,76.969],
    [43.116,76.963],[43.122,76.957],[43.128,76.951],[43.133,76.946],
    [43.138,76.941],[43.143,76.937],[43.148,76.933],[43.153,76.929],[43.158,76.925],
  ]),
  B: Object.freeze([
    [43.091,76.958],[43.097,76.954],[43.103,76.950],[43.109,76.946],
    [43.115,76.942],[43.121,76.938],[43.127,76.934],[43.132,76.930],
    [43.137,76.927],[43.142,76.924],[43.147,76.921],[43.152,76.918],
  ]),
  C: Object.freeze([
    [43.092,76.937],[43.098,76.934],[43.104,76.931],[43.110,76.929],
    [43.116,76.927],[43.122,76.925],[43.128,76.923],[43.133,76.921],
    [43.138,76.920],[43.143,76.919],[43.148,76.918],[43.153,76.917],
  ]),
  D: Object.freeze([
    [43.090,76.975],[43.096,76.971],[43.102,76.967],[43.108,76.963],
    [43.113,76.959],[43.118,76.955],[43.123,76.951],[43.128,76.947],
    [43.133,76.943],[43.138,76.940],
  ]),
});

export const TRAIL_STYLES = Object.freeze({
  A: Object.freeze({ color: '#E24B4A', label: 'Trail A · Summit',    lx: 0.38, ly: 0.86 }),
  B: Object.freeze({ color: '#EF9F27', label: 'Trail B · Shymbulak', lx: 0.56, ly: 0.80 }),
  C: Object.freeze({ color: '#1D9E75', label: 'Trail C · E.Ridge',   lx: 0.73, ly: 0.76 }),
  D: Object.freeze({ color: '#378ADD', label: 'Trail D · Valley',    lx: 0.22, ly: 0.80 }),
});

export const CHECKPOINTS = Object.freeze({
  cp1: Object.freeze([43.116, 76.963]),
  cp2: Object.freeze([43.127, 76.934]),
  cp3: Object.freeze([43.128, 76.923]),
});

// ── HIKER ROSTER ──
// ⚠ DEMO DATA — all names, ages, medical info, and contact numbers below
// are entirely fictional and used only for demonstration purposes.
// In production this object is EMPTY on the client. All medical data is
// fetched from the backend on demand, over HTTPS, with JWT authentication,
// and the response is never cached or logged client-side.
export const HIKERS = {
  asel: {
    id: 'asel', initials: 'AS',
    nameEn: 'Demo User A', nameRu: 'Демо Пользователь А', nameKz: 'Демо Пайдаланушы А',
    trail: 'A', t: 0.62, speed: 0, status: 'alert', color: '#E24B4A',
    pinId: 'pin-asel', pulseId: 'pulse-asel', labelId: 'label-asel',
    avatarCls: 'av--red',
    elevation: 3200, lastSeenMins: 0,
    age: '28', blood: 'B+', allergy: 'Penicillin, bee stings',
    sos: 'Demo Contact A (Brother) · +7 700 000 0001',
  },
  damir: {
    id: 'damir', initials: 'DM',
    nameEn: 'Demo User B', nameRu: 'Демо Пользователь Б', nameKz: 'Демо Пайдаланушы Б',
    trail: 'B', t: 0.40, speed: 0.0004, status: 'warn', color: '#EF9F27',
    pinId: 'pin-damir', pulseId: 'pulse-damir', labelId: null,
    avatarCls: 'av--amber',
    elevation: 2600, lastSeenMins: 8,
    age: '34', blood: 'A+', allergy: 'None',
    sos: 'Demo Contact B (Spouse) · +7 700 000 0002',
  },
  bolat: {
    id: 'bolat', initials: 'BT',
    nameEn: 'Demo User C', nameRu: 'Демо Пользователь В', nameKz: 'Демо Пайдаланушы В',
    trail: 'A', t: 0.28, speed: 0.0010, status: 'safe', color: '#1D9E75',
    pinId: 'pin-bolat', pulseId: null, labelId: null,
    avatarCls: 'av--green',
    elevation: 2100, lastSeenMins: 2,
    age: '41', blood: 'O+', allergy: 'Latex',
    sos: 'Demo Contact C (Spouse) · +7 700 000 0003',
  },
  zarina: {
    id: 'zarina', initials: 'ZA',
    nameEn: 'Demo User D', nameRu: 'Демо Пользователь Г', nameKz: 'Демо Пайдаланушы Г',
    trail: 'C', t: 0.52, speed: 0, status: 'offline', color: '#aaa',
    pinId: 'pin-zarina', pulseId: 'pulse-zarina', labelId: 'label-zarina',
    avatarCls: 'av--grey',
    elevation: 2900, lastSeenMins: 22,
    age: '26', blood: 'AB−', allergy: 'None',
    sos: 'Demo Contact D (Parent) · +7 700 000 0004',
  },
  madina: {
    id: 'madina', initials: 'MA',
    nameEn: 'Demo User E', nameRu: 'Демо Пользователь Д', nameKz: 'Демо Пайдаланушы Д',
    trail: 'D', t: 0.35, speed: 0.0008, status: 'safe', color: '#1D9E75',
    pinId: 'pin-madina', pulseId: null, labelId: null,
    avatarCls: 'av--blue',
    elevation: 1800, lastSeenMins: 1,
    age: '31', blood: 'A−', allergy: 'Aspirin',
    sos: 'Demo Contact E (Spouse) · +7 700 000 0005',
  },
  kanat: {
    id: 'kanat', initials: 'KS',
    nameEn: 'Demo User F', nameRu: 'Демо Пользователь Е', nameKz: 'Демо Пайдаланушы Е',
    trail: 'B', t: 0.22, speed: 0.0006, status: 'safe', color: '#378ADD',
    pinId: 'pin-kanat', pulseId: null, labelId: null,
    avatarCls: 'av--green',
    elevation: 2300, lastSeenMins: 4,
    age: '29', blood: 'O−', allergy: 'None',
    sos: 'Demo Contact F (Sibling) · +7 700 000 0006',
  },
};

// ── DEMO ALERT DEFINITIONS ──
// Names come from HIKERS so they always match the displayed language.
export const DEMO_ALERTS = [
  { delay:  2000, type: 'movement', hikerId: 'asel',   param: 47 },
  { delay:  5000, type: 'offline',  hikerId: 'zarina', param: 22 },
  { delay:  9000, type: 'sunset',   hikerId: 'damir',  param: 14 },
  { delay: 13000, type: 'weather',  hikerId: null,     param: { en:'Rain', ru:'Дождь', kz:'Жаңбыр' }, nameOverride: { en:'Trail A–C area', ru:'Район маршрутов А–В', kz:'А–В маршрут ауданы' } },
  { delay: 30000, type: 'offline',  hikerId: 'bolat',  param: 16 },
  { delay: 45000, type: 'sunset',   hikerId: 'zarina', param: 8  },
];
