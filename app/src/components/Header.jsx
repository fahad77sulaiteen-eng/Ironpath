import { useI18n } from '../i18n/I18nContext';

const CIRC = 2 * Math.PI * 13;

export default function Header({ doneCount, onOpenSettings }) {
  const { t } = useI18n();
  const dash = `${((CIRC * doneCount) / 16).toFixed(1)} ${CIRC.toFixed(1)}`;
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 18px',
        background: 'color-mix(in srgb, var(--color-bg) 72%, transparent)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderBottom: '1px solid var(--color-divider)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', marginInlineEnd: 'auto', lineHeight: 1.1 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em' }}>{t('appName')}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}>
          {t('tagline')}
        </span>
      </div>
      <div style={{ textAlign: 'end', lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>
          {doneCount}
          <span style={{ opacity: 0.45 }}>/16</span>
        </div>
        <div style={{ fontSize: 10, color: 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}>{t('sessions')}</div>
      </div>
      <svg viewBox="0 0 32 32" style={{ width: 36, height: 36, transform: 'rotate(-90deg)', flex: 'none' }} role="img" aria-label={t('monthlyProgress')}>
        <circle cx={16} cy={16} r={13} fill="none" stroke="var(--color-neutral-800)" strokeWidth={3} />
        <circle cx={16} cy={16} r={13} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" strokeDasharray={dash} />
      </svg>
      <button
        type="button"
        className="btn btn-icon btn-ghost"
        onClick={onOpenSettings}
        aria-label={t('settings')}
        style={{ flex: 'none' }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5c0 .34-.03.67-.07 1l2.11 1.65a.5.5 0 0 1 .12.64l-2 3.46a.5.5 0 0 1-.6.22l-2.49-1a7.4 7.4 0 0 1-1.73 1l-.38 2.65a.5.5 0 0 1-.5.43h-4a.5.5 0 0 1-.5-.43l-.38-2.65a7.4 7.4 0 0 1-1.73-1l-2.49 1a.5.5 0 0 1-.6-.22l-2-3.46a.5.5 0 0 1 .12-.64L4.07 13c-.04-.33-.07-.66-.07-1s.03-.67.07-1L1.96 9.35a.5.5 0 0 1-.12-.64l2-3.46a.5.5 0 0 1 .6-.22l2.49 1c.53-.42 1.11-.76 1.73-1l.38-2.65A.5.5 0 0 1 9.5 2h4a.5.5 0 0 1 .5.43l.38 2.65c.62.24 1.2.58 1.73 1l2.49-1a.5.5 0 0 1 .6.22l2 3.46a.5.5 0 0 1-.12.64L19.93 11c.04.33.07.66.07 1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  );
}
