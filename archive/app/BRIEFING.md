# DROP. — Feature Briefing & Treatment

```
================================================================
DROP. — DEIN STYLE. DEIN AVATAR.
Fashion-App · Treatment & Feature-Briefing
Phase 1 — MVP
Stand: Mai 2026
================================================================
```

---

## 1. KONZEPT

DROP ist eine Fashion-App, die deinen echten Kleiderschrank in eine spielerische 3D-Welt verwandelt. Du fotografierst deine Klamotten, lädst sie hoch und stellst auf einer stilisierten Schaufensterpuppe Outfits zusammen. Eine integrierte KI hilft beim Kombinieren, schlägt Looks vor und matcht deinen Stil mit dem aktueller Promis.

**Die Atmosphäre:** Wie ein digitales Modegeschäft mit Privatzugang. Warmes Studio-Licht, polierte Plattform, geblurrte Schaufensterpuppen im Hintergrund. Keine Excel-Listen, kein Verwaltungs-Feeling. Spaß. Visuell. Schnell.

**Zielgruppe:** Jeder, der mit seiner Garderobe kreativ umgeht — Teenager, Studierende, Erwachsene. Stil: Berlin · Urban · Futuristisch · Premium.

---

## 2. TECH STACK

| Layer | Technologie |
|---|---|
| Frontend | Next.js 16 + React + TypeScript |
| 3D-Rendering | Three.js + React Three Fiber + Drei |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| KI (Naming + Vorschläge) | Anthropic Claude Sonnet 4.5 (Vision + Text) |
| Sound | Web Audio API (programmatisch generiert) |
| Hosting | Vercel |
| Datenbank (Phase 2) | Supabase |
| Try-On (Phase 3) | Fashn.ai API |

---

## 3. PHASE 1 — DAS FUNKTIONIERT JETZT

### 3.1 Hauptansicht — der Schrank-Tab

**Drei-Spalten-Layout** im Stil eines Boutiquen-Showrooms:

**Linke Spalte: Kleiderschrank**
- 24 vorgeladene Beispiel-Items mit eigens generierten SVG-Produktillustrationen (E-Commerce-Look)
- 7 Kategorie-Filter (Alle, Wishlist, Oberteile, Unterteile, Kleider, Schuhe, Jacken, Accessoires) — jede mit Live-Counter
- Live-Suchfeld
- Settings-Dropdown: Sortierung (Neueste / Favoriten / A–Z), Outfit zurücksetzen
- Upload-Button mit vollwertigem Upload-Flow
- Smart KI-Tipp-Banner, der sich an die Schrank-Größe anpasst (3+, 6+ Teile)

**Mittelspalte: Avatar-Bühne**
- Stilisierte Schaufensterpuppe in matt-cremefarbenem Look, einzeln drehbar per Drag
- Studio mit Spotlight von oben, vier Decken-Spots, weicher Bodenreflexion
- Vier statische Hintergrund-Mannequins, leicht geblurrt durch atmosphärischen Nebel
- Polierte runde Plattform mit goldenem Glow-Ring
- Männlich/Weiblich-Toggle ändert Proportionen und Silhouette
- Multi-Puppen-System (Puppe 1 / Puppe 2 / +) — verschiedene Avatare wählbar oder erstellbar

**Rechte Spalte: KI-Stylist-Panel**
- Begrüßungs-Chatnachricht
- Tagesaktuelle Wetteranzeige
- 3 dynamisch aus deinem eigenen Schrank generierte Outfit-Vorschläge mit Match-Score
- "Anziehen"-Button bringt das vorgeschlagene Outfit sofort auf den Avatar
- Refresh-Button für neue Vorschläge
- Daumen-Feedback hoch/runter

---

### 3.2 Upload & KI-Erkennung

**Vollwertiger Upload-Workflow** mit drei Stufen:

