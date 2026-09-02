import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SplitSection from './components/SplitSection';
import TrackerSection from './components/TrackerSection';
import WorkoutSection from './components/WorkoutSection';
import Footer from './components/Footer';
import { useIronPath, currentWeek } from './hooks/useIronPath';

export default function App() {
  const { sessions, day, toggle, resetMonth, selectDay } = useIronPath();
  const doneCount = sessions.filter(Boolean).length;
  const monthDone = doneCount === 16;
  const cw = currentWeek(sessions);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 468, position: 'relative', borderLeft: '1px solid var(--color-divider)', borderRight: '1px solid var(--color-divider)' }}>
        <Header doneCount={doneCount} />
        <HeroSection />
        <SplitSection />
        <TrackerSection sessions={sessions} cw={cw} monthDone={monthDone} toggle={toggle} resetMonth={resetMonth} />
        <WorkoutSection day={day} selectDay={selectDay} cw={cw} />
        <Footer />
      </div>
    </div>
  );
}
