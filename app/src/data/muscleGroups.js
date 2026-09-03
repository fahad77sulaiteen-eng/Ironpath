// Groups the dataset's specific `muscle` display strings (e.g. "Upper
// chest", "Rear delts") into 6 broad categories, used for the filter chips
// and for finding same-muscle swap alternatives.

export const MUSCLE_GROUPS = [
  { id: 'chest', labelKey: 'muscleChest' },
  { id: 'shoulders', labelKey: 'muscleShoulders' },
  { id: 'back', labelKey: 'muscleBack' },
  { id: 'arms', labelKey: 'muscleArms' },
  { id: 'legs', labelKey: 'muscleLegs' },
  { id: 'core', labelKey: 'muscleCore' },
];

const MUSCLE_TO_GROUP = {
  Chest: 'chest',
  'Upper chest': 'chest',
  'Inner chest': 'chest',
  'Front delts': 'shoulders',
  'Side delts': 'shoulders',
  'Rear delts': 'shoulders',
  Lats: 'back',
  'Mid back': 'back',
  'Lats, mid back': 'back',
  Biceps: 'arms',
  'Biceps, forearms': 'arms',
  Triceps: 'arms',
  'Quads, glutes': 'legs',
  Hamstrings: 'legs',
  Quads: 'legs',
  Glutes: 'legs',
  Calves: 'legs',
  Abs: 'core',
  Obliques: 'core',
};

export function groupFor(muscle) {
  return MUSCLE_TO_GROUP[muscle] || null;
}