1. **Quelle wählen:** Foto vom Gerät oder Live-Kamera-Aufnahme (z.B. im Laden)
2. **KI-Analyse:** Anthropic Claude Vision identifiziert das Kleidungsstück — Name, Kategorie und Konfidenz-Score
3. **Bestätigen:**
   - Name (DE + EN) editierbar
   - Kategorie aus 6 Optionen
   - **Quelle:** Eigenes Teil / Im Laden / Im Internet
   - **Dauer:** Permanent / 1 Tag / 7 Tage / 30 Tage testen
   - Optional: Laden-Name oder Web-Link

Dominant-Color-Extraction läuft im Hintergrund: die Hauptfarbe des Fotos wird automatisch erkannt und auf der Puppe gerendert.

---

### 3.3 Drag & Drop mit Smart-Snapping

- Klamotte aus dem Schrank greifen, auf den Avatar ziehen
- Beim Drag: gestrichelter lila Rahmen + "Hier loslassen"-Banner
- **Auto-Snap zum richtigen Slot:** Top, Bottom, Shoes oder Accessory — basierend auf Kategorie
- Akustisches Feedback (Whoosh + Pop) + visueller goldener Flash beim Drop
- Doppelklick als Alternative für Quick-Equip
- Slot-Karten rechts neben Avatar zeigen aktuelles Outfit mit Mini-Vorschau-Bild
- X-Button entfernt einzelnes Item, Sound-Feedback

---

### 3.4 3D-Visualisierung der Klamotten

Die stilisierte Schaufensterpuppe nimmt die **Farben der angezogenen Klamotten** an:

| Slot | Auswirkung am Avatar |
|---|---|
| Top | Torso, Schultern, Arme |
| Bottom | Hüfte und Beine |
| Shoes | Schuhe (Box-Form) |
| Accessory | Spezifische 3D-Form je nach Typ |

**Accessoires werden typgerecht visualisiert:**

| Typ | Position | Form |
|---|---|---|
| Cap | Auf dem Kopf | Halbkugel mit Visier |
| Sonnenbrille | Vor dem Gesicht | Zwei Linsen mit Steg |
| Kette | Um den Hals | Torus mit Anhänger |
| Tasche | An Hüft-Seite | Box mit Riemen und Schnalle |
| Uhr | Linkes Handgelenk | Zylinder |
| Gürtel | Taille | Torus |

---

### 3.5 Kontext-Engine

Drei Dropdown-Tags unter dem Avatar definieren den Kontext deines Outfits:

- **Anlass:** Büro · Date · Freizeit · Sport · Party · Shopping · Uni · Festlich (8 Optionen)
- **Aktivität:** Fahrrad · Spaziergang · Auto · U-Bahn · Tanzen · Essen · Kino · Park · Stehend · Sitzend (10 Optionen)
- **Wetter:** Sonnig · Bewölkt · Regen · Schnee · Wind · Warm · Kalt + manueller Refresh-Button (7 Optionen)

Der Button **"Outfit anpassen lassen"** öffnet ein Modal mit Kontext-Übersicht. Auf Klick wendet das System smarte Regeln an:
- Bei Kälte → Jacke/Mantel/Hoodie wird gewählt
- Bei formellem Anlass → Blazer + Chino + Loafer
- Bei Sport → Tank + Jogger + Sneaker

---

### 3.6 Outfit-System

- **Speichern:** Modal mit 4-Slot-Vorschau und Namensvergabe
- **Outfits-Tab:** Alle gespeicherten Outfits als Cards mit Produktbildern, Datum, Stern-Favorit
- **Laden:** Klick auf eine Outfit-Card → komplettes Outfit landet auf Avatar, Animation
- **Löschen** mit Bestätigung
- **Teilen:** Web Share API (WhatsApp, Instagram, Mail) — Fallback: Link kopieren

---

### 3.7 Promi-Looks

Der **Inspiration-Tab** ist mehr als Style-Boards. Er ist die **Match-Engine zwischen Promi-Outfits und deinem eigenen Schrank.**

