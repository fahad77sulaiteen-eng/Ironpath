import { REST_SECONDS } from '../data/exercises';
import { useI18n } from '../i18n/I18nContext';

const bodyTextStyle = { margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' };
const titleStyle = { fontFamily: 'var(--font-heading)', fontSize: 14, marginBottom: 3 };

export default function Footer() {
  const { t } = useI18n();
  const restNote = t('restNoteTemplate')
    .replace('{main}', REST_SECONDS)
    .replace('{iso}', Math.max(30, REST_SECONDS - 30));
  return (
    <footer style={{ margin: '40px 0 0', padding: '26px 20px 44px', background: 'linear-gradient(180deg, var(--color-neutral-900), var(--color-bg))' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={titleStyle}>{t('warmUpTitle')}</div>
          <p style={bodyTextStyle}>{t('warmUpBody')}</p>
        </div>
        <div>
          <div style={titleStyle}>{t('restBetweenSetsTitle')}</div>
          <p style={bodyTextStyle}>{restNote}</p>
        </div>
        <div>
          <div style={titleStyle}>{t('exercisesRotateTitle')}</div>
          <p style={bodyTextStyle}>{t('exercisesRotateBody')}</p>
        </div>
      </div>
    </footer>
  );
}
