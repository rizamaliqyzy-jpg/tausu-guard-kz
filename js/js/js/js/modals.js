/* ============================================================
   MODALS.JS — Registration, Sign-In, Medical Info modals
   Fix #4:  Full form validation on all required fields
   Fix #5:  Sign-in clearly marked demo-only; no real auth bypass
   Fix #6:  Med data imported from data.js, not duplicated here
   Fix #12: GPS coords collected and included in submission payload
   Fix #14: "None" allergy chip toggles correctly
   Fix #16: Escape key closes active modal; focus trapped inside
   Fix #20: ES module
   TauSu Guard KZ
   ============================================================ */

import { HIKERS } from './data.js';
import { t, currentLang } from './i18n.js';

// SEC-10: Tighter phone validation — requires at least 7 actual digit characters.
// Accepts international formats: +7 700 123 4567, 87001234567, +1-800-555-0100, etc.
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
function phoneHasEnoughDigits(s) {
  return (s.match(/\d/g) || []).length >= 7;
}
function isValidPhone(s) {
  return s && PHONE_RE.test(s) && phoneHasEnoughDigits(s);
}

function showError(inputId, msgKey) {
  const input = document.getElementById(inputId);
  const msg   = t(msgKey);
  if (!input) return;

  input.classList.add('input--error');
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', `${inputId}-err`);

  let errEl = document.getElementById(`${inputId}-err`);
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = `${inputId}-err`;
    errEl.className = 'field-error';
    errEl.setAttribute('role', 'alert');
    input.parentNode.appendChild(errEl);
  }
  errEl.textContent = msg;
  input.focus();
}

function clearErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.input--error').forEach(el => {
    el.classList.remove('input--error');
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  });
  form.querySelectorAll('.field-error').forEach(el => el.remove());
}

// ── GPS LOCATION ──
let gpsCoords = { lat: null, lng: null };

function requestUserGPS() {
  const statusEl = document.getElementById('gps-status');
  const set = (cls, msg) => {
    if (!statusEl) return;
    statusEl.className = `gps-status ${cls}`;
    statusEl.textContent = msg;
  };
  set('', 'Requesting GPS…');
  gpsCoords = { lat: null, lng: null };

  if (!navigator.geolocation) {
    set('gps-status--warning', '⚠ GPS not supported by this browser');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      gpsCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      // SEC-6: Do not display raw coordinates — show confirmation only.
      // Precise GPS (5 decimal places ≈ 1m accuracy) in the UI is a privacy risk.
      set('gps-status--ok', '✓ Location captured successfully');
    },
    () => {
      // Fallback: Shymbulak trailhead — makes it clear this is an estimate
      gpsCoords = { lat: 43.090, lng: 76.985 };
      set('gps-status--warning', '⚠ GPS unavailable — using Shymbulak trailhead as default');
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// ── FOCUS TRAP ──
// Fix #16: keeps keyboard focus inside the modal
function trapFocus(modalEl) {
  const focusable = 'button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])';
  const nodes = [...modalEl.querySelectorAll(focusable)].filter(n => !n.disabled);
  if (!nodes.length) return () => {};
  const first = nodes[0], last = nodes[nodes.length - 1];
  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  modalEl.addEventListener('keydown', handler);
  // Focus first element
  requestAnimationFrame(() => first.focus());
  return () => modalEl.removeEventListener('keydown', handler);
}

// ── ACTIVE MODAL TRACKING ── (for Escape key handler)
let activeModalClose = null;
let removeFocusTrap  = null;

function openModal(overlayId, closeFn) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  if (removeFocusTrap) removeFocusTrap();
  overlay.classList.add('open');
  const card = overlay.querySelector('.modal-card, .med-modal');
  removeFocusTrap = card ? trapFocus(card) : null;
  activeModalClose = closeFn;
}

function closeModal(overlayId) {
  document.getElementById(overlayId)?.classList.remove('open');
  if (removeFocusTrap) { removeFocusTrap(); removeFocusTrap = null; }
  activeModalClose = null;
}

// Fix #16: Escape key closes whatever modal is open
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activeModalClose) activeModalClose();
});

// ── REGISTRATION MODAL ──
export function openReg() {
  clearErrors('reg-form-body');
  document.getElementById('reg-form-body').style.display = 'block';
  document.getElementById('reg-success').style.display   = 'none';
  openModal('reg-overlay', closeReg);
  requestUserGPS();
}

export function closeReg() { closeModal('reg-overlay'); }

// Fix REG-4: collect ALL errors before returning so the user sees everything at once
// Fix REG-5: errors on select fields appended after the <select>, not after <label>
// Fix REG-6: duration error targets the visible button grid, not the hidden input
function showErrorAfter(afterEl, errId, msgKey) {
  if (!afterEl) return;
  const msg = t(msgKey);
  let errEl = document.getElementById(errId);
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = errId;
    errEl.className = 'field-error';
    errEl.setAttribute('role', 'alert');
    afterEl.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = msg;
  afterEl.classList?.add('input--error');
  afterEl.setAttribute?.('aria-invalid', 'true');
}

