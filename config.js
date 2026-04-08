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
