import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

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

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    setLoading(true);
    // TODO: zastąp wywołaniem API
    await new Promise((r) => setTimeout(r, 800));
    login({ email, name: "Tomasz" });
    navigate("/", { replace: true });
    setLoading(false);
  }

  return (
    <div className="auth-root">
      <div className="auth-logo">Żarłometr</div>

      <div className="card auth-card">
        <h1 className="login-title">Witaj ponownie</h1>
        <p className="login-subtitle">Zaloguj się, aby kontynuować</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label">Email</label>
          <div className="field-wrap">
            <IconMail />
            <input
              className="field-input"
              type="email"
              placeholder="Wpisz swój email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <label className="field-label">Hasło</label>
          <div className="field-wrap">
            <IconLock />
            <input
              className="field-input"
              type="password"
              placeholder="Wpisz swoje hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="login-forgot-row">
            <Link to="/forgot-password" className="login-forgot-link">
              Zapomniałeś hasła?
            </Link>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>

      <p className="auth-bottom-row">
        Nie masz konta?
        <Link to="/register" className="auth-bottom-link">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
