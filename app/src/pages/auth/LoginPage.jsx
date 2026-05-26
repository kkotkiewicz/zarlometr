import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { IconMail, IconLock } from "../../components/icons";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import Card from "../../components/ui/Card";
import AuthDivider from "../../components/ui/AuthDivider";
import "../../styles/auth.css";

function firebaseErrorMsg(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Nieprawidłowy email lub hasło.";
    case "auth/invalid-email":
      return "Nieprawidłowy adres email.";
    case "auth/too-many-requests":
      return "Zbyt wiele prób. Spróbuj ponownie później.";
    case "auth/user-disabled":
      return "To konto zostało zablokowane.";
    default:
      return "Wystąpił błąd. Spróbuj ponownie.";
  }
}

export default function LoginPage() {
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
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
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
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
      <div className="auth-logo">Żarłometr</div>

      <Card className="auth-card">
        <h1 className="login-title">Witaj ponownie</h1>
        <p className="login-subtitle">Zaloguj się, aby kontynuować</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            icon={IconMail}
            type="email"
            placeholder="Wpisz swój email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <TextField
            label="Hasło"
            icon={IconLock}
            type="password"
            placeholder="Wpisz swoje hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="login-forgot-row">
            <Link to="/forgot-password" className="login-forgot-link">
              Zapomniałeś hasła?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        <AuthDivider />

        <GoogleButton
          disabled={loading}
          onClick={handleGoogle}
          aria-label="Zaloguj się przez Google"
        />
      </Card>

      <p className="auth-bottom-row">
        Nie masz konta?
        <Link to="/register" className="auth-bottom-link">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
