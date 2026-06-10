import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/profile.css";

function IconUser() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
  );
}
function IconFlag() {
  return (
    <svg viewBox="0 0 24 24"><path d="M5 3v18" /><path d="M5 4h13l-2 4 2 4H5" /></svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>
  );
}
function IconLink() {
  return (
    <svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.6-5.6l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.6 5.6l1-1" /></svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" /></svg>
  );
}
function IconKey() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="8" cy="14" r="4" /><path d="M11 12l9-9 2 2-3 3 2 2-3 3-2-2-3 3" /></svg>
  );
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24"><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /><path d="M8 17l-5-5 5-5" /><path d="M3 12h13" /></svg>
  );
}
function IconChevron() {
  return (
    <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
  );
}
function IconArrowBack() {
  return (
    <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
  );
}
function IconApple() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 7c-3-3-7-2-7 3 0 4 3 9 7 9s7-5 7-9c0-5-4-6-7-3z" /><path d="M12 7c0-2 1-3 2-4" /></svg>
  );
}
function IconRun() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="13" cy="5" r="2" /><path d="M7 22l3-7-2-3 4-4 3 3 3 1" /><path d="M5 11l3-2" /></svg>
  );
}

const GOALS = [
  { id: "cut",      label: "Redukcja"   },
  { id: "maintain", label: "Utrzymanie" },
  { id: "bulk",     label: "Masa"       },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName]           = useState(user?.name ?? "Tomasz");
  const [nickname, setNickname]   = useState(user?.nickname ?? "TomFit");
  const [email, setEmail]         = useState(user?.email ?? "tomasz@example.com");
  const [goal, setGoal]           = useState(user?.profile?.goal ?? "cut");
  const [tempo, setTempo]         = useState(user?.profile?.tempo ?? 0.5);
  const [mealReminders, setMealReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(false);

  const tempoSign = goal === "bulk" ? "+" : goal === "cut" ? "-" : "";
  const tempoDisplay = goal === "maintain" ? "0" : `${tempoSign}${tempo.toFixed(1)}`;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleSave(e) {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <div className="profile">
      <header className="profile-topbar">
        <button type="button" className="profile-back" onClick={() => navigate(-1)} aria-label="Wróć">
          <IconArrowBack />
        </button>
        <h1 className="profile-page-title">Żarłometr</h1>
      </header>

      <form className="profile-form" onSubmit={handleSave}>
        <section className="profile-card">
          <h2 className="profile-card-title"><IconUser /> Dane osobowe</h2>

          <label className="field-label" htmlFor="profile-name">Imię</label>
          <input
            id="profile-name"
            className="profile-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="field-label" htmlFor="profile-nick">Nickname</label>
          <input
            id="profile-nick"
            className="profile-input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <label className="field-label" htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            className="profile-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>

        <section className="profile-section">
          <h2 className="profile-section-title">Parametry</h2>
          <div className="param-grid">
            <div className="param-card">
              <span className="param-label">Waga aktualna</span>
              <span className="param-value">82 <span className="param-unit">kg</span></span>
            </div>
            <div className="param-card">
              <span className="param-label">Wzrost</span>
              <span className="param-value">185 <span className="param-unit">cm</span></span>
            </div>
          </div>
          <div className="param-card param-card--wide">
            <span className="param-label">Wiek</span>
            <span className="param-value">30 <span className="param-unit">lat</span></span>
          </div>
        </section>

        <section className="profile-card profile-card--goals">
          <h2 className="profile-card-title profile-card-title--goal"><IconFlag /> Cele</h2>

          <span className="field-label">Cel główny</span>
          <div className="goal-segmented" role="radiogroup" aria-label="Cel główny">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={goal === g.id}
                className={`goal-segmented-btn ${goal === g.id ? "is-active" : ""}`}
                onClick={() => setGoal(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="tempo-row">
            <span className="field-label tempo-row-label">Tempo redukcji</span>
            <span className="tempo-row-value">{tempoDisplay} kg / tydz.</span>
          </div>
          <input
            type="range"
            className="profile-slider"
            min="0"
            max="1.0"
            step="0.1"
            value={goal === "maintain" ? 0.5 : tempo}
            disabled={goal === "maintain"}
            onChange={(e) => setTempo(parseFloat(e.target.value))}
            aria-label="Tempo zmian"
          />
        </section>

        <section className="profile-card">
          <h2 className="profile-card-title"><IconBell /> Powiadomienia</h2>

          <ToggleRow
            checked={mealReminders}
            onChange={setMealReminders}
            title="Przypomnienia o posiłkach"
            sub="Pora na śniadanie, obiad i kolację"
          />
          <ToggleRow
            checked={waterReminders}
            onChange={setWaterReminders}
            title="Picie wody"
            sub="Regularne przypomnienia co dwie godziny"
          />
        </section>

        <section className="profile-card">
          <h2 className="profile-card-title"><IconLink /> Integracje</h2>

          <div className="integration-row">
            <div className="integration-icon"><IconApple /></div>
            <div className="integration-body">
              <div className="integration-name">Apple Health</div>
              <div className="integration-sub">Połączono</div>
            </div>
            <span className="integration-status">Rozłącz</span>
          </div>

          <div className="integration-row">
            <div className="integration-icon"><IconRun /></div>
            <div className="integration-body">
              <div className="integration-name">Google Fit</div>
              <div className="integration-sub">Brak połączenia</div>
            </div>
            <span className="integration-status integration-status--accent">Połącz</span>
          </div>
        </section>

        <section className="profile-card">
          <h2 className="profile-card-title profile-card-title--danger"><IconShield /> Bezpieczeństwo</h2>

          <button type="button" className="profile-list-btn">
            <span className="profile-list-icon"><IconKey /></span>
            <span className="profile-list-text">Resetowanie hasła</span>
            <span className="profile-list-chevron"><IconChevron /></span>
          </button>

          <button type="button" className="profile-list-btn profile-list-btn--danger" onClick={handleLogout}>
            <span className="profile-list-icon"><IconLogout /></span>
            <span className="profile-list-text">Wyloguj się</span>
          </button>
        </section>

        <button type="submit" className="profile-save">Zapisz zmiany</button>
      </form>
    </div>
  );
}

function ToggleRow({ checked, onChange, title, sub }) {
  return (
    <div className="toggle-row">
      <div className="toggle-body">
        <div className="toggle-title">{title}</div>
        <div className="toggle-sub">{sub}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle ${checked ? "is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}
