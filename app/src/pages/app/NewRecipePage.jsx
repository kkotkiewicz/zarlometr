import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../../lib/recipesRepo";
import {
  INGREDIENTS,
  getIngredient,
  getDominantMacro,
  calcForAmount,
  sumIngredients,
} from "../../lib/ingredients";
import { IconBack } from "../../components/icons";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import "../../styles/ingredient-picker.css";
import "../../styles/new-recipe.css";

const SOLID_COLORS = [
  { id: "lavender", value: "#B4C1FB" },
  { id: "yellow",   value: "#E8E971" },
  { id: "orange",   value: "#E8935A" },
  { id: "rose",     value: "#D47CA8" },
  { id: "teal",     value: "#7CC5BC" },
  { id: "navy",     value: "#5B6BA8" },
];

const COVER_MODES = [
  { id: "solid", label: "Kolor"   },
  { id: "image", label: "Zdjęcie" },
];

// Skalowanie + JPEG ~75% jakości — kompromis między rozmiarem (~30-100 KB)
// a wyglądem. localStorage ma ~5 MB limit, więc upchamy kilkadziesiąt przepisów.
async function compressImage(file, maxW = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Nie udało się wczytać obrazu"));
    };
    img.src = url;
  });
}

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

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 8" /></svg>
  );
}
function IconCamera() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 8h4l1.5-2h5L16 8h4v11H4z" /><circle cx="12" cy="13.5" r="3.5" /></svg>
  );
}
function IconTrash() {
  return (
    <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
  );
}

