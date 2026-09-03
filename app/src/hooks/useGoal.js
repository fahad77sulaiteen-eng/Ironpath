import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.goal.v1';

const DEFAULTS = {
  type: 'maintain', // 'lose_fat' | 'build_muscle' | 'recomp' | 'maintain'
  targetWeightKg: null,
  targetBodyFatPct: null,
  targetDate: null,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULTS;
  }
}

function save(goal) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
  } catch (e) {
    // storage unavailable — goal still works in-memory for this session
  }
}

export function useGoal() {
  const [goal, setGoal] = useState(load);

  const updateGoal = useCallback((patch) => {
    setGoal((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  return { goal, updateGoal };
}
