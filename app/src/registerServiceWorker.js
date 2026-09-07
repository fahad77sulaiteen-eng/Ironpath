// Only registers in production — the dev server serves many unbundled ES
// modules that a cache-first service worker would fight with (stale
// modules during hot reload). Also a no-op wherever service workers
// aren't supported (older browsers, some sandboxed preview contexts).
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // offline support just won't be available — the app still works online
    });
  });
}