**5 Promis** mit aktuellen Looks:
- Hailey Bieber — Y2K Coffee Run, New York
- Bella Hadid — Off-Duty Street, Paris
- Zendaya — Elegant Minimal, Los Angeles
- Timothée Chalamet — Eclectic Soft, Mailand
- Rosalía — Urban Edgy, Barcelona

**Pro Promi-Look:**
- 4 Outfit-Bestandteile mit Beschreibung und Farb-Swatch
- Match-Score in Prozent — wie viele dieser Teile du selbst besitzt
- Algorithmus: Keyword-Matching + RGB-Farbähnlichkeit gegen deine Wardrobe
- "Look anziehen" → die gefundenen Matches landen auf deinem Avatar
- "Was dir noch fehlt" → Liste mit fehlenden Pieces + Phase-2-Shopping-Vorschau
- Visuelle Score-Ampel: Grün (75%+), Gelb (40–74%), Rot (<40%)

**Sub-Tab "Was ist angesagt":** 6 aktuelle Trend-Konzepte (Y2K Revival, Quiet Luxury, Coastal Grandma, Mob Wife, Berlin Tech, Soft Boy) mit Hashtag und Kurzbeschreibung.

---

### 3.8 Wishlist & Probier-Modus

Ein Kernfeature, das DROP von klassischen Schrank-Apps unterscheidet.

**Workflow:**
1. Item im Laden fotografieren oder aus dem Internet hochladen
2. Quelle markieren (Laden / Web), optional Laden-Name oder Link hinterlegen
3. Probier-Dauer wählen: 1 / 7 / 30 Tage
4. Item landet im Schrank — markiert mit:
   - Orangem Rahmen statt grauem
   - Live-Countdown-Badge (z.B. "5d", "2h")
   - Quellen-Icon (Laden / Globus)
5. Während der Probier-Phase wie jedes andere Teil verwendbar — auf Avatar ziehen, Outfits bauen, Promi-Matches sehen
6. **Hover über Item zeigt zwei Aktionen:**
   - **Gekauft** → wird permanent in den Schrank übernommen
   - **Verwerfen** → wird gelöscht
7. **Auto-Cleanup:** Nach Ablauf verschwindet das Item automatisch (Hintergrund-Check alle 60 Sekunden). War es gerade angezogen, wird es vom Avatar entfernt.

Der Wishlist-Filter im Schrank zeigt nur Probier-Items mit Banner und Anleitung.

---

### 3.9 Stats-Tab

Persönliche Schrank-Statistiken auf einen Blick:

- Teile im Schrank (Live-Count)
- Favoriten
- Outfits erstellt
- Style-Score (Berechnung Phase 2)
- Kategorien-Verteilung als Balken-Diagramm

---

### 3.10 Sound & Haptik

Komplett **programmatisch generiert** über die Web Audio API — keine Audio-Files, keine externen Abhängigkeiten:

- **Drop-Sound:** Sinus-Whoosh (800 Hz → 180 Hz) + Triangle-Pop (220 Hz → 440 Hz)
- **Click-Sound:** Square-Wave Blip
- An/Aus-Toggle in der TopBar
- Akustisches Feedback bei: Item anziehen · Item entfernen · Outfit speichern · Bottom-Nav · Buttons

---

### 3.11 Globale UI-Elemente

**TopBar:** Logo · 4 Haupt-Tabs (Schrank · Outfits · Inspiration · Stats) · Sound-Toggle · Bell mit Notification-Indikator · Geschlechts-Toggle

**SideNav (links):** 6 Icons — Schrank · Puppen · Kombinieren · Kalender · Favoriten · Mehr

**BottomNav:** Home · Community · Inbox · Shop · Profil — jeder Button öffnet Modal mit Phase-2-Vorschau und Beschreibung

---

## 4. PHASE 2 — DIE NÄCHSTE STUFE