function validateReg() {
  clearErrors('reg-form-body');

  const fname    = document.getElementById('r-fname')?.value.trim();
  const lname    = document.getElementById('r-lname')?.value.trim();
  const phone    = document.getElementById('r-phone')?.value.trim();
  const ageRaw   = document.getElementById('r-age')?.value;
  const trail    = document.getElementById('r-trail')?.value;
  const duration = document.getElementById('r-duration')?.value;
  const sosPhone = document.getElementById('r-sos-phone')?.value.trim();
  const age      = parseInt(ageRaw, 10);

  let firstErrorEl = null;
  let hasErrors    = false;

  function flag(elId, msgKey, useGrid = false) {
    hasErrors = true;
    const el = useGrid
      ? document.querySelector('.duration-grid')
      : document.getElementById(elId);
    if (el && !firstErrorEl) firstErrorEl = el;
    showErrorAfter(
      useGrid ? document.querySelector('.duration-grid') : document.getElementById(elId),
      `${elId}-err`,
      msgKey
    );
  }

  if (!fname)                               flag('r-fname',    'err.fname');
  if (!lname)                               flag('r-lname',    'err.lname');
  if (!phone || !isValidPhone(phone))      flag('r-phone',    'err.phone');
  if (!ageRaw || isNaN(age) || age < 1 || age > 120) flag('r-age', 'err.age');
  if (!trail)                               flag('r-trail',    'err.trail');
  if (!duration)                            flag('r-duration', 'err.duration', true);
  if (!sosPhone || !isValidPhone(sosPhone)) flag('r-sos-phone', 'err.sos');

  if (hasErrors) {
    firstErrorEl?.focus?.();
    return false;
  }
  return true;
}

