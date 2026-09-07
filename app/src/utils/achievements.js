import { topSet } from '../hooks/useWorkoutLogs';

// Checks if any exercise ever had a session beat every session logged
// before it — a personal record on at least one lift.
function hasAnyPR(logs) {
  for (const sessions of Object.values(logs)) {
    const sorted = sessions.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
    let bestSoFar = -Infinity;
    for (const session of sorted) {
      const top = topSet(session);
      if (!top) continue;
      const score = top.weight * top.reps;
      if (bestSoFar > -Infinity && score > bestSoFar) return true;
      bestSoFar = Math.max(bestSoFar, score);
    }
  }
  return false;
}

// Badges are derived, not stored — an achievement stays "earned" as long
// as the underlying history still supports it (e.g. longestStreak, not
// the current streak, so a lapsed streak doesn't un-earn the badge).
export function computeAchievements({ logs, workoutDates, longestStreak }) {
  return [
    { id: 'first_workout', unlocked: workoutDates.length >= 1 },
    { id: '7_day_streak', unlocked: longestStreak >= 7 },
    { id: '10_sessions', unlocked: workoutDates.length >= 10 },
    { id: 'first_pr', unlocked: hasAnyPR(logs) },
  ];
}
