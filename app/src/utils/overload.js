// Progressive-overload helpers: a 1RM estimate and a next-session nudge.

// Epley formula — a standard, simple 1RM estimate from one set.
export function estimateOneRM(weight, reps) {
  if (!(weight > 0) || !(reps > 0)) return null;
  return weight * (1 + reps / 30);
}

// If every logged set in `session` met or beat the exercise's target reps,
// the lifter is ready to add load next time. `exercise` is the EX entry
// (has `sets`/`reps` targets); `settings` carries the increment + mode.
export function suggestNext(exercise, session, settings) {
  if (!session || !session.sets.length) return null;
  const targetReps = Number(exercise.reps);
  const validSets = session.sets.filter((s) => s && s.weight > 0 && s.reps > 0);
  if (validSets.length < exercise.sets) return null;
  const allMetTarget = validSets.every((s) => s.reps >= targetReps);
  if (!allMetTarget) return null;

  const topWeight = Math.max(...validSets.map((s) => s.weight));
  if (settings.progressionMode === 'reps') {
    return { type: 'reps', weight: topWeight, reps: targetReps + settings.repIncrement };
  }
  return { type: 'weight', weight: topWeight + settings.weightIncrement, reps: targetReps };
}
