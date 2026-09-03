import { EX } from '../data/exercises';
import { groupFor } from '../data/muscleGroups';

// Flattened once: every exercise entry tagged with where it lives (day +
// index), so alternatives can be found across the whole program, not just
// the current day.
const ALL = Object.entries(EX).flatMap(([dayId, list]) => list.map((entry, index) => ({ dayId, index, entry })));

// Pulls the display fields for one exercise entry at a given set (a/b) —
// the same shape WorkoutSection already renders, so a swapped-in
// alternative or a Workout Mode step can use it interchangeably.
export function pickVariant(entry, setKey) {
  const isA = setKey === 'a';
  return {
    name: isA ? entry.a : entry.b,
    nameAr: isA ? entry.ar.a : entry.ar.b,
    machine: isA ? entry.am : entry.bm,
    machineAr: isA ? entry.ar.am : entry.ar.bm,
    img: isA ? entry.aImg : entry.bImg,
    slug: isA ? entry.aSlug : entry.bSlug,
    cue: entry.cue,
    cueAr: entry.ar.cue,
    muscle: entry.muscle,
    muscleAr: entry.ar.muscle,
    kind: entry.kind,
    pts: entry.pts,
    view: entry.view,
    sets: entry.sets,
    reps: entry.reps,
  };
}

// Up to 2 other exercises that hit the same muscle group, for "this
// machine's busy" substitution. Excludes the exercise's own a/b pair
// (which already appears elsewhere on other days) and prefers an exact
// muscle-string match before falling back to the broader group.
export function findAlternatives(dayId, index, setKey) {
  const current = EX[dayId][index];
  const group = groupFor(current.muscle);
  if (!group) return [];

  const ownSlugs = new Set([current.aSlug, current.bSlug]);
  const candidates = ALL.filter(({ dayId: d, index: i, entry }) => {
    if (d === dayId && i === index) return false;
    if (groupFor(entry.muscle) !== group) return false;
    if (ownSlugs.has(entry.aSlug) || ownSlugs.has(entry.bSlug)) return false;
    return true;
  });

  const seen = new Set();
  const ranked = candidates
    .map(({ entry }) => pickVariant(entry, setKey))
    .filter((v) => {
      if (seen.has(v.slug)) return false;
      seen.add(v.slug);
      return true;
    })
    .sort((a, b) => {
      const aExact = a.muscle === current.muscle ? 0 : 1;
      const bExact = b.muscle === current.muscle ? 0 : 1;
      return aExact - bExact;
    });

  return ranked.slice(0, 2);
}
