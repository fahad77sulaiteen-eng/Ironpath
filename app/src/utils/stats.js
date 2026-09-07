// Derives motivational stats purely from the workout logs — no separate
// stored state, so these numbers are always consistent with what's
// actually been logged.

function isRealSet(s) {
  return s && s.weight > 0 && s.reps > 0;
}

function diffDays(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / msPerDay);
}

// Every distinct calendar date (across all exercises) with at least one
// real logged set, sorted ascending.
export function getWorkoutDates(logs) {
  const dates = new Set();
  for (const sessions of Object.values(logs)) {
    for (const session of sessions) {
      if (session.sets.some(isRealSet)) dates.add(session.date);
    }
  }
  return Array.from(dates).sort();
}

// Consecutive calendar days ending today or yesterday — 0 if the most
// recent workout is further back than that (the streak has lapsed).
export function currentStreak(dates, todayStr) {
  if (!dates.length) return 0;
  const last = dates[dates.length - 1];
  if (diffDays(todayStr, last) > 1) return 0;

  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    if (diffDays(dates[i], dates[i - 1]) === 1) streak++;
    else break;
  }
  return streak;
}

// The longest run of consecutive days ever logged — used so a "7-day
// streak" achievement stays earned even after the streak later breaks.
export function longestStreak(dates) {
  if (!dates.length) return 0;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    run = diffDays(dates[i], dates[i - 1]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  return longest;
}

export function sessionsThisMonth(dates, todayStr) {
  const ym = todayStr.slice(0, 7);
  return dates.filter((d) => d.slice(0, 7) === ym).length;
}

// Lifetime sum of weight × reps across every logged set — a big, always-
// growing number that rewards consistency over any single session.
export function totalVolume(logs) {
  let total = 0;
  for (const sessions of Object.values(logs)) {
    for (const session of sessions) {
      for (const s of session.sets) {
        if (isRealSet(s)) total += s.weight * s.reps;
      }
    }
  }
  return Math.round(total);
}
