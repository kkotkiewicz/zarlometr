import { useEffect } from "react";
import "../styles/meal-reminder.css";

function IconFork() {
  return (
    <svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 1 0 4 0V3" /><path d="M9 11v10" /><path d="M17 3c-2 1-3 3-3 6s1 4 3 4v8" /></svg>
  );
}
function IconFlame() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 3c1 5-4 6-4 11a4 4 0 0 0 8 0c0-2-1-3-2-4 1 3-1 4-2 4 0-3 3-5 0-11z" /></svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
  );
}

export default function MealReminder({
  open,
  onClose,
  onLog,
  streakDays = 12,
  mealName = "obiad",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="reminder-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="reminder-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="reminder-close" onClick={onClose} aria-label="Zamknij">
          <IconClose />
        </button>

        <div className="reminder-head">
          <div className="reminder-icon"><IconFork /></div>
          <div>
            <h2 className="reminder-title">Przypomnienie o posiłku</h2>
            <p className="reminder-streak"><span className="reminder-dot" /> LIVE STREAK: {streakDays} DNI</p>
          </div>
        </div>

        <p className="reminder-text">
          Czas na {mealName}! Pamiętaj, aby <strong>zalogować swój posiłek</strong>, by
          utrzymać streak {streakDays} dni.
        </p>

        <div className="reminder-progress">
          <div className="reminder-rings" aria-hidden>
            <span className="reminder-ring reminder-ring--done">{streakDays - 2}</span>
            <span className="reminder-ring reminder-ring--done">{streakDays - 1}</span>
            <span className="reminder-ring reminder-ring--current"><IconFlame /></span>
          </div>
          <div className="reminder-next">
            <span className="reminder-next-label">Następny cel</span>
            <span className="reminder-next-value">Puchar 14 Dni</span>
          </div>
        </div>

        <button type="button" className="reminder-cta" onClick={() => { onLog?.(); onClose?.(); }}>
          Zaloguj teraz
        </button>

        <button type="button" className="reminder-skip" onClick={onClose}>
          POMIŃ →
        </button>
      </div>
    </div>
  );
}
