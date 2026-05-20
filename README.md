# Żarłometr

Aplikacja do śledzenia diety i kalorii. Zbudowana w React + Vite, z Firebase jako backendem (autentykacja + Firestore).

## Stack

- **React 18** + **Vite**
- **React Router v6**
- **Firebase 12** (Authentication, Firestore)
- **React GA4** (Google Analytics)

## Wymagania wstępne

- Node.js ≥ 18
- Konto Firebase z własnym projektem

## Pierwsze uruchomienie

### 1. Sklonuj repo i zainstaluj zależności

```bash
git clone <url-repo>
cd zarlometr/app
npm install
```

### 2. Skonfiguruj Firebase

Plik `app/src/firebase.js` **nie jest commitowany** — każdy dev musi go utworzyć ręcznie.

Wejdź w [Firebase Console](https://console.firebase.google.com/) → twój projekt →  Project Settings → zakładka **Your apps** → sekcja **SDK setup and configuration**.

Utwórz plik `app/src/firebase.js`:

```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

### 3. Włącz metody logowania w Firebase

W Firebase Console → **Authentication** → **Sign-in method**:

| Provider | Status |
|---|---|
| Email/Password | Enabled |
| Google |  Enabled |

### 4. Włącz Firestore

Firebase Console → **Firestore Database** → **Create database**.

Reguły na start (development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Uruchom aplikację

```bash
cd app
npm run dev
```

Aplikacja działa pod `http://localhost:5173`.

## Struktura projektu

```
app/
├── src/
│   ├── components/
│   │   ├── layout/AppShell.jsx     # Nawigacja dolna + header
│   │   ├── AnalyticsListener.jsx
│   │   └── PageTransition.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Firebase onAuthStateChanged
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   └── app/
│   │       ├── DashboardPage.jsx
│   │       ├── JournalPage.jsx
│   │       ├── AddMealPage.jsx
│   │       ├── RecipesPage.jsx
│   │       ├── ProgressPage.jsx
│   │       └── OnboardingPage.jsx
│   ├── styles/                     # CSS (bez CSS-in-JS)
│   ├── firebase.js                 # nie commitowany — stwórz lokalnie
│   ├── App.jsx                     # Routing + PrivateRoute
│   └── main.jsx
└── index.html
```

## Firestore — schemat danych

```
users/
  {uid}/
    name        string
    nickname    string
    email       string
    createdAt   timestamp
    groupId     string | null   (opcjonalne)
```

## Dostępne skrypty

```bash
npm run dev      # serwer deweloperski (localhost:5173)
npm run build    # build produkcyjny do dist/
```

## Częste problemy

**`firebase.js` nie istnieje / błąd importu**
→ Utwórz plik zgodnie z krokiem 2 powyżej.

**`auth/unauthorized-domain`**
→ Firebase Console → Authentication → Settings → **Authorized domains** → dodaj `localhost`.

**Biały ekran / nieskończony loading**
→ Sprawdź czy `projectId` w `firebase.js` jest poprawny i czy Firestore jest włączony.

**Popup Google zamknięty od razu**
→ Sprawdź czy domena jest na liście Authorized domains.
