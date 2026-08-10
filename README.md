# BioCOPPA Index Dashboard

A modern, responsive web dashboard for the **BioCOPPA (Biological Crop Protection Products Access) Index** — visualising how ready a country is to support biological crop protection products, based on stakeholder assessments.

## Stack

- React 18 + TypeScript + Vite
- React Router (client-side navigation)
- Hand-rolled SVG charts (no chart library) — bar, radar, doughnut, heatmap
- Pure calculation engine with unit tests (Vitest)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run calculation-engine tests
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Architecture

```
src/
  calc/            calculation engine (pure, UI-free, unit-tested)
  data/            data layer: types, domain definitions, mock datasets, store
  context/         theme (light/dark) + data store react bindings
  components/
    charts/        SVG chart components
    layout/        sidebar, topbar, app shell
    ui.tsx         reusable UI primitives (Card, Badge, StatCard, ScoreRing…)
  pages/           Dashboard, Domain pages, Indicator Analysis, Reports, Settings
```

### Calculation rules

- **Weighted Score (per indicator)** = Importance × Performance
- **Domain Score** = Σ(Importance × Performance) ÷ Σ(Importance)
- **Overall BioCOPPA Score** = average of the three domain scores
- **Percentage (0–100)** and **Index (0–10)** = normalised from the 1–5 scale

The dashboard recomputes automatically whenever the active dataset changes (see the **Settings** page — JSON datasets can be imported at runtime).

## Data layer

Mock datasets ship in `src/data/datasets.ts`. The store in `src/data/dataService.ts` is the single boundary between UI and data — replace `loadSource()` with an Excel parser or a REST API and no UI code changes. Datasets are structured per country per year so the project scales to multiple countries and assessment years.
