# Workflow — Größere Features

Gilt wenn ein Feature als eigenständige Einheit gebaut wird (neue Komponente, neues System, substanzielle Erweiterung). Bei Bug-Fixes, Tippfehlern oder Mini-Anpassungen nicht anwenden — direkt bauen.

---

## 1 — Klären vor dem Bauen

Vor dem ersten Code: offene Fragen stellen, bis das Feature wirklich verstanden ist. Annahmen explizit benennen. Lieber eine Frage zu viel als Stunden in die falsche Richtung.

## 2 — Vertical Slicing

Features als komplette, testbare Mini-Einheiten bauen (UI + Logik + Daten zusammen) — nicht erst alle UIs, dann alle Logik, dann alle Daten. Sofortiges Feedback statt spätes Chaos.

## 3 — Plan vor Implementierung

Kurzer Plan (3–6 Zeilen): Was wird gebaut, in welcher Reihenfolge, was ist out-of-scope. Erst nach Freigabe schreiben.

## 4 — Markdown-Anker

Pro Feature eine kurze Notiz unter `_workflow/<feature>.md` mit Entscheidungen, offenen Punkten, Erkenntnissen. Dient als Wissensanker bei Kontext-Resets. Datei wird am Ende des Features wieder gelöscht.

## 5 — Recap & Aufräumen am Ende

Nach jedem Feature: kurz erklären, was funktioniert, was bewusst weggelassen wurde, was als Nächstes ansteht. Code auf historisches Chaos prüfen — alte Stellen entfernen, die durch das neue Feature obsolet sind.

## 6 — Kontext-Resets aktiv vorschlagen

Werden Antworten merklich schwächer oder die Session sehr lang (Faustregel: ~100k Tokens), Reset vorschlagen. Vorher den Stand in der relevanten `_workflow/<feature>.md` sichern, damit nach dem Reset alles wieder da ist.
