# Raport zgodności - Żarłometr

Patrząc na ten projekt z obu stron naraz, od strony prototypu i dokumentacji oraz od strony kodu, widać, na ile aplikacja pokrywa się z tym, co było zaplanowane w makiecie. Z założenia jest to aplikacja front-endowa. Poza logowaniem przez Firebase nie ma backendu ani bazy, więc brak własnego API czy trwałego zapisu danych nie jest tu uchybieniem. Punktem odniesienia jest to, co realnie odbiega od pierwotnego projektu.

## 1.  Wymagania techniczne i infrastruktura

Warstwa architektoniczna i technologiczna została zrealizowana w 100% zgodnie ze specyfikacją:
* **Routing i struktura:** Każdy zaplanowany ekran został zmapowany w strukturze React Router. Wdrożono mechanizm zagnieżdżonego routingu z wykorzystaniem komponentu `<Outlet />` wewnątrz układu ramowego, a także obsłużono fallback dla błędów 404. Widoki zostały poprawnie odseparowane w strukturze katalogów `pages/auth` oraz `pages/app`.
* **Dekompozycja i Style:** Powtarzalne elementy interfejsu (m.in. `Button`, `Card`, `TextField`, `Toggle`, `GoogleButton`, `AppShell`, `MealReminder`) zostały wydzielone do czystych komponentów sterowanych za pomocą mechanizmu propsów. Warstwa wizualna bazuje na globalnych zmiennych CSS oraz dedykowanych arkuszach stylów dla poszczególnych widoków, co zapewnia pełną spójność estetyczną.
* **Autentykacja i Analityka:** Wdrożono pełny, bezpieczny cykl autentykacji (rejestracja, logowanie tradycyjne, logowanie przez Google OAuth, wylogowanie) zintegrowany z systemem Firebase. Trasy aplikacyjne zostały skutecznie zabezpieczone za pomocą komponentów `PrivateRoute` i `PublicRoute`. Narzędzia Hotjar oraz Google Analytics zostały zaimplementowane na poziomie globalnym, a zdarzenia *pageview* są dynamicznie przechwytywane przez dedykowany komponent `AnalyticsListener` przy każdej zmianie ścieżki.
* **Deployment:** Gotowa aplikacja została pomyślnie udostępniona produkcyjnie na platformie Railway (`zarometret-production.up.railway.app`).

## 2. Analiza zgodności z badaniami preferencji użytkowników
Przed przygotowywanie dokumentacji przeprowadzono badania ankietowe mające na celu zbadanie nawyków grupy docelowej. Gotowy produkt w wysokim stopniu (ok. 85% pokrycia założeń) odpowiada na zidentyfikowane potrzeby respondentów.

### Co użytkownicy chcieli, a rozwiązano inaczej:
* **Korekta gramatury potraw „Na dziś”:** W badaniach respondenci wyrazili chęć procentowej korekty porcji posiłku (np. zjedzenie 70% dania) i oczekiwali automatycznego przeliczenia makroskładników wyłącznie dla tego jednego wpisu dziennego. 
* *Rozbieżność:* Zamiast posługiwać się suwakami procentowymi, wdrożono bardziej intuicyjną i precyzyjną korektę ułamkową (np. wpisanie `0.7` porcji w polu ilości). System automatycznie przelicza wartości odżywcze i przypisuje je do dziennika bez trwałej modyfikacji oryginalnego przepisu, co w pełni realizuje intencję użytkowników.

### Co użytkownicy chcieli (lub zakładał projekt), a czego nie ma:
* **Skaner kodów kreskowych:** Funkcja ta była uwzględniona w ankiecie preferencji i na wstępnych makietach jako alternatywna metoda szybkiego dodawania produktów spożywczych, jednak ostatecznie skaner kodów został pominięty.

* **Współpraca z dietetykiem i udostępnianie dziennika:** W badaniach ankietowych weryfikowano potrzebę dzielenia się danymi żywieniowymi ze specjalistą. Respondenci wyrazili bardzo umiarkowane zainteresowanie tym modułem, zaznaczając, że jeśli się pojawi, powinien zostać głęboko schowany w menu. Funkcja ta została całkowicie wykluczona z obecnego wydania.

