# IronPath

A React + Vite implementation of the IronPath mobile app design (`project/IronPath.dc.html` in the repo root), a 4-day machine-only gym program with a 16-session monthly tracker.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

## Structure

- `src/App.jsx` — page shell, wires the session/state hook into each section
- `src/hooks/useIronPath.js` — session tracker state (`localStorage`-persisted), current-week/lock logic
- `src/data/exercises.js` — the 4-day split and per-day exercise data (sets A/B)
- `src/components/HeroSection.jsx` — Three.js gym-machine hero with an SVG fallback if WebGL is unavailable
- `src/components/MachineDemo.jsx` — looping animated SVG diagram per exercise
- `src/components/BodyFigure.jsx` — small stick figure highlighting the worked muscle group
- `src/styles/nocturne.css` — the Nocturne design system tokens/components (copied from `project/_ds/`)
- `src/styles/ironpath.css` — page-level reset and the `ip-*` animation keyframes
