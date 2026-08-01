# DROP — Current Status

**Version:** Phase 1 (MVP) in Umsetzung.
**Hauptlinie:** `drop-app/` (Vite + React + TypeScript). Legacy-Referenz: Branch `legacy/nextjs-reference` (Next.js, Three.js-3D-Avatar).
**Stand:** 2026-08-01. Die „fertig / in Arbeit"-Einordnung ist eine Momentaufnahme aus dem Code und per Test zu bestätigen.

## Vorhanden im Code (Bausteine)
- **Wardrobe:** Grid, Card, Upload, Panel
- **Avatar & Bühne:** Selector, View (2D, bildbasiert), Stage/Plattform, Themes (showroom, luxury-boutique, berlin-loft, noble, my-room)
- **Stylist:** Panel, InfoColumn, AI-Suggestions
- **Outfit:** Saver, gespeicherte Outfits
- **Layout:** Desktop (TopBar, IconSidebar, BottomNav) und Mobile-Shell (MobileHome, MobileStage, MobileStageSheet, MobileBottomNav, MobileSettings)
- **Infrastruktur:** Store (Zustand), i18n, Sounds, Weather-Service, Style-Scoring, Storage

## In Arbeit
- Mobile-Shell und Stage-Sheet (aktive, noch nicht committete Änderungen im Arbeitsverzeichnis)
- i18n (neu hinzugekommen)

## Nächster Milestone
MVP-Herz vollständig und ohne Erklärung bedienbar:
1. Hochladen → KI erkennt (Name, Kategorie) → landet im Schrank
2. Teil auf den Avatar → sitzt sofort, klares Feedback
3. KI-Stylist „Outfit vorschlagen" → kompletter Look
4. Bühne wechseln
5. Avatar Weiblich/Männlich umschalten
