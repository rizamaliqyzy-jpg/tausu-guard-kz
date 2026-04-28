/* ============================================================
   MAIN.JS — App bootstrap, navigation, user rows, last-seen
   Fix #10: Last-seen based on real timestamps — no fake counter
   Fix #17: Allergy hint moved to CSS class (no inline style)
   Fix #18: reg-done-btn modifier moved to CSS (no inline style)
   Fix #19: Import order explicit — no fragile load-order magic
   Fix #20: ES module — no global namespace pollution
   TauSu Guard KZ
   ============================================================ */

import { applyLang, currentLang, t } from './i18n.js';
import { trackingStart, trackingStop, flashHikerPin } from './tracking.js';
import { startDemoAlerts, triggerTestAlert } from './alerts.js';
import { openReg, openSignin } from './modals.js';
import { HIKERS } from './data.js';
import './sunset.js'; // REG-8: imported here — no second <script> tag needed

// ── PAGE NAVIGATION ──
export function showDashboard() {
  document.getElementById('landing-page').style.display   = 'none';
  document.getElementById('dashboard-page').style.display = 'block';
  window.scrollTo(0, 0);
  trackingStart();
  startDemoAlerts();
}

export function showLanding() {
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('landing-page').style.display   = 'block';
  window.scrollTo(0, 0);
  trackingStop();
}

// SEC-8: window.showDashboard is intentionally exposed here as a one-way
// navigation bridge for modals.js (to avoid circular imports).
// ⚠ When real auth is added, replace this with a custom event:
//   document.dispatchEvent(new CustomEvent('tausu:authenticated', { detail: { token } }))
// and listen for it here rather than exposing a global function.
// Until then, this only navigates to the demo dashboard and carries no auth state.
window.showDashboard = showDashboard;

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── USER ROW SELECTION ──
function selectUser(row, hikerKey) {
  row.closest('.u-list').querySelectorAll('.u-row').forEach(r => r.classList.remove('selected'));
  row.classList.add('selected');
  if (hikerKey) flashHikerPin(hikerKey);
}

// ── LAST-SEEN TIMERS (real wall-clock timestamps) ──
const lastSeenTimestamps = {};
for (const [key, h] of Object.entries(HIKERS)) {
  lastSeenTimestamps[key] = Date.now() - h.lastSeenMins * 60 * 1000;
}

const LAST_SEEN_EL = {
  asel: 'ls-u1', damir: 'ls-u2', bolat: 'ls-u3',
  zarina: 'ls-u4', madina: 'ls-u5', kanat: 'ls-u6',
};

function formatMins(mins) {
  if (mins === 0) return 'now';
  if (mins === 1) return '1 min ago';
  return `${mins} min ago`;
}

function updateLastSeen() {
  let online = 0, weak = 0, offline = 0;
  const now = Date.now();
  for (const [key, ts] of Object.entries(lastSeenTimestamps)) {
    const mins = Math.floor((now - ts) / 60000);
    const el   = document.getElementById(LAST_SEEN_EL[key]);
    if (el) {
      el.textContent = formatMins(mins);
      el.classList.toggle('last-seen--overdue', mins >= 15);
    }
    if (mins >= 15) offline++;
    else if (mins >= 8) weak++;
    else online++;
  }
  const osOnline  = document.getElementById('os-online');
  const osWeak    = document.getElementById('os-weak');
  const osOffline = document.getElementById('os-offline');
  if (osOnline)  osOnline.textContent  = `${online} ${t('online.label')}`;
  if (osWeak)    osWeak.textContent    = `${weak} ${t('weak.label')}`;
  if (osOffline) osOffline.textContent = `${offline} ${t('offlineLong.label')}`;
}
setInterval(updateLastSeen, 30000);

// ── INIT — REG-9: ES modules are deferred by default, so DOM is ready
// when this code runs. No DOMContentLoaded wrapper needed.
// MIN-4: applyLang called once here, not again after every DOM rewrite. ──
function init() {
  updateLastSeen();

  document.getElementById('hero-btn1')?.addEventListener('click', showDashboard);
  document.getElementById('cta-btn')?.addEventListener('click',   showDashboard);
  document.getElementById('btn-home')?.addEventListener('click',  showLanding);
  document.getElementById('btn-test-alert')?.addEventListener('click', triggerTestAlert);
  document.getElementById('btn-register')?.addEventListener('click',   openReg);

  document.querySelectorAll('.lb').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.textContent.toLowerCase()));
  });

  document.querySelectorAll('.u-row[data-hiker]').forEach(row => {
    row.addEventListener('click', () => selectUser(row, row.dataset.hiker));
  });

  document.getElementById('scroll-to-problem')?.addEventListener('click',  () => scrollToSection('problem'));
  document.getElementById('scroll-to-features')?.addEventListener('click', () => scrollToSection('features'));

  // MIN-4: single initial language application — HTML already has default EN text
  // so this only runs the i18n pass once, not twice
  applyLang('en');
}

// ES modules execute after DOM parsing — safe to call init() directly
init();
