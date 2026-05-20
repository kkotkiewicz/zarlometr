import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
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

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function firebaseErrorMsg(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Konto z tym adresem email już istnieje.";
    case "auth/invalid-email":
      return "Nieprawidłowy adres email.";
    case "auth/weak-password":
      return "Hasło jest za słabe. Użyj co najmniej 6 znaków.";
    case "auth/too-many-requests":
      return "Zbyt wiele prób. Spróbuj ponownie później.";
    default:
      return "Wystąpił błąd. Spróbuj ponownie.";
  }
}

async function saveUserDoc(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export default function RegisterPage() {
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
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await saveUserDoc(user.uid, { name, nickname, email });
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(firebaseErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await saveUserDoc(user.uid, {
        name: user.displayName || "",
        nickname: "",
        email: user.email || "",
      });
      navigate("/onboarding", { replace: true });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(firebaseErrorMsg(err.code));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-logo register-logo-margin">Żarłometr</div>
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

        <div className="auth-divider">lub</div>

        <button
          className="btn-google"
          type="button"
          disabled={loading}
          onClick={handleGoogle}
          aria-label="Zarejestruj się przez Google"
        >
          <IconGoogle />
          Kontynuuj z Google
        </button>
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