export default function NewRecipePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [coverType, setCoverType] = useState("solid"); // "solid" | "image"
  const [coverColor, setCoverColor] = useState(SOLID_COLORS[0].value);
  const [coverImage, setCoverImage] = useState(null);
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]); // [{key, ingredientId, amount}]
  const [pickerId, setPickerId] = useState(INGREDIENTS[0].id);
  const [pickerAmount, setPickerAmount] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const totals = useMemo(() => sumIngredients(items), [items]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return INGREDIENTS;
    return INGREDIENTS.filter((i) => normalize(i.name).includes(q));
  }, [query]);

  // Jeśli aktualnie wybrany składnik wypadł z wyników wyszukiwania,
  // używamy pierwszego widocznego — żeby nie dodać nieświadomie ukrytego.
  const activeId = useMemo(() => {
    if (filtered.some((i) => i.id === pickerId)) return pickerId;
    return filtered[0]?.id ?? null;
  }, [filtered, pickerId]);

  function handleAddIngredient() {
    setError("");
    if (!activeId) {
      setError("Wybierz składnik z listy.");
      return;
    }
    const grams = toNumber(pickerAmount);
    if (Number.isNaN(grams) || grams <= 0) {
      setError("Podaj liczbę gramów dla składnika.");
      return;
    }
    setItems((prev) => [
      ...prev,
      { key: `i-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ingredientId: activeId, amount: grams },
    ]);
    setPickerAmount("");
  }

  function handleRemoveItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Wybierz plik graficzny.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Zdjęcie jest za duże (max 10 MB).");
      e.target.value = "";
      return;
    }
    setError("");
    try {
      const dataUrl = await compressImage(file, 800, 0.75);
      setCoverImage(dataUrl);
    } catch {
      setError("Nie udało się przetworzyć zdjęcia.");
    }
    // Reset, żeby ponowny wybór tego samego pliku odpalił onChange.
    e.target.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Podaj nazwę przepisu.");
      return;
    }
    if (items.length === 0) {
      setError("Dodaj co najmniej jeden składnik.");
      return;
    }
    if (coverType === "image" && !coverImage) {
      setError("Wybierz zdjęcie albo zmień tryb okładki.");
      return;
    }

    try {
      addRecipe({
        name: trimmedName,
        kcal: Math.round(totals.kcal),
        macros: {
          protein: Math.round(totals.protein),
          carbs: Math.round(totals.carbs),
          fat: Math.round(totals.fat),
        },
        coverType,
        coverColor: coverType === "solid" ? coverColor : null,
        coverImage: coverType === "image" ? coverImage : null,
        ingredients: items.map(({ ingredientId, amount }) => ({ ingredientId, amount })),
      });
      navigate("/recipes", { replace: true });
    } catch (err) {
      // Najczęściej QuotaExceededError przy zdjęciach.
      setError("Nie udało się zapisać przepisu (brak miejsca?). Spróbuj mniejszego zdjęcia.");
    }
  }

  return (
    <div className="new-recipe">
      <header className="new-recipe-head">
        <button
          type="button"
          className="new-recipe-back"
          onClick={() => navigate(-1)}
          aria-label="Wróć"
        >
          <IconBack size={20} />
        </button>
        <h1 className="new-recipe-title">Nowy przepis</h1>
      </header>

      <form className="new-recipe-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="error-msg">{error}</div>}

        <TextField
          label="Nazwa przepisu"
          type="text"
          placeholder="np. Sałatka z tuńczykiem"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />

        <section className="ingredients-section">
          <h2 className="ingredients-title">Składniki</h2>

          {items.length === 0 && (
            <p className="ingredients-empty">
              Brak składników — dodaj pierwszy poniżej.
            </p>
          )}

          {items.length > 0 && (
            <ul className="ingredients-list">
              {items.map((item) => {
                const ing = getIngredient(item.ingredientId);
                if (!ing) return null;
                const k = calcForAmount(ing, item.amount).kcal;
                return (
                  <li key={item.key} className="ingredients-row">
                    <span className={`ingredients-row-dot ingredients-row-dot--${getDominantMacro(ing)}`} />
                    <div className="ingredients-row-main">
                      <span className="ingredients-row-name">{ing.name}</span>
                      <span className="ingredients-row-meta">
                        {item.amount} g · {Math.round(k)} kcal
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ingredients-row-remove"
                      onClick={() => handleRemoveItem(item.key)}
                      aria-label={`Usuń ${ing.name}`}
                    >
                      <IconClose />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="ingredient-picker">
            <div className="ingredient-search">
              <IconSearch />
              <input
                type="search"
                placeholder="Szukaj składnika..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Szukaj składnika"
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

            <ul
              className="ingredient-options"
              role="listbox"
              aria-label="Lista składników"
            >
              {filtered.map((ing) => {
                const isActive = activeId === ing.id;
                return (
                  <li
                    key={ing.id}
                    role="option"
                    aria-selected={isActive}
                    className={`ingredient-option ${isActive ? "is-active" : ""}`}
                    onClick={() => setPickerId(ing.id)}
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
              {filtered.length === 0 && (
                <li className="ingredient-option-empty">
                  Brak wyników dla „{query}".
                </li>
              )}
            </ul>

            <div className="ingredient-picker-row">
              <input
                className="field-input ingredient-amount"
                type="text"
                inputMode="numeric"
                placeholder="Gramy"
                value={pickerAmount}
                onChange={(e) => setPickerAmount(e.target.value)}
              />
              <button
                type="button"
                className="ingredient-add-btn"
                onClick={handleAddIngredient}
                disabled={!activeId}
              >
                <IconPlus />
                <span>Dodaj składnik</span>
              </button>
            </div>
          </div>
        </section>

        <section className="totals-card">
          <div className="totals-kcal">
            <span className="totals-kcal-value">{Math.round(totals.kcal)}</span>
            <span className="totals-kcal-label">kcal / porcja</span>
          </div>
          <div className="totals-macros">
            <div className="totals-macro">
              <span className="totals-macro-label totals-macro-label--protein">Białko</span>
              <span className="totals-macro-value">{Math.round(totals.protein)} g</span>
            </div>
            <div className="totals-macro">
              <span className="totals-macro-label totals-macro-label--carbs">Węgle</span>
              <span className="totals-macro-value">{Math.round(totals.carbs)} g</span>
            </div>
            <div className="totals-macro">
              <span className="totals-macro-label totals-macro-label--fat">Tłuszcze</span>
              <span className="totals-macro-value">{Math.round(totals.fat)} g</span>
            </div>
          </div>
        </section>

        <div className="cover-section">
          <span className="field-label">Wygląd karty</span>

          <div className="cover-mode-tabs" role="tablist">
            {COVER_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={coverType === m.id}
                className={`cover-mode-tab ${coverType === m.id ? "is-active" : ""}`}
                onClick={() => setCoverType(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {coverType === "solid" && (
            <div className="color-swatches" role="radiogroup" aria-label="Kolor karty">
              {SOLID_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={coverColor === c.value}
                  className={`color-swatch ${coverColor === c.value ? "is-active" : ""}`}
                  style={{ background: c.value }}
                  onClick={() => setCoverColor(c.value)}
                  aria-label={c.id}
                >
                  {coverColor === c.value && (
                    <span className="color-swatch-check" aria-hidden>
                      <IconCheck />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {coverType === "image" && (
            <div className="image-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {coverImage ? (
                <div className="image-upload-preview">
                  <img src={coverImage} alt="Podgląd zdjęcia" />
                  <div className="image-upload-actions">
                    <button
                      type="button"
                      className="image-upload-action"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconCamera /><span>Zmień</span>
                    </button>
                    <button
                      type="button"
                      className="image-upload-action image-upload-action--danger"
                      onClick={() => setCoverImage(null)}
                    >
                      <IconTrash /><span>Usuń</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="image-upload-empty"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconCamera />
                  <span className="image-upload-label">Wybierz zdjęcie z dysku</span>
                  <span className="image-upload-hint">JPG / PNG do 10 MB</span>
                </button>
              )}
            </div>
          )}
        </div>

        <Button type="submit">Zapisz przepis</Button>
      </form>
    </div>
  );
}
