import { useRef } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { exportData, importData } from '../utils/exportImport';

const rowStyle = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelStyle = { fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' };

export default function DataSettings({ open, onClose, settings, updateSettings }) {
  const { t, lang, setLang } = useI18n();
  const fileRef = useRef(null);

  if (!open) return null;

  const handleImportClick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm(t('importConfirm'))) return;
    const result = await importData(file);
    if (result.ok) {
      window.alert(t('importSuccess'));
      window.location.reload();
    } else {
      const key = {
        'invalid-json': 'importErrorInvalidJson',
        'invalid-shape': 'importErrorInvalidShape',
        empty: 'importErrorEmpty',
        'storage-write-failed': 'importErrorWrite',
      }[result.error] || 'importErrorInvalidJson';
      window.alert(t(key));
    }
  };

  return (
    <div className="dialog-backdrop" style={{ zIndex: 100 }} onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">{t('settingsTitle')}</div>

        <div style={rowStyle}>
          <label style={labelStyle}>{t('language')}</label>
          <div className="seg" role="tablist" style={{ width: 'fit-content' }}>
            <label className="seg-opt">
              <input type="radio" name="ip-lang" checked={lang === 'ar'} onChange={() => setLang('ar')} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              العربية
            </label>
            <label className="seg-opt">
              <input type="radio" name="ip-lang" checked={lang === 'en'} onChange={() => setLang('en')} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              English
            </label>
          </div>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>{t('progressionMode')}</label>
          <div className="seg" role="tablist" style={{ width: 'fit-content' }}>
            <label className="seg-opt">
              <input
                type="radio"
                name="ip-progression"
                checked={settings.progressionMode === 'weight'}
                onChange={() => updateSettings({ progressionMode: 'weight' })}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
              />
              {t('progressionModeWeight')}
            </label>
            <label className="seg-opt">
              <input
                type="radio"
                name="ip-progression"
                checked={settings.progressionMode === 'reps'}
                onChange={() => updateSettings({ progressionMode: 'reps' })}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
              />
              {t('progressionModeReps')}
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="field" style={rowStyle}>
            <label>{t('restDefault')}</label>
            <input
              className="input"
              type="number"
              min={15}
              step={15}
              value={settings.restSeconds}
              onChange={(e) => updateSettings({ restSeconds: Math.max(15, Number(e.target.value) || 90) })}
            />
          </div>
          <div className="field" style={rowStyle}>
            <label>{t('weightIncrementLabel')}</label>
            <input
              className="input"
              type="number"
              min={0.5}
              step={0.5}
              value={settings.weightIncrement}
              onChange={(e) => updateSettings({ weightIncrement: Math.max(0.5, Number(e.target.value) || 2.5) })}
            />
          </div>
          <div className="field" style={rowStyle}>
            <label>{t('repIncrementLabel')}</label>
            <input
              className="input"
              type="number"
              min={1}
              step={1}
              value={settings.repIncrement}
              onChange={(e) => updateSettings({ repIncrement: Math.max(1, Number(e.target.value) || 2) })}
            />
          </div>
        </div>

        <div className="hr" />

        <div style={rowStyle}>
          <button type="button" className="btn btn-primary" onClick={exportData}>
            {t('exportData')}
          </button>
          <p style={{ margin: 0, fontSize: 11.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('exportDataHint')}</p>
        </div>

        <div style={rowStyle}>
          <button type="button" className="btn btn-secondary" onClick={handleImportClick}>
            {t('importData')}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={handleFile} style={{ display: 'none' }} />
          <p style={{ margin: 0, fontSize: 11.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t('importDataHint')}</p>
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('settingsClose')}
          </button>
        </div>
      </div>
    </div>
  );
}
