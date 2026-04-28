/* ============================================================
   SUNSET.JS — Astana clock + real sunset via Open-Meteo API
   Almaty: 43.25°N 76.95°E — UTC+5 (Asia/Almaty)
   Fix #20: ES module
   TauSu Guard KZ
   ============================================================ */

function getAstanaDate() {
  const now = new Date();
  return new Date(now.getTime() + (5 * 60 - now.getTimezoneOffset()) * 60000);
}

// ── CLOCK ──
function updateClock() {
  const d  = getAstanaDate();
  const el = document.getElementById('clock');
  if (el) {
    el.textContent =
      d.getHours().toString().padStart(2, '0') + ':' +
      d.getMinutes().toString().padStart(2, '0') + ':' +
      d.getSeconds().toString().padStart(2, '0');
  }
}
setInterval(updateClock, 1000);
updateClock();

// ── SUNSET ──
let sunsetH = null, sunsetM = null;

async function fetchSunset() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=43.25&longitude=76.95' +
      '&daily=sunset&timezone=Asia%2FAlmaty&forecast_days=1';
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw  = data.daily.sunset[0]; // "YYYY-MM-DDTHH:MM" in Asia/Almaty
    const time = raw.split('T')[1];
    sunsetH = parseInt(time.split(':')[0], 10);
    sunsetM = parseInt(time.split(':')[1], 10);
  } catch {
    // Fallback: NOAA solar calculation for Almaty
    const now = new Date();
    const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const decl = -23.45 * Math.cos((360 / 365) * (doy + 10) * Math.PI / 180);
    const cosH = (Math.cos(90.833 * Math.PI / 180) - Math.sin(43.25 * Math.PI / 180) * Math.sin(decl * Math.PI / 180))
               / (Math.cos(43.25 * Math.PI / 180) * Math.cos(decl * Math.PI / 180));
    const H    = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;
    const B    = (360 / 365) * (doy - 81) * Math.PI / 180;
    const eot  = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const noon = 12 - (76.95 - 5 * 15) / 15 - eot / 60;
    const sd   = noon + H / 15;
    sunsetH    = Math.floor(sd);
    sunsetM    = Math.floor((sd - sunsetH) * 60);
  }
  updateSunsetBadge();
}

function updateSunsetBadge() {
  if (sunsetH === null) return;
  const el = document.getElementById('sunset-badge');
  if (!el) return;

  const d   = getAstanaDate();
  const now = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  const set = sunsetH * 3600 + sunsetM * 60;
  const rem = set - now;

  const str = `${String(sunsetH).padStart(2, '0')}:${String(sunsetM).padStart(2, '0')}`;

  if (rem <= 0) {
    el.textContent = `🌙 Sunset was ${str}`;
    el.classList.remove('b-warn'); el.classList.add('b-red');
    return;
  }
  const hh = Math.floor(rem / 3600);
  const mm = Math.floor((rem % 3600) / 60);
  el.textContent = hh > 0 ? `🌅 Sunset ${str} · ${hh}h ${mm}m left` : `🌅 Sunset ${str} · ${mm}m left`;
  el.classList.toggle('b-red',  rem < 3600);
  el.classList.toggle('b-warn', rem >= 3600);
}

setInterval(updateSunsetBadge, 1000); // sync with clock
setInterval(fetchSunset, 3600000);    // refresh API data hourly
fetchSunset();
