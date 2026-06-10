import ReactGA from "react-ga4";
import Hotjar from "@hotjar/browser";

// ID-ki pochodzą z .env (patrz .env.example). Gdy brak — dana integracja
// jest no-opem, więc projekt działa lokalnie bez kont GA/Hotjar.
const GA_ID = import.meta.env.VITE_GA_ID || "G-ZHYLM2TPLZ";
const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID;
const HOTJAR_VERSION = 6;

// Inicjalizacja GA na poziomie modułu, żeby zdążyć przed pierwszym pageview.
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

export function initHotjar() {
  if (!HOTJAR_ID) {
    console.warn("[hotjar] Brak VITE_HOTJAR_ID — Hotjar wyłączony.");
    return;
  }
  Hotjar.init(Number(HOTJAR_ID), HOTJAR_VERSION);
}

export function trackPageview(path) {
  if (GA_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
}
