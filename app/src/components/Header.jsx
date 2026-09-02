const CIRC = 2 * Math.PI * 13;

export default function Header({ doneCount }) {
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
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto', lineHeight: 1.1 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em' }}>IronPath</span>
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}>
          Machines only · 4 days
        </span>
      </div>
      <div style={{ textAlign: 'right', lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>
          {doneCount}
          <span style={{ opacity: 0.45 }}>/16</span>
        </div>
        <div style={{ fontSize: 10, color: 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}>sessions</div>
      </div>
      <svg viewBox="0 0 32 32" style={{ width: 36, height: 36, transform: 'rotate(-90deg)', flex: 'none' }} role="img" aria-label="Monthly progress">
        <circle cx={16} cy={16} r={13} fill="none" stroke="var(--color-neutral-800)" strokeWidth={3} />
        <circle cx={16} cy={16} r={13} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" strokeDasharray={dash} />
      </svg>
    </header>
  );
}
