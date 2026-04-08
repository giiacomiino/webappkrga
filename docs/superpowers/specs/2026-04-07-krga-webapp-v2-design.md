# krga web-app v2 — Design Spec

**Date:** 2026-04-07  
**Status:** Approved  
**Scope:** i18n (EN/ES), visual rebrand (Outfit + taupe/lime palette + logo), developer handoff structure, updated rental flow

---

## Overview

Rebuild the krga web-app prototype to reflect the real scan-to-rent flow, match the krga.mx visual identity, support English/Spanish switching, and be structured for clean backend integration by the dev team.

---

## File Structure

```
krga web-app/
├── index.html      — app shell, all screens, i18n bindings, screen logic
├── i18n.js         — all UI strings in EN and ES
├── config.js       — API endpoints, pricing, UI copy, polling config, demo flag
└── README.md       — updated developer guide
```

No build step, no framework dependencies. Runs from any static host.

---

## Visual Identity

| Token | Value | Notes |
|---|---|---|
| Font | `Outfit` (Google Fonts) | weights 400, 600, 700, 800 — replaces Sora |
| Background | `#B8B5A6` (taupe) | replaces beige #f0ede6 |
| Dark bg | `#111111` | unchanged |
| Accent | `#E8EDB5` (lime) | replaces green #4ade80 — used on primary CTAs |
| Muted text | `#47453D` | replaces #8a8580 |
| Card bg | `#C8C5B8` | replaces white cards |
| Logo (dark bg) | `assets/logo-color.png` | used in Screen 0 header |
| Logo (light bg) | `assets/logo-black.png` | if needed in light sections |

All CSS variables updated in `:root`. No class names change — only values.

---

## Internationalization

- **Default language:** English
- **Available languages:** English (`en`), Spanish (`es`)
- **Persistence:** `localStorage.setItem('krga_lang', lang)` — survives page refresh
- **Toggle UI:** Floating globe button (`🌐`), fixed bottom-right corner, visible on all screens
- **Mechanism:**
  - Every text node in HTML has `data-i18n="key"` attribute
  - `i18n.js` exports `const KRGA_I18N = { en: {...}, es: {...} }`
  - `setLang(lang)` iterates `[data-i18n]` elements and sets `textContent` from the dictionary
  - Called on page load (reads `localStorage`) and on toggle tap

---

## Screen Flow

### Screen 0 — Landing (post-QR scan)

User arrives by scanning the QR code on the physical station. No login required at this point.

**Content:**
- Logo (image) + tagline (i18n)
- Station status chip: "Active station · [station-id]" (i18n)
- Station card: name, address, available batteries count, total slots, charge level
- Cable types: Lightning, USB-C, Micro-USB
- Price strip: price per block, daily cap
- CTA: "Rent a battery" (i18n) → goes to Screen 1
- Ghost link: "See nearby stations" (placeholder, wired to `config.api.nearbyStations`)

**Data source:** `config.js` in demo mode; `config.api.stationStatus` in production.

---

### Screen 1 — User Info + Payment

**Fields:**
- Phone number (`tel` input, `inputmode="numeric"`, `autocomplete="tel"`)
- Email (`email` input, `autocomplete="email"`)

**Payment section:**
- Apple Pay button (calls `config.api.initPayment` with method `apple_pay`)
- Google Pay button (calls `config.api.initPayment` with method `google_pay`)
- Divider: "or pay with card" (i18n)
- Stripe Elements embed — Stripe renders its own secure card UI; no raw card inputs in our HTML

**Pre-auth notice:**
- Text pulled from `config.ui.paymentNotice` — devs connect this field to the operator backend so the copy can be updated without a code deploy

**CTA:** "Confirm and unlock battery" (i18n) → calls `config.api.initPayment`, on success calls `config.api.unlockBattery`, then transitions to Screen 2

---

### Screen 2 — Active Rental

**Content:**
- "Active rental" label + station name (i18n)
- Status badge: "Unlocked" (i18n)
- Elapsed time counter (MM:SS)
- Live cost meter (increments per block)
- Daily cap display
- Return instructions text (i18n)
- **No slot number displayed**
- **No manual return button**

**Auto-return detection:**
- On screen load, start polling `config.api.pollRentStatus` every `config.polling.intervalMs` (default 5000ms)
- When response includes `{ returned: true }`, stop polling and transition to Screen 3
- In demo mode, auto-trigger return after 90 seconds

---

### Screen 3 — Receipt

**Content:**
- Success checkmark icon
- "Battery returned" heading (i18n)
- Receipt sent to email confirmation (i18n)
- Order summary card: station, duration, blocks × price, deposit released, total charged
- **App download upsell card:** "Next time, one tap. Download the app and create your account." with App Store / Google Play links (placeholder URLs in `config.js`)
- CTA: "Done" → returns to Screen 0 (i18n)
- Secondary: "Download receipt as PDF" (placeholder, wired to `config.api.downloadReceipt`)

---

## config.js Structure

