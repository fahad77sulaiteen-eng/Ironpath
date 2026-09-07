import { programForWeek, setKeyForWeek } from '../utils/programs';
import { useI18n } from '../i18n/I18nContext';

function weekCardStyle(active, locked) {
  return {
    padding: 12,
    borderRadius: 'var(--radius-lg)',
    background: active ? 'color-mix(in srgb, var(--color-accent) 16%, var(--glass-bg))' : 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: `1px solid ${active ? 'rgba(108,92,231,.5)' : 'var(--glass-border)'}`,
    boxShadow: active ? 'var(--glass-glow)' : 'var(--glass-shadow)',
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
    color: done ? 'var(--color-accent-2)' : 'color-mix(in srgb,var(--color-text) 60%,transparent)',
    background: done ? 'color-mix(in srgb, var(--color-accent) 24%, transparent)' : 'rgba(255,255,255,.04)',
    border: `1px solid ${done ? 'rgba(108,92,231,.6)' : 'var(--glass-border)'}`,
    boxShadow: done ? '0 0 12px rgba(108,92,231,.3)' : 'none',
    transition: 'transform .15s ease, background .2s ease',
  };
}

export default function TrackerSection({ sessions, cw, monthDone, toggle, resetMonth, programMode, updateSettings }) {
  const { t, lang } = useI18n();
  return (
    <section id="tracker" style={{ padding: '38px 20px 8px', scrollMarginTop: 64 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{t('trackerKicker')}</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
        {t('trackerTitle')}
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
        {t('trackerBody')}
      </p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, marginBottom: 8, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('programModeLabel')}</div>
        <div className="seg" role="tablist" style={{ width: '100%' }}>
          {['auto', 'fourDay', 'upperLower'].map((mode) => (
            <label key={mode} className="seg-opt" style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
              <input
                type="radio"
                name="ip-programMode"
                checked={programMode === mode}
                onChange={() => updateSettings({ programMode: mode })}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
              />
              {t(mode === 'auto' ? 'programModeAuto' : mode === 'fourDay' ? 'programFourDay' : 'programUpperLower')}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[0, 1, 2, 3].map((w) => {
          const prog = programForWeek(w, programMode);
          const setKey = setKeyForWeek(w, programMode);
          const wDone = sessions.slice(w * 4, w * 4 + 4).filter(Boolean).length;
          const active = w === cw && !monthDone;
          const locked = w > cw;
          const status = wDone === 4 ? t('complete') : locked ? t('locked') : `${wDone} ${t('ofFour')}`;
          const statusColor = wDone === 4 ? 'var(--color-accent-300)' : 'color-mix(in srgb,var(--color-text) 45%,transparent)';
          const progLabel = lang === 'ar' ? prog.ar.label : prog.label;
          return (
            <div key={w} style={weekCardStyle(active, locked)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14 }}>{t('week')} {w + 1}</span>
                <span className="tag tag-neutral">{prog.id === 'fourDay' ? (setKey === 'a' ? t('setA') : t('setB')) : progLabel}</span>
                <span style={{ marginInlineStart: 'auto', fontSize: 11, color: statusColor }}>{status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {[0, 1, 2, 3].map((d) => {
                  const i = w * 4 + d;
                  const done = sessions[i];
                  const dayObj = prog.days[d];
                  const dayLabel = lang === 'ar' ? dayObj.ar.label : dayObj.label;
                  const short = lang === 'ar' ? (dayObj.ar.short || dayObj.ar.label) : (dayObj.short || dayObj.label);
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
