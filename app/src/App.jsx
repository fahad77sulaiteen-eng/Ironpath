import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SplitSection from './components/SplitSection';
import TrackerSection from './components/TrackerSection';
import WorkoutSection from './components/WorkoutSection';
import Footer from './components/Footer';
import DataSettings from './components/DataSettings';
import BodyPage from './components/BodyPage';
import { useIronPath, currentWeek } from './hooks/useIronPath';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';
import { useSettings } from './hooks/useSettings';
import { useI18n } from './i18n/I18nContext';

export default function App() {
  const { t } = useI18n();
  const { sessions, day, toggle, resetMonth, selectDay } = useIronPath();
  const doneCount = sessions.filter(Boolean).length;
  const monthDone = doneCount === 16;
  const cw = currentWeek(sessions);
  const workoutLogs = useWorkoutLogs();
  const { settings, updateSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState('program');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 468, position: 'relative', borderInlineStart: '1px solid var(--color-divider)', borderInlineEnd: '1px solid var(--color-divider)' }}>
        <Header doneCount={doneCount} onOpenSettings={() => setSettingsOpen(true)} />

        <div style={{ position: 'sticky', top: 57, zIndex: 30, padding: '10px 20px 0', background: 'var(--color-bg)' }}>
          <div className="seg" role="tablist" style={{ width: '100%' }}>
            <label className="seg-opt" style={{ flex: 1, justifyContent: 'center' }}>
              <input type="radio" name="ip-view" checked={view === 'program'} onChange={() => setView('program')} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              {t('navProgram')}
            </label>
            <label className="seg-opt" style={{ flex: 1, justifyContent: 'center' }}>
              <input type="radio" name="ip-view" checked={view === 'body'} onChange={() => setView('body')} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
              {t('navBody')}
            </label>
          </div>
        </div>

        {view === 'program' ? (
          <>
            <HeroSection />
            <SplitSection />
            <TrackerSection sessions={sessions} cw={cw} monthDone={monthDone} toggle={toggle} resetMonth={resetMonth} />
            <WorkoutSection day={day} selectDay={selectDay} cw={cw} workoutLogs={workoutLogs} settings={settings} updateSettings={updateSettings} />
            <Footer />
          </>
        ) : (
          <BodyPage />
        )}
      </div>
      <DataSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} updateSettings={updateSettings} />
    </div>
  );
}
