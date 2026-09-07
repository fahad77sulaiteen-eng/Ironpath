// Offline support for the deployed (single-file) build: precache the app
// shell and the exercise photos, then serve same-origin GETs cache-first
// with a background refresh so updates still arrive without breaking
// offline use.
const CACHE_NAME = 'ironpath-v2';

const IMG_FILES = [
  'ab_crunch_machine.jpg', 'assisted_pullup_machine.jpg', 'biceps_curl_machine.jpg',
  'cable_crunch.jpg', 'cable_curl.jpg', 'cable_face_pull.jpg', 'cable_fly.jpg',
  'cable_lateral_raise.jpg', 'cable_overhead_extension.jpg', 'cable_rope_hammer_curl.jpg',
  'cable_triceps_pushdown.jpg', 'captains_chair_knee_raise.jpg', 'chest_press_machine.jpg',
  'hack_squat.jpg', 'high_cable_curl.jpg', 'hip_thrust_machine.jpg', 'incline_press_machine.jpg',
  'lat_pulldown.jpg', 'lateral_raise_machine.jpg', 'leg_extension.jpg', 'leg_press.jpg',
  'leg_press_calf_raise.jpg', 'lying_leg_curl.jpg', 'pec_deck.jpg', 'reverse_pec_deck.jpg',
  'seated_cable_row.jpg', 'seated_leg_curl.jpg', 'seated_row_machine.jpg', 'shoulder_press_machine.jpg',
  'smith_bench_press.jpg', 'smith_incline_press.jpg', 'smith_romanian_deadlift.jpg',
  'smith_shoulder_press.jpg', 'smith_squat.jpg', 'standing_calf_raise_machine.jpg',
];

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  ...IMG_FILES.map((f) => `./img/${f}`),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
