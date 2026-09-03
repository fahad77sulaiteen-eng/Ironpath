import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useProfile } from '../hooks/useProfile';
import { useGoal } from '../hooks/useGoal';
import { useBodyLogs } from '../hooks/useBodyLogs';
import { todayISO } from '../hooks/useWorkoutLogs';
import { calculateBMR, calculateTDEE, calorieTarget, proteinTarget } from '../utils/nutrition';
import { weeklyGuidanceKey } from '../utils/guidance';
import { addPhoto, deletePhoto, fileToDataUrl, listPhotos } from '../utils/photoStore';
import MiniLineChart from './MiniLineChart';

const cardStyle = {
  padding: 14,
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
};
const kicker = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 };
const fieldRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 };
const GOAL_TYPES = ['lose_fat', 'build_muscle', 'recomp', 'maintain'];
const GOAL_LABEL_KEYS = { lose_fat: 'goalLoseFat', build_muscle: 'goalBuildMuscle', recomp: 'goalRecomp', maintain: 'goalMaintain' };

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function BodyPage() {
  const { t, lang } = useI18n();
  const { profile, updateProfile } = useProfile();
  const { goal, updateGoal } = useGoal();
  const { entries, latest, logEntry } = useBodyLogs();

  const [draft, setDraft] = useState({ weightKg: '', bodyFatPct: '', muscleMassKg: '', waistCm: '', armCm: '', chestCm: '' });
  const [photos, setPhotos] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    listPhotos().then(setPhotos).catch(() => setPhotos([]));
  }, []);

  const currentWeight = latest?.weightKg ?? null;
  const bmr = calculateBMR({ weightKg: currentWeight, heightCm: profile.heightCm, age: profile.age, sex: profile.sex });
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calories = calorieTarget(tdee, goal.type);
  const protein = currentWeight ? proteinTarget(currentWeight, goal.type) : null;
  const hasProfileAndWeight = Boolean(profile.heightCm && profile.age && currentWeight);
  const guidanceKey = hasProfileAndWeight ? weeklyGuidanceKey(entries, goal.type) : null;

  const weightPoints = entries.filter((e) => e.weightKg != null).map((e) => ({ date: e.date, value: e.weightKg }));
  const fatPoints = entries.filter((e) => e.bodyFatPct != null).map((e) => ({ date: e.date, value: e.bodyFatPct }));

  const saveEntry = () => {
    const patch = {};
    for (const [k, v] of Object.entries(draft)) {
      if (v !== '' && v != null) patch[k] = Number(v);
    }
    if (!Object.keys(patch).length) return;
    logEntry(todayISO(), patch);
    setDraft({ weightKg: '', bodyFatPct: '', muscleMassKg: '', waistCm: '', armCm: '', chestCm: '' });
  };

  const handlePhotoFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const id = await addPhoto(dataUrl, todayISO());
    setPhotos((prev) => [...prev, { id, date: todayISO(), dataUrl }].sort((a, b) => (a.date < b.date ? -1 : 1)));
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const comparePhotos = compareIds.map((id) => photos.find((p) => p.id === id)).filter(Boolean);

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Profile */}
      <section style={cardStyle}>
        <div style={kicker}>{t('profileTitle')}</div>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('profileHint')}</p>
        <div style={{ ...fieldRow, marginBottom: 10 }}>
          <Field label={t('heightCm')}>
            <input className="input" type="number" min={0} value={profile.heightCm ?? ''} onChange={(e) => updateProfile({ heightCm: Number(e.target.value) || null })} />
          </Field>
          <Field label={t('age')}>
            <input className="input" type="number" min={0} value={profile.age ?? ''} onChange={(e) => updateProfile({ age: Number(e.target.value) || null })} />
          </Field>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>{t('sex')}</label>
          <div className="seg" role="tablist" style={{ width: 'fit-content' }}>
            <label className="seg-opt">
              <input type="radio" name="ip-sex" checked={profile.sex === 'male'} onChange={() => updateProfile({ sex: 'male' })} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              {t('sexMale')}
            </label>
            <label className="seg-opt">
              <input type="radio" name="ip-sex" checked={profile.sex === 'female'} onChange={() => updateProfile({ sex: 'female' })} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              {t('sexFemale')}
            </label>
          </div>
        </div>
        <Field label={t('activityLevel')}>
          <select className="input" value={profile.activityLevel} onChange={(e) => updateProfile({ activityLevel: e.target.value })}>
            <option value="sedentary">{t('activitySedentary')}</option>
            <option value="light">{t('activityLight')}</option>
            <option value="moderate">{t('activityModerate')}</option>
            <option value="active">{t('activityActive')}</option>
            <option value="very_active">{t('activityVeryActive')}</option>
          </select>
        </Field>
      </section>

      {/* Goal */}
      <section style={cardStyle}>
        <div style={kicker}>{t('goalTitle')}</div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>{t('goalType')}</label>
          <div className="seg" role="tablist" style={{ width: '100%', flexWrap: 'wrap' }}>
            {GOAL_TYPES.map((g) => (
              <label key={g} className="seg-opt" style={{ flex: '1 0 auto', justifyContent: 'center' }}>
                <input type="radio" name="ip-goal" checked={goal.type === g} onChange={() => updateGoal({ type: g })} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
                {t(GOAL_LABEL_KEYS[g])}
              </label>
            ))}
          </div>
        </div>
        <div style={fieldRow}>
          <Field label={t('targetWeightKg')}>
            <input className="input" type="number" min={0} value={goal.targetWeightKg ?? ''} onChange={(e) => updateGoal({ targetWeightKg: Number(e.target.value) || null })} />
          </Field>
          <Field label={t('targetBodyFatPct')}>
            <input className="input" type="number" min={0} value={goal.targetBodyFatPct ?? ''} onChange={(e) => updateGoal({ targetBodyFatPct: Number(e.target.value) || null })} />
          </Field>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label={t('targetDate')}>
            <input className="input" type="date" value={goal.targetDate ?? ''} onChange={(e) => updateGoal({ targetDate: e.target.value || null })} />
          </Field>
        </div>
      </section>

      {/* Guidance */}
      <section style={{ ...cardStyle, background: 'linear-gradient(150deg, var(--color-accent-900), var(--color-surface))', boxShadow: '0 0 0 1px var(--color-accent-700)' }}>
        <div style={kicker}>{t('guidanceTitle')}</div>
        {!hasProfileAndWeight ? (
          <p style={{ margin: 0, fontSize: 13 }}>{t('guidanceNeedsProfile')}</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 18, marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--color-accent)' }}>{calories}</div>
                <div style={{ fontSize: 10.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('dailyCalories')} ({t('kcal')})</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--color-accent)' }}>{protein}</div>
                <div style={{ fontSize: 10.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('dailyProtein')} ({t('gramsShort')})</div>
              </div>
            </div>
            {guidanceKey && (
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500 }}>{t(guidanceKey)}</p>
            )}
          </>
        )}
        <p style={{ margin: 0, fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 50%,transparent)' }}>{t('guidanceDisclaimer')}</p>
      </section>

      {/* Body log */}
      <section style={cardStyle}>
        <div style={kicker}>{t('bodyLogTitle')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          <Field label={t('weightKgLabel')}>
            <input className="input" type="number" value={draft.weightKg} onChange={(e) => setDraft((d) => ({ ...d, weightKg: e.target.value }))} />
          </Field>
          <Field label={t('bodyFatPct')}>
            <input className="input" type="number" value={draft.bodyFatPct} onChange={(e) => setDraft((d) => ({ ...d, bodyFatPct: e.target.value }))} />
          </Field>
          <Field label={t('muscleMassKg')}>
            <input className="input" type="number" value={draft.muscleMassKg} onChange={(e) => setDraft((d) => ({ ...d, muscleMassKg: e.target.value }))} />
          </Field>
          <Field label={t('waistCm')}>
            <input className="input" type="number" value={draft.waistCm} onChange={(e) => setDraft((d) => ({ ...d, waistCm: e.target.value }))} />
          </Field>
          <Field label={t('armCm')}>
            <input className="input" type="number" value={draft.armCm} onChange={(e) => setDraft((d) => ({ ...d, armCm: e.target.value }))} />
          </Field>
          <Field label={t('chestCm')}>
            <input className="input" type="number" value={draft.chestCm} onChange={(e) => setDraft((d) => ({ ...d, chestCm: e.target.value }))} />
          </Field>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={saveEntry}>{t('saveEntry')}</button>

        {weightPoints.length >= 2 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, marginBottom: 4, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('weightTrend')}</div>
            <MiniLineChart points={weightPoints} unit={lang === 'ar' ? '' : 'kg'} />
          </div>
        )}
        {fatPoints.length >= 2 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, marginBottom: 4, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('bodyFatTrend')}</div>
            <MiniLineChart points={fatPoints} unit="%" />
          </div>
        )}
      </section>

      {/* Progress photos */}
      <section style={cardStyle}>
        <div style={kicker}>{t('photosTitle')}</div>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{t('photosHint')}</p>
        <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>{t('addPhoto')}</button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoFile} style={{ display: 'none' }} />

        {photos.length === 0 ? (
          <p style={{ marginTop: 10, fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 50%,transparent)' }}>{t('noPhotosYet')}</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 8, marginTop: 12 }}>
              {photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleCompare(p.id)}
                  style={{
                    padding: 0,
                    border: compareIds.includes(p.id) ? '2px solid var(--color-accent)' : '1px solid var(--color-divider)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none',
                    position: 'relative',
                  }}
                  title={p.date}
                >
                  <img src={p.dataUrl} alt={p.date} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 11, color: 'color-mix(in srgb,var(--color-text) 50%,transparent)' }}>{t('compareHint')}</p>
            {comparePhotos.length === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                {comparePhotos.map((p) => (
                  <div key={p.id}>
                    <img src={p.dataUrl} alt={p.date} style={{ width: '100%', borderRadius: 'var(--radius-sm)', display: 'block' }} />
                    <div style={{ fontSize: 10.5, textAlign: 'center', marginTop: 4, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{p.date}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
