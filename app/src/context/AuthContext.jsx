import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

// VITE_NO_FIREBASE=true (app/.env.local) omija Firebase Auth na potrzeby dev.
export const DoNotFirebase = import.meta.env.VITE_NO_FIREBASE === "true";

const STORAGE_KEY = "zarlometr.localUser";

function readLocalUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // W trybie bez Firebase przywracamy usera synchronicznie (bez mignięcia redirectu).
  const [user, setUser] = useState(() => (DoNotFirebase ? readLocalUser() : null));
  const [loading, setLoading] = useState(!DoNotFirebase);

  useEffect(() => {
    if (DoNotFirebase) return undefined;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Lokalne logowanie — używane przez Login/Register tylko gdy DoNotFirebase.
  function login(profile = {}) {
    const u = {
      uid: "local-dev-uid",
      email: "dev@local.test",
      name: "Dev Lokalny",
      displayName: "Dev Lokalny",
      ...profile,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* ignore */
    }
    setUser(u);
    return u;
  }

  async function logout() {
    if (DoNotFirebase) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setUser(null);
      return;
    }
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, logout, DoNotFirebase }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
