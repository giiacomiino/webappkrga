# krga web-app v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the krga web-app prototype with Outfit font, taupe/lime brand palette, logo image, EN/ES language toggle, updated 4-screen rental flow with Stripe Elements and auto-return polling, and a clean config.js/i18n.js separation for developer handoff.

**Architecture:** Three files — `config.js` (all integration points and copy), `i18n.js` (all UI strings in EN and ES), and `index.html` (shell + all screen HTML + vanilla JS logic). No build step, no framework, loads from any static host. Demo mode in `config.js` simulates all backend calls.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Outfit (Google Fonts), Stripe.js (CDN, mock in demo mode)

**Spec:** `docs/superpowers/specs/2026-04-07-krga-webapp-v2-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `config.js` | Create | API endpoints, pricing, UI copy, polling config, Stripe key, demo flag |
| `i18n.js` | Create | All UI strings in `en` and `es` objects |
| `index.html` | Rewrite | CSS tokens, all 4 screens, i18n system, globe toggle, screen logic, polling |
| `README.md` | Update | Developer integration guide |

---

## Task 1: Create config.js

**Files:**
- Create: `krga web-app/config.js`

- [ ] **Step 1: Create the file with all config values**

```js
// krga web-app — Integration Config
// Developers: edit this file to connect to the real backend.
// Set demo: false and replace all '/api/...' paths with real endpoints.

const KRGA_CONFIG = {
  api: {
    stationStatus:   '/api/station/:id',      // GET → { name, address, available, total, chargeLevel }
    initPayment:     '/api/payment/init',     // POST { amount, email, phone, method } → { clientSecret, rentId }
    unlockBattery:   '/api/rent/unlock',      // POST { stationId, paymentId } → { rentId }
    pollRentStatus:  '/api/rent/:id/status',  // GET → { returned: bool, cost: number, elapsedSecs: number }
    downloadReceipt: '/api/rent/:id/receipt', // GET → PDF blob
    nearbyStations:  '/api/stations/nearby',  // GET { lat, lng } → [{ id, name, distance }]
  },
  ui: {
    // Edit this from your operator backend — no code deploy needed.
    paymentNotice: "A pre-authorization of $800 MXN will be held as a deposit. Only actual usage time is charged. The deposit is released immediately when you return the battery.",
  },
  pricing: {
    blockPriceMXN: 20,
    blockMinutes:  30,
    dailyCapMXN:   150,
    depositMXN:    800,
  },
  polling: {
    intervalMs: 5000, // how often to check if battery was returned (ms)
  },
  appLinks: {
    appStore:   '#', // replace with App Store URL
    googlePlay: '#', // replace with Google Play URL
  },
  stripe: {
    publishableKey: 'pk_test_REPLACE_ME',
  },
  demo: true, // true = mock all API calls; false = hit real endpoints
};
```

- [ ] **Step 2: Verify the file is valid JS**

Open browser console and run:
```
// drag config.js into browser console or open index.html after Task 8
console.log(KRGA_CONFIG.demo) // expected: true
```

- [ ] **Step 3: Commit**

```bash
cd "krga web-app"
git add config.js
git commit -m "feat: add config.js with all API endpoints and integration points"
```

---

## Task 2: Create i18n.js

**Files:**
- Create: `krga web-app/i18n.js`

- [ ] **Step 1: Create the file with all strings in EN and ES**

```js
// krga web-app — i18n strings
// To add a language: add a new key at the top level (e.g. 'fr') and fill all keys.
// To add a new string: add the key to BOTH 'en' and 'es' objects, then use
// data-i18n="your_key" on the HTML element.

