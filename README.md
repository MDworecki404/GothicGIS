# GothicGIS - trójwymiarowa wikipedia świata Gothic

GothicGIS to interaktywna, trójwymiarowa wikipedia zbudowana na CesiumJS. Aplikacja pozwala na przeglądanie świata gry, jego elementów, prowadzenie użytkownika przez zadania dostępne w grze i jeszcze więcej.

## Ogólne informacje
* **Cel projektu:** dostarczyć encyklopędię świata gry Gothic w nietypowym wydaniu,
* **Główne funkcje:** przeglądanie świata gry, położenia pozycji ważnych przedmiotów dostępnych w grze, położenia postaci, przechodzenia przez kolejne kroki zadań z dokładnym *walktrough*
* **Status projektu:** projekt działa i jest dostępny pod linkiem https://mdworecki404.github.io/GothicGIS/, natomiast jest on w wczesnej fazie produkcyjnej

## Informacje techniczne

* **Frontend:** `Vue 3` + `Pinia (store)` + `Vuetify (UI)`
* **Technologia GIS'owa:** `CesiumJS`
* **Backend:** `Firebase`

## Struktura projektu

```
GothicGIS/
├── src/                        # Kod źródłowy
│   ├── App.vue                 # Root Vue component
│   ├── main.ts                 # Punkt wejścia aplikacji (TypeScript)
│   ├── style.css               # Style globalne (CSS)
│   ├── assets/                 # Zasoby statyczne (obrazy, modele, inne pliki)
│   ├── components/             # Komponenty Vue (.vue): UI, narzędzia, edytory
│   │   ├── Editors/            # dialogi i edytory (.vue)
│   │   ├── tools/              # narzędzia interakcji i kontrolery (.vue)
│   │   └── ui/                 # elementy interfejsu użytkownika (.vue)
│   ├── services/               # Logika aplikacji (TypeScript .ts)
│   │   ├── globe/              # moduły Cesium (kamera, globe, warstwy)
│   │   ├── i18n/               # internacjonalizacja (ts + locales .json)
│   │   ├── stores/             # Pinia stores (.ts)
│   │   └── types/              # definicje typów i deklaracje (.d.ts / .ts)
```

