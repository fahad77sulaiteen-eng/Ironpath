// Bundles every ironpath.* localStorage key into one downloadable JSON file,
// and restores it back. This is the only backup mechanism — everything is
// localStorage, so losing the browser/device loses the data without it.

const PREFIX = 'ironpath.';
const EXPORT_VERSION = 1;

function collectKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  return keys;
}

export function exportData() {
  const data = {};
  for (const key of collectKeys()) {
    try {
      data[key] = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      data[key] = localStorage.getItem(key);
    }
  }
  const payload = { version: EXPORT_VERSION, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ironpath-backup-${payload.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Resolves { ok: true } on success, { ok: false, error } with a short
// human-readable reason otherwise. Reloads the page on success so every
// hook re-reads the restored localStorage from scratch.
export async function importData(file) {
  let payload;
  try {
    const text = await file.text();
    payload = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: 'invalid-json' };
  }
  if (!payload || typeof payload !== 'object' || !payload.data || typeof payload.data !== 'object') {
    return { ok: false, error: 'invalid-shape' };
  }
  const entries = Object.entries(payload.data).filter(([k]) => k.startsWith(PREFIX));
  if (!entries.length) return { ok: false, error: 'empty' };
  try {
    for (const [key, value] of entries) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  } catch (e) {
    return { ok: false, error: 'storage-write-failed' };
  }
  return { ok: true };
}
