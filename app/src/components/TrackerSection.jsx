import { DAYS } from '../data/exercises';
import { useI18n } from '../i18n/I18nContext';

function weekCardStyle(active, locked) {
  return {
    padding: 12,
    borderRadius: 'var(--radius-md)',
    background: active ? 'linear-gradient(150deg, var(--color-accent-900), var(--color-surface))' : 'var(--color-neutral-900)',
    boxShadow: active ? '0 0 0 1px var(--color-accent-600)' : 'var(--shadow-sm)',
    opacity: locked ? 0.5 : 1,
    transition: 'opacity .25s ease',
  };
}

function sessionButtonStyle(done, locked) {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 56,
    padding: '8px 2px',
    borderRadius: 'var(--radius-sm)',
    cursor: locked ? 'not-allowed' : 'pointer',
    color: done ? 'var(--color-accent-200)' : 'color-mix(in srgb,var(--color-text) 60%,transparent)',
    background: done ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : 'color-mix(in srgb, var(--color-text) 4%, transparent)',
    border: `1px solid ${done ? 'var(--color-accent-600)' : 'var(--color-divider)'}`,
    transition: 'transform .15s ease, background .2s ease',
  };
}

export default function TrackerSection({ sessions, cw, monthDone, toggle, resetMonth }) {
  const { t, lang } = useI18n();
  return (
    <section id="tracker" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('trackerKicker')}</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
        {t('trackerTitle')}
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
        {t('trackerBody')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[0, 1, 2, 3].map((w) => {
          const wDone = sessions.slice(w * 4, w * 4 + 4).filter(Boolean).length;
          const active = w === cw && !monthDone;
          const locked = w > cw;
          const status = wDone === 4 ? t('complete') : locked ? t('locked') : `${wDone} ${t('ofFour')}`;
          const statusColor = wDone === 4 ? 'var(--color-accent-300)' : 'color-mix(in srgb,var(--color-text) 45%,transparent)';
          return (
            <div key={w} style={weekCardStyle(active, locked)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14 }}>{t('week')} {w + 1}</span>
                <span className="tag tag-neutral">{w < 2 ? t('setA') : t('setB')}</span>
                <span style={{ marginInlineStart: 'auto', fontSize: 11, color: statusColor }}>{status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {[0, 1, 2, 3].map((d) => {
                  const i = w * 4 + d;
                  const done = sessions[i];
                  const dayLabel = lang === 'ar' ? DAYS[d].ar.label : DAYS[d].label;
                  const short = DAYS[d].id === 'core' ? t('upperCoreShort') : dayLabel;
                  const aria = `${t('week')} ${w + 1} ${dayLabel}${done ? ', ' + t('complete') : ''}`;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      aria-label={aria}
                      disabled={locked}
                      onClick={() => toggle(i)}
                      style={sessionButtonStyle(done, locked)}
                    >
                      <span style={{ fontSize: 10.5, letterSpacing: '0.04em' }}>{short}</span>
                      {done ? (
                        <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, animation: 'ip-pop .34s cubic-bezier(.2,1.4,.4,1) both' }} aria-hidden="true">
                          <path d="M4 13l5 5L20 7" fill="none" stroke="var(--color-accent-200)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ width: 17, height: 17, borderRadius: '50%', border: '1.5px dashed color-mix(in srgb,var(--color-text) 30%,transparent)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {monthDone && (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={resetMonth}
          style={{ marginTop: 14, animation: 'ip-halo 1.8s ease-out 3' }}
        >
          {t('startNewMonth')}
        </button>
      )}
    </section>
  );
}
