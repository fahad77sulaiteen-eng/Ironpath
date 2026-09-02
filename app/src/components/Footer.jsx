import { REST_SECONDS } from '../data/exercises';

const bodyTextStyle = { margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' };
const titleStyle = { fontFamily: 'var(--font-heading)', fontSize: 14, marginBottom: 3 };

export default function Footer() {
  const restNote = `${REST_SECONDS} seconds between sets on presses and pulls; ${Math.max(30, REST_SECONDS - 30)} seconds on isolation, calves and abs.`;
  return (
    <footer style={{ margin: '40px 0 0', padding: '26px 20px 44px', background: 'linear-gradient(180deg, var(--color-neutral-900), var(--color-bg))' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={titleStyle}>Warm up first</div>
          <p style={bodyTextStyle}>Five minutes easy cardio, then one light set of your first machine at half the weight.</p>
        </div>
        <div>
          <div style={titleStyle}>Rest between sets</div>
          <p style={bodyTextStyle}>{restNote}</p>
        </div>
        <div>
          <div style={titleStyle}>Exercises rotate</div>
          <p style={bodyTextStyle}>Set A runs weeks 1–2, set B runs weeks 3–4. Same muscles, different machines — add a little weight whenever all sets feel easy.</p>
        </div>
      </div>
    </footer>
  );
}
