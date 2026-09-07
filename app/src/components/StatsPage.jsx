import { useI18n } from '../i18n/I18nContext';
import { useBodyLogs } from '../hooks/useBodyLogs';
import { todayISO } from '../hooks/useWorkoutLogs';
import { getWorkoutDates, currentStreak, longestStreak, sessionsThisMonth, totalVolume } from '../utils/stats';
import { computeAchievements } from '../utils/achievements';
import MiniLineChart from './MiniLineChart';

const cardStyle = {
  padding: 14,
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
};
const kicker = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 };

const ACHIEVEMENT_KEYS = {
  first_workout: ['achievementFirstWorkout', 'achievementFirstWorkoutDesc', '🏁'],
  '7_day_streak': ['achievement7DayStreak', 'achievement7DayStreakDesc', '🔥'],
  '10_sessions': ['achievement10Sessions', 'achievement10SessionsDesc', '🔟'],
  first_pr: ['achievementFirstPr', 'achievementFirstPrDesc', '🏆'],
};

function StatTile({ value, label }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--color-accent)', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function StatsPage({ workoutLogs }) {
  const { t, lang } = useI18n();
  const { entries: bodyEntries } = useBodyLogs();

  const today = todayISO();
  const dates = getWorkoutDates(workoutLogs.logs);
  const streak = currentStreak(dates, today);
  const longest = longestStreak(dates);
  const monthCount = sessionsThisMonth(dates, today);
  const volume = totalVolume(workoutLogs.logs);
  const achievements = computeAchievements({ logs: workoutLogs.logs, workoutDates: dates, longestStreak: longest });

  const weightPoints = bodyEntries.filter((e) => e.weightKg != null).map((e) => ({ date: e.date, value: e.weightKg }));

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <section style={cardStyle}>
        <div style={kicker}>{t('statsTitle')}</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <StatTile value={monthCount} label={t('sessionsThisMonth')} />
          <StatTile value={`${streak} ${t('unitDays')}`} label={t('currentStreak')} />
          <StatTile value={volume.toLocaleString(lang === 'ar' ? 'ar' : 'en')} label={t('totalVolume')} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={kicker}>{t('achievementsTitle')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {achievements.map(({ id, unlocked }) => {
            const [labelKey, descKey, icon] = ACHIEVEMENT_KEYS[id];
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                  padding: 10,
                  borderRadius: 'var(--radius-sm)',
                  background: unlocked ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'color-mix(in srgb, var(--color-text) 4%, transparent)',
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{t(labelKey)}</div>
                  <div style={{ fontSize: 10.5, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{t(descKey)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {weightPoints.length >= 2 && (
        <section style={cardStyle}>
          <div style={kicker}>{t('weightTrendStats')}</div>
          <MiniLineChart points={weightPoints} unit={lang === 'ar' ? '' : 'kg'} />
        </section>
      )}
    </div>
  );
}
