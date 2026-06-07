import { FOOD_IMAGES } from "../../foodImages";
import "../../styles/recipes.css";

const RECIPES = [
  {
    id: 1,
    name: "Domowe Spaghetti",
    kcal: 450,
    macros: { protein: 24, carbs: 58, fat: 12 },
    accent: "spaghetti",
    image: FOOD_IMAGES.spaghetti,
  },
  {
    id: 2,
    name: "Bowl z łososiem",
    kcal: 410,
    macros: { protein: 32, carbs: 45, fat: 22 },
    accent: "salmon",
    image: FOOD_IMAGES.bowl,
  },
  {
    id: 3,
    name: "Owsianka nocna",
    kcal: 320,
    macros: { protein: 12, carbs: 48, fat: 8 },
    accent: "oats",
    image: FOOD_IMAGES.oats,
  },
];

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

export default function RecipesPage() {
  return (
    <div className="recipes">
      <header className="recipes-hero">
        <h1 className="recipes-title">Moje Przepisy</h1>
        <p className="recipes-lead">Twoja prywatna alchemia smaku.</p>
        <button type="button" className="recipes-create">
          <IconPlusBold />
          <span>Utwórz nowy przepis</span>
        </button>
      </header>

      <div className="recipes-list">
        {RECIPES.map((r) => (
          <article key={r.id} className="recipe-tile">
            <div className={`recipe-tile-photo recipe-tile-photo--${r.accent}`}>
              <img className="recipe-tile-img" src={r.image} alt={r.name} loading="lazy" />
              <span className="recipe-tile-kcal">{r.kcal} kcal / porcja</span>
            </div>
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
                <button type="button" className="recipe-tile-details">
                  <IconEye />
                  <span>Szczegóły</span>
                </button>
                <button type="button" className="mini-action recipe-tile-add" aria-label={`Dodaj ${r.name}`}>+</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
