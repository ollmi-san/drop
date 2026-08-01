# DROP — Produktbeschreibung

## Was ist DROP?

Eine spielerische Fashion-App, die den eigenen Kleiderschrank in ein digitales Studio verwandelt. Nutzer fotografieren ihre Kleidung, die KI erkennt und benennt sie, im Schrank-Grid lassen sich per Drag & Drop Outfits auf einer stilisierten Schaufensterpuppe zusammenstellen. Die KI schlägt Kombinationen vor, matcht Promi-Looks mit dem eigenen Schrank und hat einen Probier-Modus für Wishlist-Items.

**Zielsatz:** "Eine Version, die man Freunden zeigt – und sie sagen: Ey, das macht echt Spaß."

**Status:** Phase 1 in Umsetzung. Hauptlinie: `drop-app/` (Vite + React + TypeScript).

---

## Persona

**Lina — die ideale Userin**

- 15 Jahre, Berlin, urban, modebewusst
- Problem: „Ich hab nichts anzuziehen" — trotz vollem Schrank
- Freizeit: TikTok scrollen, Reels, Trends
- Wow-Moment: KI zeigt in 30 Sekunden das perfekte Outfit

Bei jeder Design-Entscheidung fragen: **Würde Lina das verstehen? Macht es ihr Spaß?**

---

## Marke & Werte

**Versprechen:** Style ohne Stress.

| | |
|---|---|
| **Hauptwert** | Spielerisch — wie ein Game, nicht wie eine Aufgabe |
| **Anti-Wert** | Niemals langweilig — wenn's sich wie Excel anfühlt: raus |
| **Tonalität** | Cool & knapp — wenig Worte, viel Style |
| **Persönlichkeit** | Kompetenter Buddy — auf Augenhöhe, dem man glaubt |

---

## Visueller Stil

**Vision:** Apple × Luxus-Fashion × futuristisches Mode-Studio.
**Nicht:** dark/grau, Comic, Fortnite-spielerisch, Admin-Dashboard, flach.
**Sondern:** elegant, modern, weich, plastisch, cinematic.

Visuelle Referenzen: [mockups/](./mockups/)

