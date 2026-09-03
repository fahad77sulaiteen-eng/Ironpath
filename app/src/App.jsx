import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SplitSection from './components/SplitSection';
import TrackerSection from './components/TrackerSection';
import WorkoutSection from './components/WorkoutSection';
import Footer from './components/Footer';
import DataSettings from './components/DataSettings';
import { useIronPath, currentWeek } from './hooks/useIronPath';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const { sessions, day, toggle, resetMonth, selectDay } = useIronPath();
  const doneCount = sessions.filter(Boolean).length;
  const monthDone = doneCount === 16;
  const cw = currentWeek(sessions);
  const workoutLogs = useWorkoutLogs();
  const { settings, updateSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 468, position: 'relative', borderInlineStart: '1px solid var(--color-divider)', borderInlineEnd: '1px solid var(--color-divider)' }}>
        <Header doneCount={doneCount} onOpenSettings={() => setSettingsOpen(true)} />
        <HeroSection />
        <SplitSection />
        <TrackerSection sessions={sessions} cw={cw} monthDone={monthDone} toggle={toggle} resetMonth={resetMonth} />
        <WorkoutSection day={day} selectDay={selectDay} cw={cw} workoutLogs={workoutLogs} settings={settings} updateSettings={updateSettings} />
        <Footer />
      </div>
      <DataSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} updateSettings={updateSettings} />
    </div>
  );
}
