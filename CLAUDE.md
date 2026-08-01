# DROP — Projekt-Regeln

DROP-spezifische Regeln für dieses Repository. Das **Verhaltens-Betriebssystem ist global** in `~/.claude` (CLAUDE.md, LOOPS.md, TOOLS.md, MEMORY.md, AGENTS.md) — hier **nicht** duplizieren. Produktbeschreibung → [PROJECT.md](./PROJECT.md).

## Hauptlinie
- Aktive App: `drop-app/` (Vite + React + TypeScript). Neue Features werden nur hier gebaut.
- Die Next.js-App `app/` ist nur Referenz (dort liegt der Three.js-3D-Avatar).

## Bauen gegen das Mockup
- Das Mockup ist Spezifikation **und** Ziel — „lebendig machen", nicht „etwas Ähnliches bauen".
- Bei Konflikt zwischen bestehender UI und Mockup gewinnt immer das Mockup.
- Alte visuelle UI ersetzen, nicht parallel behalten: keine doppelten Layouts, konkurrierenden Panels, Dashboard-Reste oder alten Theme-Farben.
- Bestehende Logik bewahren (Upload, Store/Zustand, Favoriten, Styles) — nur die alte Oberfläche ersetzen.
- Bestehende Komponenten verbessern statt neu bauen.

## Produkt-Leitplanken
- „Fühlt sich wie ein Spiel an" ist die oberste Regel.
- Visuelle Qualität ist Pflicht; `mockups/` immer als Referenz nutzen.
- Schrank startet leer — keine Seed-/Demodaten.
- Kategoriestruktur: Hauptkategorien (Oberteile, Unterteile, Outwear, Schuhe, Accessoires); Unterkategorien erst nach Klick.
- Phase 2 + 3 nicht bauen, bis Phase 1 sitzt.
- Nichts ohne Freigabe ändern; keine Regressionen.
