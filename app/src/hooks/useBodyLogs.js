import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.bodylogs.v1';

// One entry per date: { date, weightKg, bodyFatPct, muscleMassKg, waistCm, armCm, chestCm }.
// Any field can be missing — the user logs what they measured that day.

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function save(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    // storage unavailable — log still works in-memory for this session
  }
}

export function useBodyLogs() {
  const [entries, setEntries] = useState(load);

  // Merges `patch` into the entry for `date` (creating it if needed), so
  // logging weight today and body fat % tomorrow both land on their own dates.
  const logEntry = useCallback((date, patch) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.date === date);
      const next = prev.slice();
      if (idx === -1) {
        next.push({ date, ...patch });
      } else {
        next[idx] = { ...next[idx], ...patch };
      }
      next.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      save(next);
      return next;
    });
  }, []);

  const sorted = entries.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const latest = sorted.length ? sorted[sorted.length - 1] : null;

  return { entries: sorted, latest, logEntry };
}
