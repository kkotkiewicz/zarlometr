import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getIngredient, getDominantMacro, calcForAmount } from "../lib/ingredients";
import "../styles/recipe-details.css";

function IconClose() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
  );
}

export default function RecipeDetailsModal({ recipe, onClose }) {
  useEffect(() => {
    if (!recipe) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  // Renderujemy przez portal do body, bo PageTransition zawiera transform,
  // który łamałby position: fixed wewnątrz drzewa strony.
  return createPortal((
    <div className="rd-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rd-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rd-close" onClick={onClose} aria-label="Zamknij">
          <IconClose />
        </button>

        <header className="rd-head">
          <h2 className="rd-title">{recipe.name}</h2>
          <p className="rd-kcal">
            <span className="rd-kcal-value">{recipe.kcal}</span>
            <span className="rd-kcal-label">kcal / porcja</span>
          </p>
        </header>

        <div className="rd-macros">
          <div className="rd-macro">
            <span className="rd-macro-label rd-macro-label--protein">Białko</span>
            <span className="rd-macro-value">{recipe.macros.protein}g</span>
          </div>
          <div className="rd-macro">
            <span className="rd-macro-label rd-macro-label--carbs">Węgle</span>
            <span className="rd-macro-value">{recipe.macros.carbs}g</span>
          </div>
          <div className="rd-macro">
            <span className="rd-macro-label rd-macro-label--fat">Tłuszcze</span>
            <span className="rd-macro-value">{recipe.macros.fat}g</span>
          </div>
        </div>

        <h3 className="rd-section-title">Składniki</h3>
        {ingredients.length === 0 ? (
          <p className="rd-empty">Ten przepis nie ma zapisanej listy składników.</p>
        ) : (
          <ul className="rd-ingredients">
            {ingredients.map((item, idx) => {
              const ing = getIngredient(item.ingredientId);
              if (!ing) {
                return (
                  <li key={idx} className="rd-ingredient rd-ingredient--missing">
                    <span className="rd-ingredient-dot" />
                    <span className="rd-ingredient-name">Nieznany składnik</span>
                    <span className="rd-ingredient-amount">{item.amount} g</span>
                  </li>
                );
              }
              const k = calcForAmount(ing, item.amount).kcal;
              return (
                <li key={idx} className="rd-ingredient">
                  <span className={`rd-ingredient-dot rd-ingredient-dot--${getDominantMacro(ing)}`} />
                  <div className="rd-ingredient-body">
                    <span className="rd-ingredient-name">{ing.name}</span>
                    <span className="rd-ingredient-sub">{item.amount} g · {Math.round(k)} kcal</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  ), document.body);
}
