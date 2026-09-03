import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.settings.v1';

const DEFAULTS = {
  restSeconds: 90,
  weightIncrement: 2.5,
  repIncrement: 2,
  progressionMode: 'weight', // 'weight' | 'reps'
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch (e) {
    return DEFAULTS;
  }
}

function save(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // storage unavailable — settings still work in-memory for this session
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
