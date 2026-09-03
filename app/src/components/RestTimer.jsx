import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
    osc.onended = () => ctx.close();
  } catch (e) {
    // Web Audio unavailable — silent fallback, vibration still fires
  }
}

function vibrate() {
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } catch (e) {
    // Vibration API unsupported (e.g. iOS Safari) — no-op
  }
}

// A countdown that starts immediately when mounted (the parent remounts it
// with a new `key` to restart it). Beeps + vibrates once at zero.
export default function RestTimer({ seconds, onSecondsChange }) {
  const { t } = useI18n();
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      setRunning(false);
      beep();
      vibrate();
    }
  }, [remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
        padding: '8px 10px',
        borderRadius: 'var(--radius-sm)',
        background: remaining === 0 ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        border: '1px solid var(--color-divider)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontVariantNumeric: 'tabular-nums', color: remaining === 0 ? 'var(--color-accent)' : 'var(--color-text)' }}>
        {remaining === 0 ? t('restDone') : `${mm}:${ss}`}
      </span>
      {remaining > 0 && (
        <>
          <input
            type="number"
            min={0}
            step={5}
            value={remaining}
            onChange={(e) => {
              const v = Math.max(0, Number(e.target.value) || 0);
              setRemaining(v);
              onSecondsChange?.(v);
            }}
            aria-label={t('restTitle')}
            style={{ width: 52, font: 'inherit', fontSize: 12, padding: '3px 5px', borderRadius: 4, border: '1px solid var(--color-divider)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
          />
          <span style={{ fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('restSecondsLabel')}</span>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginInlineStart: 'auto', fontSize: 12 }}
            onClick={() => setRemaining(0)}
          >
            {t('restSkip')}
          </button>
        </>
      )}
    </div>
  );
}
