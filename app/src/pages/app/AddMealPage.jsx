import { useState } from "react";
import { Link } from "react-router-dom";
import { FOOD_IMAGES } from "../../foodImages";
import "../../styles/add-meal.css";

const RECENT = [
  { id: 1, name: "Jajko kurze", kcal: 143, portion: "100g",    icon: "egg",   tone: "tertiary" },
  { id: 2, name: "Chleb żytni", kcal: 259, portion: "Kromka",  icon: "bread", tone: "secondary" },
  { id: 3, name: "Awokado",     kcal: 160, portion: "0.5 szt.", icon: "leaf",  tone: "primary" },
];

const SAVED_RECIPES = [
  { id: 1, name: "Bowl z łososiem", kcal: 580, protein: 32, accent: "salmon", image: FOOD_IMAGES.bowl },
  { id: 2, name: "Owsianka nocna",  kcal: 320, protein: 12, accent: "oats",   image: FOOD_IMAGES.oats },
];

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>
  );
}
function IconCamera() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 8h4l1.5-2h5L16 8h4v11H4z" /><circle cx="12" cy="13.5" r="3.5" /></svg>
  );
}
function IconEgg() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 3c-4 0-7 6-7 11a7 7 0 0 0 14 0c0-5-3-11-7-11z" /></svg>
  );
}
function IconBread() {
  return (
    <svg viewBox="0 0 24 24"><path d="M5 9c0-3 3-5 7-5s7 2 7 5c0 1-1 2-2 2v8H7v-8c-1 0-2-1-2-2z" /></svg>
  );
}
function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24"><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" /><path d="M5 19c4-4 9-7 14-14" /></svg>
  );
}
function IconBolt() {
  return (
    <svg viewBox="0 0 24 24"><path d="M13 3 4 14h6l-1 7 9-11h-6z" /></svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
  );
}

const ICON_BY_KEY = { egg: IconEgg, bread: IconBread, leaf: IconLeaf };

export default function AddMealPage() {
  const [query, setQuery] = useState("");
  const filtered = RECENT.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="add-meal">
      <div className="add-search-row">
        <div className="add-search">
          <IconSearch />
          <input
            type="search"
            placeholder="Szukaj produktu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Szukaj produktu"
          />
        </div>
        <button type="button" className="add-camera" aria-label="Skanuj kod produktu">
          <IconCamera />
        </button>
      </div>

      <section className="add-section">
        <header className="add-section-head">
          <h2 className="add-section-title">Ostatnio używane</h2>
          <button type="button" className="add-section-link">Wyczyść</button>
        </header>
        <ul className="recent-list">
          {filtered.map((p) => {
            const Icon = ICON_BY_KEY[p.icon] ?? IconEgg;
            const chipTone = p.tone === "primary" ? "fat" : p.tone === "secondary" ? "carbs" : "protein";
            return (
              <li key={p.id} className="recent-item">
                <div className={`recent-icon recent-icon--${p.tone}`}>
                  <Icon />
                </div>
                <div className="recent-body">
                  <div className="recent-name">{p.name}</div>
                  <div className="recent-chips">
                    <span className={`chip chip--${chipTone}`}>{p.kcal} KCAL</span>
                    <span className="recent-portion">{p.portion}</span>
                  </div>
                </div>
                <button type="button" className="recent-add" aria-label={`Dodaj ${p.name}`}>
                  <IconPlus />
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="recent-empty">Brak wyników dla „{query}”.</li>
          )}
        </ul>
      </section>

      <section className="add-section">
        <header className="add-section-head">
          <h2 className="add-section-title">Twoje przepisy</h2>
          <Link to="/recipes" className="add-section-link">Zobacz wszystko</Link>
        </header>
        <div className="recipe-grid">
          {SAVED_RECIPES.map((r) => (
            <article key={r.id} className={`recipe-card recipe-card--${r.accent}`}>
              <div className="recipe-card-photo">
                <img className="recipe-card-img" src={r.image} alt={r.name} loading="lazy" />
              </div>
              <h3 className="recipe-card-name">{r.name}</h3>
              <div className="recipe-card-chips">
                <span className="chip chip--kcal">{r.kcal} KCAL</span>
                <span className="chip chip--protein">{r.protein}G B</span>
                <button type="button" className="recipe-card-add" aria-label={`Dodaj ${r.name}`}>
                  <IconPlus />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quick-add">
        <div className="quick-add-icon">
          <IconBolt />
        </div>
        <div>
          <h3 className="quick-add-title">Szybkie dodawanie</h3>
          <p className="quick-add-text">
            Wybierz produkty, a następnie kliknij przycisk na dole, aby dodać
            wszystko naraz.
          </p>
        </div>
      </section>
    </div>
  );
}