const KRGA_I18N = {
  en: {
    tagline:            "charge your phone, always",
    stationActive:      "Active station",
    batteriesAvailable: "Batteries available",
    totalSlots:         "Total slots",
    chargeLevel:        "Charge level",
    perBlock:           "MXN per 30 min",
    dailyCap:           "Daily cap",
    rentBattery:        "Rent a battery",
    nearbyStations:     "See nearby stations",
    confirmRent:        "Confirm your rental",
    paymentMethod:      "Payment method",
    yourPhone:          "Your phone number",
    yourEmail:          "Your email",
    quickPay:           "Quick pay",
    orCard:             "or pay with card",
    confirmUnlock:      "Confirm and unlock battery",
    activeRental:       "Active rental",
    pickUpBattery:      "Pick up your battery!",
    unlocked:           "Unlocked",
    currentCost:        "Current cost",
    dailyCapLabel:      "Daily cap",
    nextCharge:         "Next charge",
    returnTitle:        "How to return the battery?",
    returnBody:         "Go to any active KRGA station, scan the QR and insert the battery into any free slot. Charge stops instantly.",
    batteryReturned:    "Battery returned",
    receiptSent:        "Your receipt was sent to",
    rentalSummary:      "Rental summary",
    station:            "Station",
    duration:           "Duration",
    blocks:             "Blocks",
    deposit:            "Deposit",
    depositReleased:    "$800 MXN released ✓",
    totalCharged:       "Total charged",
    upsellTitle:        "Next time, one tap.",
    upsellBody:         "Download the app and create your account to rent instantly.",
    downloadApp:        "Download the app",
    done:               "Done",
    downloadReceipt:    "Download receipt as PDF",
  },
  es: {
    tagline:            "tu celular, siempre cargado",
    stationActive:      "Estación activa",
    batteriesAvailable: "Baterías disponibles",
    totalSlots:         "Slots totales",
    chargeLevel:        "Nivel de carga",
    perBlock:           "MXN por 30 minutos",
    dailyCap:           "Tope diario",
    rentBattery:        "Rentar batería",
    nearbyStations:     "Ver estaciones cercanas",
    confirmRent:        "Confirma tu renta",
    paymentMethod:      "Método de pago",
    yourPhone:          "Tu número de teléfono",
    yourEmail:          "Tu correo electrónico",
    quickPay:           "Pago rápido",
    orCard:             "o paga con tarjeta",
    confirmUnlock:      "Confirmar y desbloquear batería",
    activeRental:       "Renta activa",
    pickUpBattery:      "¡Retira tu batería!",
    unlocked:           "Desbloqueada",
    currentCost:        "Costo actual",
    dailyCapLabel:      "Tope diario",
    nextCharge:         "Próx. cobro",
    returnTitle:        "¿Cómo devolver la batería?",
    returnBody:         "Dirígete a cualquier estación KRGA activa, escanea el QR e inserta la batería en cualquier slot libre. El cobro se detiene al instante.",
    batteryReturned:    "Batería devuelta",
    receiptSent:        "Tu recibo fue enviado a",
    rentalSummary:      "Resumen de renta",
    station:            "Estación",
    duration:           "Duración",
    blocks:             "Bloques",
    deposit:            "Garantía",
    depositReleased:    "$800 MXN liberados ✓",
    totalCharged:       "Total cobrado",
    upsellTitle:        "La próxima vez, un solo toque.",
    upsellBody:         "Descarga la app y crea tu cuenta para rentar al instante.",
    downloadApp:        "Descargar la app",
    done:               "Finalizar",
    downloadReceipt:    "Descargar recibo en PDF",
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add i18n.js
git commit -m "feat: add i18n.js with EN and ES string dictionaries"
```

---

## Task 3: Scaffold index.html — CSS tokens, font, logo

Replace the entire current `index.html` with a new shell. This task covers only the `<head>`, `:root` CSS tokens, and the shared `.shell` container. Screens are added in Tasks 4–8.

**Files:**
- Rewrite: `krga web-app/index.html`

- [ ] **Step 1: Write the new index.html shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="theme-color" content="#111111">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<title>krga — rent a battery</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<script src="config.js"></script>
<script src="i18n.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --black:    #111111;
  --taupe:    #B8B5A6;
  --taupe-dk: #A5A296;
  --taupe-lt: #C8C5B8;
  --lime:     #E8EDB5;
  --muted:    #47453D;
  --white:    #ffffff;
  --radius:   20px;
  --radius-sm:12px;
}
html,body{
  font-family:'Outfit',sans-serif;
  background:var(--taupe);
  min-height:100vh;
  display:flex;
  justify-content:center;
  -webkit-font-smoothing:antialiased;
  overscroll-behavior:none;
}
.shell{
  width:100%;
  max-width:430px;
  min-height:100vh;
  background:var(--taupe);
  display:flex;
  flex-direction:column;
  position:relative;
  overflow-x:hidden;
}
.screen{display:none;flex-direction:column;min-height:100vh;animation:fadeUp .3s ease;}
.screen.active{display:flex;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}

/* BUTTONS */
.btn{
  width:100%;height:58px;border-radius:16px;border:none;
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;
  cursor:pointer;transition:opacity .15s,transform .1s;
  display:flex;align-items:center;justify-content:center;gap:8px;
  -webkit-tap-highlight-color:transparent;
}
.btn:active{transform:scale(.98);opacity:.85;}
.btn-black{background:var(--black);color:var(--lime);}
.btn-outline{
  background:transparent;color:var(--muted);
  border:1.5px solid var(--taupe-dk);height:50px;font-size:14px;font-weight:600;
}
.btn-ghost{
  background:transparent;border:none;
  color:var(--muted);font-size:13px;height:38px;
  font-family:'Outfit',sans-serif;cursor:pointer;
  -webkit-tap-highlight-color:transparent;
}

/* LANG GLOBE */
.lang-toggle{
  position:fixed;bottom:28px;right:20px;z-index:999;
  width:42px;height:42px;border-radius:50%;
  background:var(--black);border:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.25);
  -webkit-tap-highlight-color:transparent;
  transition:transform .15s;
}
.lang-toggle:active{transform:scale(.93);}
.lang-popup{
  position:fixed;bottom:78px;right:20px;z-index:998;
  background:var(--black);border-radius:12px;
  padding:6px;display:none;flex-direction:column;gap:4px;
  box-shadow:0 8px 24px rgba(0,0,0,0.3);
}
.lang-popup.open{display:flex;}
.lang-opt{
  padding:9px 20px;border-radius:8px;font-size:13px;font-weight:700;
  color:rgba(255,255,255,0.55);background:transparent;border:none;
  font-family:'Outfit',sans-serif;cursor:pointer;text-align:left;
  transition:background .15s,color .15s;
}
.lang-opt.active{background:var(--lime);color:var(--black);}
.lang-opt:hover:not(.active){color:var(--white);}
</style>
</head>
<body>
<div class="shell">
  <!-- screens inserted in Tasks 4–7 -->
</div>

<!-- Language toggle -->
<button class="lang-toggle" onclick="toggleLangMenu()" aria-label="Change language">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8EDB5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
</button>
<div class="lang-popup" id="langMenu">
  <button class="lang-opt active" data-lang="en" onclick="setLang('en')">English</button>
  <button class="lang-opt" data-lang="es" onclick="setLang('es')">Español</button>
</div>

<script>
// ── i18n ──────────────────────────────────────────────
let currentLang = localStorage.getItem('krga_lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('krga_lang', lang);
  document.documentElement.lang = lang;

  const strings = KRGA_I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[key] !== undefined) el.textContent = strings[key];
  });

  // update active state on lang buttons
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  closeLangMenu();
}

function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}
function closeLangMenu() {
  document.getElementById('langMenu').classList.remove('open');
}

// close menu on outside tap
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-toggle') && !e.target.closest('.lang-popup')) {
    closeLangMenu();
  }
});

// ── Screen navigation ─────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});
</script>
</body>
</html>
```

- [ ] **Step 2: Open index.html in the browser and verify**

Expected: taupe background loads, globe button appears bottom-right, tapping globe opens EN/ES menu, selecting ES switches `html[lang]` attribute.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: scaffold index.html with Outfit font, taupe/lime tokens, globe lang toggle"
```

---

## Task 4: Screen 0 — Landing

Add Screen 0 inside `.shell` in `index.html`.

**Files:**
- Modify: `krga web-app/index.html` — insert Screen 0 HTML before `</div><!-- .shell -->`

- [ ] **Step 1: Add CSS for Screen 0 inside the `<style>` block (before the closing `</style>`)**

```css
/* ─── SCREEN 0: LANDING ─── */
.s0-top{
  background:var(--black);
  padding:60px 28px 36px;
  display:flex;flex-direction:column;gap:14px;
}
.logo-img{height:32px;object-fit:contain;}
.logo-tag{font-size:10px;font-weight:400;color:rgba(255,255,255,0.28);letter-spacing:2.5px;text-transform:uppercase;margin-top:2px;}
.station-chip{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(232,237,181,0.10);border:1px solid rgba(232,237,181,0.25);
  border-radius:40px;padding:8px 16px;width:fit-content;
}
.chip-dot{width:7px;height:7px;border-radius:50%;background:var(--lime);flex-shrink:0;}
.chip-text{font-size:12px;color:rgba(255,255,255,0.60);font-weight:400;}

.s0-body{flex:1;padding:24px 28px 0;display:flex;flex-direction:column;gap:16px;}
.station-hero{
  background:var(--taupe-lt);border-radius:var(--radius);
  padding:22px;display:flex;flex-direction:column;gap:14px;
  border:1px solid var(--taupe-dk);
}
.sh-name{font-size:20px;font-weight:700;color:var(--black);line-height:1.2;letter-spacing:-0.4px;}
.sh-addr{font-size:13px;color:var(--muted);margin-top:4px;}
.sh-row{display:flex;gap:8px;}
.sh-stat{flex:1;background:var(--taupe);border-radius:var(--radius-sm);padding:13px;text-align:center;}
.sh-stat-n{font-size:22px;font-weight:800;color:var(--black);letter-spacing:-0.5px;}
.sh-stat-l{font-size:10px;color:var(--muted);margin-top:3px;font-weight:500;}
.cables{display:flex;gap:7px;justify-content:center;}
.cable{
  background:var(--taupe);border:1px solid var(--taupe-dk);
  border-radius:20px;padding:6px 14px;font-size:11px;color:var(--muted);font-weight:600;
}
.price-strip{
  background:var(--black);border-radius:var(--radius);
  padding:20px 22px;display:flex;align-items:center;justify-content:space-between;
}
.ps-amount{font-size:38px;font-weight:800;color:var(--lime);letter-spacing:-1.5px;line-height:1;}
.ps-unit{font-size:12px;color:rgba(255,255,255,0.35);margin-top:4px;font-weight:400;}
.ps-right{text-align:right;}
.ps-cap{font-size:10px;color:rgba(255,255,255,0.28);font-weight:400;}
.ps-cap-val{font-size:15px;color:rgba(255,255,255,0.6);font-weight:700;margin-top:3px;letter-spacing:-0.3px;}
.s0-foot{padding:20px 28px 52px;display:flex;flex-direction:column;gap:10px;}
```

- [ ] **Step 2: Add Screen 0 HTML inside `.shell`**

```html
<!-- ══ SCREEN 0 — Landing ══ -->
<div class="screen active" id="s0">
  <div class="s0-top">
    <div>
      <img class="logo-img" src="assets/logo-color.png" alt="krga">
      <div class="logo-tag" data-i18n="tagline">charge your phone, always</div>
    </div>
    <div class="station-chip">
      <div class="chip-dot"></div>
      <span class="chip-text"><span data-i18n="stationActive">Active station</span> · K-042</span>
    </div>
  </div>

  <div class="s0-body">
    <div class="station-hero">
      <div>
        <div class="sh-name">Plaza Andares<br>Level 1 · Main entrance</div>
        <div class="sh-addr">Guadalajara, Jalisco</div>
      </div>
      <div class="sh-row">
        <div class="sh-stat">
          <div class="sh-stat-n">4</div>
          <div class="sh-stat-l" data-i18n="batteriesAvailable">Batteries available</div>
        </div>
        <div class="sh-stat">
          <div class="sh-stat-n">6</div>
          <div class="sh-stat-l" data-i18n="totalSlots">Total slots</div>
        </div>
        <div class="sh-stat">
          <div class="sh-stat-n">100%</div>
          <div class="sh-stat-l" data-i18n="chargeLevel">Charge level</div>
        </div>
      </div>
      <div class="cables">
        <div class="cable">Lightning</div>
        <div class="cable">USB-C</div>
        <div class="cable">Micro-USB</div>
      </div>
    </div>

    <div class="price-strip">
      <div>
        <div class="ps-amount">$20</div>
        <div class="ps-unit" data-i18n="perBlock">MXN per 30 min</div>
      </div>
      <div class="ps-right">
        <div class="ps-cap" data-i18n="dailyCap">Daily cap</div>
        <div class="ps-cap-val">$150 / 24h</div>
      </div>
    </div>
  </div>

  <div class="s0-foot">
    <button class="btn btn-black" onclick="show('s1')">
      <span data-i18n="rentBattery">Rent a battery</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
    </button>
    <button class="btn btn-ghost" data-i18n="nearbyStations">See nearby stations</button>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Expected:
- Logo image renders in dark header
- Lime dot in station chip
- Stats card with taupe background
- Price strip with lime `$20`
- Tap "ES" in globe menu → all labeled text switches to Spanish

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Screen 0 landing with logo, taupe/lime palette, i18n labels"
```

---

## Task 5: Screen 1 — Payment

**Files:**
- Modify: `krga web-app/index.html`

- [ ] **Step 1: Add CSS for Screen 1 inside `<style>`**

```css
/* ─── SCREEN 1: PAYMENT ─── */
.s1-top{
  background:var(--black);padding:60px 28px 28px;
  display:flex;align-items:center;gap:14px;
}
.back-btn{
  width:40px;height:40px;border-radius:50%;
  border:1px solid rgba(255,255,255,0.13);background:transparent;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent;
}
.s1-lbl{font-size:10px;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:1.5px;}
.s1-title{font-size:20px;font-weight:700;color:var(--taupe);letter-spacing:-0.4px;margin-top:3px;}
.s1-body{flex:1;padding:24px 28px 0;display:flex;flex-direction:column;gap:18px;overflow-y:auto;}
.field-label{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.3px;margin-bottom:7px;}
.field-input{
  background:var(--taupe-lt);border:1.5px solid var(--taupe-dk);
  border-radius:var(--radius-sm);padding:16px;
  font-family:'Outfit',sans-serif;font-size:16px;color:var(--black);
  outline:none;transition:border-color .2s;width:100%;
}
.field-input:focus{border-color:var(--black);}
.field-input::placeholder{color:var(--taupe-dk);}
.pay-section{display:flex;flex-direction:column;gap:10px;}
.pay-native-row{display:flex;gap:10px;}
.pay-native{
  flex:1;height:56px;border-radius:var(--radius-sm);
  border:1.5px solid var(--taupe-dk);background:var(--taupe-lt);
  display:flex;align-items:center;justify-content:center;gap:8px;
  cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;
  transition:opacity .15s;-webkit-tap-highlight-color:transparent;
  color:var(--black);
}
.pay-native.apple{background:var(--black);color:var(--lime);border-color:var(--black);}
.pay-native:active{opacity:.75;}
.or-div{
  display:flex;align-items:center;gap:12px;
  font-size:12px;color:var(--muted);font-weight:600;
}
.or-div::before,.or-div::after{content:'';flex:1;height:1px;background:var(--taupe-dk);}
/* Stripe Elements mount point */
#stripe-card-element{
  background:var(--taupe-lt);border:1.5px solid var(--taupe-dk);
  border-radius:var(--radius-sm);padding:16px;
  transition:border-color .2s;
}
#stripe-card-element.focused{border-color:var(--black);}
.preauth{
  background:var(--taupe-lt);border-radius:var(--radius-sm);
  padding:14px 16px;font-size:12px;color:var(--muted);line-height:1.7;
  border:1px solid var(--taupe-dk);text-align:center;
}
.preauth strong{color:var(--black);}
.s1-foot{padding:16px 28px 52px;}
```

- [ ] **Step 2: Add Screen 1 HTML after Screen 0 inside `.shell`**

```html
<!-- ══ SCREEN 1 — Payment ══ -->
<div class="screen" id="s1">
  <div class="s1-top">
    <button class="back-btn" onclick="show('s0')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"><path d="M10 3L5 8l5 5"/></svg>
    </button>
    <div>
      <div class="s1-lbl" data-i18n="confirmRent">Confirm your rental</div>
      <div class="s1-title" data-i18n="paymentMethod">Payment method</div>
    </div>
  </div>

  <div class="s1-body">
    <div>
      <div class="field-label" data-i18n="yourPhone">Your phone number</div>
      <input class="field-input" type="tel" inputmode="tel" autocomplete="tel" placeholder="+52 33 1234 5678">
    </div>
    <div>
      <div class="field-label" data-i18n="yourEmail">Your email</div>
      <input class="field-input" id="emailInput" type="email" inputmode="email" autocomplete="email" placeholder="name@email.com">
    </div>

    <div class="pay-section">
      <div class="field-label" data-i18n="quickPay">Quick pay</div>
      <div class="pay-native-row">
        <button class="pay-native apple" onclick="payAndGo()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple Pay
        </button>
        <button class="pay-native" onclick="payAndGo()">
          <svg width="17" height="17" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Pay
        </button>
      </div>
    </div>

    <div class="or-div"><span data-i18n="orCard">or pay with card</span></div>

    <!-- Stripe Elements mounts here. In demo mode this is replaced by a placeholder. -->
    <div id="stripe-card-element"></div>

    <div class="preauth" id="paymentNotice"></div>
  </div>

  <div class="s1-foot">
    <button class="btn btn-black" onclick="payAndGo()">
      <span data-i18n="confirmUnlock">Confirm and unlock battery</span>
    </button>
  </div>
</div>
```

- [ ] **Step 3: Add Stripe init + payment notice script at the bottom of `<body>`, before the closing `</body>` tag, inside the existing `<script>` block**

Add these functions inside the `<script>` tag (after the `show` function):

```js
// ── Payment notice (from config) ──────────────────────
function initPaymentNotice() {
  const el = document.getElementById('paymentNotice');
  if (el) el.innerHTML = KRGA_CONFIG.ui.paymentNotice;
}

// ── Stripe / demo card element ─────────────────────────
function initStripe() {
  const mountEl = document.getElementById('stripe-card-element');
  if (!mountEl) return;

  if (KRGA_CONFIG.demo) {
    // Demo mode: show a placeholder instead of real Stripe
    mountEl.innerHTML = `
      <div style="font-size:13px;color:var(--muted);text-align:center;padding:4px 0;font-weight:600;">
        💳 Stripe card form loads here (demo mode)
      </div>`;
    return;
  }

  // Production: initialize Stripe Elements
  // Requires: <script src="https://js.stripe.com/v3/"></script> in <head>
  const stripe = Stripe(KRGA_CONFIG.stripe.publishableKey);
  const elements = stripe.elements();
  const cardEl = elements.create('card', {
    style: {
      base: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '16px',
        color: '#111111',
        '::placeholder': { color: '#A5A296' },
      },
    },
  });
  cardEl.mount('#stripe-card-element');
  cardEl.on('focus', () => mountEl.classList.add('focused'));
  cardEl.on('blur', () => mountEl.classList.remove('focused'));
}

