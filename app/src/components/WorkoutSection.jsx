import BodyFigure from './BodyFigure';
import MachineDemo from './MachineDemo';
import { DAYS, EX, DEMO_SPEED } from '../data/exercises';

const DUR = Math.max(1.2, 2.5 / (DEMO_SPEED || 1)).toFixed(2);

export default function WorkoutSection({ day, selectDay, cw }) {
  const activeDay = DAYS[day];
  const setKey = cw < 2 ? 'a' : 'b';
  const activeSetLabel = `Set ${setKey.toUpperCase()}`;
  const setNote = setKey === 'a' ? 'Weeks 1–2 exercise set' : 'Weeks 3–4 exercise set';
  const activeDayTitle = `${activeDay.label} · ${activeDay.focus.toLowerCase()}`;
  const exercises = EX[activeDay.id];

  return (
    <section id="workout" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Today&rsquo;s work</div>
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
            {d.label}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 16px', fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
        <span className="tag tag-accent">{activeSetLabel}</span>
        <span>{setNote}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {exercises.map((e, i) => {
          const name = setKey === 'a' ? e.a : e.b;
          const machine = setKey === 'a' ? e.am : e.bm;
          const img = setKey === 'a' ? e.aImg : e.bImg;
          const search = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${name} gym machine`)}`;
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
                </div>
                <div style={{ textAlign: 'right', flex: 'none' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 23, color: 'var(--color-accent)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {e.sets} × {e.reps}
                  </div>
                  <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 40%,transparent)', marginTop: 3 }}>
                    sets × reps
                  </div>
                </div>
              </div>
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
                    alt={`${name} — ${e.muscle} highlighted`}
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
                    {e.muscle}
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', textWrap: 'pretty' }}>
                    {e.cue}
                  </p>
                  <a
                    href={search}
                    target="_blank"
                    rel="noopener"
                    style={{ display: 'inline-block', marginTop: 7, fontSize: 11.5, borderBottom: '1px solid color-mix(in srgb,var(--color-accent) 45%,transparent)' }}
                  >
                    See real machine photos →
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
