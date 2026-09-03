import { useEffect, useRef, useState } from 'react';
import RestTimer from './RestTimer';
import { useI18n } from '../i18n/I18nContext';
import { todayISO } from '../hooks/useWorkoutLogs';

const inputStyle = {
  width: '100%',
  font: 'inherit',
  fontSize: 14,
  padding: '7px 8px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-divider)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontVariantNumeric: 'tabular-nums',
};

// Per-exercise set-by-set logger: weight/reps rows (default = the
// exercise's target set count), add/remove rows, autosaves into today's
// session log, and a "done" mark per row that (re)starts the rest timer.
export default function SetLogger({ slug, targetSets, sessions, onLogSet, onRemoveSet, restSeconds, onRestSecondsChange }) {
  const { t } = useI18n();
  const [rows, setRows] = useState(() => initRows(sessions, targetSets));
  const [restKey, setRestKey] = useState(null);
  const skipPersist = useRef(true);

  // Re-seed rows whenever the exercise/set changes (slug flips on A<->B swap).
  useEffect(() => {
    skipPersist.current = true;
    setRows(initRows(sessions, targetSets));
    setRestKey(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return undefined;
    }
    const id = setTimeout(() => {
      rows.forEach((row, i) => {
        const weight = Number(row.weight);
        const reps = Number(row.reps);
        if (weight > 0 && reps > 0) onLogSet(i, { weight, reps });
      });
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const updateRow = (i, patch) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { weight: '', reps: '', done: false }]);
  const removeRow = (i) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    onRemoveSet(i);
  };
  const markDone = (i) => {
    updateRow(i, { done: true });
    setRestKey((k) => (k === null ? 0 : k + 1));
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr auto auto', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', textAlign: 'center' }}>{i + 1}</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              placeholder={t('weightKg')}
              aria-label={t('weightKg')}
              value={row.weight}
              onChange={(e) => updateRow(i, { weight: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder={t('reps')}
              aria-label={t('reps')}
              value={row.reps}
              onChange={(e) => updateRow(i, { reps: e.target.value })}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => markDone(i)}
              className={row.done ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: 12, padding: '6px 10px' }}
            >
              {t('setDone')}
            </button>
            {rows.length > 1 && (
              <button type="button" className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 4px' }} onClick={() => removeRow(i)} aria-label={t('removeSet')}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" style={{ fontSize: 12, marginTop: 8 }} onClick={addRow}>
        + {t('addSet')}
      </button>
      {restKey !== null && <RestTimer key={`${slug}-${restKey}`} seconds={restSeconds} onSecondsChange={onRestSecondsChange} />}
    </div>
  );
}

function initRows(sessions, targetSets) {
  const today = sessions.find((s) => s.date === todayISO());
  const base = today?.sets?.length ? today.sets : new Array(targetSets).fill(null);
  return base.map((s) => ({ weight: s?.weight ?? '', reps: s?.reps ?? '', done: Boolean(s) }));
}
