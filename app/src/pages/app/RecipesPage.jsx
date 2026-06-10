import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FOOD_IMAGES } from "../../foodImages";
import { getRecipes, removeRecipe } from "../../lib/recipesRepo";
import RecipeDetailsModal from "../../components/RecipeDetailsModal";
import "../../styles/recipes.css";

function IconEye() {
  return (
    <svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
  );
}
function IconPlusBold() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" /></svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
  );
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [detailsId, setDetailsId] = useState(null);

  useEffect(() => {
    setRecipes(getRecipes());
  }, []);

  function handleRemove(id) {
    setRecipes(removeRecipe(id));
  }

  const detailsRecipe = recipes.find((r) => r.id === detailsId) || null;

  return (
    <div className="recipes">
      <header className="recipes-hero">
        <h1 className="recipes-title">Moje Przepisy</h1>
        <p className="recipes-lead">Twoja prywatna alchemia smaku.</p>
        <Link to="/recipes/new" className="recipes-create">
          <IconPlusBold />
          <span>Utwórz nowy przepis</span>
        </Link>
      </header>

      <div className="recipes-list">
        {recipes.length === 0 && (
          <p className="recipes-empty">Nie masz jeszcze żadnych przepisów. Utwórz pierwszy!</p>
        )}

        {recipes.map((r) => {
          // Seed-przepisy używają `image` jako klucza do FOOD_IMAGES;
          // user-created mają `coverImage` jako data-URL.
          const seedImg = r.image && FOOD_IMAGES[r.image];
          const coverType = r.coverType || "gradient";

          let coverContent;
          if (coverType === "image" && r.coverImage) {
            coverContent = (
              <div className="recipe-tile-photo recipe-tile-photo--image">
                <img className="recipe-tile-img" src={r.coverImage} alt={r.name} loading="lazy" />
                <span className="recipe-tile-kcal">{r.kcal} kcal / porcja</span>
              </div>
            );
          } else if (coverType === "solid" && r.coverColor) {
            coverContent = (
              <div
                className="recipe-tile-photo recipe-tile-photo--solid"
                style={{ background: r.coverColor }}
              >
                <span className="recipe-tile-kcal">{r.kcal} kcal / porcja</span>
              </div>
            );
          } else {
            coverContent = (
              <div className={`recipe-tile-photo recipe-tile-photo--${r.accent || "spaghetti"}`}>
                {seedImg && <img className="recipe-tile-img" src={seedImg} alt={r.name} loading="lazy" />}
                <span className="recipe-tile-kcal">{r.kcal} kcal / porcja</span>
              </div>
            );
          }

          return (
            <article key={r.id} className="recipe-tile">
              {coverContent}
              <div className="recipe-tile-body">
                <h2 className="recipe-tile-name">{r.name}</h2>
                <div className="recipe-tile-macros">
                  <div className="rt-macro">
                    <span className="rt-macro-label rt-macro-label--protein">Białko</span>
                    <span className="rt-macro-value">{r.macros.protein}g</span>
                  </div>
                  <div className="rt-macro">
                    <span className="rt-macro-label rt-macro-label--carbs">Węgle</span>
                    <span className="rt-macro-value">{r.macros.carbs}g</span>
                  </div>
                  <div className="rt-macro">
                    <span className="rt-macro-label rt-macro-label--fat">Tłuszcze</span>
                    <span className="rt-macro-value">{r.macros.fat}g</span>
                  </div>
                </div>
                <div className="recipe-tile-actions">
                  <button
                    type="button"
                    className="recipe-tile-details"
                    onClick={() => setDetailsId(r.id)}
                  >
                    <IconEye />
                    <span>Szczegóły</span>
                  </button>
                  <button
                    type="button"
                    className="mini-action recipe-tile-remove"
                    aria-label={`Usuń ${r.name}`}
                    onClick={() => handleRemove(r.id)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <RecipeDetailsModal recipe={detailsRecipe} onClose={() => setDetailsId(null)} />
    </div>
  );
}
