import { createElement as h, useId } from 'react';
import { C } from '../data/colors';

// Looping animated line-diagram of a single machine's movement, keyed by
// exercise `kind`. Ported from the IronPath.dc.html prototype's `machine()`
// render function, then reworked with gradients, a weight-stack rod/pin,
// a two-tone cable and pulley detail, and a contact shadow so the machine's
// full shape reads clearly rather than as flat single-stroke line art. The
// CSS keyframes it references (ip-stack, ip-tx-neg, ip-tx-pos, ip-ty-neg,
// ip-ty-pos, ip-rot-neg, ip-rot-pos) live in src/styles/ironpath.css.
export default function MachineDemo({ kind, dur }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');
  const gFrame = `url(#${uid}-frame)`;
  const gPlate = `url(#${uid}-plate)`;
  const gPad = `url(#${uid}-pad)`;
  const gHousing = `url(#${uid}-housing)`;
  const gHead = `url(#${uid}-head)`;

  // Every moving part gets the same soft lift so motion reads clearly at a
  // glance, plus a hold at peak contraction (see the ip-* keyframes) so the
  // rep tempo — quick lift, brief squeeze, controlled lower — looks real.
  const anim = (name, extra) =>
    Object.assign(
      { animation: `${name} ${dur}s ease-in-out infinite`, transformBox: 'view-box', filter: `drop-shadow(0 2px 3px ${C.shadow})` },
      extra || {}
    );
  const L = (x1, y1, x2, y2, sw, col) =>
    h('line', { x1, y1, x2, y2, stroke: col || C.accent, strokeWidth: sw || 6, strokeLinecap: 'round' });

  const defs = h(
    'defs',
    { key: 'defs' },
    h(
      'linearGradient',
      { id: `${uid}-frame`, x1: '0', y1: '0', x2: '1', y2: '1' },
      h('stop', { offset: '0%', stopColor: C.frameLight }),
      h('stop', { offset: '55%', stopColor: C.frame }),
      h('stop', { offset: '100%', stopColor: C.frameDark })
    ),
    h(
      'linearGradient',
      { id: `${uid}-plate`, x1: '0', y1: '0', x2: '0', y2: '1' },
      h('stop', { offset: '0%', stopColor: C.plateLight }),
      h('stop', { offset: '100%', stopColor: C.plateDark })
    ),
    h(
      'linearGradient',
      { id: `${uid}-pad`, x1: '0', y1: '0', x2: '0', y2: '1' },
      h('stop', { offset: '0%', stopColor: C.padLight }),
      h('stop', { offset: '100%', stopColor: C.pad })
    ),
    h(
      'linearGradient',
      { id: `${uid}-housing`, x1: '0', y1: '0', x2: '1', y2: '0' },
      h('stop', { offset: '0%', stopColor: C.housingLight }),
      h('stop', { offset: '30%', stopColor: C.housing }),
      h('stop', { offset: '100%', stopColor: C.housing })
    ),
    h(
      'radialGradient',
      { id: `${uid}-head`, cx: '35%', cy: '32%', r: '75%' },
      h('stop', { offset: '0%', stopColor: C.accentLight }),
      h('stop', { offset: '55%', stopColor: C.accent }),
      h('stop', { offset: '100%', stopColor: C.accentDeep })
    )
  );

  const plates = (x, y, n) => {
    const count = n || 4;
    const out = [];
    for (let i = 0; i < count; i++) {
      const py = y + i * 10;
      out.push(
        h('rect', { key: 'p' + i, x, y: py, width: 34, height: 8, rx: 2, fill: gPlate, stroke: C.edge, strokeWidth: 0.7 }),
        h('circle', { key: 'ph' + i, cx: x + 17, cy: py + 4, r: 2.1, fill: C.housing, opacity: 0.85 })
      );
    }
    out.push(h('rect', { key: 'pin', x: x + 25, y: y - 2, width: 9, height: 4, rx: 1, fill: C.accent }));
    return out;
  };
  const stack = (x, y, n) => [
    h('line', { key: 'rod', x1: x + 17, y1: y - 6, x2: x + 17, y2: y + (n || 4) * 10 + 4, stroke: C.frameDark, strokeWidth: 1.6 }),
    h('g', { key: 'stk', style: anim('ip-stack') }, plates(x, y, n)),
  ];
  const floor = h('line', { key: 'fl', x1: 0, y1: 124, x2: 220, y2: 124, stroke: C.frame, strokeWidth: 2 });
  const floorShadow = h('ellipse', { key: 'flsh', cx: 110, cy: 126, rx: 96, ry: 3.2, fill: C.shadow });
  const col = (x, w, top) => [
    h('rect', { key: 'col' + x, x, y: top, width: w, height: 124 - top, rx: 4, fill: gHousing, stroke: C.edge, strokeWidth: 0.8 }),
    h('rect', { key: 'colhl' + x, x: x + 3, y: top + 4, width: 2.2, height: 124 - top - 8, rx: 1, fill: 'rgba(255,255,255,0.14)' }),
  ];
  const pulley = (cx, cy) => [
    h('circle', { key: 'plo' + cx, cx, cy, r: 6, fill: 'none', stroke: C.frame, strokeWidth: 2.2 }),
    h('circle', { key: 'pli' + cx, cx, cy, r: 5.4, fill: 'none', stroke: C.accent, strokeWidth: 1.1 }),
    h('circle', { key: 'plh' + cx, cx, cy, r: 1.6, fill: C.frameDark }),
  ];
  const cable = (d) => [
    h('path', { key: 'cbw', d, fill: 'none', stroke: C.cable, strokeWidth: 2.4, strokeLinecap: 'round' }),
    h('path', { key: 'cbh', d, fill: 'none', stroke: C.cableLight, strokeWidth: 0.8, strokeLinecap: 'round', opacity: 0.85 }),
  ];
  const seat = (x, y, w) => {
    const sw = w || 40;
    return [
      h('rect', { key: 'sa', x, y, width: sw, height: 8, rx: 3, fill: gPad, stroke: C.edge, strokeWidth: 0.6 }),
      h('line', { key: 'stitch', x1: x + 5, y1: y + 4, x2: x + sw - 5, y2: y + 4, stroke: 'rgba(255,255,255,0.18)', strokeWidth: 0.6, strokeDasharray: '2 2.4' }),
      h('rect', { key: 'sb', x: x + sw / 2 - 3.5, y: y + 8, width: 7, height: 124 - y - 8, rx: 2.5, fill: gFrame, stroke: C.edge, strokeWidth: 0.6 }),
    ];
  };
  const wrap = (...kids) =>
    h(
      'svg',
      { viewBox: '0 0 220 130', style: { width: '100%', height: 'auto', display: 'block' }, role: 'img', 'aria-label': 'Animated demonstration of the movement' },
      defs,
      floorShadow,
      floor,
      ...kids
    );

  switch (kind) {
    case 'horizPress':
    case 'fly': {
      const armAnim = kind === 'fly' ? anim('ip-rot-pos', { transformOrigin: '167px 58px' }) : anim('ip-tx-neg');
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 30),
        ...cable('M57 74 L57 34 Q60 26 66 30 L136 56'),
        h('rect', { x: 174, y: 48, width: 9, height: 42, rx: 4, fill: gFrame }),
        ...seat(158, 88, 36),
        h('circle', { cx: 164, cy: 44, r: 8, fill: gHead }),
        L(170, 88, 166, 52, 8),
        L(170, 88, 146, 92, 7),
        L(146, 92, 143, 118, 6),
        h('g', { style: armAnim }, L(167, 58, 150, 58, 5.5), L(150, 58, 137, 56, 5), h('rect', { x: 128, y: 48, width: 8, height: 18, rx: 3, fill: C.accent }))
      );
    }
    case 'curl':
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 66),
        ...cable('M57 74 L57 70 Q60 62 66 66 L128 78'),
        ...seat(154, 92, 40),
        h('rect', { x: 132, y: 70, width: 30, height: 8, rx: 3, fill: gFrame }),
        h('circle', { cx: 168, cy: 46, r: 8, fill: gHead }),
        L(172, 92, 168, 54, 8),
        L(172, 92, 148, 96, 7),
        L(148, 96, 146, 118, 6),
        L(168, 58, 148, 72, 5.5),
        h(
          'g',
          { style: anim('ip-rot-neg', { transformOrigin: '148px 72px' }) },
          L(148, 72, 128, 76, 5),
          h('rect', { x: 120, y: 68, width: 9, height: 16, rx: 3, fill: C.accent })
        )
      );
    case 'horizPull':
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 40),
        ...cable('M57 74 L57 44 Q60 36 66 40 L134 62'),
        ...seat(156, 88, 40),
        h('circle', { cx: 166, cy: 44, r: 8, fill: gHead }),
        L(170, 88, 167, 52, 8),
        L(170, 88, 144, 92, 7),
        L(144, 92, 141, 118, 6),
        h(
          'g',
          { style: anim('ip-tx-pos') },
          L(167, 58, 148, 62, 5.5),
          L(148, 62, 134, 62, 5),
          h('rect', { x: 126, y: 54, width: 8, height: 16, rx: 3, fill: C.accent })
        )
      );
    case 'vertPull':
    case 'pushdown': {
      const standing = kind === 'pushdown';
      return wrap(
        ...col(14, 40, 12),
        ...stack(17, 72),
        ...pulley(60, 20),
        ...cable('M57 74 L57 24 Q60 16 66 20 L150 22'),
        h(
          'g',
          { style: anim(standing ? 'ip-rot-pos' : 'ip-ty-pos', standing ? { transformOrigin: '156px 62px' } : null) },
          standing ? L(156, 62, 152, 84, 5.5) : h('rect', { x: 126, y: 26, width: 62, height: 6, rx: 3, fill: C.accent }),
          standing ? h('rect', { x: 138, y: 80, width: 26, height: 7, rx: 3, fill: C.accent }) : null
        ),
        standing
          ? h(
              'g',
              null,
              h('circle', { cx: 158, cy: 36, r: 8, fill: gHead }),
              L(158, 45, 158, 84, 8),
              L(156, 45, 156, 62, 5.5),
              L(158, 84, 152, 118, 7)
            )
          : h(
              'g',
              null,
              ...seat(146, 92, 40),
              h('circle', { cx: 158, cy: 52, r: 8, fill: gHead }),
              L(158, 92, 158, 60, 8),
              L(158, 92, 186, 96, 7),
              L(186, 96, 188, 118, 6),
              h(
                'g',
                { style: anim('ip-rot-pos', { transformOrigin: '158px 62px' }) },
                L(158, 62, 152, 40, 5.5),
                L(152, 40, 150, 26, 5)
              )
            )
      );
    }
    case 'vertPress':
    case 'raise': {
      const a = kind === 'raise' ? anim('ip-rot-neg', { transformOrigin: '166px 58px' }) : anim('ip-ty-neg');
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 26),
        ...cable('M57 74 L57 30 Q60 22 66 26 L138 40'),
        ...seat(152, 92, 40),
        h('rect', { x: 176, y: 48, width: 9, height: 46, rx: 4, fill: gFrame }),
        h('circle', { cx: 166, cy: 44, r: 8, fill: gHead }),
        L(170, 92, 168, 52, 8),
        L(170, 92, 146, 96, 7),
        L(146, 96, 144, 118, 6),
        h('g', { style: a }, L(166, 58, 150, 52, 5.5), L(150, 52, 140, 38, 5), h('rect', { x: 130, y: 32, width: 8, height: 16, rx: 3, fill: C.accent }))
      );
    }
    case 'legpress':
      return wrap(
        h(
          'g',
          { style: anim('ip-tx-neg') },
          h('rect', { x: 34, y: 34, width: 14, height: 56, rx: 3, fill: C.accent, opacity: 0.9 }),
          ...plates(0, 44, 4)
        ),
        h('rect', { x: 96, y: 88, width: 96, height: 8, rx: 3, fill: gFrame }),
        h('rect', { x: 180, y: 62, width: 10, height: 30, rx: 4, fill: gFrame }),
        h('circle', { cx: 182, cy: 54, r: 8, fill: gHead }),
        L(176, 84, 130, 80, 8),
        h('g', { style: anim('ip-tx-neg') }, L(130, 80, 100, 64, 7), L(100, 64, 62, 62, 6))
      );
    case 'legcurl':
    case 'legext': {
      const prone = kind === 'legcurl';
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 46),
        ...cable('M57 74 L57 50 Q60 42 66 46 L120 78'),
        h('rect', { x: 104, y: prone ? 74 : 84, width: 92, height: 8, rx: 3, fill: gFrame }),
        h('rect', { x: 142, y: prone ? 82 : 92, width: 8, height: 42, fill: gHousing }),
        h('circle', { cx: prone ? 190 : 186, cy: prone ? 66 : 56, r: 8, fill: gHead }),
        prone ? L(184, 70, 138, 72, 8) : h('g', null, L(186, 66, 184, 82, 8), L(184, 82, 150, 84, 7)),
        h(
          'g',
          { style: anim(prone ? 'ip-rot-neg' : 'ip-rot-neg', { transformOrigin: prone ? '138px 72px' : '150px 84px' }) },
          L(prone ? 138 : 150, prone ? 72 : 84, prone ? 112 : 122, prone ? 74 : 92, 6),
          h('rect', { x: prone ? 104 : 114, y: prone ? 66 : 84, width: 10, height: 16, rx: 3, fill: C.accent })
        )
      );
    }
    case 'hipthrust':
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 60),
        ...cable('M57 74 L57 64 Q60 56 66 60 L118 74'),
        h('rect', { x: 100, y: 96, width: 100, height: 8, rx: 3, fill: gFrame }),
        h('rect', { x: 176, y: 52, width: 10, height: 44, rx: 4, fill: gFrame }),
        h('circle', { cx: 180, cy: 46, r: 8, fill: gHead }),
        h(
          'g',
          { style: anim('ip-ty-neg') },
          h('rect', { x: 108, y: 68, width: 40, height: 10, rx: 4, fill: C.accent }),
          L(174, 68, 130, 76, 8),
          L(130, 76, 122, 96, 7)
        )
      );
    case 'calf':
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 22),
        ...cable('M57 74 L57 26 Q60 18 66 22 L150 34'),
        h('rect', { x: 120, y: 112, width: 74, height: 10, rx: 3, fill: gFrame }),
        h(
          'g',
          { style: anim('ip-ty-neg') },
          h('rect', { x: 138, y: 30, width: 40, height: 9, rx: 4, fill: C.accent }),
          h('circle', { cx: 158, cy: 52, r: 8, fill: gHead }),
          L(158, 60, 158, 88, 8),
          L(152, 44, 152, 60, 5),
          L(164, 44, 164, 60, 5),
          L(158, 88, 156, 112, 7)
        )
      );
    case 'crunch':
    case 'rotation': {
      const rot = kind === 'rotation';
      return wrap(
        ...col(14, 40, 16),
        ...stack(17, 72),
        ...pulley(60, 52),
        ...cable('M57 74 L57 56 Q60 48 66 52 L128 64'),
        ...seat(150, 92, 44),
        h('rect', { x: 128, y: 60, width: 10, height: 22, rx: 4, fill: C.accent }),
        L(172, 92, 148, 96, 7),
        L(148, 96, 146, 118, 6),
        h(
          'g',
          { style: anim(rot ? 'ip-rot-neg' : 'ip-rot-pos', { transformOrigin: '172px 92px' }) },
          L(172, 92, 168, 54, 8),
          h('circle', { cx: 167, cy: 46, r: 8, fill: gHead }),
          L(168, 60, 146, 66, 5.5)
        )
      );
    }
    default:
      return h(MachineDemo, { kind: 'horizPull', dur });
  }
}
