# GothicGIS — trójwymiarowa Gothicpedia

GothicGIS to interaktywna, trójwymiarowa "Gothicpedia" zbudowana na CesiumJS i Vue 3. Projekt pozwala przeglądać świat Gothic (lokalizacje, przedmioty, postacie), śledzić zadania (questy) oraz podglądać dokładne pozycje.

---

## **Ogólne**
- **Cel:** dostarczyć wizualną, łatwą w użyciu encyklopedię świata Gothic z możliwością prowadzenia użytkownika przez interaktywne zadania.
- **Główne funkcje:** przeglądanie obiektów i postaci, podgląd ich pozycji na mapie 3D, system zadań z krokami zmieniającymi widok kamery i widoczność warstw, edytory treści i warstw.
- **Status:** projekt działa natomiast jest w fazie produkcji.

---

## **Technicznie**

### **Stos technologiczny**
- Frontend: `Vue 3` + `Pinia` (store), `Vuetify` (UI)
- Mapy 3D: `CesiumJS` (pakiet `@cesium/engine` + `vite-plugin-cesium`)
- Auth / backend: `Firebase` (auth + RT/Firestore — zależnie od konfiguracji projektu)
- Edytory: `monaco-editor` do edycji JSON / skryptów

### **Struktura repozytorium (skrót)**
- Główne wejście: [src/main.ts](src/main.ts)
- Komponent root: [src/App.vue](src/App.vue)
- Widok projektu i UI: [src/components/ProjectView.vue](src/components/ProjectView.vue)
- Logika globu i warstw: [src/services/globe/globe.ts](src/services/globe/globe.ts), [src/services/globe/layers.ts](src/services/globe/layers.ts)
- Kontrola kamery: [src/services/globe/cameraControl.ts](src/services/globe/cameraControl.ts)
- System zadań (quests): [src/services/quests.ts](src/services/quests.ts)
- Stores: [src/services/stores](src/services/stores) (pinia stores: `project`, `user`, `layers`, `tools`, ...)
- Konfiguracje i domyślny setup Cesium: [src/services/defaults.ts](src/services/defaults.ts)

### **Jak działają questy i widoki kamery**
- Definicja kroku zadania zawiera opcjonalnie: `cameraView` oraz `layersIds`.
- Wywołanie kroku uruchamia `stepChanges()` z [src/services/quests.ts](src/services/quests.ts):
	- jeśli `cameraView` jest ustawione — wywoływana jest funkcja zmiany widoku kamery (`zoomToViewConfig`), co powoduje płynne przejście kamery.
	- jeśli `layersIds` są podane — warstwy są włączane/wyłączane poprzez menedżera warstw (`globeInstance.layers`).

Implementacja globu tworzy jedną instancję `GlobeViewer` (singleton) w [src/services/globe/globe.ts](src/services/globe/globe.ts), gdzie uruchamiane są: `LayersManager` oraz `CameraControl`.

### **Uruchomienie lokalne**
1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom w trybie developerskim:

```bash
npm run dev
```

3. Budowanie produkcyjne:

```bash
npm run build
```

Upewnij się, że w pliku `.env` (lub w systemie) masz ustawiony klucz Cesium: `VITE_CESIUM_API_KEY` oraz konfigurację Firebase, jeśli używasz integracji.

### **Gdzie szukać kluczowej logiki**
- Inicjalizacja aplikacji i stores: [src/main.ts](src/main.ts) i [src/services/stores/init.ts](src/services/stores/init.ts)
- Zarządzanie warstwami: [src/services/globe/layers.ts](src/services/globe/layers.ts)
- Kamera i animacje widoków: [src/services/globe/cameraControl.ts](src/services/globe/cameraControl.ts)
- Obsługa eventów zadań: [src/services/quests.ts](src/services/quests.ts)

### **Dobre miejsca do rozbudowy / dalszej pracy**
- Dopracowanie edytorów treści i walidacji JSON (użycie `zod` już występuje w projekcie).
- Rozszerzenie systemu questów o zapisywanie postępu użytkownika.
- Optymalizacja warstw Cesium dla wydajności (LOD, batching).

---

_Szybkie referencje:_ zobacz [package.json](package.json) dla skryptów `dev`/`build` i [src/main.ts](src/main.ts) dla inicjalizacji aplikacji.