// ── payAndGo (demo) ────────────────────────────────────
function payAndGo() {
  show('s2');
  startTimer();
  if (KRGA_CONFIG.demo) startDemoPolling();
}
```

Update the `DOMContentLoaded` handler:

```js
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  initPaymentNotice();
  initStripe();
});
```

- [ ] **Step 4: Verify in browser**

Open `index.html`, tap "Rent a battery".
Expected:
- Phone + email fields appear with taupe styling
- Apple Pay black/lime, Google Pay white/taupe buttons visible
- Stripe demo placeholder renders
- Pre-auth notice shows `KRGA_CONFIG.ui.paymentNotice` text
- Tapping "Confirm and unlock battery" advances to Screen 2

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add Screen 1 payment with phone/email fields, Stripe mount, demo mode"
```

---

## Task 6: Screen 2 — Active Rental

**Files:**
- Modify: `krga web-app/index.html`

- [ ] **Step 1: Add CSS for Screen 2 inside `<style>`**

```css
/* ─── SCREEN 2: ACTIVE RENTAL ─── */
.s2-top{
  background:var(--black);padding:60px 28px 30px;
  display:flex;flex-direction:column;gap:5px;
}
.s2-lbl{font-size:10px;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:1.5px;}
.s2-title{font-size:26px;font-weight:800;color:var(--taupe);letter-spacing:-0.5px;}
.s2-body{flex:1;padding:22px 28px 0;display:flex;flex-direction:column;gap:14px;}
.active-card{
  background:var(--black);border-radius:var(--radius);
  padding:22px;display:flex;flex-direction:column;gap:18px;
}
.ac-header{display:flex;align-items:center;justify-content:space-between;}
.ac-badge{
  background:rgba(232,237,181,0.12);border:1px solid rgba(232,237,181,0.30);
  border-radius:20px;padding:5px 13px;font-size:11px;color:var(--lime);font-weight:700;
}
.ac-time{font-size:14px;color:rgba(255,255,255,0.26);font-weight:400;font-variant-numeric:tabular-nums;letter-spacing:0.5px;}
.meters{display:flex;gap:8px;}
.meter{flex:1;background:rgba(255,255,255,0.05);border-radius:10px;padding:13px;text-align:center;}
.meter-val{font-size:20px;font-weight:800;color:var(--lime);font-variant-numeric:tabular-nums;letter-spacing:-0.5px;}
.meter-lbl{font-size:10px;color:rgba(255,255,255,0.26);margin-top:3px;font-weight:400;}
.return-info{
  background:var(--taupe-lt);border-radius:var(--radius);
  border:1px solid var(--taupe-dk);padding:18px 20px;
}
.ri-title{font-size:13px;font-weight:700;color:var(--black);margin-bottom:8px;}
.ri-body{font-size:13px;color:var(--muted);line-height:1.65;}
.s2-foot{padding:16px 28px 52px;}
```

