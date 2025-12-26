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
....
```

## Zdjęcia poglądowe

<img width="1921" height="1080" alt="image" src="https://github.com/user-attachments/assets/333c12ea-333f-40ca-9fba-33b90c2bff15" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/30fc2386-7303-461b-a071-4391ee9d6c32" />

<img width="1918" height="1080" alt="image" src="https://github.com/user-attachments/assets/2bd0ce3f-5283-41e7-8589-50358a1527d2" />

<img width="382" height="829" alt="image" src="https://github.com/user-attachments/assets/9a6a18ea-e120-4cdf-87e8-eba509d78e11" />
