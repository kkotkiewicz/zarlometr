import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/shell.css";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function IconUtensils() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 3v8a2 2 0 1 0 4 0V3" />
      <path d="M9 11v10" />
      <path d="M17 3c-2 1-3 3-3 6s1 4 3 4v8" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6 6 2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2" />
      <path d="M20 12H10" />
      <path d="m17 9 3 3-3 3" />
    </svg>
  );
}

function getInitials(user) {
  if (!user) return "TPF";
  const source = user.displayName || user.name || user.email || "";
  const parts = source.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "TPF";
  const letters = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  return letters || "TPF";
}

function navClass({ isActive }) {
  return isActive ? "bottomnav-item active" : "bottomnav-item";
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="shell">
      <main className="shell-main">
        <header className="topbar">
          <button
            type="button"
            className="topbar-avatar topbar-avatar--btn"
            onClick={() => navigate("/settings")}
            aria-label="Ustawienia profilu"
          >
            {getInitials(user)}
          </button>
          <div className="topbar-title">Żarłometr</div>
          <button
            type="button"
            className="topbar-logout"
            onClick={handleLogout}
            aria-label="Wyloguj się"
            title="Wyloguj się"
          >
            <IconLogout />
          </button>
        </header>

        <Outlet />
      </main>

      <nav className="bottomnav" aria-label="Główna nawigacja">
        <div className="bottomnav-inner">
          <NavLink to="/" end className={navClass}>
            <IconHome />
            <span>Główna</span>
          </NavLink>
          <NavLink to="/journal" className={navClass}>
            <IconBook />
            <span>Dziennik</span>
          </NavLink>

          <button
            type="button"
            className="bottomnav-fab"
            onClick={() => navigate("/add")}
            aria-label="Dodaj posiłek"
          >
            <IconPlus />
          </button>

          <NavLink to="/recipes" className={navClass}>
            <IconUtensils />
            <span>Przepisy</span>
          </NavLink>
          <NavLink to="/progress" className={navClass}>
            <IconSparkles />
            <span>Postępy</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