- [ ] **Step 2: Add Screen 2 HTML after Screen 1 inside `.shell`**

```html
<!-- ══ SCREEN 2 — Active Rental ══ -->
<div class="screen" id="s2">
  <div class="s2-top">
    <div class="s2-lbl" data-i18n="activeRental">Active rental</div>
    <div class="s2-title" data-i18n="pickUpBattery">Pick up your battery!</div>
  </div>

  <div class="s2-body">
    <div class="active-card">
      <div class="ac-header">
        <div class="ac-badge" data-i18n="unlocked">Unlocked</div>
        <div class="ac-time" id="rentTime">00:00</div>
      </div>
      <div class="meters">
        <div class="meter">
          <div class="meter-val" id="costMeter">$0</div>
          <div class="meter-lbl" data-i18n="currentCost">Current cost</div>
        </div>
        <div class="meter">
          <div class="meter-val">$150</div>
          <div class="meter-lbl" data-i18n="dailyCapLabel">Daily cap</div>
        </div>
        <div class="meter">
          <div class="meter-val" id="nextBlock">30m</div>
          <div class="meter-lbl" data-i18n="nextCharge">Next charge</div>
        </div>
      </div>
    </div>

    <div class="return-info">
      <div class="ri-title" data-i18n="returnTitle">How to return the battery?</div>
      <div class="ri-body" data-i18n="returnBody">Go to any active KRGA station, scan the QR and insert the battery into any free slot. Charge stops instantly.</div>
    </div>
  </div>

  <div class="s2-foot">
    <!-- No return button — auto-detected by backend polling -->
  </div>
</div>
```