### Atmosphäre
- Helle, warme, **cremefarbene Studio-Atmosphäre** (kein Dark Theme)
- Polierte Plattform mit goldenem Glow-Ring
- Geblurrte Mannequins im Hintergrund mit atmosphärischem Nebel
- Premium-Boutique-Feeling mit leichter Sci-Fi-Note
- Akzentfarbe: Lila (#7B2FBE)

### Licht & Tiefe
- Weiches Spotlight von oben auf den Avatar
- Warme Bodenreflektion unter der Plattform
- Leichte Vignette an den Bildschirmrändern
- Sanfte Schatten unter Kleidung und Plattform
- Leichtes Rimlight hinter dem Avatar
- Subtile Tiefenunschärfe im Hintergrund
- Volumetrische Lichtstrahlen, sanfter Nebel

### Materialien
- Matte Premium-Materialien, satinierte Oberflächen
- Weiche Reflektionen statt harter Spiegelungen
- Hochwertiger Soft-Plastic-Look beim Avatar (matt-cremefarben)
- Leicht glänzende UI-Elemente
- Glassmorphism nur sehr subtil

### Animationen
- Langsame Breathing-Animation der Kamera
- Minimale Idle-Bewegung beim Avatar
- Smooth Hover-Animationen, sanfte Scale- & Fade-Transitions
- Outfit-Wechsel mit softem Glow-Effekt
- Leichte Floating-Bewegung bei Karten
- Goldener Visual-Flash beim erfolgreichen Drag & Drop
- Whoosh + Pop-Sound beim Drop

### UI-Layering
- Mehr Tiefe zwischen Vorder- und Hintergrund
- Hochwertige Schatten, mehrere Layer
- Cinematic statt flach

---

## UX-Leitprinzipien

**Leitsatz:** „Einfacher als jede andere Fashion-App."

**Zielgruppe:** kommuniziert für Lina (15, Berlin), gebaut für alle — Teenager, Erwachsene, Mode-Profis und Mode-Unsichere. *Spitz kommuniziert, breit nutzbar.*
- Selbsterklärend genug für Mode-Unsichere (kein Fachwissen nötig, die KI hilft).
- Kein kindisches Design, das Erwachsene abschreckt — premium, zeitlos, cool.
- Tiefe für Profis vorhanden, aber nie im Weg (erweiterte Optionen hinter einem Tap).

**Bedien-Prinzipien:**
- Jede Kern-Aktion in maximal 2 Taps erreichbar.
- Kein Tutorial nötig — selbsterklärend durch Design.
- Mobile-first, große Tap-Flächen (Daumen-Zone).
- Im Zweifel: ein Element weglassen statt hinzufügen.
- Klare Hierarchie: die Avatar-Bühne ist der Star, alles andere ordnet sich unter.
- KI nimmt Arbeit ab (Erkennung automatisch, keine manuelle Tag-Pflege).
- Test für jedes Element: „Würde ein Erstnutzer hier zögern?" Wenn ja → vereinfachen.

**MVP-Herz (muss ohne Erklärung bedienbar sein und Spaß machen):**
1. Hochladen → KI erkennt (Name, Kategorie) → landet im Schrank.
2. Teil per Drag & Drop auf den Avatar → sitzt sofort, klares Feedback.
3. KI-Stylist „Outfit vorschlagen" → kompletter Look.
4. Bühne wechseln (3 Bühnen).
5. Avatar Weiblich/Männlich umschalten.

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Interaktion | @dnd-kit, vaul (Drawer) |
| KI | Claude Vision (Erkennung + Naming) |
| Sound | Web Audio API (programmatisch generiert) |
| Hosting | Vercel |
| 3D-Avatar (Referenz) | Three.js + React Three Fiber — in Legacy-App `app/` |
| Datenbank (Phase 2) | Supabase |
| Try-On (Phase 3) | Fashn.ai |

---

## Phase 1 — MVP

### Feature 1 – 3D-Avatar-Bühne
Stilisierte, matt-cremefarbene Schaufensterpuppe, drehbar per Drag/Swipe. Multi-Puppen-System (Puppe 1, Puppe 2, +). Männlich/Weiblich-Toggle ändert Proportionen. Polierte Plattform mit goldenem Glow-Ring, atmosphärischer Nebel im Hintergrund.

### Feature 2 – KI-Upload & Erkennung
Foto vom Gerät oder Live-Aufnahme. Claude Vision identifiziert Kleidungsstück, Name, Kategorie, Konfidenz-Score. Automatische Farb-Extraktion fürs 3D-Rendering. 3-Stufen-Upload: Quelle → Analyse → Bestätigen. Quelle markieren: Eigen / Im Laden / Im Internet. Editierbare Namen in DE/EN.

### Feature 3 – Drag & Drop mit Smart-Snapping
Klamotte aus dem Schrank greifen, auf den Avatar ziehen. Auto-Snap zum richtigen Slot. Whoosh + Pop-Sound, goldener Visual-Flash als Bestätigung. Slot-Karten zeigen aktuelles Outfit. Doppelklick als Quick-Equip-Alternative.

### Weitere MVP-Bausteine
- Outfit-System & Stats
- Sound-Feedback (Web Audio API)

---

## Phase 2 — SCALE (nicht jetzt)

**Aus MVP verschoben:**
- Feature 4 – Promi-Looks Match-Engine: 5 Promis (Hailey Bieber, Bella Hadid, Zendaya, Timothée Chalamet, Rosalía). Algorithmus matcht Outfits über Keyword + RGB-Farbähnlichkeit. Match-Score in Prozent. „Look anziehen" landet Treffer auf dem Avatar.
- Feature 5 – Wishlist & Probier-Modus: Im Laden fotografieren, virtuell anziehen, testen ob es passt. Probier-Dauer: 1 / 7 / 30 Tage / Permanent. Auto-Cleanup, Countdown-Badge, Gekauft-Button.
- Feature 6 – Kontext-Engine: Dropdowns für Anlass, Aktivität, Wetter. KI optimiert das Outfit für den Moment.

**Weitere Phase-2-Themen:**
Echtes 3D-Avatar-Modell · Cinematische Kamerafahrten · Wetter-API & Kalender-Modus · Outfit-Log & „60-Tage"-Erinnerung · Verschiedene Körpertypen · Community & Sharing · Vinted & Zalando Integration · Auth & Premium-Tier · Walk-in Schrank.

## Phase 3 — FUTURE (nicht jetzt)

Fashn.ai fotorealistisches Try-On · Flammen-Ranking durch Community · Selfie-Gesicht auf Avatar · Micro-Matching & Fit-Logik · Video-Export für Social Media · Gamification (Posen, Saisons) · Limited Edition Avatare · In-Store GPS-Scanner · Kompliment-System · Gesichtsausdrücke.

---

## Monetarisierung

**Free** – sofort spielbar, vollwertig:
- Eigener Schrank ohne Limit
- Drag & Drop Outfits
- 2–3 Avatare
- Hintergrund-Mannequins geblurrt
- Einfache KI-Vorschläge
- Wishlist mit Limit

**DROP Lina — 2,99 €/Monat:**
- Hintergrund wird scharf, Mannequins anklickbar
- Unbegrenzte Avatare und Outfits
- Erweiterte KI-Stylist-Empfehlungen
- Promi-Match-Erinnerungen
- Vinted & Zalando ohne Layer

**DROP Family — 9,99 €/Monat:**
- Alles aus DROP Lina
- Bis zu 4 Kinder-Konten unter einem Account

**Premium-Launch:** Erst nach 100 aktiven Usern freischalten.

**Zusätzlich:** Affiliate Revenue über Vinted, Zalando, Amazon.

**Psychologie:** „Hier gibt es mehr zu entdecken" – kein Frust, nur Neugier.

---

## Kosten

Prototyp = $0 zum Start. Claude API ~$0.003/Anfrage. Fashn.ai ~$0.05/Bild (erst Phase 3).
