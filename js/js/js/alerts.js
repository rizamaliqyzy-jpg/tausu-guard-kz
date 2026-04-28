/* ============================================================
   ALERTS.JS — Toast notifications + demo alert queue (ES module)
   Fix #13: Hiker names come from data.js + i18n so they always
            match the currently displayed language
   Fix #15: Toast removal delayed 350ms to outlast CSS animation
   Fix #20: ES module
   TauSu Guard KZ
   ============================================================ */

import { HIKERS, DEMO_ALERTS } from './data.js';
import { currentLang, t } from './i18n.js';

const TOAST_TYPES = {
  movement: { icon: '🔴', cls: 'toast--movement' },
  offline:  { icon: '📵', cls: 'toast--offline'  },
  sunset:   { icon: '🌅', cls: 'toast--sunset'   },
  weather:  { icon: '⛈️',  cls: 'toast--weather'  },
};

// Toast message templates — use t() for title so they stay in sync with applyLang
const TOAST_TITLES = {
  movement: { en: 'No movement detected',    ru: 'Движение не обнаружено',    kz: 'Қозғалыс анықталмады'    },
  offline:  { en: 'Hiker offline',            ru: 'Турист офлайн',             kz: 'Серуенші офлайн'          },
  sunset:   { en: 'Sunset warning',           ru: 'Предупреждение о закате',   kz: 'Күн батуы туралы ескерту' },
  weather:  { en: 'Weather alert',            ru: 'Предупреждение о погоде',   kz: 'Ауа-райы туралы ескерту'  },
};

const TOAST_MSGS = {
  movement: {
    en: (n,e,p) => `${n} has not moved for ${p} min at ${e}m. Possible emergency.`,
    ru: (n,e,p) => `${n} не двигается ${p} мин на высоте ${e}м.`,
    kz: (n,e,p) => `${n} ${p} минут бойы ${e}м биіктікте қозғалмаған.`,
  },
  offline: {
    en: (n,e,p) => `${n} lost signal ${p} min ago. Last known position: ${e}m.`,
    ru: (n,e,p) => `${n} потерял сигнал ${p} мин назад. Последняя позиция: ${e}м.`,
    kz: (n,e,p) => `${n} ${p} минут бойы сигналын жоғалтты. Соңғы орын: ${e}м.`,
  },
  sunset: {
    en: (n,e,p) => `${n} at ${e}m — only ${p} min until sunset. Descent required now.`,
    ru: (n,e,p) => `${n} на ${e}м — до заката ${p} мин. Немедленный спуск.`,
    kz: (n,e,p) => `${n} ${e}м биіктікте — күн батуына ${p} минут қалды.`,
  },
  weather: {
    en: (n,e,p) => `${p} expected near ${n} at ${e}m. Advise shelter.`,
    ru: (n,e,p) => `${p} ожидается вблизи ${n} на ${e}м.`,
    kz: (n,e,p) => `${n} орнына жақын ${p} күтілуде (${e}м).`,
  },
};

const JUST_NOW = { en: 'Just now', ru: 'Только что', kz: 'Жаңа ғана' };

let toastCounter = 0;

// Fix #13: resolve hiker name in the current language from data.js
function hikerName(hikerId) {
  if (!hikerId) return '';
  const h = HIKERS[hikerId];
  if (!h) return hikerId;
  const lang = currentLang;
  return lang === 'ru' ? h.nameRu : lang === 'kz' ? h.nameKz : h.nameEn;
}

// Safe DOM-based toast builder — no innerHTML
function showToast(type, hikerId, elevation, param, duration = 7000) {
  const lang    = currentLang;
  const name    = hikerId ? hikerName(hikerId) : (typeof param === 'object' ? param[lang] || param.en : '');
  const msgParam = typeof param === 'object' ? (param[lang] || param.en) : param;
  const title   = TOAST_TITLES[type]?.[lang] || TOAST_TITLES[type]?.en || type;
  const msgFn   = TOAST_MSGS[type]?.[lang]   || TOAST_MSGS[type]?.en;
  const message = msgFn ? msgFn(name, elevation, msgParam) : '';
  const ttype   = TOAST_TYPES[type];
  const id      = `toast-${++toastCounter}`;

  const wrap = document.createElement('div');
  wrap.id        = id;
  wrap.className = `toast ${ttype.cls}`;
  wrap.setAttribute('role', 'alert');

  const icon = document.createElement('span');
  icon.className = 'toast__icon'; icon.setAttribute('aria-hidden', 'true');
  icon.textContent = ttype.icon;

  const body  = document.createElement('div');  body.className  = 'toast__body';
  const ttl   = document.createElement('div');  ttl.className   = 'toast__title';  ttl.textContent = title;
  const msg   = document.createElement('div');  msg.className   = 'toast__msg';    msg.textContent = message;
  const time  = document.createElement('div');  time.className  = 'toast__time';   time.textContent = JUST_NOW[lang] || JUST_NOW.en;
  body.append(ttl, msg, time);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast__close';
  closeBtn.setAttribute('aria-label', 'Close notification');
  closeBtn.textContent = '✕';
  // Fix #15: use 350ms so animation (300ms) completes before node removal
  closeBtn.addEventListener('click', e => { e.stopPropagation(); dismissToast(id); });

  const progress = document.createElement('div');
  progress.className = 'toast-progress';
  progress.style.animationDuration = `${duration}ms`;

  wrap.append(icon, body, closeBtn, progress);
  wrap.addEventListener('click', () => dismissToast(id));

  const container = document.getElementById('toast-container');
  if (container) container.appendChild(wrap);
  setTimeout(() => dismissToast(id), duration);
}

function dismissToast(id) {
  const el = document.getElementById(id);
  if (!el || el.classList.contains('removing')) return;
  el.classList.add('removing');
  // Fix #15: 350ms > 300ms CSS animation duration
  setTimeout(() => el.remove(), 350);
}

// ── DEMO ALERT QUEUE ──
let demoStarted = false;

export function startDemoAlerts() {
  if (demoStarted) return;
  demoStarted = true;
  DEMO_ALERTS.forEach(a => {
    setTimeout(() => {
      showToast(a.type, a.hikerId, HIKERS[a.hikerId]?.elevation ?? 2500, a.nameOverride ? a.nameOverride : a.param);
    }, a.delay);
  });
}

// ── TEST ALERT CYCLE ──
const TEST_CYCLE = [
  { type: 'movement', hikerId: 'asel',   param: 47 },
  { type: 'offline',  hikerId: 'zarina', param: 22 },
  { type: 'sunset',   hikerId: 'damir',  param: 14 },
  { type: 'weather',  hikerId: null, param: { en:'Rain', ru:'Дождь', kz:'Жаңбыр' }, nameOverride: { en:'Trail A–C area', ru:'Район маршрутов А–В', kz:'А–В маршрут ауданы' } },
];
let testIdx = 0;

export function triggerTestAlert() {
  const a = TEST_CYCLE[testIdx++ % TEST_CYCLE.length];
  showToast(a.type, a.hikerId, HIKERS[a.hikerId]?.elevation ?? 2500, a.nameOverride || a.param, 6000);
}
