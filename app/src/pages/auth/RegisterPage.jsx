import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase";
import { IconUser, IconBadge, IconMail, IconLock, IconLockRepeat } from "../../components/icons";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import Card from "../../components/ui/Card";
import AuthDivider from "../../components/ui/AuthDivider";
import "../../styles/auth.css";

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

      <Card className="auth-card">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            icon={IconUser}
            type="text"
            placeholder="Imię"
            value={form.name}
            onChange={handleChange("name")}
            autoComplete="given-name"
          />
          <TextField
            icon={IconBadge}
            type="text"
            placeholder="Pseudonim"
            value={form.nickname}
            onChange={handleChange("nickname")}
            autoComplete="username"
          />
          <TextField
            icon={IconMail}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange("email")}
            autoComplete="email"
          />
          <TextField
            icon={IconLock}
            type="password"
            placeholder="Hasło"
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
            error={passwordMismatch}
          />
          <TextField
            icon={IconLockRepeat}
            type="password"
            placeholder="Powtórz hasło"
            value={form.passwordRepeat}
            onChange={handleChange("passwordRepeat")}
            autoComplete="new-password"
            error={passwordMismatch}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>

        <AuthDivider />

        <GoogleButton
          disabled={loading}
          onClick={handleGoogle}
          aria-label="Zarejestruj się przez Google"
        />
      </Card>

      <p className="auth-bottom-row">
        Masz już konto?
        <Link to="/login" className="auth-bottom-link">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