- [ ] **Step 3: Add timer + polling logic inside the `<script>` block**

```js
// ── Timer ──────────────────────────────────────────────
let timerInt = null;
let secs = 0;

function startTimer() {
  stopTimer();
  secs = 0;
  timerInt = setInterval(() => {
    secs++;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    const timeEl = document.getElementById('rentTime');
    if (timeEl) timeEl.textContent = m + ':' + s;

    const demoBlock = 30; // 30 real seconds = 1 billing block in demo
    const blocks = Math.floor(secs / demoBlock);
    const cost = Math.min(blocks * KRGA_CONFIG.pricing.blockPriceMXN, KRGA_CONFIG.pricing.dailyCapMXN);
    const costEl = document.getElementById('costMeter');
    if (costEl) costEl.textContent = '$' + cost;

    const secsInBlock = secs % demoBlock;
    const remaining = demoBlock - secsInBlock;
    const nextEl = document.getElementById('nextBlock');
    if (nextEl) nextEl.textContent = remaining + 's';
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInt);
  timerInt = null;
}

// ── Auto-return polling ────────────────────────────────
let pollInt = null;

function startDemoPolling() {
  // Demo: auto-trigger return after 90 seconds
  stopPolling();
  let elapsed = 0;
  pollInt = setInterval(() => {
    elapsed += 1000;
    if (elapsed >= 90000) {
      handleBatteryReturned();
    }
  }, 1000);
}

function startPolling(rentId) {
  // Production: replace startDemoPolling() call in payAndGo() with startPolling(rentId)
  stopPolling();
  pollInt = setInterval(async () => {
    try {
      const url = KRGA_CONFIG.api.pollRentStatus.replace(':id', rentId);
      const res = await fetch(url);
      const data = await res.json();
      if (data.returned) handleBatteryReturned();
    } catch (e) {
      // network error — keep polling
    }
  }, KRGA_CONFIG.polling.intervalMs);
}

function stopPolling() {
  clearInterval(pollInt);
  pollInt = null;
}

function handleBatteryReturned() {
  stopTimer();
  stopPolling();
  show('s3');
}
```