```js
const KRGA_CONFIG = {
  api: {
    stationStatus:    '/api/station/:id',      // GET
    initPayment:      '/api/payment/init',     // POST { amount, email, phone, method }
    unlockBattery:    '/api/rent/unlock',      // POST { stationId, paymentId }
    pollRentStatus:   '/api/rent/:id/status',  // GET → { returned: bool, cost: number, elapsed: number }
    downloadReceipt:  '/api/rent/:id/receipt', // GET → PDF
    nearbyStations:   '/api/stations/nearby',  // GET { lat, lng }
  },
  ui: {
    paymentNotice: "A pre-authorization of $800 MXN will be held as a deposit. Only actual usage time is charged. Deposit is released immediately upon battery return.",
  },
  pricing: {
    blockPriceMXN: 20,
    blockMinutes:  30,
    dailyCapMXN:   150,
    depositMXN:    800,
  },
  polling: {
    intervalMs: 5000,
  },
  appLinks: {
    appStore:    '#',   // replace with real App Store URL
    googlePlay:  '#',   // replace with real Google Play URL
  },
  stripe: {
    publishableKey: 'pk_test_REPLACE_ME',
  },
  demo: true,  // when true, all API calls return mock data
};
```

---

## i18n.js Structure

```js
const KRGA_I18N = {
  en: {
    tagline:             "charge your phone, always",
    stationActive:       "Active station",
    batteriesAvailable:  "Batteries available",
    totalSlots:          "Total slots",
    chargeLevel:         "Charge level",
    perBlock:            "MXN per 30 min",
    dailyCap:            "Daily cap",
    rentBattery:         "Rent a battery",
    nearbyStations:      "See nearby stations",
    confirmRent:         "Confirm your rental",
    paymentMethod:       "Payment method",
    yourPhone:           "Your phone number",
    yourEmail:           "Your email",
    quickPay:            "Quick pay",
    orCard:              "or pay with card",
    confirmUnlock:       "Confirm and unlock battery",
    activeRental:        "Active rental",
    unlocked:            "Unlocked",
    currentCost:         "Current cost",
    dailyCapLabel:       "Daily cap",
    returnTitle:         "How to return the battery?",
    returnBody:          "Go to any active KRGA station, scan the QR and insert the battery into any free slot. Charge stops instantly.",
    batteryReturned:     "Battery returned",
    receiptSent:         "Your receipt was sent to",
    rentalSummary:       "Rental summary",
    station:             "Station",
    duration:            "Duration",
    blocks:              "Blocks",
    deposit:             "Deposit",
    depositReleased:     "released",
    totalCharged:        "Total charged",
    upsellTitle:         "Next time, one tap.",
    upsellBody:          "Download the app and create your account to rent instantly.",
    downloadApp:         "Download the app",
    done:                "Done",
    downloadReceipt:     "Download receipt as PDF",
  },
  es: {
    tagline:             "tu celular, siempre cargado",
    stationActive:       "Estación activa",
    batteriesAvailable:  "Baterías disponibles",
    totalSlots:          "Slots totales",
    chargeLevel:         "Nivel de carga",
    perBlock:            "MXN por 30 minutos",
    dailyCap:            "Tope diario",
    rentBattery:         "Rentar batería",
    nearbyStations:      "Ver estaciones cercanas",
    confirmRent:         "Confirma tu renta",
    paymentMethod:       "Método de pago",
    yourPhone:           "Tu número de teléfono",
    yourEmail:           "Tu correo electrónico",
    quickPay:            "Pago rápido",
    orCard:              "o paga con tarjeta",
    confirmUnlock:       "Confirmar y desbloquear batería",
    activeRental:        "Renta activa",
    unlocked:            "Desbloqueada",
    currentCost:         "Costo actual",
    dailyCapLabel:       "Tope diario",
    returnTitle:         "¿Cómo devolver la batería?",
    returnBody:          "Dirígete a cualquier estación KRGA activa, escanea el QR e inserta la batería en cualquier slot libre. El cobro se detiene al instante.",
    batteryReturned:     "Batería devuelta",
    receiptSent:         "Tu recibo fue enviado a",
    rentalSummary:       "Resumen de renta",
    station:             "Estación",
    duration:            "Duración",
    blocks:              "Bloques",
    deposit:             "Garantía",
    depositReleased:     "liberada",
    totalCharged:        "Total cobrado",
    upsellTitle:         "La próxima vez, un solo toque.",
    upsellBody:          "Descarga la app y crea tu cuenta para rentar al instante.",
    downloadApp:         "Descargar la app",
    done:                "Finalizar",
    downloadReceipt:     "Descargar recibo en PDF",
  },
};
```

---

## Developer Notes

- `config.demo = true` makes all API calls return hardcoded mock responses — flip to `false` to go live
- Stripe integration: load `stripe.js` from Stripe's CDN, initialize with `config.stripe.publishableKey`, mount `CardElement` into `#stripe-card-element`
- `config.ui.paymentNotice` should be fetched from the operator API on page load so it can be updated remotely without a deploy
- Polling stops automatically when `returned: true` is received — ensure the endpoint returns this field reliably
- App Store / Google Play links live in `config.appLinks` — replace `'#'` with real URLs when available
