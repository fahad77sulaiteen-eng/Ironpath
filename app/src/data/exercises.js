// Ported from IronPath.dc.html — day split and per-day exercise data.
// `pts` are [x, y] highlight points on the 0..60 x 0..124 BodyFigure viewBox.
// `aImg`/`bImg` are paths under public/img/ — real muscle-highlight
// renders supplied for the matching set; null falls back to the animated
// SVG MachineDemo for that exercise.
// `aSlug`/`bSlug` are stable ids for workout logs/charts/1RM history — they
// don't change even if the display name is edited, so old logs stay linked.
// `ar` holds the Arabic translation of every display field on this entry.

export const DAYS = [
  { id: 'push', label: 'Push', focus: 'Chest, shoulders, triceps', pts: [[30, 27], [21, 23], [39, 23], [16, 38], [44, 38]], view: 'front', ar: { label: 'دفع', focus: 'الصدر، الأكتاف، الترايسبس' } },
  { id: 'pull', label: 'Pull', focus: 'Back, biceps', pts: [[30, 21], [23, 34], [37, 34], [16, 38], [44, 38]], view: 'back', ar: { label: 'سحب', focus: 'الظهر، البايسبس' } },
  { id: 'legs', label: 'Legs', focus: 'Quads, hamstrings, glutes, calves', pts: [[25, 70], [35, 70], [30, 60], [24, 101], [36, 101]], view: 'back', ar: { label: 'أرجل', focus: 'الفخذ الأمامي، الخلفي، المؤخرة، السمانة' } },
  { id: 'core', label: 'Upper + Core', focus: 'Full upper body and midsection', pts: [[30, 27], [30, 46], [22, 24], [38, 24]], view: 'front', ar: { label: 'علوي + بطن', focus: 'كامل الجزء العلوي والمنطقة الوسطى' } },
];

