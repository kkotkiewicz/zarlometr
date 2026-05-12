import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function IconUser() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconBadge() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 10h5M13 14h3" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function IconLockRepeat() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15v2" strokeLinecap="round" />
    </svg>
  );
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordMismatch =
    form.passwordRepeat.length > 0 && form.password !== form.passwordRepeat;

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { name, nickname, email, password, passwordRepeat } = form;

    if (!name.trim() || !nickname.trim() || !email.trim() || !password || !passwordRepeat) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }
    if (password !== passwordRepeat) {
      setError("Hasła nie są identyczne.");
      return;
    }
    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);
    // TODO: zastąp wywołaniem API
    await new Promise((r) => setTimeout(r, 800));
    login({ email, name });
    navigate("/onboarding", { replace: true });
    setLoading(false);
  }

  return (
    <div className="auth-root">
      <div className={`auth-logo register-logo-margin`}>Żarłometr</div>
      <h1 className="register-heading">Dołącz do nas</h1>
      <p className="register-subtitle">
        Zacznij swoją przygodę<br />ze zdrowym stylem życia
      </p>

      <div className="card auth-card">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-wrap">
            <IconUser />
            <input
              className="field-input"
              type="text"
              placeholder="Imię"
              value={form.name}
              onChange={handleChange("name")}
              autoComplete="given-name"
            />
          </div>

          <div className="field-wrap">
            <IconBadge />
            <input
              className="field-input"
              type="text"
              placeholder="Pseudonim"
              value={form.nickname}
              onChange={handleChange("nickname")}
              autoComplete="username"
            />
          </div>

          <div className="field-wrap">
            <IconMail />
            <input
              className="field-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange("email")}
              autoComplete="email"
            />
          </div>

          <div className="field-wrap">
            <IconLock />
            <input
              className={`field-input ${passwordMismatch ? "field-input--error" : ""}`}
              type="password"
              placeholder="Hasło"
              value={form.password}
              onChange={handleChange("password")}
              autoComplete="new-password"
            />
          </div>

          <div className="field-wrap">
            <IconLockRepeat />
            <input
              className={`field-input ${passwordMismatch ? "field-input--error" : ""}`}
              type="password"
              placeholder="Powtórz hasło"
              value={form.passwordRepeat}
              onChange={handleChange("passwordRepeat")}
              autoComplete="new-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>
      </div>

      <p className="auth-bottom-row">
        Masz już konto?
        <Link to="/login" className="auth-bottom-link">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
