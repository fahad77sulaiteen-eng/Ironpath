# IronPath

A 4-day machines-only gym program with a 16-session monthly tracker, animated machine diagrams, and a rotating 3D hero — built from a Claude Design handoff.

**Live site (GitHub Pages):** https://fahad77sulaiteen-eng.github.io/ironpath/

## Structure

- `index.html` — the built, self-contained production build (what GitHub Pages serves)
- `app/` — the React + Vite source. See `app/README.md` for development instructions.

## Rebuilding the deployed page

```
cd app
npm install
npm run build
```

Then copy `app/dist/index.html` and inline its `app/dist/assets/*.js`/`*.css` into the repo root `index.html` (or adjust `vite.config.js`'s `base` and copy `app/dist/*` directly if you'd rather serve unbundled assets).
