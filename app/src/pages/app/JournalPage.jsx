import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/journal.css";

const MONTHS_PL = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

const DEFAULT_DAY = {
  goal: 2400,
  consumed: 980,
  remaining: 1420,
  meals: [
    {
      id: "sniadanie",
      name: "Śniadanie",
      time: "07:30",
      kcal: 420,
      items: [
        { id: 1, icon: "croissant", name: "Owsianka z borówkami", grams: "350g", kcal: 320 },
        { id: 2, icon: "coffee",    name: "Kawa z mlekiem owsianym", grams: "250ml", kcal: 100 },
      ],
    },
    {
      id: "drugie",
      name: "Drugie Śniadanie",
      time: "10:45",
      kcal: 150,
      items: [
        { id: 3, icon: "apple", name: "Jabłko i garść orzechów", grams: "120g", kcal: 150 },
      ],
    },
    {
      id: "obiad",
      name: "Obiad",
      time: "14:00",
      kcal: 410,
      items: [
        { id: 4, icon: "fork", name: "Poke Bowl z Łososiem", grams: "450g", kcal: 410 },
      ],
    },
    {
      id: "podwieczorek",
      name: "Podwieczorek",
      time: null,
      kcal: 0,
      planned: true,
      items: [],
    },
    {
      id: "kolacja",
      name: "Kolacja",
      time: null,
      kcal: 0,
      planned: true,
      items: [],
    },
  ],
  macros: { protein: 64, carbs: 120, fat: 32 },
};

function IconCroissant() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 14c2-3 6-4 10-4s7 2 6 6c-3-2-7-3-10-2s-6 0-6 0z" /><path d="M6 14c-1 2 0 4 2 4M18 16c1-2 0-4-2-4" /></svg>
  );
}
function IconCoffee() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2" /><path d="M7 4c1 1 1 2 0 3M11 4c1 1 1 2 0 3" /></svg>
  );
}
function IconApple() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 7c-3-3-7-2-7 3 0 4 3 9 7 9s7-5 7-9c0-5-4-6-7-3z" /><path d="M12 7c0-2 1-3 2-4" /></svg>
  );
}
function IconFork() {
  return (
    <svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 1 0 4 0V3" /><path d="M9 11v10" /><path d="M17 3c-2 1-3 3-3 6s1 4 3 4v8" /></svg>
  );
}
function IconPlusCircle() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>
  );
}
function IconDots() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="6"  r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
  );
}
function IconChevron({ dir = "left" }) {
  return (
    <svg viewBox="0 0 24 24" style={{ transform: dir === "right" ? "rotate(180deg)" : "none" }}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function IconEmpty() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="2.5" /><circle cx="16" cy="12" r="2.5" /></svg>
  );
}

const ICON_MAP = {
  croissant: { Cmp: IconCroissant, tone: "tertiary" },
  coffee:    { Cmp: IconCoffee,    tone: "primary"  },
  apple:     { Cmp: IconApple,     tone: "secondary"},
  fork:      { Cmp: IconFork,      tone: "tertiary" },
};

function formatDateLabel(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return "Dzisiaj";
  if (diff === -1) return "Wczoraj";
  if (diff === 1) return "Jutro";
  const dayName = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][date.getDay()];
  return dayName;
}

function formatLongDate(date) {
  return `${date.getDate()} ${MONTHS_PL[date.getMonth()]} ${date.getFullYear()}`;
}

export default function JournalPage() {
  const navigate = useNavigate();
  const { date: dateParam } = useParams();

  const currentDate = useMemo(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [dateParam]);

  const day = DEFAULT_DAY;
  const progressPct = Math.min((day.consumed / day.goal) * 100, 100);

  function shiftDay(offset) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    const iso = next.toISOString().slice(0, 10);
    navigate(`/journal/${iso}`);
  }

  return (
    <div className="journal">
      <div className="journal-datebar">
        <button className="journal-arrow" onClick={() => shiftDay(-1)} aria-label="Poprzedni dzień">
          <IconChevron dir="left" />
        </button>
        <div className="journal-date">
          <div className="journal-date-label">{formatDateLabel(currentDate)}</div>
          <div className="journal-date-sub">{formatLongDate(currentDate)}</div>
        </div>
        <button className="journal-arrow" onClick={() => shiftDay(1)} aria-label="Następny dzień">
          <IconChevron dir="right" />
        </button>
      </div>

      <section className="journal-summary">
        <div className="journal-summary-main">
          <div className="journal-summary-label">Pozostało</div>
          <div className="journal-summary-value">
            {day.remaining.toLocaleString("pl-PL")}
            <span className="journal-summary-unit">kcal</span>
          </div>
        </div>
        <div className="journal-summary-side">
          <div className="journal-summary-col">
            <span className="journal-summary-small">Zjedzone</span>
            <span className="journal-summary-num">{day.consumed}</span>
          </div>
          <div className="journal-summary-col">
            <span className="journal-summary-small">Cel</span>
            <span className="journal-summary-num">{day.goal.toLocaleString("pl-PL")}</span>
          </div>
        </div>
        <div className="journal-summary-bar">
          <div className="journal-summary-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </section>

      <div className="journal-meals">
        {day.meals.map((meal) => (
          <section key={meal.id} className={`meal-group ${meal.planned ? "meal-group--planned" : ""}`}>
            <header className="meal-group-head">
              <div>
                <h2 className="meal-group-name">{meal.name}</h2>
                <p className="meal-group-meta">
                  {meal.planned
                    ? `Planowan${meal.name.endsWith("a") ? "a" : "y"} • ${meal.kcal} KCAL`
                    : `${meal.time} • ${meal.kcal} KCAL`}
                </p>
              </div>
              <button
                type="button"
                className="meal-group-add"
                onClick={() => navigate("/add")}
              >
                <IconPlusCircle />
                <span>Dodaj produkt</span>
              </button>
            </header>

            {meal.items.length === 0 ? (
              <div className="meal-empty">
                <IconEmpty />
                <span>Brak wpisów dla tego posiłku</span>
              </div>
            ) : (
              <ul className="meal-items">
                {meal.items.map((it) => {
                  const { Cmp, tone } = ICON_MAP[it.icon] ?? { Cmp: IconFork, tone: "tertiary" };
                  return (
                    <li key={it.id} className="meal-item">
                      <div className={`meal-item-icon meal-item-icon--${tone}`}>
                        <Cmp />
                      </div>
                      <div className="meal-item-body">
                        <div className="meal-item-name">{it.name}</div>
                        <div className="meal-item-sub">{it.grams} • {it.kcal} kcal</div>
                      </div>
                      <button type="button" className="meal-item-more" aria-label="Opcje">
                        <IconDots />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="journal-macros">
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--protein" />
          <span className="journal-macro-label">Białko</span>
          <span className="journal-macro-value">{day.macros.protein}g</span>
        </div>
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--carbs" />
          <span className="journal-macro-label">Węgle</span>
          <span className="journal-macro-value">{day.macros.carbs}g</span>
        </div>
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--fat" />
          <span className="journal-macro-label">Tłuszcze</span>
          <span className="journal-macro-value">{day.macros.fat}g</span>
        </div>
      </section>
    </div>
  );
}
