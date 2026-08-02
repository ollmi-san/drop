# DROP – UI Design System

Dieses Dokument beschreibt **ausschließlich das visuelle System von DROP**. Keine Produktvision. Keine Roadmap. Keine Technik. Keine Implementierungsdetails. Nur Design.

Es ist die **einzige Quelle der Wahrheit** für das gesamte visuelle System und gilt verbindlich für Entwickler:innen und für zukünftige KI-Agenten. Grundlage sind ausschließlich der heutige Stand der Mobile-App und die aktuellen Mockups (`/mockups`).

**Zwei Gesetze, die alles überschreiben:**
1. **Mockups haben immer Vorrang vor Interpretation.**
2. **Mobile hat immer Vorrang.**

---

## 1. Design Philosophy

DROP fühlt sich an wie **Apple × Premium Fashion × modernes Lifestyle-Produkt**.

Die Oberfläche ist: **ruhig · hochwertig · zeitlos · elegant · modern · reduziert · emotional**.

Sie ist **niemals**: Dashboard · Admin-Tool · Excel · Comic · Gaming-UI · Fortnite · Hacker-Theme · überladen.

**Leitsatz:** Jedes UI-Element muss Ruhe ausstrahlen. Weniger ist mehr. Im Zweifel ein Element weglassen.

---

## 2. Mobile First

DROP wird **ausschließlich Mobile First** entwickelt. Desktop dient lediglich der Entwicklung, niemals als Designziel.

- Jede Designentscheidung wird zuerst für das Smartphone getroffen.
- Jede neue Komponente muss zuerst auf Mobile perfekt funktionieren, bevor irgendetwas anderes zählt.
- Ergonomie: Ein-Hand-Bedienung, Daumen-Zone, Tap-Flächen mindestens 44 × 44 px, Safe-Area oben und unten immer respektiert.

---

## 3. Color System

Farben werden als **Design-Tokens** verwendet – niemals als lose Hex-Codes im UI. Aktiv ist das helle **Marken-Theme** (cremeweiß / gold / lila). Frühere dunkle Paletten sind ungültig.

**Marken-Grundsatz:** Die Marke lebt aus **Schwarz + warmem Creme + Gold**. **Lila** wird **ausschließlich** für KI, Premium oder besondere Hervorhebungen eingesetzt. Kein buntes Interface. Keine kalten Grautöne – alle Neutraltöne sind warm getönt. Keine zufälligen Farben.

| Token | Wert | Verwendung |
|---|---|---|
| Background | `#FAF7F2` | Grundfläche der App |
| Primary Surface | `#F2ECE1` | Standard-Flächen |
| Secondary Surface | `#E9E0D2` | tiefer liegende Flächen |
| Elevated Surface | `#FFFFFF` / `#FAFAF8` | Karten, erhabene Elemente (mit Shadow) |
| Stage | warmes Creme + bühnen-eigene Atmosphäre | Bühnenfläche (siehe §5) |
| Glass | `rgba(250,245,238, 0.88 / 0.65 / 0.42)` + Blur | Bottom Sheet & Overlays (Milchglas, 3 Stufen) |
| Border | `rgba(0,0,0, 0.06 – 0.10)` | feine Trennlinien |
| Shadow | `rgba(0,0,0, 0.10 – 0.14)`, weich & warm | Tiefe – niemals hart |
| Primary Text | `#1C1A22` (Ink) | Überschriften, wichtige Texte |
| Secondary Text | `#6B6770` | Sekundärtext |
| Muted Text | `#9B96A2` | Hinweise, inaktive Labels |
| Accent Gold | `#C9A86A` (soft `#E6D6B8`) | Wärme, Glow, Premium, Erfolgs-Flash |
| Accent Purple | `#7B2FBE` (dark `#6325A0`, soft `#F1E7FB`) | **nur** KI · Premium · aktive Auswahl |
| Success | `#5E8C6A` | Bestätigung (gedämpft) |
| Warning | `#C08A2E` | Warnung (warm, kein Neon) |
| Error | `#B4463C` | Fehler (gedämpftes Ziegelrot) |

**Schwarz** (`#1C1A22` / `#0E0E12`) trägt die Struktur: aktive Navigation, Kategorie-Chips, Primär-Buttons und Text.

---

## 4. Navigation

Eine **dauerhaft sichtbare Bottom-Navigation** mit fünf Zielen – auf jedem Screen identisch. Sie ist fester Bestandteil des Produkts, kein Overlay.

| # | Ziel |
|---|---|
| 1 | Home |
| 2 | Kleiderschrank |
| 3 | Bühne |
| 4 | Style Guide |
| 5 | Profil |

