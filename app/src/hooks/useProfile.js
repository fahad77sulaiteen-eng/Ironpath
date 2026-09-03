import { useCallback, useState } from 'react';

const STORAGE_KEY = 'ironpath.profile.v1';

const DEFAULTS = {
  heightCm: null,
  age: null,
  sex: 'male', // 'male' | 'female' — Mifflin-St Jeor uses a different constant per sex
  activityLevel: 'moderate', // sedentary | light | moderate | active | very_active
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

function save(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    // storage unavailable — profile still works in-memory for this session
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(load);

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  const isComplete = Boolean(profile.heightCm && profile.age);

  return { profile, updateProfile, isComplete };
}
