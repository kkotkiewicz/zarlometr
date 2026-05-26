import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/settings.css";

function IconBack() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V4" />
      <path d="M4 4h12l-2 4 2 4H4" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <polyline points="21 3 21 8 16 8" />
      <polyline points="3 21 3 16 8 16" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15 21 2" />
      <path d="m18 5 3 3" />
      <path d="m15 8 3 3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function getInitials(user) {
  const source = user?.displayName || user?.email || "TPF";
  const parts = source.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "TPF";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase() || "TPF";
}

const GOALS = [
  { id: "redukcja",   label: "Redukcja" },
  { id: "utrzymanie", label: "Utrzymanie" },
  { id: "masa",       label: "Masa" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isGoogleUser = user?.providerData?.some(
    (p) => p.providerId === "google.com"
  );

  const [form, setForm] = useState({
    name: user?.displayName || "Tomasz",
    nickname: "TomFit",
    email: user?.email || "tomasz@example.com",
    weight: "82",
    height: "185",
    age: "30",
    goal: "redukcja",
    pace: -0.5,
    notifMeals: true,
    notifWater: false,
  });
  const [savedAt, setSavedAt] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedAt(null);
  }

  function handleSave(e) {
    e.preventDefault();
    setSavedAt(Date.now());
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <form className="settings-root" onSubmit={handleSave}>
      <div className="settings-topbar">
        <div className="settings-topbar-left">
          <button
            type="button"
            className="settings-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Wróć"
          >
            <IconBack />
          </button>
          <span className="settings-topbar-title">Żarłometr</span>
        </div>
        <div className="settings-avatar" aria-hidden>{getInitials(user)}</div>
      </div>

      {/* ── Dane osobowe ── */}
      <section className="settings-section">
        <div className="settings-card">
          <h2 className="settings-section-title settings-section-title--personal">
            <IconUser /> Dane osobowe
          </h2>

          <label className="field-label">Imię</label>
          <div className="field-wrap">
            <input
              className="field-input"
              style={{ paddingLeft: 14 }}
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <label className="field-label">Nickname</label>
          <div className="field-wrap">
            <input
              className="field-input"
              style={{ paddingLeft: 14 }}
              type="text"
              value={form.nickname}
              onChange={(e) => update("nickname", e.target.value)}
            />
          </div>

          <label className="field-label">
            Email{isGoogleUser && " (zarządzany przez Google)"}
          </label>
          <div className="field-wrap" style={{ marginBottom: 0 }}>
            <input
              className="field-input"
              style={{ paddingLeft: 14, opacity: isGoogleUser ? 0.6 : 1 }}
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              readOnly={isGoogleUser}
            />
          </div>
        </div>
      </section>

      {/* ── Parametry ── */}
      <section className="settings-section">
        <h2 className="settings-section-title settings-section-title--params">
          Parametry
        </h2>

        <div className="settings-params-row">
          <div className="settings-param-tile">
            <span className="settings-param-label">Waga aktualna</span>
            <div className="settings-param-input-row">
              <input
                className="settings-param-input"
                type="text"
                inputMode="decimal"
                value={form.weight}
                onChange={(e) => {
                  const v = e.target.value.replace(",", ".");
                  if (v === "" || /^\d{0,3}(\.\d{0,1})?$/.test(v)) update("weight", v);
                }}
              />
              <span className="settings-param-unit">kg</span>
            </div>
          </div>

          <div className="settings-param-tile">
            <span className="settings-param-label">Wzrost</span>
            <div className="settings-param-input-row">
              <input
                className="settings-param-input"
                type="text"
                inputMode="numeric"
                value={form.height}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d{0,3}$/.test(v)) update("height", v);
                }}
              />
              <span className="settings-param-unit">cm</span>
            </div>
          </div>

          <div className="settings-param-tile settings-param-tile--wide">
            <span className="settings-param-label">Wiek</span>
            <div className="settings-param-input-row">
              <input
                className="settings-param-input"
                type="text"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d{0,3}$/.test(v)) update("age", v);
                }}
              />
              <span className="settings-param-unit">lat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cele ── */}
      <section className="settings-section">
        <div className="settings-card">
          <h2 className="settings-section-title settings-section-title--goals">
            <IconFlag /> Cele
          </h2>

          <label className="field-label">Cel główny</label>
          <div className="settings-segmented" role="tablist">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={form.goal === g.id}
                className={`settings-seg-btn ${form.goal === g.id ? "settings-seg-btn--active" : ""}`}
                onClick={() => update("goal", g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="settings-slider-block">
            <div className="settings-slider-head">
              <span className="settings-slider-label">Tempo redukcji</span>
              <span className="settings-slider-value">
                {form.pace.toFixed(1)} kg / tydz.
              </span>
            </div>
            <input
              className="settings-slider"
              type="range"
              min="-1"
              max="0"
              step="0.1"
              value={form.pace}
              onChange={(e) => update("pace", Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* ── Powiadomienia ── */}
      <section className="settings-section">
        <div className="settings-card">
          <h2 className="settings-section-title settings-section-title--notif">
            <IconBell /> Powiadomienia
          </h2>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-title">Przypomnienia o posiłkach</span>
              <span className="settings-row-desc">Powiadomienia w godzinach jedzenia</span>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={form.notifMeals}
                onChange={(e) => update("notifMeals", e.target.checked)}
              />
              <span className="settings-toggle-track" />
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-title">Picie wody</span>
              <span className="settings-row-desc">Regularne przypomnienia o nawodnieniu</span>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={form.notifWater}
                onChange={(e) => update("notifWater", e.target.checked)}
              />
              <span className="settings-toggle-track" />
            </label>
          </div>
        </div>
      </section>

      {/* ── Integracje ── */}
      <section className="settings-section">
        <div className="settings-card">
          <h2 className="settings-section-title settings-section-title--integ">
            <IconSync /> Integracje
          </h2>

          <div className="settings-integ-row">
            <div className="settings-integ-icon"><IconHeart /></div>
            <div className="settings-integ-body">
              <div className="settings-row-title">Apple Health</div>
              <div className="settings-row-desc">Połączono</div>
            </div>
            <button type="button" className="settings-link-btn settings-link-btn--muted">
              Rozłącz
            </button>
          </div>

          <div className="settings-integ-row">
            <div className="settings-integ-icon"><IconActivity /></div>
            <div className="settings-integ-body">
              <div className="settings-row-title">Google Fit</div>
              <div className="settings-row-desc">Brak połączenia</div>
            </div>
            <button type="button" className="settings-link-btn">
              Połącz
            </button>
          </div>
        </div>
      </section>

      {/* ── Bezpieczeństwo ── */}
      <section className="settings-section">
        <div className="settings-card">
          <h2 className="settings-section-title settings-section-title--security">
            <IconShield /> Bezpieczeństwo
          </h2>

          {!isGoogleUser && (
            <button type="button" className="settings-action-row">
              <span className="settings-action-row-left">
                <IconKey /> Resetowanie hasła
              </span>
              <IconChevron />
            </button>
          )}

          <button type="button" className="settings-logout-btn" onClick={handleLogout}>
            <IconLogout /> Wyloguj się
          </button>
        </div>
      </section>

      <div className="settings-save-bar">
        <button type="submit" className="settings-save-btn">
          Zapisz zmiany
        </button>
      </div>
      {savedAt && (
        <p className="settings-saved-msg">Zmiany zapisane lokalnie.</p>
      )}
    </form>
  );
}