- Apple-artige Tab-Bar: heller, leicht transparenter Glas-Hintergrund, feine obere Trennlinie.
- Icons dünn und elegant; aktives Ziel in Ink (Schwarz), inaktive in Muted.
- Große Tap-Flächen. Safe-Area unten immer freigehalten.

---

## 5. Stage System

Die **Bühne ist das Herz der App** und der emotionale Mittelpunkt. Der Avatar steht immer in ihrer Mitte.

**Aktuelle Bühnen:** My Room · Luxury Boutique · Berlin Loft. *Weitere folgen.*

Jede Bühne besitzt eine **eigene Atmosphäre, eigene Farbwelt, eigene Plattform und eigenes Licht** – ein realer, fotografischer Raum, kein flacher Hintergrund.

- Bühnenwechsel: **langsamer Fade + sanfter Kameraschwenk**. Die Bühne bleibt dabei immer der Mittelpunkt.
- Der Bühnen-Selector liegt als dezentes Glas-Element über der Bühne (oben), inklusive Markierung für Premium- und kommende Bühnen.
- **Verbindlich:** Die Bühne wird **niemals an den Avatar angepasst** – der Avatar wird korrekt innerhalb der Bühne positioniert (siehe §6).

---

## 6. Avatar System

Der Avatar ist die Hauptfigur. **Der frühere „Soft-Plastic"-Avatar ist ungültig.**

Heute gilt:
- **realistischer Avatar** mit **fotorealistischem Gesicht**
- **echte Kleidung**, **natürliche Pose**
- **exakt mittig** auf der Bühne, **niemals abgeschnitten** – immer vollständig sichtbar
- die Bühne dient als Präsentationsfläche

**Positionierung (verbindlich):** Mockups haben immer Vorrang. Die Bühne wird nie an den Avatar angepasst; der Avatar wird korrekt in der Bühne positioniert. Ein Tap auf den Avatar legt das aktuelle Teil wieder ab.

---

## 7. Bottom Sheet

Das Bottom Sheet ist das zentrale Bedien-Element auf der Bühne – Apple-artig, aus **Milchglas**.

**Verhalten (unverrückbar):**
- Die **Bühne bleibt statisch**, der **Avatar bleibt immer sichtbar**. Nur das **Sheet bewegt sich**, der **Inhalt scrollt**. **Die App selbst bewegt sich niemals.**
- Drei Höhen-Stufen (Snap Points):
  1. **Eingeklappt (~30 %):** nur der Griff sichtbar, Avatar ~90 % der Höhe, die Bühne wirkt groß und beeindruckend.
  2. **Standard (~60 %):** Avatar ~2/3, Kategorie-Chips und „Meine Teile" horizontal scrollbar, kein vertikales Scrollen nötig.
  3. **Voll ausgezogen (~88 %):** komplettes Schrank-Grid, große Karten mit schönen Fotos, Premium-Look, kein Listen-Stil.

**Optik:** cremefarbenes Milchglas mit weichem Blur, feiner Griff, weiche Schatten, großzügige obere Rundung. Die **Glas-Transparenz ist in drei Stufen einstellbar** (dezent · normal · deutlich), sodass die Bühne mehr oder weniger durchscheint.

---

## 8. Wardrobe

Die Garderobe wird **ausschließlich Tap-basiert** bedient. **Drag & Drop wird nicht mehr dokumentiert und nicht mehr verwendet.**

**Gesten:**
- **Tap** – Teil auswählen / anziehen
- **Double Tap** – Schnellaktion (z. B. direkt anziehen)
- **Long Press** – nur wenn sinnvoll (z. B. Kontextaktion)

**Anzieh-Flow (Tap-to-Select):**
1. Teil antippen → kurzes Highlight
2. Bestätigung → Teil ist ausgewählt
3. Avatar zieht an → ersetzt ggf. das Teil im gleichen Slot
4. Avatar antippen → Teil wird wieder abgelegt

**Ziel:** Alles funktioniert mit **einer Hand**. **Maximal zwei Taps** bis zur gewünschten Aktion.

Kategorien als horizontal scrollbare Chips (aktiv in Schwarz), Unterkategorien in Lila. Teile als hohe, quadratische Karten mit schönem Produktfoto; die ausgewählte Karte trägt einen Lila-Rahmen und einen Stern.

---

## 9. Style Guide

Der Style Guide ist ein **Fashion-Lexikon**. Er **erklärt Begriffe** und hilft Nutzer:innen, Mode besser zu verstehen. Er **ersetzt keine KI** – er ist Wissen, keine Empfehlung. Optik: ruhige Lese-Oberfläche im Marken-Look, dieselbe Karten- und Typo-Sprache wie der Rest der App.

---

## 10. Feedback

