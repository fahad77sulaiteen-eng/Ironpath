import { C } from '../data/colors';

function Seg({ x1, y1, x2, y2, sw }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.bodyLine} strokeWidth={sw || 7} strokeLinecap="round" />;
}

function Joint({ x, y, r }) {
  return <circle cx={x} cy={y} r={r || 3.6} fill={C.frameDark} />;
}

// Small stick-figure with the worked-muscle points overlaid — used in the
// day-split cards and next to each exercise. Highlight points get a soft
// halo (two stacked ellipses) instead of a mix-blend trick, so they stay
// crisp on a light page background.
export default function BodyFigure({ pts, view }) {
  const marks = (pts || []).flatMap((p, i) => [
    <ellipse key={`h${i}`} cx={p[0]} cy={p[1]} rx={(p[2] || 6.5) * 1.7} ry={(p[3] || 8) * 1.7} fill={C.accent} opacity={0.16} />,
    <ellipse key={`m${i}`} cx={p[0]} cy={p[1]} rx={p[2] || 6.5} ry={p[3] || 8} fill={C.accent} opacity={0.95} />,
  ]);
  return (
    <svg viewBox="0 0 60 124" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
      <circle cx={30} cy={10} r={7.5} fill={C.frameDark} />
      <Seg x1={30} y1={19} x2={30} y2={56} sw={15} />
      <Seg x1={22} y1={24} x2={13} y2={50} />
      <Seg x1={38} y1={24} x2={47} y2={50} />
      <Seg x1={13} y1={50} x2={15} y2={64} sw={5.5} />
      <Seg x1={47} y1={50} x2={45} y2={64} sw={5.5} />
      <Seg x1={26} y1={56} x2={25} y2={84} />
      <Seg x1={34} y1={56} x2={35} y2={84} />
      <Seg x1={25} y1={84} x2={24} y2={110} sw={6} />
      <Seg x1={35} y1={84} x2={36} y2={110} sw={6} />
      <Joint x={22} y={24} r={3.2} />
      <Joint x={38} y={24} r={3.2} />
      <Joint x={13} y={50} r={3} />
      <Joint x={47} y={50} r={3} />
      <g>{marks}</g>
      <text x={30} y={122} textAnchor="middle" fontSize={7} fill={C.frame} letterSpacing="0.1em">
        {view === 'back' ? 'BACK' : 'FRONT'}
      </text>
    </svg>
  );
}
