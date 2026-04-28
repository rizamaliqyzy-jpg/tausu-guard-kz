/* ============================================================
   TRACKING.JS — Live GPS tracking engine (ES module)
   Fix #7:  Map projection documents magic numbers; note re API key
   Fix #8:  Resize listener debounced (300ms)
   Fix #9:  Static trails drawn once to off-screen canvas; only
            hiker pins update each rAF frame
   Fix #11: All hiker data imported from data.js — no local copy
   Fix #20: ES module
   TauSu Guard KZ
   ============================================================ */

import { TRAILS, TRAIL_STYLES, CHECKPOINTS, HIKERS } from './data.js';

// ── MAP PROJECTION CONFIG ──
// The Google Maps iframe is centered on 43.1280°N 76.9480°E with d=6000
// (approximately zoom 14 on a ~480×400 container).
// PX_PER_LAT/LNG are derived from the Mercator scale at this latitude:
//   1° lat  ≈ 111,320 m → at zoom 14 (~0.09m/px) ≈ 18,500 px/°
//   1° lng  ≈ 111,320 * cos(43.13°) ≈ 81,340 m → ≈ 13,500 px/°
// These are tuned to the iframe's actual render. For pixel-perfect accuracy
// replace this with the Google Maps JS API LatLng → Point projection.
const MAP_W = 480, MAP_H = 400;
const CENTER_LAT = 43.128, CENTER_LNG = 76.948;
const PX_PER_LAT = 18500;
const PX_PER_LNG = 13500;

function latlngToXY(lat, lng) {
  return [
    MAP_W / 2 + (lng - CENTER_LNG) * PX_PER_LNG,
    MAP_H / 2 - (lat - CENTER_LAT) * PX_PER_LAT,
  ];
}

function toScreen(lat, lng, W, H) {
  const [bx, by] = latlngToXY(lat, lng);
  return [bx * (W / MAP_W), by * (H / MAP_H)];
}

function trailPos(waypoints, t) {
  t = Math.max(0, Math.min(1, t));
  const seg  = (waypoints.length - 1) * t;
  const i    = Math.floor(seg);
  const frac = seg - i;
  const a    = waypoints[Math.min(i, waypoints.length - 1)];
  const b    = waypoints[Math.min(i + 1, waypoints.length - 1)];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

function moveGroup(id, x, y) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
}

// ── PIN FLASH on user row click ──
export function flashHikerPin(key) {
  const h = hikerState[key];
  if (!h) return;
  const pin = document.getElementById(h.pinId);
  if (!pin) return;
  let count = 0;
  const iv = setInterval(() => {
    pin.style.opacity = count % 2 === 0 ? '0.15' : '1';
    if (++count >= 8) { clearInterval(iv); pin.style.opacity = '1'; }
  }, 110);
  document.getElementById('live-map-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── MUTABLE HIKER STATE (copied from data so data.js stays pure) ──
const hikerState = {};
for (const [key, h] of Object.entries(HIKERS)) {
  hikerState[key] = {
    trail:    TRAILS[h.trail],
    t:        h.t,
    speed:    h.speed,
    pinId:    h.pinId,
    pulseId:  h.pulseId,
    labelId:  h.labelId,
    _jitter:  (Math.random() - 0.5) * 0.0003,
  };
}

// ── CANVAS REFS ──
let mainCanvas, mainCtx;
let trailCanvas, trailCtx;
let animId = null;
let lastContainerW = 0, lastContainerH = 0;
let _mapBox = null; // REG-10: cached reference — set once in trackingStart

function getContainerSize() {
  return _mapBox ? [_mapBox.offsetWidth || MAP_W, _mapBox.offsetHeight || MAP_H] : [MAP_W, MAP_H];
}

// roundRect polyfill applied once
function applyRoundRectPolyfill(ctx) {
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    };
  }
}

