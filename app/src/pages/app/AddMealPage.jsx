import { useEffect, useMemo, useState } from "react";
import {
  INGREDIENTS,
  getIngredient,
  getDominantMacro,
  calcForAmount,
} from "../../lib/ingredients";
import { getRecipes, getRecipe } from "../../lib/recipesRepo";
import {
  getEntries,
  addIngredientEntry,
  addRecipeEntry,
  removeEntry,
  MEAL_SLOTS,
  getMealSlot,
  defaultMealSlot,
} from "../../lib/journalRepo";
import "../../styles/ingredient-picker.css";
import "../../styles/add-meal.css";

function toNumber(value) {
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l");
}

function plPorcja(n) {
  if (n === 1) return "porcja";
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return "porcje";
  return "porcji";
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 8" /></svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
  );
}

const RECENT_LIMIT = 6;

export default function AddMealPage() {
  const [mode, setMode] = useState("ingredient"); // "ingredient" | "recipe"
  const [query, setQuery] = useState("");
  const [pickerIngredientId, setPickerIngredientId] = useState(INGREDIENTS[0].id);
  const [pickerRecipeId, setPickerRecipeId] = useState(null);
  const [pickerAmount, setPickerAmount] = useState("");
  const [mealSlot, setMealSlot] = useState(defaultMealSlot());
  const [entries, setEntries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setEntries(getEntries());
    const r = getRecipes();
    setRecipes(r);
    if (r.length > 0) setPickerRecipeId(r[0].id);
  }, []);

  // Przy przełączeniu trybu czyścimy wyszukiwanie — żeby filter z jednej puli
  // nie zostawiał pustego stanu w drugiej.
  function switchMode(next) {
    if (next === mode) return;
    setMode(next);
    setQuery("");
    setPickerAmount("");
    setError("");
  }

  const filteredIngredients = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return INGREDIENTS;
    return INGREDIENTS.filter((i) => normalize(i.name).includes(q));
  }, [query]);

  const filteredRecipes = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return recipes;
    return recipes.filter((r) => normalize(r.name).includes(q));
  }, [query, recipes]);

  const filtered = mode === "ingredient" ? filteredIngredients : filteredRecipes;
  const currentPickerId = mode === "ingredient" ? pickerIngredientId : pickerRecipeId;

  const activeId = useMemo(() => {
    if (filtered.some((i) => i.id === currentPickerId)) return currentPickerId;
    return filtered[0]?.id ?? null;
  }, [filtered, currentPickerId]);

  function selectItem(id) {
    if (mode === "ingredient") setPickerIngredientId(id);
    else setPickerRecipeId(id);
  }

  function handleAdd() {
    setError("");
    setFeedback("");
    if (!activeId) {
      setError(mode === "ingredient" ? "Wybierz produkt z listy." : "Wybierz przepis z listy.");
      return;
    }
    const qty = toNumber(pickerAmount);
    if (Number.isNaN(qty) || qty <= 0) {
      setError(mode === "ingredient" ? "Podaj liczbę gramów." : "Podaj liczbę porcji.");
      return;
    }

    if (mode === "ingredient") {
      addIngredientEntry({ ingredientId: activeId, amount: qty, mealSlot });
      const ing = getIngredient(activeId);
      setFeedback(`Dodano: ${ing?.name ?? "produkt"} (${qty} g) → ${getMealSlot(mealSlot)?.label}`);
    } else {
      addRecipeEntry({ recipeId: activeId, portions: qty, mealSlot });
      const rec = recipes.find((r) => r.id === activeId);
      setFeedback(`Dodano: ${rec?.name ?? "przepis"} (${qty} ${plPorcja(qty)}) → ${getMealSlot(mealSlot)?.label}`);
    }

    setEntries(getEntries());
    setPickerAmount("");
    window.setTimeout(() => setFeedback(""), 2500);
  }

  function handleRemove(id) {
    setEntries(removeEntry(id));
  }

  // Powtórz wpis — używamy aktualnie wybranej pory dnia (zwykle user dodaje
  // ten sam produkt na inny posiłek niż oryginał).
  function handleQuickAdd(entry) {
    setError("");
    setFeedback("");
    if (entry.type === "recipe") {
      addRecipeEntry({ recipeId: entry.recipeId, portions: entry.portions, mealSlot });
      const rec = getRecipe(entry.recipeId);
      setFeedback(`Dodano: ${rec?.name ?? "przepis"} (${entry.portions} ${plPorcja(entry.portions)}) → ${getMealSlot(mealSlot)?.label}`);
    } else {
      addIngredientEntry({ ingredientId: entry.ingredientId, amount: entry.amount, mealSlot });
      const ing = getIngredient(entry.ingredientId);
      setFeedback(`Dodano: ${ing?.name ?? "produkt"} (${entry.amount} g) → ${getMealSlot(mealSlot)?.label}`);
    }
    setEntries(getEntries());
    window.setTimeout(() => setFeedback(""), 2500);
  }

  const recent = entries.slice(0, RECENT_LIMIT);

  return (
    <div className="add-meal">
      <h1 className="add-meal-title">Dodaj produkt</h1>

      {recent.length > 0 && (
        <section className="add-section">
          <header className="add-section-head">
            <h2 className="add-section-title">Ostatnio dodane</h2>
            <span className="add-section-count">{entries.length}</span>
          </header>
          <ul className="recent-entries">
            {recent.map((entry) => {
              if (entry.type === "recipe") {
                const rec = getRecipe(entry.recipeId);
                if (!rec) return null;
                const totalKcal = rec.kcal * entry.portions;
                const slot = getMealSlot(entry.mealSlot);
                return (
                  <li key={entry.id} className="recent-entry">
                    <span className={`recent-entry-dot recent-entry-dot--recipe`} />
                    <div className="recent-entry-body">
                      <span className="recent-entry-name">{rec.name}</span>
                      <span className="recent-entry-sub">
                        {entry.portions} {plPorcja(entry.portions)} · {Math.round(totalKcal)} kcal
                        {slot && ` · ${slot.short}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="recent-entry-quickadd"
                      onClick={() => handleQuickAdd(entry)}
                      aria-label={`Dodaj ponownie ${rec.name}`}
                      title="Dodaj ponownie z aktualną porą dnia"
                    >
                      <IconPlus />
                    </button>
                    <button
                      type="button"
                      className="recent-entry-remove"
                      onClick={() => handleRemove(entry.id)}
                      aria-label={`Usuń ${rec.name} z dziennika`}
                    >
                      <IconTrash />
                    </button>
                  </li>
                );
              }
              const ing = getIngredient(entry.ingredientId);
              if (!ing) return null;
              const k = calcForAmount(ing, entry.amount).kcal;
              const slot = getMealSlot(entry.mealSlot);
              return (
                <li key={entry.id} className="recent-entry">
                  <span className={`recent-entry-dot recent-entry-dot--${getDominantMacro(ing)}`} />
                  <div className="recent-entry-body">
                    <span className="recent-entry-name">{ing.name}</span>
                    <span className="recent-entry-sub">
                      {entry.amount} g · {Math.round(k)} kcal
                      {slot && ` · ${slot.short}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="recent-entry-quickadd"
                    onClick={() => handleQuickAdd(entry)}
                    aria-label={`Dodaj ponownie ${ing.name}`}
                    title="Dodaj ponownie z aktualną porą dnia"
                  >
                    <IconPlus />
                  </button>
                  <button
                    type="button"
                    className="recent-entry-remove"
                    onClick={() => handleRemove(entry.id)}
                    aria-label={`Usuń ${ing.name} z dziennika`}
                  >
                    <IconTrash />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="add-section">
        <h2 className="add-section-title">Wybierz co dodać</h2>

        <div className="add-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "ingredient"}
            className={`add-tab ${mode === "ingredient" ? "is-active" : ""}`}
            onClick={() => switchMode("ingredient")}
          >
            Produkty
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "recipe"}
            className={`add-tab ${mode === "recipe" ? "is-active" : ""}`}
            onClick={() => switchMode("recipe")}
          >
            Przepisy
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {feedback && <div className="add-meal-feedback">{feedback}</div>}

        <div className="ingredient-picker">
          <div className="ingredient-search">
            <IconSearch />
            <input
              type="search"
              placeholder={mode === "ingredient" ? "Szukaj produktu..." : "Szukaj przepisu..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Szukaj"
            />
            {query && (
              <button
                type="button"
                className="ingredient-search-clear"
                onClick={() => setQuery("")}
                aria-label="Wyczyść wyszukiwanie"
              >
                <IconClose />
              </button>
            )}
          </div>

          <ul className="ingredient-options" role="listbox" aria-label="Lista">
            {mode === "ingredient" &&
              filteredIngredients.map((ing) => {
                const isActive = activeId === ing.id;
                return (
                  <li
                    key={ing.id}
                    role="option"
                    aria-selected={isActive}
                    className={`ingredient-option ${isActive ? "is-active" : ""}`}
                    onClick={() => selectItem(ing.id)}
                  >
                    <span className={`ingredient-option-dot ingredient-option-dot--${getDominantMacro(ing)}`} />
                    <div className="ingredient-option-body">
                      <span className="ingredient-option-name">{ing.name}</span>
                      <span className="ingredient-option-meta">
                        {ing.kcal} kcal · {ing.macros.protein}B / {ing.macros.carbs}W / {ing.macros.fat}T
                        <span className="ingredient-option-per"> / 100 g</span>
                      </span>
                    </div>
                    {isActive && (
                      <span className="ingredient-option-check" aria-hidden>
                        <IconCheck />
                      </span>
                    )}
                  </li>
                );
              })}

            {mode === "recipe" &&
              filteredRecipes.map((rec) => {
                const isActive = activeId === rec.id;
                return (
                  <li
                    key={rec.id}
                    role="option"
                    aria-selected={isActive}
                    className={`ingredient-option ${isActive ? "is-active" : ""}`}
                    onClick={() => selectItem(rec.id)}
                  >
                    <span className="ingredient-option-dot ingredient-option-dot--recipe" />
                    <div className="ingredient-option-body">
                      <span className="ingredient-option-name">{rec.name}</span>
                      <span className="ingredient-option-meta">
                        {rec.kcal} kcal · {rec.macros.protein}B / {rec.macros.carbs}W / {rec.macros.fat}T
                        <span className="ingredient-option-per"> / porcja</span>
                      </span>
                    </div>
                    {isActive && (
                      <span className="ingredient-option-check" aria-hidden>
                        <IconCheck />
                      </span>
                    )}
                  </li>
                );
              })}

            {filtered.length === 0 && (
              <li className="ingredient-option-empty">
                {mode === "recipe" && recipes.length === 0
                  ? "Nie masz jeszcze żadnych przepisów. Utwórz pierwszy w zakładce Przepisy."
                  : `Brak wyników dla „${query}".`}
              </li>
            )}
          </ul>

          <div className="meal-slot-section">
            <span className="field-label meal-slot-label">Pora dnia</span>
            <div className="meal-slot-chips" role="radiogroup" aria-label="Pora dnia">
              {MEAL_SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={mealSlot === s.id}
                  className={`meal-slot-chip ${mealSlot === s.id ? "is-active" : ""}`}
                  onClick={() => setMealSlot(s.id)}
                  title={s.label}
                >
                  {s.short}
                </button>
              ))}
            </div>
          </div>

          <div className="ingredient-picker-row">
            <input
              className="field-input ingredient-amount"
              type="text"
              inputMode="numeric"
              placeholder={mode === "ingredient" ? "Gramy" : "Porcje"}
              value={pickerAmount}
              onChange={(e) => setPickerAmount(e.target.value)}
            />
            <button
              type="button"
              className="ingredient-add-btn"
              onClick={handleAdd}
              disabled={!activeId}
            >
              <IconPlus />
              <span>Dodaj do dziennika</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
