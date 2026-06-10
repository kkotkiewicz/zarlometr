const STORAGE_KEY = "zarlometr.recipes";

const SEED = [
  {
    id: "seed-1",
    name: "Domowe Spaghetti",
    kcal: 450,
    macros: { protein: 24, carbs: 58, fat: 12 },
    accent: "spaghetti",
    image: "spaghetti",
    ingredients: [
      { ingredientId: "pasta",   amount: 80  },
      { ingredientId: "beef",    amount: 100 },
      { ingredientId: "tomato",  amount: 150 },
      { ingredientId: "cheese",  amount: 20  },
      { ingredientId: "olive-oil", amount: 5 },
    ],
  },
  {
    id: "seed-2",
    name: "Bowl z łososiem",
    kcal: 410,
    macros: { protein: 32, carbs: 45, fat: 22 },
    accent: "salmon",
    image: "bowl",
    ingredients: [
      { ingredientId: "salmon",     amount: 120 },
      { ingredientId: "rice-brown", amount: 70  },
      { ingredientId: "avocado",    amount: 50  },
      { ingredientId: "broccoli",   amount: 80  },
    ],
  },
  {
    id: "seed-3",
    name: "Owsianka nocna",
    kcal: 320,
    macros: { protein: 12, carbs: 48, fat: 8 },
    accent: "oats",
    image: "oats",
    ingredients: [
      { ingredientId: "oats",   amount: 60 },
      { ingredientId: "milk-2", amount: 150 },
      { ingredientId: "banana", amount: 80 },
      { ingredientId: "honey",  amount: 10 },
    ],
  },
];

// Stare przepisy startowe nie miały pola `ingredients`. Gdy widzimy
// w localStorage seed-* bez składników, podmieniamy je na świeży SEED
// (jednorazowa migracja przy odczycie).
function migrate(list) {
  let changed = false;
  const next = list.map((r) => {
    if (r?.id?.startsWith?.("seed-") && !r.ingredients) {
      const fresh = SEED.find((s) => s.id === r.id);
      if (fresh) {
        changed = true;
        return fresh;
      }
    }
    return r;
  });
  return { list: next, changed };
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const { list, changed } = migrate(parsed);
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [];
  }
}

function write(list) {
  // Propagujemy QuotaExceededError do callera — przepis ze zdjęciem może
  // przekroczyć ~5 MB limit localStorage i UI powinien o tym powiedzieć.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getRecipes() {
  return read();
}

export function getRecipe(id) {
  return read().find((r) => r.id === id) || null;
}

export function addRecipe(recipe) {
  const list = read();
  const next = {
    id: `r-${Date.now()}`,
    createdAt: Date.now(),
    ...recipe,
  };
  const updated = [next, ...list];
  write(updated);
  return next;
}

export function removeRecipe(id) {
  const list = read().filter((r) => r.id !== id);
  write(list);
  return list;
}
