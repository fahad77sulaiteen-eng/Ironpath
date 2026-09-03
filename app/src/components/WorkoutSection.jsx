import { useMemo, useState } from 'react';
import BodyFigure from './BodyFigure';
import MachineDemo from './MachineDemo';
import SetLogger from './SetLogger';
import MiniLineChart from './MiniLineChart';
import WorkoutMode from './WorkoutMode';
import { DAYS, EX, DEMO_SPEED } from '../data/exercises';
import { MUSCLE_GROUPS, groupFor } from '../data/muscleGroups';
import { useI18n } from '../i18n/I18nContext';
import { lastSessionBefore, todayISO, topSet } from '../hooks/useWorkoutLogs';
import { estimateOneRM, suggestNext } from '../utils/overload';
import { pickVariant, findAlternatives } from '../utils/exerciseAlternatives';

const DUR = Math.max(1.2, 2.5 / (DEMO_SPEED || 1)).toFixed(2);

export default function WorkoutSection({ day, selectDay, cw, workoutLogs, settings, updateSettings }) {
  const { t, lang } = useI18n();
  const activeDay = DAYS[day];
  const setKey = cw < 2 ? 'a' : 'b';
  const activeSetLabel = setKey === 'a' ? t('setA') : t('setB');
  const setNote = setKey === 'a' ? t('weeks12') : t('weeks34');
  const dayLabel = lang === 'ar' ? activeDay.ar.label : activeDay.label;
  const dayFocus = lang === 'ar' ? activeDay.ar.focus : activeDay.focus;
  const activeDayTitle = `${dayLabel} · ${dayFocus.toLowerCase()}`;
  const exercises = EX[activeDay.id];

  const [swaps, setSwaps] = useState({}); // { [index]: alternativeVariant } — resets on day/set change
  const [swapPickerOpen, setSwapPickerOpen] = useState(null); // index currently showing its picker, or null
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState(null);
  const [workoutModeOpen, setWorkoutModeOpen] = useState(false);

  // Every exercise for today, with any active swap applied — Workout Mode
  // walks this full list; the card list below further filters it by search.
  const dayExercises = useMemo(
    () => exercises.map((entry, i) => ({ entry, index: i, variant: swaps[i] || pickVariant(entry, setKey) })),
    [exercises, swaps, setKey]
  );

  const filtered = dayExercises.filter(({ variant }) => {
    const displayName = lang === 'ar' ? variant.nameAr : variant.name;
    const matchesSearch = !search.trim() || displayName.toLowerCase().includes(search.trim().toLowerCase());
    const matchesMuscle = !muscleFilter || groupFor(variant.muscle) === muscleFilter;
    return matchesSearch && matchesMuscle;
  });

  const applySwap = (index, alt) => {
    setSwaps((prev) => ({ ...prev, [index]: alt }));
    setSwapPickerOpen(null);
  };
  const clearSwap = (index) => {
    setSwaps((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setSwapPickerOpen(null);
  };

  return (
    <section id="workout" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('workoutKicker')}</div>
        <button type="button" className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setWorkoutModeOpen(true)}>
          {t('startWorkout')}
        </button>
      </div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 14px' }}>
        {activeDayTitle}
      </h2>
      <div className="seg" role="tablist" style={{ width: '100%', marginBottom: 6 }}>
        {DAYS.map((d, i) => (
          <label key={d.id} className="seg-opt" style={{ flex: 1, justifyContent: 'center', position: 'relative', whiteSpace: 'nowrap' }}>
            <input
              type="radio"
              name="ip-day"
              checked={i === day}
              onChange={() => {
                selectDay(i);
                setSwaps({});
              }}
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
            />
            {lang === 'ar' ? d.ar.label : d.label}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 16px', fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
        <span className="tag tag-accent">{activeSetLabel}</span>
        <span>{setNote}</span>
      </div>

      <input
        className="input"
        type="search"
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          type="button"
          className="tag tag-outline"
          style={{ cursor: 'pointer', border: !muscleFilter ? '1px solid var(--color-accent)' : '1px solid var(--color-divider)', background: 'none', color: !muscleFilter ? 'var(--color-accent)' : 'var(--color-text)' }}
          onClick={() => setMuscleFilter(null)}
        >
          {t('filterAll')}
        </button>
        {MUSCLE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className="tag tag-outline"
            style={{ cursor: 'pointer', border: muscleFilter === g.id ? '1px solid var(--color-accent)' : '1px solid var(--color-divider)', background: 'none', color: muscleFilter === g.id ? 'var(--color-accent)' : 'var(--color-text)' }}
            onClick={() => setMuscleFilter(g.id)}
          >
            {t(g.labelKey)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('noExercisesMatch')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {filtered.map(({ entry: e, index: i, variant: v }) => {
            const name = lang === 'ar' ? v.nameAr : v.name;
            const machine = lang === 'ar' ? v.machineAr : v.machine;
            const cue = lang === 'ar' ? v.cueAr : v.cue;
            const muscle = lang === 'ar' ? v.muscleAr : v.muscle;
            const search2 = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${v.name} gym machine`)}`;
            const isSwapped = Boolean(swaps[i]);
            const alternatives = findAlternatives(activeDay.id, i, setKey);

            const sessions = workoutLogs.getExerciseLogs(v.slug);
            const last = lastSessionBefore(sessions, todayISO());
            const lastTop = topSet(last);
            const oneRM = lastTop ? Math.round(estimateOneRM(lastTop.weight, lastTop.reps)) : null;
            const suggestion = suggestNext({ sets: v.sets, reps: v.reps }, last, settings);
            const chartPoints = sessions
              .map((s) => {
                const ts = topSet(s);
                return ts ? { date: s.date, value: ts.weight } : null;
              })
              .filter(Boolean);

            return (
              <article key={i} style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 38%,transparent)', paddingTop: 4, width: 16, flex: 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 18, letterSpacing: '-0.01em', margin: '0 0 4px', lineHeight: 1.2 }}>
                      {name}
                    </h3>
                    <div style={{ fontSize: 11.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{machine}</div>
                    {lastTop && (
                      <div style={{ fontSize: 11, marginTop: 3, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                        {t('lastTime')}: <strong style={{ color: 'var(--color-text)' }}>{lastTop.weight}{lang === 'ar' ? 'كجم' : 'kg'} × {lastTop.reps}</strong>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'end', flex: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 23, color: 'var(--color-accent)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {v.sets} × {v.reps}
                    </div>
                    <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 40%,transparent)', marginTop: 3 }}>
                      {t('setsReps')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: 11.5, padding: '4px 6px' }}
                    onClick={() => setSwapPickerOpen(swapPickerOpen === i ? null : i)}
                  >
                    🔄 {t('swapExercise')}
                  </button>
                  {isSwapped && (
                    <button type="button" className="btn btn-ghost" style={{ fontSize: 11.5, padding: '4px 6px' }} onClick={() => clearSwap(i)}>
                      ↺ {t('swapBackToOriginal')}
                    </button>
                  )}
                  {suggestion && (
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
                        color: 'var(--color-accent)',
                        fontSize: 11.5,
                        fontWeight: 500,
                      }}
                    >
                      {suggestion.type === 'weight'
                        ? t('overloadSuggestWeight').replace('{weight}', suggestion.weight)
                        : t('overloadSuggestReps').replace('{reps}', suggestion.reps)}
                    </span>
                  )}
                </div>

                {swapPickerOpen === i && (
                  <div style={{ marginTop: 8, padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-neutral-900)', border: '1px solid var(--color-divider)' }}>
                    <div style={{ fontSize: 11, marginBottom: 6, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('swapPickAlternative')}</div>
                    {alternatives.length === 0 ? (
                      <p style={{ margin: 0, fontSize: 12 }}>{t('swapNoAlternatives')}</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {alternatives.map((alt) => (
                          <button
                            key={alt.slug}
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: 12.5, justifyContent: 'flex-start' }}
                            onClick={() => applySwap(i, alt)}
                          >
                            {lang === 'ar' ? alt.nameAr : alt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  style={{
                    margin: '12px 0 0',
                    padding: v.img ? 0 : '6px 8px 2px',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    background: v.img
                      ? 'linear-gradient(180deg, #1b1d29 0%, #101119 100%)'
                      : 'linear-gradient(180deg, color-mix(in srgb,var(--color-bg) 70%,#000) 0%, var(--color-neutral-900) 100%)',
                    boxShadow: 'inset 0 1px 0 color-mix(in srgb,var(--color-text) 8%,transparent), var(--shadow-sm)',
                  }}
                >
                  {v.img ? (
                    <img
                      src={v.img}
                      alt={`${v.name} — ${v.muscle} highlighted`}
                      loading="lazy"
                      style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', mixBlendMode: 'lighten' }}
                    />
                  ) : (
                    <MachineDemo kind={v.kind} dur={DUR} />
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                  <div style={{ flex: 'none', width: 38 }}>
                    <BodyFigure pts={v.pts} view={v.view} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>
                      {muscle}
                    </div>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', textWrap: 'pretty' }}>
                      {cue}
                    </p>
                    <a
                      href={search2}
                      target="_blank"
                      rel="noopener"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, fontSize: 11.5, borderBottom: '1px solid color-mix(in srgb,var(--color-accent) 45%,transparent)' }}
                    >
                      {t('seeRealPhotos')} {t('arrowIcon')}
                    </a>
                  </div>
                </div>

                <SetLogger
                  slug={v.slug}
                  targetSets={v.sets}
                  sessions={sessions}
                  onLogSet={(idx, set) => workoutLogs.logSet(v.slug, idx, set)}
                  onRemoveSet={(idx) => workoutLogs.removeSetAt(v.slug, idx)}
                  restSeconds={settings.restSeconds}
                  onRestSecondsChange={(sec) => updateSettings({ restSeconds: sec })}
                />

                {oneRM != null && (
                  <div style={{ fontSize: 11, marginTop: 10, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                    {t('oneRepMax')}: <strong style={{ color: 'var(--color-text)' }}>{oneRM}{lang === 'ar' ? 'كجم' : 'kg'}</strong>
                  </div>
                )}

                {chartPoints.length >= 2 && (
                  <div style={{ marginTop: 8 }}>
                    <MiniLineChart points={chartPoints} unit={lang === 'ar' ? '' : 'kg'} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {workoutModeOpen && (
        <WorkoutMode
          dayTitle={activeDayTitle}
          exercises={dayExercises}
          workoutLogs={workoutLogs}
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setWorkoutModeOpen(false)}
        />
      )}
    </section>
  );
}