- [ ] **Step 4: Verify in browser**

Tap through to Screen 2.
Expected:
- Timer counts up from 00:00
- Cost meter increments every 30 seconds in demo
- Next charge counts down
- After 90 seconds: automatically transitions to Screen 3 (no button tap needed)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add Screen 2 active rental with timer and auto-return polling"
```

---

## Task 7: Screen 3 — Receipt

**Files:**
- Modify: `krga web-app/index.html`

- [ ] **Step 1: Add CSS for Screen 3 inside `<style>`**

```css
/* ─── SCREEN 3: RECEIPT ─── */
.s3-top{
  background:var(--black);padding:60px 28px 38px;
  display:flex;flex-direction:column;align-items:center;gap:12px;
}
.check-circle{
  width:68px;height:68px;border-radius:50%;
  background:rgba(232,237,181,0.11);border:1.5px solid rgba(232,237,181,0.32);
  display:flex;align-items:center;justify-content:center;margin-bottom:4px;
}
.s3-h{font-size:24px;font-weight:800;color:var(--taupe);letter-spacing:-0.5px;text-align:center;}
.s3-sub{font-size:13px;color:rgba(255,255,255,0.36);text-align:center;line-height:1.65;font-weight:400;}
.s3-sub span{color:rgba(255,255,255,0.65);}
.s3-body{flex:1;padding:22px 28px 0;display:flex;flex-direction:column;gap:12px;}
.receipt-card{
  background:var(--taupe-lt);border-radius:var(--radius);
  border:1px solid var(--taupe-dk);overflow:hidden;
}
.rc-header{
  background:var(--taupe);padding:13px 18px;
  font-size:10px;font-weight:700;color:var(--muted);
  text-transform:uppercase;letter-spacing:1.3px;
}
.rc-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 18px;border-bottom:1px solid var(--taupe);
}
.rc-row:last-child{border-bottom:none;}
.rc-row.total{background:var(--taupe);}
.rc-l{font-size:13px;color:var(--muted);}
.rc-r{font-size:13px;font-weight:700;color:var(--black);}
.rc-r.ok{color:#2d7a4f;}
.rc-r.big{font-size:20px;letter-spacing:-0.5px;}
.upsell{
  background:var(--black);border-radius:var(--radius);
  padding:20px;display:flex;flex-direction:column;gap:10px;
}
.upsell-title{font-size:14px;font-weight:800;color:var(--lime);letter-spacing:-0.2px;}
.upsell-sub{font-size:12px;color:rgba(255,255,255,0.40);line-height:1.5;}
.upsell-links{display:flex;gap:8px;}
.upsell-btn{
  flex:1;padding:10px;border-radius:10px;
  background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
  font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;
  color:rgba(255,255,255,0.65);text-align:center;cursor:pointer;
  text-decoration:none;display:block;
  transition:background .15s;
}
.upsell-btn:active{background:rgba(255,255,255,0.13);}
.s3-foot{padding:16px 28px 52px;display:flex;flex-direction:column;gap:10px;}
```

- [ ] **Step 2: Add Screen 3 HTML after Screen 2 inside `.shell`**

```html
<!-- ══ SCREEN 3 — Receipt ══ -->
<div class="screen" id="s3">
  <div class="s3-top">
    <div class="check-circle">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#E8EDB5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 15l7 7 11-13"/>
      </svg>
    </div>
    <div class="s3-h" data-i18n="batteryReturned">Battery returned</div>
    <div class="s3-sub">
      <span data-i18n="receiptSent">Your receipt was sent to</span><br>
      <span id="receiptEmail">user@email.com</span>
    </div>
  </div>

  <div class="s3-body">
    <div class="receipt-card">
      <div class="rc-header" data-i18n="rentalSummary">Rental summary</div>
      <div class="rc-row">
        <div class="rc-l" data-i18n="station">Station</div>
        <div class="rc-r">Andares · K-042</div>
      </div>
      <div class="rc-row">
        <div class="rc-l" data-i18n="duration">Duration</div>
        <div class="rc-r" id="receiptDuration">—</div>
      </div>
      <div class="rc-row">
        <div class="rc-l" data-i18n="blocks">Blocks</div>
        <div class="rc-r" id="receiptBlocks">—</div>
      </div>
      <div class="rc-row">
        <div class="rc-l" data-i18n="deposit">Deposit</div>
        <div class="rc-r ok" data-i18n="depositReleased">$800 MXN released ✓</div>
      </div>
      <div class="rc-row total">
        <div class="rc-l" style="font-weight:700;color:var(--black);" data-i18n="totalCharged">Total charged</div>
        <div class="rc-r big" id="receiptTotal">—</div>
      </div>
    </div>

    <div class="upsell">
      <div class="upsell-title" data-i18n="upsellTitle">Next time, one tap.</div>
      <div class="upsell-sub" data-i18n="upsellBody">Download the app and create your account to rent instantly.</div>
      <div class="upsell-links">
        <a class="upsell-btn" id="appStoreLink" href="#" target="_blank">App Store</a>
        <a class="upsell-btn" id="googlePlayLink" href="#" target="_blank">Google Play</a>
      </div>
    </div>
  </div>

  <div class="s3-foot">
    <button class="btn btn-black" onclick="resetApp()">
      <span data-i18n="done">Done</span>
    </button>
    <button class="btn btn-outline" data-i18n="downloadReceipt">Download receipt as PDF</button>
  </div>
</div>
```

- [ ] **Step 3: Add receipt population + resetApp inside `<script>`**

```js
// ── Populate receipt from live data ───────────────────
function populateReceipt() {
  // Duration
  const totalMins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  const durationEl = document.getElementById('receiptDuration');
  if (durationEl) durationEl.textContent = totalMins + 'm ' + remSecs + 's';

  // Blocks and total
  const demoBlock = 30;
  const blocks = Math.floor(secs / demoBlock);
  const cost = Math.min(blocks * KRGA_CONFIG.pricing.blockPriceMXN, KRGA_CONFIG.pricing.dailyCapMXN);
  const blocksEl = document.getElementById('receiptBlocks');
  if (blocksEl) blocksEl.textContent = blocks + ' × $' + KRGA_CONFIG.pricing.blockPriceMXN + ' MXN';
  const totalEl = document.getElementById('receiptTotal');
  if (totalEl) totalEl.textContent = '$' + cost + ' MXN';

  // Email
  const emailVal = document.getElementById('emailInput')?.value || 'user@email.com';
  const emailEl = document.getElementById('receiptEmail');
  if (emailEl) emailEl.textContent = emailVal;

  // App links from config
  const asLink = document.getElementById('appStoreLink');
  const gpLink = document.getElementById('googlePlayLink');
  if (asLink) asLink.href = KRGA_CONFIG.appLinks.appStore;
  if (gpLink) gpLink.href = KRGA_CONFIG.appLinks.googlePlay;
}

// ── Reset to start ─────────────────────────────────────
function resetApp() {
  secs = 0;
  show('s0');
}
```

Update `handleBatteryReturned`:

```js
function handleBatteryReturned() {
  stopTimer();
  stopPolling();
  populateReceipt();
  show('s3');
}
```

- [ ] **Step 4: Verify in browser**

Run through full flow: Screen 0 → 1 → 2 → wait 90s → Screen 3 auto-appears.
Expected:
- Duration and blocks auto-calculated from elapsed time
- Email from the email field appears in the "receipt sent to" line
- App Store / Google Play buttons link to `config.appLinks` values
- "Done" returns to Screen 0

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add Screen 3 receipt with auto-populated order summary and app download upsell"
```

---

## Task 8: Update README for Developers

**Files:**
- Modify: `krga web-app/README.md`

- [ ] **Step 1: Rewrite README.md**

```markdown
# krga — Web App v2

Scan-to-rent battery flow. Mobile-first, no framework, no build step.

## Screens

1. **Landing** — station info, price, availability (post-QR)
2. **Payment** — phone, email, Stripe Elements, Apple Pay / Google Pay
3. **Active rental** — live timer, cost meter, auto-return detection
4. **Receipt** — order summary, deposit released, app download upsell

## File Structure

```
krga web-app/
├── index.html   — all screens + JS logic + i18n bindings
├── config.js    — API endpoints, pricing, copy, Stripe key, demo flag
├── i18n.js      — all UI strings in EN and ES
└── assets/
    ├── logo-color.png  (used on dark backgrounds)
    └── logo-black.png  (for light backgrounds if needed)
```

## Connecting to the Backend

1. Open `config.js`
2. Set `demo: false`
3. Replace each `/api/...` path with your real endpoint URLs
4. Set `stripe.publishableKey` to your real Stripe publishable key
5. Add `<script src="https://js.stripe.com/v3/"></script>` to `<head>` in `index.html`
6. Call `startPolling(rentId)` instead of `startDemoPolling()` in the `payAndGo()` function

### API Contracts

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `stationStatus` | GET | — | `{ name, address, available, total, chargeLevel }` |
| `initPayment` | POST | `{ amount, email, phone, method }` | `{ clientSecret, rentId }` |
| `unlockBattery` | POST | `{ stationId, paymentId }` | `{ rentId }` |
| `pollRentStatus` | GET | — | `{ returned: bool, cost: number, elapsedSecs: number }` |
| `downloadReceipt` | GET | — | PDF blob |

### Updating the Payment Notice Text

Edit `config.ui.paymentNotice` in `config.js` — or better, fetch it from your operator API at page load so you can update it without a deploy:

```js
// in DOMContentLoaded, after initPaymentNotice():
fetch('/api/ui/payment-notice')
  .then(r => r.json())
  .then(d => { document.getElementById('paymentNotice').innerHTML = d.text; });
```

## Language Support

Default: English. Globe button (bottom-right) switches to Spanish. Choice persists via `localStorage`.

To add a new language: add a new key to `KRGA_I18N` in `i18n.js` and add a `.lang-opt` button in the `#langMenu` div in `index.html`.

## Deploying

Any static host works — no server required.

- **Vercel**: connect GitHub repo, auto-detects `index.html`
- **Netlify Drop**: drag the `krga web-app/` folder to netlify.com/drop
- **GitHub Pages**: Settings → Pages → main branch → / (root)
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with v2 developer integration guide"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Outfit font | Task 3 |
| Taupe/lime palette | Task 3 |
| Logo image (color on dark) | Task 4 |
| EN default, ES toggle, localStorage | Task 3 |
| Globe floating button | Task 3 |
| data-i18n on all text elements | Tasks 4–7 |
| config.js with all endpoints | Task 1 |
| i18n.js with en/es objects | Task 2 |
| Screen 0: station info, price, CTA | Task 4 |
| Screen 1: phone + email + Stripe + Apple/Google Pay | Task 5 |
| Screen 1: payment notice from config.ui | Task 5 |
| Screen 2: timer, cost meter, no slot, no return button | Task 6 |
| Screen 2: auto-return polling | Task 6 |
| Screen 2: demo auto-returns after 90s | Task 6 |
| Screen 3: receipt auto-populated | Task 7 |
| Screen 3: app download upsell with config links | Task 7 |
| README for developers | Task 8 |

All spec requirements covered. No gaps.

**Placeholder scan:** No TBDs, no "similar to Task N" references, no steps without code.

**Type consistency:** `KRGA_CONFIG`, `KRGA_I18N`, `setLang()`, `show()`, `payAndGo()`, `startTimer()`, `stopTimer()`, `startDemoPolling()`, `startPolling()`, `stopPolling()`, `handleBatteryReturned()`, `populateReceipt()`, `resetApp()` — all defined before use, named consistently across tasks.