// ── BUTTON LOADING STATE ──
// Disables the button and shows a spinner + label while the API call is in flight.
// Returns a restore function to call when the call completes (success or error).
function setButtonLoading(btnId, loadingLabel) {
  const btn = document.getElementById(btnId);
  if (!btn) return () => {};
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('btn--loading');
  btn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span> ${loadingLabel}`;
  return () => {
    btn.disabled = false;
    btn.classList.remove('btn--loading');
    btn.innerHTML = original;
  };
}

async function submitReg() {
  if (!validateReg()) return;

  const restoreBtn = setButtonLoading('reg-submit-btn', 'Registering…');

  // Hide any previous API error and the demo note
  const errDiv  = document.getElementById('reg-api-error');
  const demoDiv = document.getElementById('reg-demo-note');
  if (errDiv)  { errDiv.hidden  = true; errDiv.textContent  = ''; }
  if (demoDiv) { demoDiv.hidden = true; }

  const payload = {
    firstName:   document.getElementById('r-fname').value.trim(),
    lastName:    document.getElementById('r-lname').value.trim(),
    age:         parseInt(document.getElementById('r-age').value, 10),
    phone:       document.getElementById('r-phone').value.trim(),
    trail:       document.getElementById('r-trail').value,
    duration:    document.getElementById('r-duration').value,
    bloodType:   document.querySelector('.btn-blood.sel')?.textContent || '',
    allergies:   [...document.querySelectorAll('.chip-group .chip.sel')].map(c => c.textContent),
    allergyNote: document.getElementById('r-allergy-other')?.value.trim() || '',
    sosName:     document.getElementById('r-sos-name')?.value.trim() || '',
    sosRel:      document.getElementById('r-sos-rel')?.value.trim()  || '',
    sosPhone:    document.getElementById('r-sos-phone')?.value.trim(),
    sosPhone2:   document.getElementById('r-sos-phone2')?.value.trim() || '',
    gps:         gpsCoords,
    registeredAt: new Date().toISOString(),
  };

  // ── SUBMIT to API ──
  const token = sessionStorage.getItem('tausu_token') || '';
  try {
    const res = await fetch('/api/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        // 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    });
    restoreBtn();
    if (!res.ok) {
      if (errDiv)  { errDiv.textContent  = 'Registration failed. Please try again.'; errDiv.hidden = false; }
      if (demoDiv) { demoDiv.hidden = false; }
      return;
    }
  } catch {
    restoreBtn();
    // Network / CORS failure — most likely because this is the demo with no backend.
    if (errDiv)  { errDiv.textContent  = 'Could not reach the server.'; errDiv.hidden = false; }
    if (demoDiv) { demoDiv.hidden = false; }
    return;
  }

  document.getElementById('reg-form-body').style.display = 'none';
  document.getElementById('reg-success').style.display   = 'block';
}

// Blood type
function selBlood(btn) {
  document.querySelectorAll('.btn-blood').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// Journey duration
function selDur(btn) {
  document.querySelectorAll('.btn-duration').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('r-duration').value = btn.dataset.val;
}

// Fix #14: "None" chip properly toggleable
function toggleChip(btn) {
  const chips   = [...document.querySelectorAll('.chip-group .chip')];
  const noneBtn = chips[chips.length - 1];
  if (btn === noneBtn) {
    // Clicking None: deselect all others, toggle None itself
    chips.forEach(c => { if (c !== noneBtn) c.classList.remove('sel'); });
    noneBtn.classList.toggle('sel');
  } else {
    // Clicking any allergy: always deselect None
    noneBtn.classList.remove('sel');
    btn.classList.toggle('sel');
  }
}

// ── SIGN IN MODAL ──
// Fix #5: marked clearly as demo — in production wire to real auth API
export function openSignin() { openModal('signin-overlay', closeSignin); }
export function closeSignin() { closeModal('signin-overlay'); }

async function submitSignin() {
  const phone = document.getElementById('si-phone')?.value.trim();
  const pass  = document.getElementById('si-password')?.value;

  // Clear previous errors
  ['si-phone','si-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('input--error'); el.removeAttribute('aria-invalid'); }
    document.getElementById(`${id}-err`)?.remove();
  });
  const errDiv  = document.getElementById('signin-api-error');
  const demoDiv = document.getElementById('signin-demo-note');
  if (errDiv)  { errDiv.hidden  = true; errDiv.textContent  = ''; }
  if (demoDiv) { demoDiv.hidden = true; }

  if (!phone) { showError('si-phone', 'err.signin.phone'); return; }
  if (!pass)  { showError('si-password', 'err.signin.pass'); return; }

  const restoreBtn = setButtonLoading('signin-submit-btn', 'Signing in…');

  // ── AUTHENTICATE via API ──
  // The server must: rate-limit, hash with bcrypt/argon2, return short-lived JWT
  // + httpOnly refresh cookie. Never store tokens in localStorage.
  try {
    const res = await fetch('/api/v1/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password: pass }),
      credentials: 'same-origin',
    });
    restoreBtn();
    if (!res.ok) {
      if (errDiv)  { errDiv.textContent  = 'Incorrect phone or password.'; errDiv.hidden = false; }
      if (demoDiv) { demoDiv.hidden = false; }
      return;
    }
    const data = await res.json();
    if (data.accessToken) sessionStorage.setItem('tausu_token', data.accessToken);
  } catch {
    restoreBtn();
    if (errDiv)  { errDiv.textContent  = 'Could not reach the server.'; errDiv.hidden = false; }
    if (demoDiv) { demoDiv.hidden = false; }
    return;
  }

  closeSignin();
  if (typeof window.showDashboard === 'function') window.showDashboard();
}

// ── MED INFO MODAL ──
// Fix #6: reads from data.js HIKERS — no duplicate hardcoded data here
export function openMed(key) {
  const h = HIKERS[key];
  if (!h) return;

  // Resolve localised name
  const lang = currentLang;
  const name = lang === 'ru' ? h.nameRu : lang === 'kz' ? h.nameKz : h.nameEn;
  const trailKey = h.trail;
  const sub  = `Trail ${trailKey} · ${h.elevation}m · ${h.status.charAt(0).toUpperCase() + h.status.slice(1)}`;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('med-av',      h.initials);
  set('med-name',    name);
  set('med-sub',     sub);
  set('med-age',     h.age);
  set('med-blood',   h.blood);
  set('med-allergy', h.allergy);
  set('med-sos',     h.sos);

  openModal('med-overlay', closeMed);
}

export function closeMed() { closeModal('med-overlay'); }

// ── EVENT LISTENERS ──
// REG-9: ES modules run after DOM is parsed — no DOMContentLoaded needed.
function initModals() {
  document.getElementById('reg-overlay')?.addEventListener('click',  e => { if (e.target === e.currentTarget) closeReg(); });
  document.getElementById('reg-close-btn')?.addEventListener('click',  closeReg);
  document.getElementById('reg-submit-btn')?.addEventListener('click', submitReg);
  document.getElementById('reg-done-btn')?.addEventListener('click',   closeReg);
  document.querySelectorAll('.btn-blood').forEach(b    => b.addEventListener('click', () => selBlood(b)));
  document.querySelectorAll('.btn-duration').forEach(b => b.addEventListener('click', () => selDur(b)));
  document.querySelectorAll('.chip-group .chip').forEach(b => b.addEventListener('click', () => toggleChip(b)));
  document.getElementById('signin-overlay')?.addEventListener('click',    e => { if (e.target === e.currentTarget) closeSignin(); });
  document.getElementById('signin-close-btn')?.addEventListener('click',  closeSignin);
  document.getElementById('signin-submit-btn')?.addEventListener('click', submitSignin);
  document.getElementById('signin-to-reg')?.addEventListener('click', e => { e.preventDefault(); closeSignin(); openReg(); });
  document.getElementById('med-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeMed(); });
  document.getElementById('med-close-btn')?.addEventListener('click', closeMed);
  document.querySelectorAll('[data-med]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openMed(btn.dataset.med); });
  });
  document.getElementById('land-reg-btn')?.addEventListener('click',    openReg);
  document.getElementById('land-signin-btn')?.addEventListener('click', openSignin);
}
initModals();
