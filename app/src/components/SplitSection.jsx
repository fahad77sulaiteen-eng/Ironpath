import BodyFigure from './BodyFigure';
import { DAYS } from '../data/exercises';

export default function SplitSection() {
  return (
    <section id="split" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>The split</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
        Four days, four jobs
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
        Train any four days of the week with a rest day between the two upper days.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(196px,1fr))', gap: 12 }}>
        {DAYS.map((d, i) => (
          <article
            key={d.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(160deg, var(--color-neutral-900), var(--color-surface))',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ flex: 'none', width: 54 }}>
              <BodyFigure pts={d.pts} view={d.view} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Day {i + 1}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, margin: '2px 0 4px' }}>{d.label}</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.45, color: 'color-mix(in srgb,var(--color-text) 58%,transparent)' }}>{d.focus}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
