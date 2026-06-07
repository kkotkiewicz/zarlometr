import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  IconBack, IconUser, IconFlag, IconBell, IconSync, IconShield,
  IconKey, IconLogout, IconChevron, IconHeart, IconActivity,
} from "../../components/icons";
import Card from "../../components/ui/Card";
import Toggle from "../../components/ui/Toggle";
import "../../styles/settings.css";

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

// defPace: wartość, do której skacze klik w dany segment.
const GOAL_META = {
  redukcja:   { sliderLabel: "Tempo redukcji",  defPace: -0.5 },
  utrzymanie: { sliderLabel: "Tempo zmian",     defPace: 0    },
  masa:       { sliderLabel: "Tempo przyrostu", defPace: 0.5  },
};

function paceToGoal(pace) {
  if (pace < 0) return "redukcja";
  if (pace > 0) return "masa";
  return "utrzymanie";
}

function formatPace(v) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}`;
}

function ParamTile({ label, value, unit, wide, onChange, pattern }) {
  return (
    <div className={`settings-param-tile${wide ? " settings-param-tile--wide" : ""}`}>
      <span className="settings-param-label">{label}</span>
      <div className="settings-param-input-row">
        <input
          className="settings-param-input"
          type="text"
          inputMode={pattern === "decimal" ? "decimal" : "numeric"}
          value={value}
          onChange={(e) => {
            const v = pattern === "decimal" ? e.target.value.replace(",", ".") : e.target.value;
            const regex = pattern === "decimal" ? /^\d{0,3}(\.\d{0,1})?$/ : /^\d{0,3}$/;
            if (v === "" || regex.test(v)) onChange(v);
          }}
        />
        <span className="settings-param-unit">{unit}</span>
      </div>
    </div>
  );
}

function SettingsRow({ title, desc, control }) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <span className="settings-row-title">{title}</span>
        <span className="settings-row-desc">{desc}</span>
      </div>
      {control}
    </div>
  );
}

function IntegRow({ icon: Icon, title, desc, action }) {
  return (
    <div className="settings-integ-row">
      <div className="settings-integ-icon"><Icon /></div>
      <div className="settings-integ-body">
        <div className="settings-row-title">{title}</div>
        <div className="settings-row-desc">{desc}</div>
      </div>
      {action}
    </div>
  );
}

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
    pace: -0.5,
    notifMeals: true,
    notifWater: false,
  });
  const [savedAt, setSavedAt] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSavedAt(null);
  }

  const goal = paceToGoal(form.pace);

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
            <IconBack size={22} />
          </button>
          <span className="settings-topbar-title">Żarłometr</span>
        </div>
        <div className="settings-avatar" aria-hidden>{getInitials(user)}</div>
      </div>

      {/* ── Dane osobowe ── */}
      <section className="settings-section">
        <Card className="settings-card">
          <h2 className="settings-section-title settings-section-title--personal">
            <IconUser size={20} /> Dane osobowe
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
        </Card>
      </section>

      {/* ── Parametry ── */}
      <section className="settings-section">
        <h2 className="settings-section-title settings-section-title--params">
          Parametry
        </h2>

        <div className="settings-params-row">
          <ParamTile
            label="Waga aktualna"
            value={form.weight}
            unit="kg"
            pattern="decimal"
            onChange={(v) => update("weight", v)}
          />
          <ParamTile
            label="Wzrost"
            value={form.height}
            unit="cm"
            onChange={(v) => update("height", v)}
          />
          <ParamTile
            label="Wiek"
            value={form.age}
            unit="lat"
            wide
            onChange={(v) => update("age", v)}
          />
        </div>
      </section>

      {/* ── Cele ── */}
      <section className="settings-section">
        <Card className="settings-card">
          <h2 className="settings-section-title settings-section-title--goals">
            <IconFlag size={20} /> Cele
          </h2>

          <label className="field-label">Cel główny</label>
          <div className="settings-segmented" role="tablist">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={goal === g.id}
                className={`settings-seg-btn ${goal === g.id ? "settings-seg-btn--active" : ""}`}
                onClick={() => update("pace", GOAL_META[g.id].defPace)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="settings-slider-block">
            <div className="settings-slider-head">
              <span className="settings-slider-label">{GOAL_META[goal].sliderLabel}</span>
              <span className="settings-slider-value">
                {formatPace(form.pace)} kg / tydz.
              </span>
            </div>
            <input
              className="settings-slider"
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={form.pace}
              onChange={(e) => update("pace", Math.round(Number(e.target.value) * 10) / 10)}
              aria-label={GOAL_META[goal].sliderLabel}
            />
            <div className="settings-slider-scale" aria-hidden>
              <span>−1.0</span>
              <span>0</span>
              <span>+1.0</span>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Powiadomienia ── */}
      <section className="settings-section">
        <Card className="settings-card">
          <h2 className="settings-section-title settings-section-title--notif">
            <IconBell size={20} /> Powiadomienia
          </h2>

          <SettingsRow
            title="Przypomnienia o posiłkach"
            desc="Powiadomienia w godzinach jedzenia"
            control={
              <Toggle
                checked={form.notifMeals}
                onChange={(e) => update("notifMeals", e.target.checked)}
              />
            }
          />
          <SettingsRow
            title="Picie wody"
            desc="Regularne przypomnienia o nawodnieniu"
            control={
              <Toggle
                checked={form.notifWater}
                onChange={(e) => update("notifWater", e.target.checked)}
              />
            }
          />
        </Card>
      </section>

      {/* ── Integracje ── */}
      <section className="settings-section">
        <Card className="settings-card">
          <h2 className="settings-section-title settings-section-title--integ">
            <IconSync size={20} /> Integracje
          </h2>

          <IntegRow
            icon={IconHeart}
            title="Apple Health"
            desc="Połączono"
            action={
              <button type="button" className="settings-link-btn settings-link-btn--muted">
                Rozłącz
              </button>
            }
          />
          <IntegRow
            icon={IconActivity}
            title="Google Fit"
            desc="Brak połączenia"
            action={
              <button type="button" className="settings-link-btn">
                Połącz
              </button>
            }
          />
        </Card>
      </section>

      {/* ── Bezpieczeństwo ── */}
      <section className="settings-section">
        <Card className="settings-card">
          <h2 className="settings-section-title settings-section-title--security">
            <IconShield size={20} /> Bezpieczeństwo
          </h2>

          {!isGoogleUser && (
            <button type="button" className="settings-action-row">
              <span className="settings-action-row-left">
                <IconKey size={20} /> Resetowanie hasła
              </span>
              <IconChevron size={16} className="chev" />
            </button>
          )}

          <button type="button" className="settings-logout-btn" onClick={handleLogout}>
            <IconLogout size={18} /> Wyloguj się
          </button>
        </Card>
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
