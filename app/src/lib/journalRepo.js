import { getIngredient, calcForAmount } from "./ingredients";
import { getRecipe } from "./recipesRepo";

const STORAGE_KEY = "zarlometr.journal";

// Cel dzienny — docelowo z profilu użytkownika
export const DAILY_GOAL_KCAL = 2400;

// Reaktywny sygnał 
const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn();
}

export const MEAL_SLOTS = [
  { id: "sniadanie",    label: "Śniadanie",    short: "Śniad." },
  { id: "drugie",       label: "II śniadanie", short: "II śn." },
  { id: "obiad",        label: "Obiad",        short: "Obiad"  },
  { id: "podwieczorek", label: "Podwieczorek", short: "Podw."  },
  { id: "kolacja",      label: "Kolacja",      short: "Kolacja" },
];

export function getMealSlot(id) {
  return MEAL_SLOTS.find((s) => s.id === id) || null;
}

// Sugerowana pora dnia na podstawie zegara
export function defaultMealSlot(date = new Date()) {
  const h = date.getHours();
  if (h >= 5  && h < 10) return "sniadanie";
  if (h >= 10 && h < 12) return "drugie";
  if (h >= 12 && h < 16) return "obiad";
  if (h >= 16 && h < 19) return "podwieczorek";
  return "kolacja";
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function isoDay(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}


function normalize(entry) {
  if (!entry?.type) return { ...entry, type: "ingredient" };
  return entry;
}

export function getEntries(dateISO) {
  const list = read().map(normalize);
  if (!dateISO) return list;
  return list.filter((e) => isoDay(e.addedAt) === dateISO);
}

export function addIngredientEntry({ ingredientId, amount, mealSlot }) {
  const list = read();
  const entry = {
    id: `j-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "ingredient",
    ingredientId,
    amount,
    mealSlot: mealSlot || defaultMealSlot(),
    addedAt: Date.now(),
  };
  write([entry, ...list]);
  notify();
  return entry;
}

export function addRecipeEntry({ recipeId, portions, mealSlot }) {
  const list = read();
  const entry = {
    id: `j-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "recipe",
    recipeId,
    portions,
    mealSlot: mealSlot || defaultMealSlot(),
    addedAt: Date.now(),
  };
  write([entry, ...list]);
  notify();
  return entry;
}

export function removeEntry(id) {
  const list = read().filter((e) => e.id !== id);
  write(list);
  notify();
  return list;
}

// Obliczanie wartości żywieniowych pojedynczego wpisu. Zwraca null gdy usuniety przpis
export function computeEntryNutrition(entry) {
  if (!entry) return null;
  if (entry.type === "recipe") {
    const recipe = getRecipe(entry.recipeId);
    if (!recipe) return null;
    return {
      kcal: recipe.kcal * entry.portions,
      protein: recipe.macros.protein * entry.portions,
      carbs: recipe.macros.carbs * entry.portions,
      fat: recipe.macros.fat * entry.portions,
    };
  }
  const ing = getIngredient(entry.ingredientId);
  if (!ing) return null;
  return calcForAmount(ing, entry.amount);
}

export function getDaySummary(dateISO) {
  return getEntries(dateISO).reduce(
    (acc, entry) => {
      const c = computeEntryNutrition(entry);
      if (!c) return acc;
      acc.kcal    += c.kcal;
      acc.protein += c.protein;
      acc.carbs   += c.carbs;
      acc.fat     += c.fat;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getTodaySummary() {
  return getDaySummary(isoDay(Date.now()));
}