### 4.1 Visuelle Aufrüstung
- **Echtes 3D-Modell** statt stylisierter Puppe (Ready Player Me oder Avaturn)
- **Cinematische Kamerafahrten** beim Outfit-Wechsel
- **Walk-In-Schrank-Animation** als räumlicher Übergang
- **Wetter-Animation** im Studio-Hintergrund (Regen, Schnee, Wind)
- **HDR-Beleuchtung** mit echter Bodenreflexion

### 4.2 Smart Suggestions
- **Echte Wetter-API** (OpenWeather) statt Random
- **Kalender-Modus** mit Wochenplanung — pro Tag ein Outfit
- **Outfit-Log** — historische Tracker (was hattest du wann an)
- **"60 Tage nicht getragen"** Erinnerung
- **Verschiedene Körpertypen** (Schlank · Athletisch · Curvy · Kid)

### 4.3 Community & Sharing
- **Community-Tab** mit Outfit-Posts, Likes, Kommentaren
- **Inbox** — KI-Wochen-Vorschläge, Match-Notifications
- **Push-Notifications** "Neues Match"
- **Sharing** über WhatsApp, Instagram, TikTok

### 4.4 Shopping
- **Vinted-Integration** — fehlende Wishlist-Teile direkt kaufen
- **Amazon / Zalando Affiliate** in KI-Vorschlägen
- **In-Store Scanner** mit GPS-Erkennung lokaler Shops
- **Echte Promi-Daten-API** (Just Jared, Vogue) statt Hardcoded

### 4.5 Bildung & Account
- **Fashion-Lexikon** (Ankerpiece, Oversized, Layering, Mood-Boards...)
- **Auth + Supabase** Persistence für Schrank, Outfits, Wishlist
- **Premium-Tier** aktivierbar — schärfere Hintergrund-Mannequins, unbegrenzte Avatare

---

## 5. PHASE 3 — DIE VISION

- **Fashn.ai-Integration** rendert deine Klamotten **fotorealistisch** auf den Avatar — wie ein echtes Mode-Foto, mit Falten, Schatten, Stoff-Drape
- **Flammen-Ranking** (1–5 Flammen pro Outfit von der Community)
- **Selfie-Gesicht** auf Avatar-Kopf legen
- **Micro-Matching** — Farbdetails wie Knöpfe, Steppungen, Akzente
- **Fit-Logik** mit Erklärung warum etwas zusammenpasst
- **Video-Export** als Walkthrough für Social Media
- **Gamification** — freischaltbare Posen, Saisons, Limited Editions

---

## 6. MONETARISIERUNG

**Free**
- Eigener Schrank, Drag & Drop, Outfits erstellen
- 2–3 Avatare maximal
- Hintergrund-Mannequins geblurrt
- Einfache KI-Vorschläge
- Wishlist mit Limit

**Premium**
- Hintergrund wird scharf, Mannequins anklickbar
- Unbegrenzte Avatare und Outfits
- Erweiterte KI-Stylist-Empfehlungen
- Promi-Match Erinnerungen ("Dein Liebling hat was Neues an")
- Vinted/Zalando-Integration ohne Werbe-Layer

**Affiliate-Revenue** über Vinted, Zalando, Amazon Links bei Wishlist-Items.

---

## 7. WAS DROP EINZIGARTIG MACHT

| Pain Point der Branche | DROP-Antwort |
|---|---|
| Schrank-Apps fühlen sich an wie Tabellen | 3D-Studio-Atmosphäre, Sound, spielerisch |
| Keine Verbindung zwischen "ich hab nichts anzuziehen" und Realität | Wishlist + Probier-Modus + Promi-Match |
| Vorschläge sind generisch | KI bezieht sich auf deine echten Items |
| Kaufentscheidung ist impulsiv | 1/7/30-Tage Test mit Auto-Cleanup |
| Trends sind weit weg | Promi-Matches mit deinem Schrank |

---

```
================================================================
ENDE BRIEFING · DROP. — Mai 2026
================================================================
```
