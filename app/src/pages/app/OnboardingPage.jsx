import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/onboarding.css";

/* ── Ikony (inline SVG, w stylu reszty projektu) ── */
function IconMale() {
  return (
    <svg className="segmented__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5" />
      <path d="M19 5l-6 6" />
      <path d="M14 5h5v5" />
    </svg>
  );
}

function IconFemale() {
  return (
    <svg className="segmented__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v8" />
      <path d="M9 19h6" />
    </svg>
  );
}

function IconTrendingDown() {
  return (
    <svg className="goal-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
      <polyline points="16,17 22,17 22,11" />
    </svg>
  );
}

function IconBalance() {
  return (
    <svg className="goal-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M5 8l-3 6a4 4 0 0 0 6 0z" />
      <path d="M19 8l-3 6a4 4 0 0 0 6 0z" />
      <path d="M5 8h14" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg className="goal-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
      <polyline points="16,7 22,7 22,13" />
    </svg>
  );
}

/* ── Konfiguracja celów ── */
const GOALS = [
  { id: "cut",      label: "Redukcja",   icon: IconTrendingDown, sign: -1 },
  { id: "maintain", label: "Utrzymanie", icon: IconBalance,      sign:  0 },
  { id: "bulk",     label: "Masa",       icon: IconTrendingUp,   sign:  1 },
];

export default function OnboardingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [gender, setGender]   = useState("male");
  const [age, setAge]         = useState("");
  const [height, setHeight]   = useState("");
  const [weight, setWeight]   = useState("");
  const [target, setTarget]   = useState("");
  const [pace, setPace]       = useState(-0.5);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Cel wynika ze znaku tempa: <0 redukcja, 0 utrzymanie, >0 masa.
  const goal = pace < 0 ? "cut" : pace > 0 ? "bulk" : "maintain";
  const tempoDisplay = `${pace >= 0 ? "+" : ""}${pace.toFixed(1)}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!age || !height || !weight || !target) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    setLoading(true);
    // TODO: zastąp wywołaniem API zapisującym profil
    await new Promise((r) => setTimeout(r, 400));

    // Zapis profilu w usera (AuthContext.login po prostu setuje stan)
    login({
      ...(user ?? {}),
      profile: {
        gender,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        targetWeight: Number(target),
        goal,
        pace: Number(pace),
      },
    });

    navigate("/", { replace: true });
    setLoading(false);
  }

  return (
    <div className="onboarding-root">
      <div className="onboarding-container">
        <header className="onboarding-header">
          <h1 className="onboarding-title">Skonfiguruj swój profil</h1>
          <p className="onboarding-lead">
            Twoje dane to fundament. Stwórz profil, który pozwoli nam precyzyjnie
            obliczyć Twoje zapotrzebowanie.
          </p>
        </header>

        <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="error-msg">{error}</div>}

          {/* ── Biometria ── */}
          <section className="onb-section">
            {/* Płeć */}
            <div className="onb-field-group">
              <label className="field-label">Płeć</label>
              <div className="segmented" role="radiogroup" aria-label="Płeć">
                <button
                  type="button"
                  role="radio"
                  aria-checked={gender === "male"}
                  className={`segmented__btn ${gender === "male" ? "segmented__btn--active" : ""}`}
                  onClick={() => setGender("male")}
                >
                  <IconMale />
                  <span>Mężczyzna</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={gender === "female"}
                  className={`segmented__btn ${gender === "female" ? "segmented__btn--active" : ""}`}
                  onClick={() => setGender("female")}
                >
                  <IconFemale />
                  <span>Kobieta</span>
                </button>
              </div>
            </div>

            {/* Wiek */}
            <div className="onb-field-group">
              <label className="field-label" htmlFor="onb-age">Wiek (lata)</label>
              <input
                id="onb-age"
                className="onb-input"
                type="number"
                inputMode="numeric"
                placeholder="25"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Wzrost */}
            <div className="onb-field-group">
              <label className="field-label" htmlFor="onb-height">Wzrost (cm)</label>
              <input
                id="onb-height"
                className="onb-input"
                type="number"
                inputMode="numeric"
                placeholder="180"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            {/* Aktualna waga */}
            <div className="onb-field-group">
              <label className="field-label" htmlFor="onb-weight">Aktualna waga (kg)</label>
              <input
                id="onb-weight"
                className="onb-input"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="85.0"
                min="30"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            {/* Waga docelowa */}
            <div className="onb-field-group">
              <label className="field-label" htmlFor="onb-target">Waga docelowa (kg)</label>
              <input
                id="onb-target"
                className="onb-input onb-input--accent"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="78.0"
                min="30"
                max="300"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </section>

          {/* ── Cel + tempo ── */}
          <section className="onb-goal-card">
            <div className="onb-field-group">
              <label className="field-label">Cel główny</label>
              <div className="goal-grid" role="radiogroup" aria-label="Cel główny">
                {GOALS.map(({ id, label, icon: Icon, sign }) => {
                  const active = goal === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`goal-btn ${active ? "goal-btn--active" : ""}`}
                      onClick={() => setPace(sign * 0.5)}
                    >
                      <Icon />
                      <span className="goal-btn__label">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="tempo-block">
              <div className="tempo-header">
                <span className="tempo-label">Tempo zmian</span>
                <span className="tempo-value">{tempoDisplay}</span>
                <span className="tempo-unit">kg/tydzień</span>
              </div>
              <input
                className="tempo-slider"
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={pace}
                onChange={(e) => setPace(Math.round(parseFloat(e.target.value) * 10) / 10)}
                aria-label="Tempo zmian wagi"
              />
              <div className="tempo-edges" aria-hidden>
                <span>−1.0</span>
                <span>0</span>
                <span>+1.0</span>
              </div>
            </div>
          </section>

          {/* ── CTA (reużywam .btn-primary, .onb-cta tylko nadpisuje rozmiar/uppercase) ── */}
          <div>
            <button
              type="submit"
              className="btn-primary onb-cta"
              disabled={loading}
            >
              {loading ? "Obliczanie..." : "Oblicz zapotrzebowanie"}
            </button>
            <p className="onb-footer-text">
              Zawsze możesz zmienić te dane w ustawieniach profilu.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
