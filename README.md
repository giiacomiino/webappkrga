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
5. In `index.html`, the `<script src="https://js.stripe.com/v3/"></script>` tag is already in `<head>`
6. Replace the `payAndGo()` function body to make real API calls. Example pattern:

```js
async function payAndGo() {
  const email = document.getElementById('emailInput')?.value;
  // 1. Init payment and get clientSecret + rentId
  const payRes = await fetch(KRGA_CONFIG.api.initPayment, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: KRGA_CONFIG.pricing.depositMXN, email, method: 'card' }),
  });
  const { rentId } = await payRes.json();
  // 2. Unlock battery
  await fetch(KRGA_CONFIG.api.unlockBattery, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stationId: 'K-042', paymentId: rentId }),
  });
  // 3. Transition and start real polling
  show('s2');
  startTimer();
  startPolling(rentId);
}
```

### API Contracts

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `stationStatus` | GET | — | `{ name, address, available, total, chargeLevel }` |
| `initPayment` | POST | `{ amount, email, phone, method }` | `{ clientSecret, rentId }` |
| `unlockBattery` | POST | `{ stationId, paymentId }` | `{ rentId }` |
| `pollRentStatus` | GET | — | `{ returned: bool, cost: number, elapsedSecs: number }` |
| `downloadReceipt` | GET | — | PDF blob |

### Updating the Payment Notice Text

Edit `config.ui.paymentNotice` in `config.js`. To update it dynamically from your operator backend without a code deploy, replace the `initPaymentNotice()` call in `DOMContentLoaded` with a fetch:

```js
fetch('/api/ui/payment-notice')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('paymentNotice');
    if (el) el.innerHTML = d.text;
  });
```

> **Note:** `config.ui.paymentNotice` is a single string (English by default). If you need localized payment notices, either serve the text from your backend based on the user's language, or add it to `i18n.js` with keys like `paymentNotice_en` and `paymentNotice_es`.

## Language Support

Default: English. Globe button (bottom-right) switches to Spanish. Choice persists via `localStorage`.

To add a new language:
1. Add a new top-level key to `KRGA_I18N` in `i18n.js` (e.g. `fr: { ... }`) with all 39 string keys
2. Add a `.lang-opt` button in the `#langMenu` div in `index.html`

## Deploying

Any static host — no server required.

- **Vercel**: connect GitHub repo, auto-detects `index.html`
- **Netlify Drop**: drag the `krga web-app/` folder to app.netlify.com/drop
- **GitHub Pages**: Settings → Pages → main branch → / (root)
