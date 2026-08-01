# DROP — QA Checklist

Nach jeder Änderung durchgehen (CLAUDE.md: „Nach Änderungen QA durchgehen").

## Mockup & Design
- [ ] Ergebnis entspricht dem Mockup (`/mockups`); bei Konflikt hat das Mockup gewonnen.
- [ ] Keine alten oder parallelen Layouts, Panels, Dashboard-Reste oder alten Theme-Farben.
- [ ] Kein Dark Theme; cremefarben / gold / lila korrekt; premium und cinematic (siehe UI_GUIDELINES.md).

## UX
- [ ] Mobil geprüft; Tap-Flächen in der Daumen-Zone.
- [ ] Jede Kern-Aktion in höchstens zwei Taps erreichbar.
- [ ] Selbsterklärend — kein Tutorial nötig; ein Erstnutzer würde nicht zögern.
- [ ] Fühlt sich wie ein Spiel an, nicht wie Arbeit.

## Funktion & Daten
- [ ] Bestehende Logik (Upload, Store, Favoriten, Styles) unverändert funktionsfähig — keine Regressionen.
- [ ] Schrank startet leer — keine Seed-/Demodaten.
- [ ] Avatar bleibt das Zentrum, an der Plattform verankert.

## Scope
- [ ] Nichts aus Phase 2 + 3 gebaut.
- [ ] Keine eigenmächtige Produktentscheidung; bei Unklarheit wurde nachgefragt.
