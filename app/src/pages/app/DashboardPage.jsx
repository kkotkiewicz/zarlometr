import { Link } from "react-router-dom";
import "../../styles/dashboard.css";

const summary = {
  consumed: 1080,
  goal: 2500,
  macros: [
    { key: "protein", name: "Białko (B)", current: 85,  target: 150, unit: "g" },
    { key: "carbs",   name: "Węglowodany (W)", current: 120, target: 280, unit: "g" },
    { key: "fat",     name: "Tłuszcze (T)", current: 45,  target: 80,  unit: "g" },
  ],
  hydration: { current: 5, target: 8 },
  steps:     { current: 7402, streakDays: 5, deltaDays: 3 },
  lastMeal: {
    name: "Poke Bowl z Łososiem",
    meal: "Obiad",
    time: "14:30",
    protein: 32,
    kcal: 540,
    emoji: "🥗",
  },
};

function KcalRing({ consumed, goal }) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const remaining = Math.max(goal - consumed, 0);
  const remainingRatio = goal > 0 ? remaining / goal : 0;
  const dashOffset = circumference * (1 - remainingRatio);

  return (
    <div className="kcal-ring-wrap">
      <svg className="kcal-ring" viewBox="0 0 220 220">
        <circle className="kcal-ring-track" cx="110" cy="110" r={radius} />
        <circle
          className="kcal-ring-fill"
          cx="110"
          cy="110"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="kcal-ring-center">
        <span className="kcal-ring-label">Pozostało</span>
        <span className="kcal-ring-value">{remaining.toLocaleString("pl-PL")}</span>
        <span className="kcal-ring-unit">kcal</span>
      </div>
    </div>
  );
}

function MacroRow({ name, current, target, unit, color }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="macro-row">
      <div className="macro-head">
        <span className="macro-name">
          <span className={`macro-dot macro-dot--${color}`} />
          {name}
        </span>
        <span className="macro-amount">
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill progress-bar-fill--${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function IconDrop() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M13 3 4 14h6l-1 7 9-11h-6z" />
    </svg>
  );
}

export default function DashboardPage() {
  const { consumed, goal, macros, hydration, steps, lastMeal } = summary;

  return (
    <div className="dashboard">
      <section className="kcal-card">
        <KcalRing consumed={consumed} goal={goal} />
        <div className="kcal-stats">
          <div className="kcal-stat">
            <div className="kcal-stat-label">Spożyto</div>
            <div className="kcal-stat-value">{consumed.toLocaleString("pl-PL")}</div>
          </div>
          <div className="kcal-stat">
            <div className="kcal-stat-label">Cel</div>
            <div className="kcal-stat-value">{goal.toLocaleString("pl-PL")}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Makroskładniki</h2>
        <div className="macros-card">
          {macros.map((m) => (
            <MacroRow
              key={m.key}
              name={m.name}
              current={m.current}
              target={m.target}
              unit={m.unit}
              color={m.key}
            />
          ))}
        </div>
      </section>

      <section className="mini-row">
        <div className="mini-card">
          <div className="mini-top">
            <div className="mini-icon mini-icon--water"><IconDrop /></div>
            <div className="mini-value">
              {hydration.current}
              <span className="mini-value-suffix"> /{hydration.target}</span>
            </div>
          </div>
          <div className="mini-label">Nawodnienie</div>
          <button type="button" className="mini-action" aria-label="Dodaj szklankę">+</button>
        </div>

        <div className="mini-card">
          <div className="mini-top">
            <div className="mini-icon mini-icon--bolt"><IconBolt /></div>
            <div className="mini-value">{steps.current.toLocaleString("pl-PL")}</div>
          </div>
          <div className="mini-label">Kroki</div>
          <div className="mini-streak">
            <span className="mini-streak-badge">🔥 +{steps.deltaDays}</span>
            Seria: {steps.streakDays} dni
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2 className="section-title">Ostatni posiłek</h2>
          <Link to="/journal" className="section-head-link">Zobacz wszystkie</Link>
        </div>
        <div className="meal-card">
          <div className="meal-thumb" aria-hidden>{lastMeal.emoji}</div>
          <div className="meal-body">
            <div className="meal-name">{lastMeal.name}</div>
            <div className="meal-meta">{lastMeal.meal} • {lastMeal.time}</div>
            <div className="meal-chips">
              <span className="chip chip--protein">{lastMeal.protein}g B</span>
              <span className="chip chip--kcal">{lastMeal.kcal} kcal</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
