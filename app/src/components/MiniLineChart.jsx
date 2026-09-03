import { useId } from 'react';
import { useI18n } from '../i18n/I18nContext';

const W = 240;
const H = 64;
const PAD_X = 4;
const PAD_Y = 10;

// Small sparkline of top-set weight per logged session. `points` is
// [{ date, value }], oldest first. Hidden by the caller until there are
// at least 2 points.
export default function MiniLineChart({ points, unit }) {
  const { t } = useI18n();
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  if (!points || points.length < 2) {
    return (
      <div style={{ fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', padding: '6px 0' }}>{t('chartTooShort')}</div>
    );
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (W - PAD_X * 2) / (points.length - 1);
  const yFor = (v) => H - PAD_Y - ((v - min) / span) * (H - PAD_Y * 2);
  const coords = points.map((p, i) => [PAD_X + i * stepX, yFor(p.value)]);
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1][0].toFixed(1)},${H - PAD_Y} L${coords[0][0].toFixed(1)},${H - PAD_Y} Z`;
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Weight trend">
      <defs>
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} stroke="var(--color-divider)" strokeWidth={1} />
      <path d={areaPath} fill={`url(#${uid}-fill)`} />
      <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={3.2} fill="var(--color-accent)" />
      <text x={PAD_X} y={10} fontSize={9} fill="color-mix(in srgb,var(--color-text) 45%,transparent)">
        {max}{unit}
      </text>
      <text x={PAD_X} y={H - 2} fontSize={9} fill="color-mix(in srgb,var(--color-text) 45%,transparent)">
        {min}{unit}
      </text>
    </svg>
  );
}