// Build the static trail canvas once (or when size changes)
function buildTrailCache(W, H) {
  trailCanvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  trailCanvas.width  = W * dpr;
  trailCanvas.height = H * dpr;
  trailCtx = trailCanvas.getContext('2d');
  applyRoundRectPolyfill(trailCtx);
  trailCtx.scale(dpr, dpr);

  for (const [key, style] of Object.entries(TRAIL_STYLES)) {
    const pts = TRAILS[key];
    const screenPts = pts.map(([lat, lng]) => toScreen(lat, lng, W, H));

    // White glow casing
    trailCtx.strokeStyle = 'rgba(255,255,255,0.55)';
    trailCtx.lineWidth = 8; trailCtx.lineCap = 'round'; trailCtx.lineJoin = 'round';
    trailCtx.setLineDash([]);
    trailCtx.beginPath(); trailCtx.moveTo(...screenPts[0]);
    screenPts.slice(1).forEach(p => trailCtx.lineTo(...p));
    trailCtx.stroke();

    // Coloured dashed line
    trailCtx.strokeStyle = style.color;
    trailCtx.lineWidth = 3.5; trailCtx.setLineDash([10, 5]);
    trailCtx.beginPath(); trailCtx.moveTo(...screenPts[0]);
    screenPts.slice(1).forEach(p => trailCtx.lineTo(...p));
    trailCtx.stroke();
    trailCtx.setLineDash([]);

    // Trail label pill
    const lx = style.lx * W, ly = style.ly * H;
    trailCtx.font = '700 8px "DM Sans",Arial,sans-serif';
    const tw = trailCtx.measureText(style.label).width + 14;
    trailCtx.fillStyle = 'rgba(255,255,255,0.94)';
    trailCtx.strokeStyle = 'rgba(0,0,0,0.07)'; trailCtx.lineWidth = 0.5;
    trailCtx.roundRect(lx - tw / 2, ly - 8, tw, 15, 4);
    trailCtx.fill(); trailCtx.stroke();
    trailCtx.fillStyle = style.color;
    trailCtx.textAlign = 'center'; trailCtx.textBaseline = 'middle';
    trailCtx.fillText(style.label, lx, ly);
  }
}

function setupCanvas(W, H) {
  if (!mainCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  mainCanvas.width  = W * dpr;
  mainCanvas.height = H * dpr;
  mainCanvas.style.width  = W + 'px';
  mainCanvas.style.height = H + 'px';
  mainCtx = mainCanvas.getContext('2d');
  applyRoundRectPolyfill(mainCtx);
  mainCtx.scale(dpr, dpr);
  const svg = document.getElementById('pin-layer');
  if (svg) svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  buildTrailCache(W, H);
  positionCheckpoints(W, H);
}

// Fix #8: debounce resize handler
let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const [W, H] = getContainerSize();
    setupCanvas(W, H);
    lastContainerW = W; lastContainerH = H;
  }, 300);
}

function positionCheckpoints(W, H) {
  for (const [id, [lat, lng]] of Object.entries(CHECKPOINTS)) {
    const [sx, sy] = toScreen(lat, lng, W, H);
    const marker = document.getElementById(`${id}-marker`);
    const label  = document.getElementById(`${id}-label`);
    if (marker) marker.setAttribute('transform', `translate(${sx.toFixed(1)},${sy.toFixed(1)})`);
    if (label)  label.setAttribute('transform',  `translate(${(sx + 9).toFixed(1)},${(sy - 6).toFixed(1)})`);
  }
}

// ── ANIMATION LOOP (Fix #9: composites static trail + moving pins) ──
let lastTs = 0;

function tick(ts) {
  animId = requestAnimationFrame(tick);
  const dt = Math.min((ts - lastTs) / 1000, 0.1);
  lastTs = ts;
  if (!mainCanvas || !mainCtx || !trailCanvas) return;

  const [W, H] = getContainerSize();

  // Rebuild if container changed size (e.g. orientation change)
  if (W !== lastContainerW || H !== lastContainerH) {
    setupCanvas(W, H);
    lastContainerW = W; lastContainerH = H;
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  // Fix #9: blit cached static trail layer
  mainCtx.drawImage(trailCanvas, 0, 0, W, H);

  // Update SVG viewBox
  const svg = document.getElementById('pin-layer');
  if (svg) svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Move hiker pins
  for (const [, h] of Object.entries(hikerState)) {
    if (h.speed > 0) {
      const jitter = Math.sin(ts * 0.001 + h._jitter * 100) * 0.0001;
      h.t += (h.speed + jitter) * dt * 10;
      if (h.t >= 1) h.t = 0.05;
    }
    const [lat, lng] = trailPos(h.trail, h.t);
    const [sx, sy]   = toScreen(lat, lng, W, H);
    moveGroup(h.pinId, sx, sy);
    if (h.pulseId)  moveGroup(h.pulseId,  sx, sy);
    if (h.labelId)  moveGroup(h.labelId,  sx, sy);
  }
}

// ── PUBLIC API ──
export function trackingStart() {
  if (animId) return;
  mainCanvas = document.getElementById('track-canvas');
  if (!mainCanvas) return;
  // REG-10: cache the map box reference once — never query it inside the animation loop
  _mapBox = document.getElementById('live-map-box');
  if (!_mapBox) return;
  const [W, H] = getContainerSize();
  lastContainerW = W; lastContainerH = H;
  setupCanvas(W, H);
  window.addEventListener('resize', onResize);
  requestAnimationFrame(tick);
}

export function trackingStop() {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', onResize);
}
