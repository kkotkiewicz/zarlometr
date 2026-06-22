# Raport zgodności, Żarłometr

Patrząc na ten projekt z obu stron naraz, od strony prototypu i dokumentacji oraz od strony kodu, widać, na ile aplikacja pokrywa się z tym, co było zaplanowane w makiecie. Z założenia jest to aplikacja front-endowa. Poza logowaniem przez Firebase nie ma backendu ani bazy, więc brak własnego API czy trwałego zapisu danych nie jest tu uchybieniem. Punktem odniesienia jest to, co realnie odbiega od pierwotnego projektu.

## Wymagania techniczne

Ta część jest pokryta w całości. Każdy ekran z prototypu jest wpięty w React Router, jest fallback 404, a widoki leżą w folderze `pages` (osobno auth, osobno app). Powtarzalne elementy są wyciągnięte do komponentów (Button, Card, TextField, Toggle, GoogleButton, AppShell, MealReminder) i sterują się propsami. Stylowanie jest spójne, oparte na zmiennych CSS w `global.css` plus osobne arkusze per widok. Logowanie działa na Firebase (email z hasłem oraz Google, wylogowanie, chronione trasy). Hotjar i Google Analytics są wpięte na poziomie aplikacji, a pageview jest łapany przez `AnalyticsListener` przy każdej zmianie trasy. Całość stoi na Railwayu. Ponad minimum są jeszcze chronione trasy, zagnieżdżony routing i wspólny layout przez `<Outlet />`.

## Gdzie kod odszedł od prototypu

Szkielet wizualny trzyma się makiety. Została paleta, fonty (Space Grotesk i Manrope), ciemny motyw, dolny pasek z pięcioma ikonami i wyróżnionym „+", brak nawigacji na logowaniu, rejestracji i onboardingu. Komplet zaprojektowanych ekranów jest na miejscu, a przypomnienie o posiłku zostało zrobione jako modal, dokładnie tak jak w dokumentacji.

Różnice są punktowe:

- Reset hasła został wiszący. Link „Zapomniałeś hasła?" prowadzi do `/forgot-password`, której nie ma, więc ląduje na 404. Przyciski „Resetowanie hasła" w Ustawieniach i Profilu też na razie nic nie robią.
- Profil dubluje się z Ustawieniami. Są dwa zbliżone ekrany, `/settings` (klikalny) i `/profile` (statyczny wariant), przy czym do `/profile` nic nie prowadzi, bo awatar w topbarze otwiera Ustawienia. W makiecie był jeden ekran.
- Ekran dodawania wyszedł inaczej niż w projekcie. Zamiast karuzeli miniaturek przepisów i osobnej karty „Szybkie dodawanie" jest przełącznik Produkty/Przepisy z listą. Działa tak samo, ale układ odbiega od prototypu.
- Skaner kodów z wyszukiwarki na ekranie dodawania został wycięty.
- Brak importu przepisu publicznego, choć w schemacie funkcjonalnym był przewidziany. Zostało samo tworzenie własnych przepisów.
- Brak opcji „Użyj AI" przy przepisach, którą zapowiadała makieta.
- Zostały drobne rozjazdy w danych przykładowych. Cel kaloryczny i streak różnią się między ekranami (2400 kontra 2500 kcal, 5 kontra 12 dni). To kosmetyka, ale wypada ujednolicić.

## Podsumowanie

Od strony wymagań projekt jest kompletny, a odwzorowanie prototypu wierne. Wszystko, co odjechało, to pojedyncze elementy UI, czyli martwy link resetu hasła, zdublowany profil, inny układ dodawania i kilka świadomie odpuszczonych drobiazgów (skaner, import przepisu, „Użyj AI"). Każda z tych rzeczy jest łatwa do wskazania i do poprawienia.
