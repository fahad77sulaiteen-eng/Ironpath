import { groupFor } from '../data/muscleGroups';

// Pulls the display fields for one exercise entry at a given set (a/b) —
// the same flat shape every card/Workout Mode step renders, so a swapped-in
// alternative can be used interchangeably regardless of which program (and
// which entry shape) it came from. The 4-day program's entries carry an
// a/b pair to pick between; the Upper/Lower program's entries are already
// single-variant and pass through unchanged (setKey is irrelevant to them).
export function pickVariant(entry, setKey) {
  if (entry.a === undefined && entry.b === undefined) {
    return {
      name: entry.name,
      nameAr: entry.ar.name,
      machine: entry.machine,
      machineAr: entry.ar.machine,
      img: entry.img,
      slug: entry.slug,
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

function ownSlugsOf(entry) {
  return entry.a === undefined && entry.b === undefined
    ? new Set([entry.slug])
    : new Set([entry.aSlug, entry.bSlug]);
}

// Up to 2 other exercises in the same active program that hit the same
// muscle group, for "this machine's busy" substitution. Excludes the
// exercise's own a/b pair (or its own slug, for single-variant entries) and
// prefers an exact muscle-string match before falling back to the broader
// group. `ex` is the active program's exercise map (`program.ex`), so
// swaps only ever offer machines from the program currently in view.
export function findAlternatives(ex, dayId, index, setKey) {
  const current = ex[dayId][index];
  const group = groupFor(current.muscle);
  if (!group) return [];

  const all = Object.entries(ex).flatMap(([d, list]) => list.map((entry, i) => ({ dayId: d, index: i, entry })));
  const ownSlugs = ownSlugsOf(current);
  const candidates = all.filter(({ dayId: d, index: i, entry }) => {
    if (d === dayId && i === index) return false;
    if (groupFor(entry.muscle) !== group) return false;
    const entrySlugs = ownSlugsOf(entry);
    for (const s of entrySlugs) if (ownSlugs.has(s)) return false;
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
