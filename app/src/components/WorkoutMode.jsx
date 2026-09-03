import { useState } from 'react';
import BodyFigure from './BodyFigure';
import MachineDemo from './MachineDemo';
import SetLogger from './SetLogger';
import { useI18n } from '../i18n/I18nContext';
import { lastSessionBefore, todayISO, topSet } from '../hooks/useWorkoutLogs';
import { DEMO_SPEED } from '../data/exercises';

const DUR = Math.max(1.2, 2.5 / (DEMO_SPEED || 1)).toFixed(2);

// Full-screen, one-exercise-at-a-time flow for using the app live at the
// gym: big text, the set logger and rest timer built right in, and
// next/previous stepping through today's (post-swap) exercise list.
export default function WorkoutMode({ dayTitle, exercises, workoutLogs, settings, updateSettings, onClose }) {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = exercises.length;
  const { variant: v } = exercises[step];
  const name = lang === 'ar' ? v.nameAr : v.name;
  const machine = lang === 'ar' ? v.machineAr : v.machine;
  const cue = lang === 'ar' ? v.cueAr : v.cue;
  const muscle = lang === 'ar' ? v.muscleAr : v.muscle;

  const sessions = workoutLogs.getExerciseLogs(v.slug);
  const last = lastSessionBefore(sessions, todayISO());
  const lastTop = topSet(last);

  const goNext = () => {
    if (step === total - 1) setFinished(true);
    else setStep((s) => s + 1);
  };
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'color-mix(in srgb, var(--color-bg) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <span style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
          {dayTitle} · {step + 1} {t('exerciseOf')} {total}
        </span>
        <button type="button" className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }} onClick={onClose}>
          {t('exitWorkout')} ✕
        </button>
      </div>

      {finished ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>{t('workoutComplete')}</div>
          <button type="button" className="btn btn-primary" onClick={onClose}>{t('exitWorkout')}</button>
        </div>
      ) : (
        <div style={{ flex: 1, padding: '20px 20px 100px', maxWidth: 468, margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>
            {name}
          </div>
          <div style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 10 }}>{machine}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>{v.sets} × {v.reps}</div>
            {lastTop && (
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                {t('lastTime')}: <strong style={{ color: 'var(--color-text)' }}>{lastTop.weight}{lang === 'ar' ? 'كجم' : 'kg'} × {lastTop.reps}</strong>
              </div>
            )}
          </div>

          <div
            style={{
              padding: v.img ? 0 : '6px 8px 2px',
              overflow: 'hidden',
              borderRadius: 'var(--radius-md)',
              background: v.img
                ? 'linear-gradient(180deg, #1b1d29 0%, #101119 100%)'
                : 'linear-gradient(180deg, color-mix(in srgb,var(--color-bg) 70%,#000) 0%, var(--color-neutral-900) 100%)',
              boxShadow: 'inset 0 1px 0 color-mix(in srgb,var(--color-text) 8%,transparent), var(--shadow-sm)',
              marginBottom: 14,
            }}
          >
            {v.img ? (
              <img src={v.img} alt={name} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', mixBlendMode: 'lighten' }} />
            ) : (
              <MachineDemo kind={v.kind} dur={DUR} />
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ flex: 'none', width: 42 }}>
              <BodyFigure pts={v.pts} view={v.view} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>{muscle}</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'color-mix(in srgb,var(--color-text) 80%,transparent)' }}>{cue}</p>
            </div>
          </div>

          <SetLogger
            slug={v.slug}
            targetSets={v.sets}
            sessions={sessions}
            onLogSet={(idx, set) => workoutLogs.logSet(v.slug, idx, set)}
            onRemoveSet={(idx) => workoutLogs.removeSetAt(v.slug, idx)}
            restSeconds={settings.restSeconds}
            onRestSecondsChange={(sec) => updateSettings({ restSeconds: sec })}
          />
        </div>
      )}

      {!finished && (
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            gap: 10,
            padding: '12px 20px',
            background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--color-divider)',
          }}
        >
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={goPrev} disabled={step === 0}>
            {t('prevExercise')}
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={goNext}>
            {step === total - 1 ? t('finishWorkout') : t('nextExercise')}
          </button>
        </div>
      )}
    </div>
  );
}