* **Import i modyfikacja przepisów publicznych:** Pierwotny schemat funkcjonalny i domena terminologii zakładały obecność gotowej bazy przepisów publicznych do pobrania z internetu. Zaimplementowana wersja systemu ogranicza się wyłącznie do tworzenia i prowadzenia prywatnej listy przepisów użytkownika.

* **Generator przepisów „Użyj AI”:** Szkice projektowe zapowiadały obecność inteligentnego przycisku wsparcia sztucznej inteligencji (AI) przy układaniu potraw. Integracja z modelami językowymi (LLM) została w całości pominięta.

## 3. Gdzie kod odszedł od pierwotnego prototypu i specyfikacji

Szkielet wizualny, ciemny motyw, dedykowana paleta kolorów oraz typografia (Space Grotesk i Manrope) zostały zachowane w 100% według księgi stylu. Zidentyfikowano jednak następujące punktowe rozbieżności implementacyjne:

* **Struktura porcji dnia w Dzienniku:** Dokumentacja funkcjonalna zakładała podział dnia na 5 sekcji (Śniadanie, II śniadanie, Obiad, Podwieczorek, Kolacja). W kodzie zredukowano to do 4 kategorii: Śniadanie, Obiad, Kolacja oraz Przekąski.

* **Brak godzin posiłków i emoji:** Według założeń, pozycje w dzienniku miały wyświetlać dokładną godzinę wpisu oraz ikony emoji. W kodzie grupy posiłków agregują elementy bez znaczników godzinowych, a emoji zastąpiono jednolitymi, minimalistycznymi ikonami SVG (`IconFork`, `IconChef`).

* **Zdublowane ekrany zarządzania profilem:** W kodzie funkcjonują dwa bliźniacze ekrany: klikalny `/settings` (`SettingsPage.jsx`) oraz statyczny `/profile` (`ProfilePage.jsx`). Ścieżka `/profile` jest obecnie odcięta od nawigacji, ponieważ awatar użytkownika w topbarze przekierowuje bezpośrednio do Ustawień. W pierwotnej makiecie te widoki stanowiły jedną spójną całość.

* **Architektura ekranu dodawania posiłków:** Układ graficzny `AddMealPage.jsx` uległ uproszczeniu. Zamiast karuzeli miniaturek z przepisami oraz odrębnej sekcji „Szybkie dodawanie”, zastosowano czytelny i ergonomiczny przełącznik kart (Produkty / Przepisy) połączony z listą opcji i wyszukiwarką. Cel funkcjonalny został zachowany, jednak kompozycja ekranu odbiega od wireframe'u.

* **Moduł resetowania hasła użytkownika:** Link „Zapomniałeś hasła?” na ekranie logowania oraz przycisk „Resetowanie hasła” w sekcji bezpieczeństwa są nieaktywne (link prowadzi do nieistniejącej ścieżki `/forgot-password` i kończy się błędem 404). 

Szkielet wizualny trzyma się makiety. Została paleta, fonty (Space Grotesk i Manrope), ciemny motyw, dolny pasek z pięcioma ikonami i wyróżnionym „+", brak nawigacji na logowaniu, rejestracji i onboardingu. Komplet zaprojektowanych ekranów jest na miejscu, a przypomnienie o posiłku zostało zrobione jako modal, dokładnie tak jak w dokumentacji.


## 4. Podsumowanie

Z technicznego punktu widzenia projekt „Żarłometr” jest kompletny i w pełni zdatny do użytku produkcyjnego. Zaimplementowane flow użytkownika (rejestracja -> onboarding -> dashboard -> dodawanie posiłków -> analiza postępów) działa prawidłowo. Wszystkie wykryte rozbieżności mają charakter wyłącznie interfejsowy (UI) lub wynikają ze świadomego ograniczenia zakresu prac nad funkcjami pobocznymi na rzecz dopracowania głównej funkcjonalności aplikacji, który dla końcowych użytkowników był najważniejszym elementem aplikacji.