export const EX = {
  push: [
    { a: 'Chest Press Machine', am: 'Seated chest press', aImg: 'img/chest_press_machine.jpg', aSlug: 'chest-press-machine', b: 'Smith Bench Press', bm: 'Smith machine, flat bench', bImg: 'img/smith_bench_press.jpg', bSlug: 'smith-bench-press', sets: 3, reps: '10', cue: 'Wrists stacked over your elbows. Stop just short of locking out.', muscle: 'Chest', view: 'front', pts: [[30, 27]], kind: 'horizPress',
      ar: { a: 'جهاز ضغط الصدر', am: 'جلوس، ضغط صدر', b: 'ضغط بنش سميث', bm: 'جهاز سميث، بنش مستوي', cue: 'خلّ معصمك فوق كوعك تماماً. توقف قبل ما تفرد الذراع بالكامل.', muscle: 'الصدر' } },
    { a: 'Incline Press Machine', am: 'Incline chest press', aImg: 'img/incline_press_machine.jpg', aSlug: 'incline-press-machine', b: 'Smith Incline Press', bm: 'Smith machine, incline bench', bImg: 'img/smith_incline_press.jpg', bSlug: 'smith-incline-press', sets: 3, reps: '10', cue: 'Press up and slightly in; keep your shoulders pulled down.', muscle: 'Upper chest', view: 'front', pts: [[30, 24]], kind: 'horizPress',
      ar: { a: 'جهاز ضغط مائل', am: 'ضغط صدر مائل', b: 'ضغط مائل سميث', bm: 'جهاز سميث، بنش مائل', cue: 'ادفع لأعلى ولداخل قليلاً؛ خلّ أكتافك للأسفل.', muscle: 'أعلى الصدر' } },
    { a: 'Pec Deck', am: 'Pec deck / butterfly', aImg: 'img/pec_deck.jpg', aSlug: 'pec-deck', b: 'Cable Fly', bm: 'Cable crossover station', bImg: 'img/cable_fly.jpg', bSlug: 'cable-fly', sets: 3, reps: '12', cue: 'Hug, don’t press — elbows stay softly bent the whole way.', muscle: 'Inner chest', view: 'front', pts: [[30, 29]], kind: 'fly',
      ar: { a: 'جهاز الفراشة', am: 'جهاز الفراشة', b: 'فتح كيبل', bm: 'محطة الكيبل المتقاطع', cue: 'احتضن الجهاز، لا تضغط — خلّ الكوع مثني بلطف طول الحركة.', muscle: 'وسط الصدر' } },
    { a: 'Shoulder Press Machine', am: 'Seated shoulder press', aImg: 'img/shoulder_press_machine.jpg', aSlug: 'shoulder-press-machine', b: 'Smith Shoulder Press', bm: 'Smith machine, upright bench', bImg: 'img/smith_shoulder_press.jpg', bSlug: 'smith-shoulder-press', sets: 3, reps: '10', cue: 'Ribs down. Press overhead without arching your lower back.', muscle: 'Front delts', view: 'front', pts: [[22, 24], [38, 24]], kind: 'vertPress',
      ar: { a: 'جهاز ضغط الكتف', am: 'جلوس، ضغط كتف', b: 'ضغط كتف سميث', bm: 'جهاز سميث، بنش مستقيم', cue: 'ثبّت ضلوعك للأسفل. ادفع للأعلى بدون تقويس أسفل الظهر.', muscle: 'الكتف الأمامي' } },
    { a: 'Lateral Raise Machine', am: 'Seated lateral raise', aImg: 'img/lateral_raise_machine.jpg', aSlug: 'lateral-raise-machine', b: 'Cable Lateral Raise', bm: 'Low cable pulley', bImg: 'img/cable_lateral_raise.jpg', bSlug: 'cable-lateral-raise', sets: 3, reps: '15', cue: 'Lead with the elbows and stop at shoulder height.', muscle: 'Side delts', view: 'front', pts: [[20, 26], [40, 26]], kind: 'raise',
      ar: { a: 'جهاز رفرفة جانبية', am: 'جلوس، رفرفة جانبية', b: 'رفرفة جانبية بالكيبل', bm: 'بكرة كيبل منخفضة', cue: 'ابدأ الحركة بالكوع وتوقف عند مستوى الكتف.', muscle: 'الكتف الجانبي' } },
    { a: 'Cable Triceps Pushdown', am: 'High cable, rope or bar', aImg: 'img/cable_triceps_pushdown.jpg', aSlug: 'cable-triceps-pushdown', b: 'Cable Overhead Extension', bm: 'High cable, rope', bImg: 'img/cable_overhead_extension.jpg', bSlug: 'cable-overhead-extension', sets: 3, reps: '12', cue: 'Pin your elbows to your sides — only the forearms move.', muscle: 'Triceps', view: 'back', pts: [[16, 38], [44, 38]], kind: 'pushdown',
      ar: { a: 'دفع ترايسبس بالكيبل', am: 'كيبل علوي، حبل أو بار', b: 'مد ترايسبس فوق الرأس', bm: 'كيبل علوي، حبل', cue: 'ثبّت كوعك بجنبك — الساعد فقط هو اللي يتحرك.', muscle: 'الترايسبس' } },
  ],
  pull: [
    { a: 'Lat Pulldown', am: 'Cable pulldown station', aImg: 'img/lat_pulldown.jpg', aSlug: 'lat-pulldown', b: 'Assisted Pull-up Machine', bm: 'Assisted pull-up / dip', bImg: 'img/assisted_pullup_machine.jpg', bSlug: 'assisted-pullup-machine', sets: 3, reps: '10', cue: 'Pull the bar to your collarbone and keep your chest tall.', muscle: 'Lats', view: 'back', pts: [[23, 34], [37, 34]], kind: 'vertPull',
      ar: { a: 'سحب أمامي علوي', am: 'محطة السحب بالكيبل', b: 'جهاز العقلة المساعد', bm: 'عقلة / تنعيس مساعد', cue: 'اسحب البار لعظمة الترقوة وخلّ صدرك مرفوع.', muscle: 'عضلة اللاتس (الظهر الجانبي)' } },
    { a: 'Seated Cable Row', am: 'Low cable row station', aImg: 'img/seated_cable_row.jpg', aSlug: 'seated-cable-row', b: 'Seated Row Machine', bm: 'Chest-supported row', bImg: 'img/seated_row_machine.jpg', bSlug: 'seated-row-machine', sets: 3, reps: '10', cue: 'Drive your elbows past your ribs; don’t rock the torso.', muscle: 'Mid back', view: 'back', pts: [[30, 32]], kind: 'horizPull',
      ar: { a: 'تجديف كيبل جلوس', am: 'محطة تجديف كيبل منخفض', b: 'جهاز تجديف جلوس', bm: 'تجديف بإسناد الصدر', cue: 'ادفع كوعك خلف ضلوعك؛ لا تتأرجح بجذعك.', muscle: 'منتصف الظهر' } },
    { a: 'Cable Face Pull', am: 'High cable, rope', aImg: 'img/cable_face_pull.jpg', aSlug: 'cable-face-pull', b: 'Reverse Pec Deck', bm: 'Pec deck, reversed', bImg: 'img/reverse_pec_deck.jpg', bSlug: 'reverse-pec-deck', sets: 3, reps: '15', cue: 'Pull to eye level with your thumbs pointing back.', muscle: 'Rear delts', view: 'back', pts: [[21, 25], [39, 25]], kind: 'horizPull',
      ar: { a: 'سحب للوجه بالكيبل', am: 'كيبل علوي، حبل', b: 'فراشة عكسية', bm: 'جهاز الفراشة بالعكس', cue: 'اسحب لمستوى العين مع توجيه الإبهام للخلف.', muscle: 'الكتف الخلفي' } },
    { a: 'Biceps Curl Machine', am: 'Seated preacher curl', aImg: 'img/biceps_curl_machine.jpg', aSlug: 'biceps-curl-machine', b: 'Cable Curl', bm: 'Low cable, straight bar', bImg: 'img/cable_curl.jpg', bSlug: 'cable-curl', sets: 3, reps: '12', cue: 'Elbows stay put. Lower slower than you lift.', muscle: 'Biceps', view: 'front', pts: [[16, 38], [44, 38]], kind: 'curl',
      ar: { a: 'جهاز باي البايسبس', am: 'جلوس، باي بريتشر', b: 'باي بالكيبل', bm: 'كيبل منخفض، بار مستقيم', cue: 'خلّ كوعك ثابت. انزل أبطأ من ما ترفع.', muscle: 'البايسبس' } },
    { a: 'Cable Rope Hammer Curl', am: 'Low cable, rope', aImg: 'img/cable_rope_hammer_curl.jpg', aSlug: 'cable-rope-hammer-curl', b: 'High Cable Curl', bm: 'Twin high pulleys', bImg: 'img/high_cable_curl.jpg', bSlug: 'high-cable-curl', sets: 3, reps: '12', cue: 'Neutral grip, no swinging — the rope should never jerk.', muscle: 'Biceps, forearms', view: 'front', pts: [[16, 40], [44, 40]], kind: 'curl',
      ar: { a: 'باي هامر بحبل الكيبل', am: 'كيبل منخفض، حبل', b: 'باي بكيبل علوي', bm: 'بكرتين عاليتين', cue: 'قبضة محايدة، بدون تأرجح — الحبل ما يصير يهتز.', muscle: 'البايسبس والساعد' } },
  ],
  legs: [
    { a: 'Leg Press', am: '45° leg press sled', aImg: 'img/leg_press.jpg', aSlug: 'leg-press', b: 'Hack Squat', bm: 'Hack squat machine', bImg: 'img/hack_squat.jpg', bSlug: 'hack-squat', sets: 3, reps: '10', cue: 'Feet flat, knees tracking over your toes, never lock out hard.', muscle: 'Quads, glutes', view: 'front', pts: [[25, 70], [35, 70]], kind: 'legpress',
      ar: { a: 'ضغط أرجل', am: 'زحافة ضغط أرجل بزاوية ٤٥', b: 'هاك سكوات', bm: 'جهاز هاك سكوات', cue: 'القدم مسطحة، الركبة بخط أصابع القدم، لا تفرد الركبة بقوة.', muscle: 'الفخذ الأمامي والمؤخرة' } },
    { a: 'Lying Leg Curl', am: 'Prone leg curl', aImg: 'img/lying_leg_curl.jpg', aSlug: 'lying-leg-curl', b: 'Seated Leg Curl', bm: 'Seated leg curl', bImg: 'img/seated_leg_curl.jpg', bSlug: 'seated-leg-curl', sets: 3, reps: '12', cue: 'Keep your hips pressed down and squeeze at the top.', muscle: 'Hamstrings', view: 'back', pts: [[25, 72], [35, 72]], kind: 'legcurl',
      ar: { a: 'ثني رجل بالانبطاح', am: 'انبطاح، ثني رجل', b: 'ثني رجل بالجلوس', bm: 'ثني رجل جلوس', cue: 'خلّ وركك مضغوط للأسفل واعصر بأعلى الحركة.', muscle: 'الفخذ الخلفي' } },
    { a: 'Leg Extension', am: 'Seated leg extension', aImg: 'img/leg_extension.jpg', aSlug: 'leg-extension', b: 'Smith Romanian Deadlift', bm: 'Smith machine, hip hinge', bImg: 'img/smith_romanian_deadlift.jpg', bSlug: 'smith-romanian-deadlift', sets: 3, reps: '12', cue: 'Pause a full second at the top, then lower under control.', muscle: 'Quads', view: 'front', pts: [[25, 68], [35, 68]], kind: 'legext',
      ar: { a: 'فرد الرجل', am: 'جلوس، فرد رجل', b: 'رومانيان ديدلفت سميث', bm: 'جهاز سميث، انحناء بالورك', cue: 'توقف ثانية كاملة بأعلى الحركة، ثم انزل بتحكم.', muscle: 'الفخذ الأمامي' } },
    { a: 'Hip Thrust Machine', am: 'Seated hip thrust', aImg: 'img/hip_thrust_machine.jpg', aSlug: 'hip-thrust-machine', b: 'Hip Abduction Machine', bm: 'Seated abduction', bImg: null, bSlug: 'hip-abduction-machine', sets: 3, reps: '12', cue: 'Tuck the pelvis and squeeze the glutes — not the lower back.', muscle: 'Glutes', view: 'back', pts: [[30, 60]], kind: 'hipthrust',
      ar: { a: 'جهاز دفع الورك', am: 'جلوس، دفع ورك', b: 'جهاز تبعيد الورك', bm: 'تبعيد جلوس', cue: 'اطوِ الحوض واعصر المؤخرة — مو أسفل الظهر.', muscle: 'المؤخرة' } },
    { a: 'Standing Calf Raise Machine', am: 'Standing calf raise', aImg: 'img/standing_calf_raise_machine.jpg', aSlug: 'standing-calf-raise-machine', b: 'Leg Press Calf Raise', bm: 'Leg press, toes only', bImg: 'img/leg_press_calf_raise.jpg', bSlug: 'leg-press-calf-raise', sets: 3, reps: '15', cue: 'Full stretch at the bottom, one-second pause at the top.', muscle: 'Calves', view: 'back', pts: [[24, 101], [36, 101]], kind: 'calf',
      ar: { a: 'جهاز سمانة وقوف', am: 'وقوف، رفع سمانة', b: 'سمانة بجهاز ضغط الأرجل', bm: 'ضغط أرجل، أطراف الأصابع فقط', cue: 'مطّ كامل بالأسفل، ووقفة ثانية بالأعلى.', muscle: 'السمانة' } },
  ],
  core: [
    { a: 'Chest Press Machine', am: 'Seated chest press', aImg: 'img/chest_press_machine.jpg', aSlug: 'chest-press-machine', b: 'Cable Fly', bm: 'Cable crossover station', bImg: 'img/cable_fly.jpg', bSlug: 'cable-fly', sets: 3, reps: '10', cue: 'Same cue as Push day: elbows under the handles, no lockout.', muscle: 'Chest', view: 'front', pts: [[30, 27]], kind: 'horizPress',
      ar: { a: 'جهاز ضغط الصدر', am: 'جلوس، ضغط صدر', b: 'فتح كيبل', bm: 'محطة الكيبل المتقاطع', cue: 'نفس ملاحظة يوم الدفع: الكوع تحت المقابض، وبدون فرد كامل.', muscle: 'الصدر' } },
    { a: 'Lat Pulldown', am: 'Cable pulldown station', aImg: 'img/lat_pulldown.jpg', aSlug: 'lat-pulldown', b: 'Seated Row Machine', bm: 'Chest-supported row', bImg: 'img/seated_row_machine.jpg', bSlug: 'seated-row-machine', sets: 3, reps: '10', cue: 'Lead with the elbows, finish with the shoulder blades.', muscle: 'Lats, mid back', view: 'back', pts: [[23, 34], [37, 34]], kind: 'vertPull',
      ar: { a: 'سحب أمامي علوي', am: 'محطة السحب بالكيبل', b: 'جهاز تجديف جلوس', bm: 'تجديف بإسناد الصدر', cue: 'ابدأ بالكوع، وأنهِ الحركة بلوح الكتف.', muscle: 'اللاتس ومنتصف الظهر' } },
    { a: 'Lateral Raise Machine', am: 'Seated lateral raise', aImg: 'img/lateral_raise_machine.jpg', aSlug: 'lateral-raise-machine', b: 'Cable Face Pull', bm: 'High cable, rope', bImg: 'img/cable_face_pull.jpg', bSlug: 'cable-face-pull', sets: 3, reps: '15', cue: 'Light weight, slow tempo — shoulders fatigue fast.', muscle: 'Side delts', view: 'front', pts: [[20, 26], [40, 26]], kind: 'raise',
      ar: { a: 'جهاز رفرفة جانبية', am: 'جلوس، رفرفة جانبية', b: 'سحب للوجه بالكيبل', bm: 'كيبل علوي، حبل', cue: 'وزن خفيف، إيقاع بطيء — الكتف يتعب بسرعة.', muscle: 'الكتف الجانبي' } },
    { a: 'Ab Crunch Machine', am: 'Seated ab crunch', aImg: 'img/ab_crunch_machine.jpg', aSlug: 'ab-crunch-machine', b: 'Cable Crunch', bm: 'High cable, kneeling', bImg: 'img/cable_crunch.jpg', bSlug: 'cable-crunch', sets: 3, reps: '15', cue: 'Curl your ribs toward your hips; don’t pull with your arms.', muscle: 'Abs', view: 'front', pts: [[30, 46]], kind: 'crunch',
      ar: { a: 'جهاز طي البطن', am: 'جلوس، طي بطن', b: 'طي بطن بالكيبل', bm: 'كيبل علوي، جثو', cue: 'اطوِ ضلوعك تجاه وركك؛ لا تسحب بذراعك.', muscle: 'البطن' } },
    { a: 'Torso Rotation Machine', am: 'Seated rotation', aImg: null, aSlug: 'torso-rotation-machine', b: 'Captain’s Chair Knee Raise', bm: 'Vertical knee raise', bImg: 'img/captains_chair_knee_raise.jpg', bSlug: 'captains-chair-knee-raise', sets: 3, reps: '15', cue: 'Turn from the ribcage and keep your hips facing forward.', muscle: 'Obliques', view: 'front', pts: [[22, 44], [38, 44]], kind: 'rotation',
      ar: { a: 'جهاز دوران الجذع', am: 'جلوس، دوران', b: 'رفع ركبة كرسي الكابتن', bm: 'رفع ركبة عمودي', cue: 'لُف من القفص الصدري وخلّ وركك يواجه الأمام.', muscle: 'عضلات الخاصرة (المائلة)' } },
  ],
};

// Design-canvas tweakable props in the prototype — fixed defaults for production.
export const DEMO_SPEED = 1;
export const REST_SECONDS = 75;
export const HERO_SCENE = 'chest-press';