DROP besitzt einen festen **Feedback-Kanal** als Bestandteil des Produkts. Tester:innen hinterlassen Ideen und Verbesserungsvorschläge **direkt in der App**.

- Erreichbar über einen dezenten Feedback-Button (Sprechblasen-Icon) im Bühnen-Header.
- Öffnet einen Apple-artigen Dialog aus cremefarbenem Glas: kurze Frage, Textfeld, ein klarer Primär-Button „Feedback senden".
- Ton: freundlich, knapp, einladend.

---

## 11. Motion Design

Alle Animationen orientieren sich an **Apple**: **ruhig · weich · hochwertig · niemals hektisch**. Dieses Kapitel ist die einzige Quelle für Bewegungs-Timing; einzelne Komponenten verweisen hierher.

| Bewegung | Charakter |
|---|---|
| **Fade** | weiche, langsame Ein- und Ausblendung |
| **Scale** | dezentes Zusammendrücken beim Tap |
| **Blur** | Glas-Übergänge, Fokuswechsel |
| **Glass** | weiches Auf- und Abblenden von Milchglas |
| **Spring** | natürliche, gedämpfte Feder (Sheet, Chips) |
| **Sheet Motion** | gefedertes Snappen zwischen den drei Stufen; Inhalt scrollt, App bleibt fix |
| **Stage Motion** | langsamer Fade + Kameraschwenk beim Bühnenwechsel |

Grundregel: lieber eine Bewegung zu wenig als eine zu viel. Nichts blinkt, nichts springt hart.

---

## 12. Components

Verbindliche Referenz der Bausteine. Feature-Komponenten sind in ihren eigenen Kapiteln vollständig beschrieben; hier steht die gemeinsame Sprache – **eine Definition pro Komponente, keine Doppelung.**

- **Navigation** → §4 (Bottom-Tab-Bar, 5 Ziele, immer sichtbar).
- **Buttons** – Primär: Ink-Fläche, weiße Schrift, weiche Rundung, leichtes Zusammendrücken beim Tap. Sekundär: Glas oder Outline auf Creme. Immer große Tap-Fläche, ein klarer Primär-Button pro Screen.
- **Cards** – helle, erhabene Fläche (Elevated Surface), große weiche Ecken, weicher warmer Schatten, großzügiger Innenabstand; Karten schweben leicht.
- **Chips** – Pillen für Kategorien: aktiv in Ink (Schwarz), inaktiv dezent; Unterkategorien-Chips in Lila; horizontal scrollbar.
- **Bottom Sheet** → §7 (Milchglas, 3 Stufen).
- **Stage Selector** → §5 (Glas-Element über der Bühne, Premium-Markierung).
- **Avatar** → §6 (realistisch, mittig, nie abgeschnitten).
- **Wardrobe Cards** → §8 (Produktfoto, Auswahl in Lila).
- **Dialogs** – cremefarbenes Glas, von unten einfahrend, abgerundet, ein Primär-Button; verdunkelter Hintergrund; schließbar per Tap außerhalb oder ×.
- **Feedback** → §10.

Grundregel: Bestehende Komponenten werden **erweitert**, nicht neu erfunden.

---

## 13. Layout System

- **Großzügiger Weiß-/Cremeraum** – Luft ist Teil des Designs.
- **Klare Hierarchie:** Ein Bildschirm hat immer **genau einen klaren Fokus**.
- **Der Avatar ist der Mittelpunkt** – alles ordnet sich ihm unter.
- Das **Bottom Sheet verdeckt niemals den kompletten Avatar** – er bleibt in jeder Stufe sichtbar.
- Die **Navigation bleibt sichtbar**.
- **Home** ist ein ruhiger, emotionaler Scroll-Feed (Hero + Karten wie „Outfit des Tages", „Fashion Guide", „Neueste Teile", „Bühne wählen"); die **Bühne** ist der funktionale, fokussierte Screen zum schnellen Anziehen.
- Die volle sichtbare Höhe wird genutzt, Safe-Area oben und unten respektiert – nichts wird abgeschnitten.

---

## 14. Design Rules

**Dieses Kapitel ist verbindlich.**

1. **Mockups haben immer Vorrang.**
2. **Mobile hat immer Vorrang.**
3. **Keine kreative Eigeninterpretation.**
4. Bestehende Komponenten werden **erweitert statt neu erfunden**.
5. Neue Screens **lehnen sich optisch an bestehende Screens an**.
6. **Konsistenz ist wichtiger als Individualität.**
7. Jede Änderung muss das bestehende Design **verbessern** und darf **keine** bestehende Designregel verletzen.
8. **Die Bühne bleibt der emotionale Mittelpunkt der App.**
