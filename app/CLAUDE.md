@AGENTS.md

# DROP App — Codebasis

Der vollständige Projektkontext steht im **Parent-Verzeichnis** (`../CLAUDE.md`, `../PROJECT.md`, `../WORKFLOW.md`).

## Pfade
- Dev-Server: `npm run dev` → http://localhost:3000
- Komponenten: `app/components/`
- Store: `app/store/` (Zustand — useWardrobe, useApp)
- KI: `app/api/ai/name/` (Claude Vision → Kategorie + Name)
- Avatar: `app/components/avatar/` (Three.js, React Three Fiber)
- Schrank: `app/components/wardrobe/`
- Lib: `app/lib/` (aiNaming, extractColor, soundFx, productSvg)

## Stack
Next.js 16 · React Three Fiber · Three.js · Zustand · Tailwind v3 · lucide-react
