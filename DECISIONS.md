# DROP — Decisions

Getroffene Produktentscheidungen mit Begründung. Offene Punkte gehören nicht hierher.

## Hauptlinie: Vite-App `drop-app/`
Neue Features werden ausschließlich in `drop-app/` (Vite + React + TypeScript) gebaut. Die alte Next.js-App wurde aus dem Repo entfernt und ist nur noch im Branch `legacy/nextjs-reference` als Referenz erhalten (dort liegt der Three.js-3D-Avatar).
**Grund:** Eine klare Hauptlinie verhindert konkurrierende Systeme.

## Das Mockup ist die Wahrheit
Das aktuelle Mockup ist Spezifikation und Ziel. Bei Konflikt gewinnt das Mockup; alte visuelle UI wird ersetzt, nicht parallel behalten.
**Grund:** Eine einzige visuelle Wahrheit, keine Dashboard-Reste.

## Der Avatar ist das Zentrum
Der Avatar ist an der Plattform verankert und bildet das emotionale Zentrum der App.
**Grund:** Die Bühne ist der Star; alles ordnet sich unter.

## Mobile First & maximal zwei Taps
Mobil zuerst, jede Kern-Aktion in höchstens zwei Taps.
**Grund:** Daumen-Zone, selbsterklärend, kein Tutorial nötig.

## Bestehende Logik bewahren
Vorhandene Logik (Upload, Store/Zustand, Favoriten, Styles) bleibt; nur die alte Oberfläche wird ersetzt. Bestehende Komponenten verbessern statt neu bauen.
**Grund:** Keine Regressionen.

## Schrank startet leer
Keine Seed-/Demodaten.
**Grund:** Echte Nutzung von Anfang an.

## Kein Dark Theme
Helle, cremefarbene Studio-Atmosphäre.
**Grund:** Premium-Boutique-Gefühl statt Admin-Look.

## Phase-Gating
Phase 2 + 3 werden nicht angefasst, bis Phase 1 sitzt.
**Grund:** Fokus, kein Scope Creep.
