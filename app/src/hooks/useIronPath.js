import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (d && Array.isArray(d.sessions) && d.sessions.length === 16) {
      return { sessions: d.sessions.map(Boolean), day: Number(d.day) || 0 };
    }
  } catch (e) {
    // ignore malformed/unavailable storage
  }
  return null;
}

function save(sessions, day) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, day }));
  } catch (e) {
    // storage unavailable (private browsing, quota) — state still works in-memory
  }
}

export function currentWeek(sessions) {
  for (let w = 0; w < 4; w++) {
    if (sessions.slice(w * 4, w * 4 + 4).some((v) => !v)) return w;
  }
  return 3;
}

export function useIronPath() {
  const [initial] = useState(loadInitial);
  const [sessions, setSessions] = useState(() => initial?.sessions ?? new Array(16).fill(false));
  const [day, setDay] = useState(() => initial?.day ?? 0);

  const toggle = useCallback((i) => {
    setSessions((prev) => {
      const week = Math.floor(i / 4);
      if (week > currentWeek(prev)) return prev;
      const next = prev.slice();
      next[i] = !next[i];
      const nextDay = i % 4;
      setDay(nextDay);
      save(next, nextDay);
      return next;
    });
  }, []);

  const resetMonth = useCallback(() => {
    const next = new Array(16).fill(false);
    setSessions(next);
    setDay(0);
    save(next, 0);
  }, []);

  const selectDay = useCallback((i) => setDay(i), []);

  return { sessions, day, toggle, resetMonth, selectDay };
}
