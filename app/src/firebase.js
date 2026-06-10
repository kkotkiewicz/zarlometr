// Konfiguracja Firebase Web App.
// Wartości pochodzą z env (VITE_FIREBASE_*) — patrz app/.env.example.
// Web-config Firebase nie jest tajny (i tak trafia do przeglądarki), więc ten
// plik jest commitowany; prawdziwe wartości wstrzykuje się przez zmienne
// środowiskowe na hostingu (Railway / Vercel) lub lokalnie w app/.env.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
