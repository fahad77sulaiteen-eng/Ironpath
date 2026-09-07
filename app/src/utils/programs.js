// Resolves which training program is active for a given tracker week (0-3),
// and which fourDay a/b variant set that week should use. `programMode`
// comes from settings: 'auto' alternates fourDay/upperLower by week,
// 'fourDay'/'upperLower' pin a single program for every week.
import { PROGRAMS } from '../data/exercises';

export function programForWeek(week, programMode) {
  if (programMode === 'fourDay') return PROGRAMS.fourDay;
  if (programMode === 'upperLower') return PROGRAMS.upperLower;
  return week % 2 === 0 ? PROGRAMS.fourDay : PROGRAMS.upperLower;
}

// Counts how many earlier weeks in the month also ran the 4-day program,
// so each fourDay week in a month gets a different a/b variant for variety.
export function setKeyForWeek(week, programMode) {
  let count = 0;
  for (let w = 0; w < week; w++) {
    if (programForWeek(w, programMode).id === 'fourDay') count++;
  }
  return count % 2 === 0 ? 'a' : 'b';
}
