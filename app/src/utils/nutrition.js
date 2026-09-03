// Mifflin-St Jeor BMR, activity-scaled TDEE, and rough calorie/protein
// targets per goal. These are standard rule-of-thumb formulas — the UI
// that displays them always pairs them with a not-medical-advice notice.

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR({ weightKg, heightCm, age, sex }) {
  if (!(weightKg > 0) || !(heightCm > 0) || !(age > 0)) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'female' ? base - 161 : base + 5;
}

export function calculateTDEE(bmr, activityLevel) {
  if (!(bmr > 0)) return null;
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] ?? ACTIVITY_MULTIPLIERS.moderate;
  return bmr * mult;
}

// A fixed ±500kcal/day (~0.5kg/week) is the standard beginner-friendly rate
// for cutting/bulking — aggressive enough to see progress, mild enough to
// sustain and to preserve muscle/performance in the gym.
export function calorieTarget(tdee, goalType) {
  if (!(tdee > 0)) return null;
  switch (goalType) {
    case 'lose_fat':
      return Math.round(tdee - 500);
    case 'build_muscle':
      return Math.round(tdee + 300);
    case 'recomp':
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

// g/kg bodyweight, within the 1.6–2.2 range — higher in a deficit to help
// preserve muscle, lower at maintenance.
export function proteinTarget(weightKg, goalType) {
  if (!(weightKg > 0)) return null;
  const perKg = { lose_fat: 2.2, recomp: 2.0, build_muscle: 1.8, maintain: 1.6 }[goalType] ?? 1.8;
  return Math.round(weightKg * perKg);
}
