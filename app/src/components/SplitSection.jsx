import BodyFigure from './BodyFigure';
import { DAYS } from '../data/exercises';
import { useI18n } from '../i18n/I18nContext';

export default function SplitSection() {
  const { t, lang } = useI18n();
  return (
    <section id="split" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('splitKicker')}</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
        {t('splitTitle')}
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
        {t('splitBody')}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(196px,1fr))', gap: 12 }}>
        {DAYS.map((d, i) => {
          const label = lang === 'ar' ? d.ar.label : d.label;
          const focus = lang === 'ar' ? d.ar.focus : d.focus;
          return (
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
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('day')} {i + 1}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, margin: '2px 0 4px' }}>{label}</div>
                <div style={{ fontSize: 11.5, lineHeight: 1.45, color: 'color-mix(in srgb,var(--color-text) 58%,transparent)' }}>{focus}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
