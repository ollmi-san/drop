# DROP — CLAUDE.md · Projekt-Regeln 2026

## Was ist DROP?
DROP ist der digitale Zwilling des echten Kleiderschranks.
Kauf → Digitalisieren → Verwalten → Stylen → Tragen → Verkaufen → Neukauf
"DROP wird das Betriebssystem für den eigenen Kleiderschrank."

## USP
Andere Apps verkaufen Kleidung. DROP verwaltet Kleidung.

## Hauptfunktionen Phase 1
- Digitaler Kleiderschrank
- Outfit Builder mit Drag & Drop
- Fashion Stage (goldene Showroom-Bühne)
- KI Stylist (Wetter, Anlass, Stil, vorhandene Kleidung)
- Fashion Lexikon
- Virtuelle Anprobe mit Fashn.ai API
- Fashion Gedächtnis (oft / selten / nie getragen)
- Cost per Wear Berechnung
- Vibe Filter (Clean Girl, Old Money, Mob Wife, Gorpcore)
- Wetter- und Anlassvorschläge

## Phase 2 + 3 — NOCH NICHT BAUEN
- Wiederverkauf Vinted, Kleinanzeigen, Depop
- Shopping Assistent
- Eigener Avatar mit Selfie
- Community Features
- Kamerafahrten

## Fashion Stage
Die Mitte der App ist eine Fashion Stage — keine Avatar-Fläche.
Luxuriöse Boutique-Bühne mit goldenem Showroom-Hintergrund.
Das emotionale Zentrum der App.

## KI Stylist
Die KI erklärt — nicht nur vorschlägt:
"Dieses Shirt funktioniert als Ankerteil."
"Diese Jacke hast du seit 4 Monaten nicht getragen."

## Visueller Stil
Apple x Luxus-Fashion x Berlin Streetwear
- Cremeweiß und warme Goldtöne
- Lila #7B2FBE als Akzentfarbe
- Cinematic, weich, plastisch, premium
- Kein Dark Theme, kein Comic-Look
- Mockups im /mockups Ordner — immer als Referenz nutzen

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- GSAP
- Claude API claude-sonnet-4-6
- Fashn.ai API
- Next.js API Routes
- Supabase Phase 2
- Vercel

## Regeln
- Erst planen, dann bauen — Freigabe abwarten
- Visuelle Qualität ist Pflicht
- Bestehende Komponenten verbessern, nicht neu bauen
- Nach jedem Schritt Feedback abwarten
- Phase 2 + 3 nicht anfassen bis Phase 1 sitzt
- Fühlt sich wie ein Spiel an — oberste Regel

## UX Prinzipien
- Spaß statt Arbeit
- Bilder statt Listen
- Sofortiges Feedback
- Keine komplizierten Menüs

## Roadmap & Offene Ideen
Ergänzende Leitlinien für die aktuelle Mockup-Umsetzung und spätere Ausbaustufen.
Alle bestehenden Regeln oben bleiben unverändert gültig — dieser Abschnitt ergänzt nur.

### Mockup als Hauptoberfläche
- Das aktuelle Mockup ist die Spezifikation und zugleich die gewünschte App — nicht nur Inspiration.
- Aufgabe ist „das Mockup lebendig machen", nicht „etwas Ähnliches bauen": Render als Hintergrundbild + funktionales DOM-Overlay (wie zuvor bei der Showroom-Bühne).
- Bei Konflikt zwischen bestehender UI und Mockup gewinnt immer das Mockup.
- Alte visuelle UI wird ersetzt, nicht parallel behalten: keine doppelten Layouts, konkurrierenden Panels, Dashboard-Reste, alten Theme-Farben oder parallelen Schrank-Systeme.

### Bestehende Logik bewahren
- Vorhandene Logik bleibt und wird ins Mockup verdrahtet: Upload, Drag & Drop, Store (Zustand), Favoriten, Styles/Style Guide.
- Klare Trennung: bestehende Logik behalten — alte visuelle Oberfläche ersetzen.

### Kategoriestruktur (minimal, Unterkategorien erst nach Klick)
- Hauptkategorien: Oberteile, Unterteile, Outwear, Schuhe, Accessoires.
- Unterkategorien erscheinen erst nach Klick auf eine Hauptkategorie.
- Beispiele Oberteile: T-Shirts, Hemden, Hoodies, Pullover, Tanktops, Blusen.
- Beispiele Accessoires: Uhren, Ketten, Brillen, Ringe, Gürtel, Kopfbedeckungen.

### Später — noch nicht jetzt bauen
- Automatische Kleidungserkennung: hochgeladene Teile sortieren sich selbst in die richtige (Unter-)Kategorie.
- Style DNA, Wetterdaten und Outfit Engine als eigene Ausbaustufen.
- Stage-Themes erweiterbar: Noble, Urban Berlin, Sport, Punk-Rock, Scandinavian.
- Avatar / Virtuelle Anprobe: Fashn.ai/VTO, eigener Avatar, Foto-Upload. Aktuell kein Avatar, kein Dummy.
- Schrank startet leer — keine Seed-/Demodaten.

### Entscheidung Hauptlinie (07.07.2026)
- Hauptlinie ist die Vite-App (`~/Claude/drop-app_ALT_ARCHIV`, Port 5173, Foto-Bühne).
- Die Next.js-App (`~/Projekte/DROP/app`, Port 3002) bleibt als Referenz: dort liegen der fertige 3D-Avatar (Three.js) und eine zweite Bühnen-Implementierung.
- Neue Features werden nur noch auf der Hauptlinie gebaut.
