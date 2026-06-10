// Wartości odżywcze na 100 g produktu
// Źródło z USDA, wartości zaokrąglone
export const INGREDIENTS = [
  { id: "egg",        name: "Jajko",               kcal: 143, macros: { protein: 13, carbs: 1,  fat: 10 } },
  { id: "chicken",    name: "Pierś z kurczaka",    kcal: 165, macros: { protein: 31, carbs: 0,  fat: 4  } },
  { id: "salmon",     name: "Łosoś",               kcal: 208, macros: { protein: 20, carbs: 0,  fat: 13 } },
  { id: "tuna",       name: "Tuńczyk (w wodzie)",  kcal: 116, macros: { protein: 26, carbs: 0,  fat: 1  } },
  { id: "beef",       name: "Wołowina chuda",      kcal: 200, macros: { protein: 26, carbs: 0,  fat: 10 } },
  { id: "rice-white", name: "Ryż biały (suchy)",   kcal: 360, macros: { protein: 7,  carbs: 79, fat: 1  } },
  { id: "rice-brown", name: "Ryż brązowy (suchy)", kcal: 360, macros: { protein: 8,  carbs: 76, fat: 3  } },
  { id: "buckwheat",  name: "Kasza gryczana",      kcal: 343, macros: { protein: 13, carbs: 71, fat: 3  } },
  { id: "pasta",      name: "Makaron (suchy)",     kcal: 358, macros: { protein: 13, carbs: 72, fat: 2  } },
  { id: "bread-rye",  name: "Chleb żytni",         kcal: 259, macros: { protein: 8,  carbs: 48, fat: 3  } },
  { id: "oats",       name: "Płatki owsiane",      kcal: 379, macros: { protein: 13, carbs: 68, fat: 7  } },
  { id: "tomato",     name: "Pomidor",             kcal: 18,  macros: { protein: 1,  carbs: 4,  fat: 0  } },
  { id: "avocado",    name: "Awokado",             kcal: 160, macros: { protein: 2,  carbs: 9,  fat: 15 } },
  { id: "banana",     name: "Banan",               kcal: 89,  macros: { protein: 1,  carbs: 23, fat: 0  } },
  { id: "apple",      name: "Jabłko",              kcal: 52,  macros: { protein: 0,  carbs: 14, fat: 0  } },
  { id: "broccoli",   name: "Brokuł",              kcal: 34,  macros: { protein: 3,  carbs: 7,  fat: 0  } },
  { id: "cheese",     name: "Ser żółty (gouda)",   kcal: 356, macros: { protein: 25, carbs: 2,  fat: 27 } },
  { id: "cottage",    name: "Twaróg półtłusty",    kcal: 133, macros: { protein: 17, carbs: 4,  fat: 5  } },
  { id: "milk-2",     name: "Mleko 2%",            kcal: 50,  macros: { protein: 3,  carbs: 5,  fat: 2  } },
  { id: "olive-oil",  name: "Oliwa z oliwek",      kcal: 884, macros: { protein: 0,  carbs: 0,  fat: 100 } },
  { id: "butter",     name: "Masło",               kcal: 717, macros: { protein: 1,  carbs: 0,  fat: 81 } },
  { id: "honey",      name: "Miód",                kcal: 304, macros: { protein: 0,  carbs: 82, fat: 0  } },
];

export function getIngredient(id) {
  return INGREDIENTS.find((i) => i.id === id);
}

export function calcForAmount(ingredient, grams) {
  const factor = grams / 100;
  return {
    kcal: ingredient.kcal * factor,
    protein: ingredient.macros.protein * factor,
    carbs: ingredient.macros.carbs * factor,
    fat: ingredient.macros.fat * factor,
  };
}

// Dominujący makroskładnik (po kalorycznym wkładzie). Białko/węgle = 4 kcal/g,
// tłuszcze = 9 kcal/g. 
export function getDominantMacro(ingredient) {
  const p = ingredient.macros.protein * 4;
  const c = ingredient.macros.carbs * 4;
  const f = ingredient.macros.fat * 9;
  const max = Math.max(p, c, f);
  if (max === 0) return "carbs";
  if (max === p) return "protein";
  if (max === c) return "carbs";
  return "fat";
}

export function sumIngredients(items) {
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const item of items) {
    const ing = getIngredient(item.ingredientId);
    if (!ing) continue;
    const t = calcForAmount(ing, item.amount);
    totals.kcal += t.kcal;
    totals.protein += t.protein;
    totals.carbs += t.carbs;
    totals.fat += t.fat;
  }
  return totals;
}
