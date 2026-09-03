import BodyFigure from './BodyFigure';
import MachineDemo from './MachineDemo';
import SetLogger from './SetLogger';
import MiniLineChart from './MiniLineChart';
import { DAYS, EX, DEMO_SPEED } from '../data/exercises';
import { useI18n } from '../i18n/I18nContext';
import { lastSessionBefore, todayISO, topSet } from '../hooks/useWorkoutLogs';
import { estimateOneRM, suggestNext } from '../utils/overload';

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

  return (
    <section id="workout" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('workoutKicker')}</div>
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
              onChange={() => selectDay(i)}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {exercises.map((e, i) => {
          const name = lang === 'ar' ? (setKey === 'a' ? e.ar.a : e.ar.b) : setKey === 'a' ? e.a : e.b;
          const machine = lang === 'ar' ? (setKey === 'a' ? e.ar.am : e.ar.bm) : setKey === 'a' ? e.am : e.bm;
          const cue = lang === 'ar' ? e.ar.cue : e.cue;
          const muscle = lang === 'ar' ? e.ar.muscle : e.muscle;
          const img = setKey === 'a' ? e.aImg : e.bImg;
          const slug = setKey === 'a' ? e.aSlug : e.bSlug;
          const searchName = setKey === 'a' ? e.a : e.b;
          const search = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${searchName} gym machine`)}`;

          const sessions = workoutLogs.getExerciseLogs(slug);
          const last = lastSessionBefore(sessions, todayISO());
          const lastTop = topSet(last);
          const oneRM = lastTop ? Math.round(estimateOneRM(lastTop.weight, lastTop.reps)) : null;
          const suggestion = suggestNext(e, last, settings);
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
                    {e.sets} × {e.reps}
                  </div>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 40%,transparent)', marginTop: 3 }}>
                    {t('setsReps')}
                  </div>
                </div>
              </div>

              {suggestion && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
                    color: 'var(--color-accent)',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {suggestion.type === 'weight'
                    ? t('overloadSuggestWeight').replace('{weight}', suggestion.weight)
                    : t('overloadSuggestReps').replace('{reps}', suggestion.reps)}
                </div>
              )}

              <div
                style={{
                  margin: '12px 0 0',
                  padding: img ? 0 : '6px 8px 2px',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  // Photos carry their own near-black background and rely on
                  // mix-blend-mode:lighten to disappear into this panel, so
                  // this well stays a fixed dark tone regardless of page
                  // theme — a pale panel would wash the blend out to white.
                  background: img
                    ? 'linear-gradient(180deg, #1b1d29 0%, #101119 100%)'
                    : 'linear-gradient(180deg, color-mix(in srgb,var(--color-bg) 70%,#000) 0%, var(--color-neutral-900) 100%)',
                  boxShadow: 'inset 0 1px 0 color-mix(in srgb,var(--color-text) 8%,transparent), var(--shadow-sm)',
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${searchName} — ${e.muscle} highlighted`}
                    loading="lazy"
                    style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', mixBlendMode: 'lighten' }}
                  />
                ) : (
                  <MachineDemo kind={e.kind} dur={DUR} />
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <div style={{ flex: 'none', width: 38 }}>
                  <BodyFigure pts={e.pts} view={e.view} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>
                    {muscle}
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', textWrap: 'pretty' }}>
                    {cue}
                  </p>
                  <a
                    href={search}
                    target="_blank"
                    rel="noopener"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, fontSize: 11.5, borderBottom: '1px solid color-mix(in srgb,var(--color-accent) 45%,transparent)' }}
                  >
                    {t('seeRealPhotos')} {t('arrowIcon')}
                  </a>
                </div>
              </div>

              <SetLogger
                slug={slug}
                targetSets={e.sets}
                sessions={sessions}
                onLogSet={(idx, set) => workoutLogs.logSet(slug, idx, set)}
                onRemoveSet={(idx) => workoutLogs.removeSetAt(slug, idx)}
                restSeconds={settings.restSeconds}
                onRestSecondsChange={(v) => updateSettings({ restSeconds: v })}
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
    </section>
  );
}
