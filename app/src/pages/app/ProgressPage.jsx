import "../../styles/progress.css";

const WEEK = [
  { d: "Pn", w: 79.6, kcal: 2230 },
  { d: "Wt", w: 79.2, kcal: 2260 },
  { d: "Śr", w: 79.8, kcal: 2480 },
  { d: "Cz", w: 78.7, kcal: 2410 },
  { d: "Pt", w: 78.9, kcal: 2370 },
  { d: "Sb", w: 78.3, kcal: 2400 },
  { d: "Nd", w: 78.2, kcal: 2300 },
];

const KCAL_TARGET = 2500;

const MACROS = [
  { key: "protein", name: "Białko",     current: 120, target: 140 },
  { key: "carbs",   name: "Węglowodany",current: 250, target: 240 },
  { key: "fat",     name: "Tłuszcze",   current: 65,  target: 70  },
];

function buildPath(points, width, height, padY = 12) {
  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = maxY - minY || 1;

  const mapped = points.map((p, i) => ({
    x: ((i + 0.5) / points.length) * width,
    y: padY + (1 - (p.y - minY) / span) * (height - padY * 2),
  }));

  if (mapped.length < 2) return { d: "", last: mapped[0] };

  let d = `M ${mapped[0].x},${mapped[0].y}`;
  for (let i = 1; i < mapped.length; i++) {
    const prev = mapped[i - 1];
    const curr = mapped[i];
    const cx = (prev.x + curr.x) / 2;
    d += ` Q ${cx},${prev.y} ${cx},${(prev.y + curr.y) / 2}`;
    d += ` Q ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return { d, last: mapped[mapped.length - 1] };
}

function IconStreak() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 3c1 5-4 6-4 11a4 4 0 0 0 8 0c0-2-1-3-2-4 1 3-1 4-2 4 0-3 3-5 0-11z" /></svg>
  );
}
function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2 2M16 16l2 2M6 18l2-2M16 8l2-2" /></svg>
  );
}
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24"><path d="M13 3 4 14h6l-1 7 9-11h-6z" /></svg>
  );
}
function IconTrendingDown() {
  return (
    <svg viewBox="0 0 24 24"><polyline points="22,17 13.5,8.5 8.5,13.5 2,7" /><polyline points="16,17 22,17 22,11" /></svg>
  );
}

export default function ProgressPage() {
  const width = 320;
  const height = 140;
  const series = WEEK.map((p) => ({ y: p.w }));
  const { d, last } = buildPath(series, width, height);

  const avgKcal = Math.round(WEEK.reduce((sum, p) => sum + p.kcal, 0) / WEEK.length);
  const overshoot = avgKcal - KCAL_TARGET;
  const todayIndex = WEEK.length - 1;

  const PCT_PER_KCAL = 0.08;
  const BAR_BASE = 60;

  const currentWeight = WEEK[WEEK.length - 1].w;
  const startWeight = WEEK[0].w;
  const delta = (currentWeight - startWeight).toFixed(1);

  return (
    <div className="progress">
      <section className="weight-card">
        <header className="weight-card-head">
          <div>
            <p className="weight-label">Postępy wagi</p>
            <p className="weight-value">{currentWeight.toFixed(1)} <span>kg</span></p>
          </div>
          <div className="weight-delta">
            <IconTrendingDown />
            <span className="weight-delta-num">{delta} kg</span>
            <span className="weight-delta-text">w tym tyg.</span>
          </div>
        </header>

        <div className="weight-chart">
          <div className="weight-chart-plot">
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <line
                x1="0"
                y1={height / 2}
                x2={width}
                y2={height / 2}
                stroke="rgba(197,198,208,0.25)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {last && (
              <span
                className="weight-chart-dot"
                style={{ left: `${(last.x / width) * 100}%`, top: `${(last.y / height) * 100}%` }}
              />
            )}
          </div>
          <div className="weight-chart-axis">
            {WEEK.map((p) => (
              <span key={p.d}>{p.d}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="forecast-card">
        <div className="forecast-icon">
          <IconSparkles />
        </div>
        <h2 className="forecast-title">Prognoza celu: Osiągniesz 75 kg za 47 dni</h2>
        <p className="forecast-text">
          Przy obecnym tempie spalania i zbilansowanej diecie jesteś na świetnej
          drodze.
        </p>
      </section>

      <section className="avg-card">
        <header className="avg-head">
          <span className="avg-label">Średnia kcal (7 dni)</span>
          <span className="avg-pill"><IconBolt /></span>
        </header>
        <div className="avg-value">{avgKcal.toLocaleString("pl-PL")}</div>
        <div className={`avg-delta ${overshoot >= 0 ? "avg-delta--over" : "avg-delta--under"}`}>
          {overshoot >= 0 ? "+" : ""}{overshoot} względem celu
        </div>
        <div className="avg-bars" aria-hidden>
          {WEEK.map((p, i) => {
            const height = Math.min(Math.max(BAR_BASE + (p.kcal - avgKcal) * PCT_PER_KCAL, 18), 100);
            const isToday = i === todayIndex;
            return (
              <div
                key={i}
                className={`avg-bar ${isToday ? "avg-bar--today" : ""}`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </section>

      <section className="progress-macros">
        <h2 className="progress-macros-label">Średnia makroskładników (7 dni)</h2>
        {MACROS.map((m) => {
          const pct = Math.min((m.current / m.target) * 100, 100);
          return (
            <div key={m.key} className="macro-row">
              <div className="macro-head">
                <span className={`progress-macro-name progress-macro-name--${m.key}`}>{m.name}</span>
                <span className="macro-amount">{m.current}g / {m.target}g</span>
              </div>
              <div className="progress-bar-track">
                <div className={`progress-bar-fill progress-bar-fill--${m.key}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="streak-card">
        <div className="streak-icon">
          <IconStreak />
        </div>
        <div>
          <h3 className="streak-title">Streak: 12 dni</h3>
          <p className="streak-text">Jesteś w elitarnym gronie 5% użytkowników!</p>
        </div>
      </section>
    </div>
  );
}
