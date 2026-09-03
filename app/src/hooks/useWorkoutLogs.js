import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.logs.v1';

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function save(logs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    // storage unavailable — state still works in-memory for this session
  }
}

// Most recent session strictly before `beforeDate` (defaults to excluding
// today), so "last time" reflects the previous workout, not today's in-progress one.
export function lastSessionBefore(sessionLog, beforeDate) {
  const list = (sessionLog || []).filter((s) => s.date < beforeDate);
  if (!list.length) return null;
  return list[list.length - 1];
}

export function topSet(session) {
  if (!session || !session.sets.length) return null;
  return session.sets.reduce((best, s) => {
    if (!s || !(s.weight > 0) || !(s.reps > 0)) return best;
    if (!best) return s;
    return s.weight * s.reps > best.weight * best.reps ? s : best;
  }, null);
}

export function useWorkoutLogs() {
  const [logs, setLogs] = useState(loadLogs);

  const getExerciseLogs = useCallback((slug) => logs[slug] || [], [logs]);

  const logSet = useCallback((slug, index, set) => {
    setLogs((prev) => {
      const date = todayISO();
      const sessions = prev[slug] ? prev[slug].slice() : [];
      let todayIdx = sessions.findIndex((s) => s.date === date);
      let today = todayIdx === -1 ? { date, sets: [] } : { ...sessions[todayIdx], sets: sessions[todayIdx].sets.slice() };
      while (today.sets.length <= index) today.sets.push(null);
      today.sets[index] = set;
      if (todayIdx === -1) {
        sessions.push(today);
      } else {
        sessions[todayIdx] = today;
      }
      const next = { ...prev, [slug]: sessions };
      save(next);
      return next;
    });
  }, []);

  const removeSetAt = useCallback((slug, index) => {
    setLogs((prev) => {
      const date = todayISO();
      const sessions = prev[slug] ? prev[slug].slice() : [];
      const todayIdx = sessions.findIndex((s) => s.date === date);
      if (todayIdx === -1) return prev;
      const sets = sessions[todayIdx].sets.slice();
      sets.splice(index, 1);
      sessions[todayIdx] = { ...sessions[todayIdx], sets };
      const next = { ...prev, [slug]: sessions };
      save(next);
      return next;
    });
  }, []);

  return { logs, getExerciseLogs, logSet, removeSetAt };
}
