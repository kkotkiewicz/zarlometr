import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getIngredient,
  getDominantMacro,
  calcForAmount,
} from "../../lib/ingredients";
import { getRecipe } from "../../lib/recipesRepo";
import {
  getEntries,
  removeEntry,
  MEAL_SLOTS,
  DAILY_GOAL_KCAL,
} from "../../lib/journalRepo";
import "../../styles/journal.css";

const MONTHS_PL = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

const TONE_BY_MACRO = {
  protein: "tertiary",
  carbs:   "secondary",
  fat:     "primary",
};

function plPorcja(n) {
  if (n === 1) return "porcja";
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return "porcje";
  return "porcji";
}

function isoDay(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function IconFork() {
  return (
    <svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 1 0 4 0V3" /><path d="M9 11v10" /><path d="M17 3c-2 1-3 3-3 6s1 4 3 4v8" /></svg>
  );
}
function IconChef() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 14h12v6H6z" /><path d="M7 14a4 4 0 1 1 2-7 4 4 0 0 1 6 0 4 4 0 1 1 2 7" /></svg>
  );
}
function IconPlusCircle() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
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

// Zwraca obliczone wartości żywieniowe + meta-info do wyświetlenia.
// Zwraca null jeśli wpis odwołuje się do nieistniejącego składnika/przepisu.
function computeEntry(entry) {
  if (entry.type === "recipe") {
    const recipe = getRecipe(entry.recipeId);
    if (!recipe) return null;
    return {
      isRecipe: true,
      name: recipe.name,
      kcal: recipe.kcal * entry.portions,
      protein: recipe.macros.protein * entry.portions,
      carbs: recipe.macros.carbs * entry.portions,
      fat: recipe.macros.fat * entry.portions,
      sub: `${entry.portions} ${plPorcja(entry.portions)}`,
      tone: "primary",
    };
  }
  const ing = getIngredient(entry.ingredientId);
  if (!ing) return null;
  const c = calcForAmount(ing, entry.amount);
  return {
    isRecipe: false,
    name: ing.name,
    kcal: c.kcal,
    protein: c.protein,
    carbs: c.carbs,
    fat: c.fat,
    sub: `${entry.amount} g`,
    tone: TONE_BY_MACRO[getDominantMacro(ing)],
  };
}

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
  const [tick, setTick] = useState(0);

  const currentDate = useMemo(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [dateParam]);

  const dayISO = useMemo(() => isoDay(currentDate), [currentDate]);

  const entries = useMemo(() => getEntries(dayISO), [dayISO, tick]);

  // Grupowanie po porze dnia + obliczanie sum.
  const groups = useMemo(() => {
    const acc = MEAL_SLOTS.map((s) => ({ slot: s, items: [], kcal: 0 }));
    const byId = Object.fromEntries(acc.map((g) => [g.slot.id, g]));
    for (const entry of entries) {
      const computed = computeEntry(entry);
      if (!computed) continue;
      const slotId = entry.mealSlot && byId[entry.mealSlot] ? entry.mealSlot : "obiad";
      byId[slotId].items.push({ entry, computed });
      byId[slotId].kcal += computed.kcal;
    }
    return acc;
  }, [entries]);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        const c = computeEntry(entry);
        if (!c) return acc;
        acc.kcal    += c.kcal;
        acc.protein += c.protein;
        acc.carbs   += c.carbs;
        acc.fat     += c.fat;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [entries]);

  const consumed = Math.round(totals.kcal);
  const remaining = Math.max(DAILY_GOAL_KCAL - consumed, 0);
  const progressPct = Math.min((consumed / DAILY_GOAL_KCAL) * 100, 100);

  function shiftDay(offset) {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    navigate(`/journal/${isoDay(next)}`);
  }

  function handleRemove(entryId) {
    removeEntry(entryId);
    setTick((t) => t + 1);
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
            {remaining.toLocaleString("pl-PL")}
            <span className="journal-summary-unit">kcal</span>
          </div>
        </div>
        <div className="journal-summary-side">
          <div className="journal-summary-col">
            <span className="journal-summary-small">Zjedzone</span>
            <span className="journal-summary-num">{consumed}</span>
          </div>
          <div className="journal-summary-col">
            <span className="journal-summary-small">Cel</span>
            <span className="journal-summary-num">{DAILY_GOAL_KCAL.toLocaleString("pl-PL")}</span>
          </div>
        </div>
        <div className="journal-summary-bar">
          <div className="journal-summary-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </section>

      <div className="journal-meals">
        {groups.map((group) => {
          const empty = group.items.length === 0;
          return (
            <section
              key={group.slot.id}
              className={`meal-group ${empty ? "meal-group--planned" : ""}`}
            >
              <header className="meal-group-head">
                <div>
                  <h2 className="meal-group-name">{group.slot.label}</h2>
                  <p className="meal-group-meta">
                    {empty
                      ? "Brak wpisów"
                      : `${group.items.length} pozycji • ${Math.round(group.kcal)} KCAL`}
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

              {empty ? (
                <div className="meal-empty">
                  <IconEmpty />
                  <span>Brak wpisów dla tego posiłku</span>
                </div>
              ) : (
                <ul className="meal-items">
                  {group.items.map(({ entry, computed }) => (
                    <li key={entry.id} className="meal-item">
                      <div className={`meal-item-icon meal-item-icon--${computed.tone}`}>
                        {computed.isRecipe ? <IconChef /> : <IconFork />}
                      </div>
                      <div className="meal-item-body">
                        <div className="meal-item-name">{computed.name}</div>
                        <div className="meal-item-sub">{computed.sub} • {Math.round(computed.kcal)} kcal</div>
                      </div>
                      <button
                        type="button"
                        className="meal-item-more"
                        onClick={() => handleRemove(entry.id)}
                        aria-label={`Usuń ${computed.name}`}
                      >
                        <IconTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <section className="journal-macros">
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--protein" />
          <span className="journal-macro-label">Białko</span>
          <span className="journal-macro-value">{Math.round(totals.protein)}g</span>
        </div>
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--carbs" />
          <span className="journal-macro-label">Węgle</span>
          <span className="journal-macro-value">{Math.round(totals.carbs)}g</span>
        </div>
        <div className="journal-macro">
          <span className="journal-macro-bar journal-macro-bar--fat" />
          <span className="journal-macro-label">Tłuszcze</span>
          <span className="journal-macro-value">{Math.round(totals.fat)}g</span>
        </div>
      </section>
    </div>
  );
}
