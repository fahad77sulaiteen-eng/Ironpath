import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { todayISO } from './useWorkoutLogs';

const LAST_SHOWN_KEY = 'ironpath.reminderShown.v1';

function hasWorkoutToday(logs, today) {
  return Object.values(logs).some((sessions) =>
    sessions.some((s) => s.date === today && s.sets.some((set) => set && set.weight > 0 && set.reps > 0))
  );
}

// Best-effort only: this can show a notification while the app is open (or
// briefly after, on some platforms with an installed PWA) — a static site
// with no server/push service cannot reliably wake a fully closed browser.
export function useTrainingReminder(enabled, logs) {
  const { t } = useI18n();

  useEffect(() => {
    if (!enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const check = () => {
      const today = todayISO();
      let lastShown = null;
      try {
        lastShown = localStorage.getItem(LAST_SHOWN_KEY);
      } catch (e) {
        // storage unavailable — reminder may repeat within the same day
      }
      if (lastShown === today) return;
      if (hasWorkoutToday(logs, today)) return;

      new Notification(t('reminderMessage'));
      try {
        localStorage.setItem(LAST_SHOWN_KEY, today);
      } catch (e) {
        // storage unavailable — non-fatal, just may re-show later today
      }
    };

    check();
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [enabled, logs, t]);
}
