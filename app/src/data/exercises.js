// Ported from IronPath.dc.html — day split and per-day exercise data.
// `pts` are [x, y] highlight points on the 0..60 x 0..124 BodyFigure viewBox.
// `aImg`/`bImg` are filenames under public/img/ — real muscle-highlight
// renders supplied for the matching set; null falls back to the animated
// SVG MachineDemo for that exercise.

export const DAYS = [
  { id: 'push', label: 'Push', focus: 'Chest, shoulders, triceps', pts: [[30, 27], [21, 23], [39, 23], [16, 38], [44, 38]], view: 'front' },
  { id: 'pull', label: 'Pull', focus: 'Back, biceps', pts: [[30, 21], [23, 34], [37, 34], [16, 38], [44, 38]], view: 'back' },
  { id: 'legs', label: 'Legs', focus: 'Quads, hamstrings, glutes, calves', pts: [[25, 70], [35, 70], [30, 60], [24, 101], [36, 101]], view: 'back' },
  { id: 'core', label: 'Upper + Core', focus: 'Full upper body and midsection', pts: [[30, 27], [30, 46], [22, 24], [38, 24]], view: 'front' },
];

export const EX = {
  push: [
    { a: 'Chest Press Machine', am: 'Seated chest press', aImg: 'chest_press_machine.jpg', b: 'Smith Bench Press', bm: 'Smith machine, flat bench', bImg: 'smith_bench_press.jpg', sets: 3, reps: '10', cue: 'Wrists stacked over your elbows. Stop just short of locking out.', muscle: 'Chest', view: 'front', pts: [[30, 27]], kind: 'horizPress' },
    { a: 'Incline Press Machine', am: 'Incline chest press', aImg: 'incline_press_machine.jpg', b: 'Smith Incline Press', bm: 'Smith machine, incline bench', bImg: 'smith_incline_press.jpg', sets: 3, reps: '10', cue: 'Press up and slightly in; keep your shoulders pulled down.', muscle: 'Upper chest', view: 'front', pts: [[30, 24]], kind: 'horizPress' },
    { a: 'Pec Deck', am: 'Pec deck / butterfly', aImg: 'pec_deck.jpg', b: 'Cable Fly', bm: 'Cable crossover station', bImg: 'cable_fly.jpg', sets: 3, reps: '12', cue: 'Hug, don’t press — elbows stay softly bent the whole way.', muscle: 'Inner chest', view: 'front', pts: [[30, 29]], kind: 'fly' },
    { a: 'Shoulder Press Machine', am: 'Seated shoulder press', aImg: 'shoulder_press_machine.jpg', b: 'Smith Shoulder Press', bm: 'Smith machine, upright bench', bImg: 'smith_shoulder_press.jpg', sets: 3, reps: '10', cue: 'Ribs down. Press overhead without arching your lower back.', muscle: 'Front delts', view: 'front', pts: [[22, 24], [38, 24]], kind: 'vertPress' },
    { a: 'Lateral Raise Machine', am: 'Seated lateral raise', aImg: 'lateral_raise_machine.jpg', b: 'Cable Lateral Raise', bm: 'Low cable pulley', bImg: 'cable_lateral_raise.jpg', sets: 3, reps: '15', cue: 'Lead with the elbows and stop at shoulder height.', muscle: 'Side delts', view: 'front', pts: [[20, 26], [40, 26]], kind: 'raise' },
    { a: 'Cable Triceps Pushdown', am: 'High cable, rope or bar', aImg: 'cable_triceps_pushdown.jpg', b: 'Cable Overhead Extension', bm: 'High cable, rope', bImg: 'cable_overhead_extension.jpg', sets: 3, reps: '12', cue: 'Pin your elbows to your sides — only the forearms move.', muscle: 'Triceps', view: 'back', pts: [[16, 38], [44, 38]], kind: 'pushdown' },
  ],
  pull: [
    { a: 'Lat Pulldown', am: 'Cable pulldown station', aImg: 'lat_pulldown.jpg', b: 'Assisted Pull-up Machine', bm: 'Assisted pull-up / dip', bImg: 'assisted_pullup_machine.jpg', sets: 3, reps: '10', cue: 'Pull the bar to your collarbone and keep your chest tall.', muscle: 'Lats', view: 'back', pts: [[23, 34], [37, 34]], kind: 'vertPull' },
    { a: 'Seated Cable Row', am: 'Low cable row station', aImg: 'seated_cable_row.jpg', b: 'Seated Row Machine', bm: 'Chest-supported row', bImg: 'seated_row_machine.jpg', sets: 3, reps: '10', cue: 'Drive your elbows past your ribs; don’t rock the torso.', muscle: 'Mid back', view: 'back', pts: [[30, 32]], kind: 'horizPull' },
    { a: 'Cable Face Pull', am: 'High cable, rope', aImg: 'cable_face_pull.jpg', b: 'Reverse Pec Deck', bm: 'Pec deck, reversed', bImg: 'reverse_pec_deck.jpg', sets: 3, reps: '15', cue: 'Pull to eye level with your thumbs pointing back.', muscle: 'Rear delts', view: 'back', pts: [[21, 25], [39, 25]], kind: 'horizPull' },
    { a: 'Biceps Curl Machine', am: 'Seated preacher curl', aImg: 'biceps_curl_machine.jpg', b: 'Cable Curl', bm: 'Low cable, straight bar', bImg: 'cable_curl.jpg', sets: 3, reps: '12', cue: 'Elbows stay put. Lower slower than you lift.', muscle: 'Biceps', view: 'front', pts: [[16, 38], [44, 38]], kind: 'curl' },
    { a: 'Cable Rope Hammer Curl', am: 'Low cable, rope', aImg: 'cable_rope_hammer_curl.jpg', b: 'High Cable Curl', bm: 'Twin high pulleys', bImg: 'high_cable_curl.jpg', sets: 3, reps: '12', cue: 'Neutral grip, no swinging — the rope should never jerk.', muscle: 'Biceps, forearms', view: 'front', pts: [[16, 40], [44, 40]], kind: 'curl' },
  ],
  legs: [
    { a: 'Leg Press', am: '45° leg press sled', aImg: 'leg_press.jpg', b: 'Hack Squat', bm: 'Hack squat machine', bImg: 'hack_squat.jpg', sets: 3, reps: '10', cue: 'Feet flat, knees tracking over your toes, never lock out hard.', muscle: 'Quads, glutes', view: 'front', pts: [[25, 70], [35, 70]], kind: 'legpress' },
    { a: 'Lying Leg Curl', am: 'Prone leg curl', aImg: 'lying_leg_curl.jpg', b: 'Seated Leg Curl', bm: 'Seated leg curl', bImg: 'seated_leg_curl.jpg', sets: 3, reps: '12', cue: 'Keep your hips pressed down and squeeze at the top.', muscle: 'Hamstrings', view: 'back', pts: [[25, 72], [35, 72]], kind: 'legcurl' },
    { a: 'Leg Extension', am: 'Seated leg extension', aImg: 'leg_extension.jpg', b: 'Smith Romanian Deadlift', bm: 'Smith machine, hip hinge', bImg: 'smith_romanian_deadlift.jpg', sets: 3, reps: '12', cue: 'Pause a full second at the top, then lower under control.', muscle: 'Quads', view: 'front', pts: [[25, 68], [35, 68]], kind: 'legext' },
    { a: 'Hip Thrust Machine', am: 'Seated hip thrust', aImg: 'hip_thrust_machine.jpg', b: 'Hip Abduction Machine', bm: 'Seated abduction', bImg: null, sets: 3, reps: '12', cue: 'Tuck the pelvis and squeeze the glutes — not the lower back.', muscle: 'Glutes', view: 'back', pts: [[30, 60]], kind: 'hipthrust' },
    { a: 'Standing Calf Raise Machine', am: 'Standing calf raise', aImg: 'standing_calf_raise_machine.jpg', b: 'Leg Press Calf Raise', bm: 'Leg press, toes only', bImg: 'leg_press_calf_raise.jpg', sets: 3, reps: '15', cue: 'Full stretch at the bottom, one-second pause at the top.', muscle: 'Calves', view: 'back', pts: [[24, 101], [36, 101]], kind: 'calf' },
  ],
  core: [
    { a: 'Chest Press Machine', am: 'Seated chest press', aImg: 'chest_press_machine.jpg', b: 'Cable Fly', bm: 'Cable crossover station', bImg: 'cable_fly.jpg', sets: 3, reps: '10', cue: 'Same cue as Push day: elbows under the handles, no lockout.', muscle: 'Chest', view: 'front', pts: [[30, 27]], kind: 'horizPress' },
    { a: 'Lat Pulldown', am: 'Cable pulldown station', aImg: 'lat_pulldown.jpg', b: 'Seated Row Machine', bm: 'Chest-supported row', bImg: 'seated_row_machine.jpg', sets: 3, reps: '10', cue: 'Lead with the elbows, finish with the shoulder blades.', muscle: 'Lats, mid back', view: 'back', pts: [[23, 34], [37, 34]], kind: 'vertPull' },
    { a: 'Lateral Raise Machine', am: 'Seated lateral raise', aImg: 'lateral_raise_machine.jpg', b: 'Cable Face Pull', bm: 'High cable, rope', bImg: 'cable_face_pull.jpg', sets: 3, reps: '15', cue: 'Light weight, slow tempo — shoulders fatigue fast.', muscle: 'Side delts', view: 'front', pts: [[20, 26], [40, 26]], kind: 'raise' },
    { a: 'Ab Crunch Machine', am: 'Seated ab crunch', aImg: 'ab_crunch_machine.jpg', b: 'Cable Crunch', bm: 'High cable, kneeling', bImg: 'cable_crunch.jpg', sets: 3, reps: '15', cue: 'Curl your ribs toward your hips; don’t pull with your arms.', muscle: 'Abs', view: 'front', pts: [[30, 46]], kind: 'crunch' },
    { a: 'Torso Rotation Machine', am: 'Seated rotation', aImg: null, b: 'Captain’s Chair Knee Raise', bm: 'Vertical knee raise', bImg: 'captains_chair_knee_raise.jpg', sets: 3, reps: '15', cue: 'Turn from the ribcage and keep your hips facing forward.', muscle: 'Obliques', view: 'front', pts: [[22, 44], [38, 44]], kind: 'rotation' },
  ],
};

// Design-canvas tweakable props in the prototype — fixed defaults for production.
export const DEMO_SPEED = 1;
export const REST_SECONDS = 75;
export const HERO_SCENE = 'chest-press';
