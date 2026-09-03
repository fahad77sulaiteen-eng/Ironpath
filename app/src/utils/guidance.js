// A one-line "what to do this week" nudge, derived from the recent weight
// (and, for recomp, body-fat %) trend against the chosen goal. Deliberately
// simple — a trend direction, not a coached program — the UI always pairs
// this with an estimates-not-medical-advice notice.

const WINDOW_DAYS = 14;

function trendDelta(entries, field) {
  const points = entries.filter((e) => e[field] != null);
  if (points.length < 2) return null;
  const latest = points[points.length - 1];
  const latestTime = new Date(latest.date).getTime();
  const cutoff = latestTime - WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const baseline = points.find((e) => new Date(e.date).getTime() >= cutoff) || points[0];
  if (baseline === latest) return null;
  return latest[field] - baseline[field];
}

// Returns an i18n key (see strings.js) for the recommendation, or null if
// there isn't enough data yet.
export function weeklyGuidanceKey(entries, goalType) {
  const weightDelta = trendDelta(entries, 'weightKg');

  if (goalType === 'recomp') {
    const fatDelta = trendDelta(entries, 'bodyFatPct');
    if (fatDelta != null) return fatDelta <= -0.2 ? 'guidanceProgressing' : 'guidanceStalledLoss';
    if (weightDelta == null) return 'guidanceNeedsMoreData';
    return Math.abs(weightDelta) <= 0.5 ? 'guidanceOnTrackMaintain' : weightDelta > 0 ? 'guidanceDriftedUp' : 'guidanceDriftedDown';
  }

  if (weightDelta == null) return 'guidanceNeedsMoreData';

  switch (goalType) {
    case 'lose_fat':
      return weightDelta <= -0.2 ? 'guidanceProgressing' : 'guidanceStalledLoss';
    case 'build_muscle':
      return weightDelta >= 0.2 ? 'guidanceProgressing' : 'guidanceStalledGain';
    case 'maintain':
    default:
      if (Math.abs(weightDelta) <= 0.5) return 'guidanceOnTrackMaintain';
      return weightDelta > 0 ? 'guidanceDriftedUp' : 'guidanceDriftedDown';
  }
}
