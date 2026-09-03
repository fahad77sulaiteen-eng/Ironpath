import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HERO_SCENE } from '../data/exercises';
import { C } from '../data/colors';
import { useI18n } from '../i18n/I18nContext';

// Builds the rotating 3D gym-machine hero. Falls back to (and keeps
// showing) the static SVG rig if WebGL isn't available.
function useHeroScene(canvasRef, fallbackRef) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    } catch (e) {
      return undefined;
    }

    const fb = fallbackRef.current;
    if (fb) fb.style.display = 'none';

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    cam.position.set(0, 1.7, 8.2);
    cam.lookAt(0, 1.1, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9bdcb, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(4, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-3, 2, 6);
    scene.add(fill);
    const rim = new THREE.PointLight(0x9184d9, 1.2, 22);
    rim.position.set(-4, 2.4, 2);
    scene.add(rim);

    // Light steel palette — a light hero background needs a well-lit
    // machine rather than the near-black studio look a dark page allowed.
    const metal = new THREE.MeshStandardMaterial({ color: 0xc7cbda, roughness: 0.4, metalness: 0.55 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x8b90a3, roughness: 0.55, metalness: 0.4 });
    const pad = new THREE.MeshStandardMaterial({ color: 0x555a72, roughness: 0.9, metalness: 0.05 });
    const acc = new THREE.MeshStandardMaterial({ color: 0x9184d9, roughness: 0.3, metalness: 0.5, emissive: 0x4a3fa0, emissiveIntensity: 0.6 });

    const g = new THREE.Group();
    const box = (w, hh, d, m, x, y, z) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m);
      b.position.set(x, y, z);
      g.add(b);
      return b;
    };
    const cyl = (r, hh, m, x, y, z, rot) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, hh, 20), m);
      c.position.set(x, y, z);
      if (rot) c.rotation.z = Math.PI / 2;
      g.add(c);
      return c;
    };

    box(4.6, 0.18, 2.6, dark, 0, 0.09, 0);
    box(0.28, 3.5, 0.28, metal, -1.5, 1.85, -0.9);
    box(0.28, 3.5, 0.28, metal, 1.5, 1.85, -0.9);
    box(3.3, 0.2, 0.2, metal, 0, 3.5, -0.9);
    for (let i = 0; i < 5; i++) box(1.9, 0.24, 1.1, i < 3 ? metal : dark, 0, 0.55 + i * 0.3, -0.9);
    box(0.1, 3.1, 0.1, acc, 0, 1.9, -0.78);

    if (HERO_SCENE === 'cable-station') {
      box(1.2, 0.2, 1.1, pad, 0, 0.32, 0.7);
      const bar = cyl(0.08, 2.0, acc, 0, 2.5, 0.5, true);
      bar.position.z = 0.5;
      cyl(0.05, 1.4, metal, 0, 3.2, -0.55);
    } else {
      box(1.5, 0.22, 1.3, pad, 0, 1.05, 0.55);
      const back = box(1.4, 1.5, 0.22, pad, 0, 1.85, -0.05);
      back.rotation.x = -0.12;
      cyl(0.07, 1.5, metal, -0.95, 2.1, 0.35, true);
      cyl(0.07, 1.5, metal, 0.95, 2.1, 0.35, true);
      const hL = cyl(0.09, 0.7, acc, -1.55, 2.1, 0.35);
      hL.rotation.x = Math.PI / 2;
      const hR = cyl(0.09, 0.7, acc, 1.55, 2.1, 0.35);
      hR.rotation.x = Math.PI / 2;
    }
    g.position.y = -0.35;
    scene.add(g);

    const resize = () => {
      const w = cv.clientWidth || 1;
      const hgt = cv.clientHeight || 1;
      renderer.setSize(w, hgt, false);
      cam.aspect = w / hgt;
      cam.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let scrollY = window.scrollY || 0;
    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf;
    const tick = () => {
      g.rotation.y += 0.0032;
      const s = scrollY;
      cam.position.y = 1.7 + Math.min(s, 500) * 0.0016;
      cam.position.z = 8.2 - Math.min(s, 500) * 0.0012;
      cam.lookAt(0, 1.05, 0);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, [canvasRef, fallbackRef]);
}

export default function HeroSection() {
  const { t } = useI18n();
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);
  useHeroScene(canvasRef, fallbackRef);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 20px 34px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 70% at 70% 22%, var(--color-accent-900) 0%, transparent 62%), linear-gradient(180deg, var(--color-neutral-900) 0%, var(--color-bg) 70%)',
        }}
      />
      <svg
        ref={fallbackRef}
        viewBox="0 0 300 300"
        style={{ position: 'absolute', left: '50%', top: '8%', width: 300, marginLeft: -150, animation: 'ip-float 7s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <g stroke={C.frame} fill="none" strokeWidth={6} strokeLinecap="round">
          <path d="M70 240 L70 90 M230 240 L230 120 M70 100 L230 130" />
          <path d="M96 186 L150 200 L150 236" stroke={C.accent} strokeWidth={3} />
        </g>
        <rect x={52} y={150} width={36} height={10} rx={3} fill={C.plateLight} />
        <rect x={52} y={164} width={36} height={10} rx={3} fill={C.plate} />
        <rect x={52} y={178} width={36} height={10} rx={3} fill={C.plateDark} />
        <rect x={136} y={196} width={60} height={9} rx={4} fill={C.accent} />
        <circle cx={230} cy={120} r={9} fill="none" stroke={C.accent} strokeWidth={3} />
      </svg>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} aria-hidden="true" />
      {/* Frosted scrim: keeps the headline legible over the 3D machine
          regardless of how the render happens to fall behind it. */}
      <div
        style={{
          position: 'relative',
          background: 'color-mix(in srgb, var(--color-bg) 86%, transparent)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderRadius: 18,
          padding: '16px 18px 18px',
          margin: '0 -18px -18px',
          boxShadow: '0 -8px 24px color-mix(in srgb, var(--color-bg) 60%, transparent)',
        }}
      >
        <span className="tag tag-outline" style={{ marginBottom: 16 }}>{t('heroTag')}</span>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            fontSize: 'clamp(34px,10.5vw,46px)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            margin: '14px 0 12px',
            textWrap: 'pretty',
          }}
        >
          {t('heroTitle1')}
          <br />
          {t('heroTitle2')}
        </h1>
        <p
          style={{
            margin: '0 0 22px',
            fontSize: 14,
            lineHeight: 1.55,
            maxWidth: '31ch',
            color: 'color-mix(in srgb,var(--color-text) 68%,transparent)',
          }}
        >
          {t('heroBody')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="btn btn-primary" href="#tracker">{t('startProgram')}</a>
          <a className="btn btn-secondary" href="#split">{t('seeSplit')}</a>
        </div>
      </div>
    </section>
  );
}
