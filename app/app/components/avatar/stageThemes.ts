// Bühnen-Themes für die Fashion Stage (Roadmap: Noble, Urban Berlin, Sport,
// Punk-Rock, Scandinavian). Jedes Theme liefert die CSS-Schichten des
// Showroom-Hintergrunds plus Nebel-/Akzentfarbe für die 3D-Szene, damit
// Hintergrund und Avatar-Beleuchtung dieselbe Stimmung haben.
export interface StageTheme {
  id: string;
  label: string;
  emoji: string;
  bg: string;         // Grundverlauf Wand/Raum
  spot: string;       // Deckenspot
  floorGlow: string;  // helle Bodenfläche
  innerGlow: string;  // Lichtinsel unter den Füßen
  vignette: string;   // Randabdunklung
  topShade: string;   // Abdunklung oben
  mannequin: string;  // Tönung der Hintergrund-Mannequins
  fog: string;        // Nebelfarbe der 3D-Szene
  accent: string;     // Rim-Licht-Farbe der 3D-Szene
}

export const STAGE_THEMES: StageTheme[] = [
  {
    id: "noble",
    label: "Noble",
    emoji: "👑",
    bg: "linear-gradient(180deg, #b8a888 0%, #cdbea0 18%, #ddd0b4 38%, #ede4cc 55%, #e8dcc0 75%, #dfd0a8 100%)",
    spot: "radial-gradient(ellipse at 50% 0%, rgba(255,240,200,0.60) 0%, rgba(255,220,140,0.20) 48%, transparent 78%)",
    floorGlow: "radial-gradient(ellipse, rgba(255,240,200,0.80) 0%, rgba(248,220,140,0.45) 50%, transparent 75%)",
    innerGlow: "radial-gradient(ellipse, rgba(255,255,220,0.70) 0%, transparent 70%)",
    vignette: "radial-gradient(ellipse at 50% 55%, transparent 38%, rgba(100,78,45,0.30) 100%)",
    topShade: "linear-gradient(to bottom, rgba(70,50,20,0.32) 0%, transparent 100%)",
    mannequin: "#9c8060",
    fog: "#f0e5d5",
    accent: "#d4a860",
  },
  {
    id: "urban",
    label: "Urban Berlin",
    emoji: "🏙️",
    bg: "linear-gradient(180deg, #14161c 0%, #1d2129 22%, #2a2f3a 45%, #383e4c 65%, #2c313d 85%, #1a1d25 100%)",
    spot: "radial-gradient(ellipse at 50% 0%, rgba(180,200,255,0.38) 0%, rgba(120,150,220,0.14) 48%, transparent 78%)",
    floorGlow: "radial-gradient(ellipse, rgba(140,170,230,0.45) 0%, rgba(90,120,190,0.22) 50%, transparent 75%)",
    innerGlow: "radial-gradient(ellipse, rgba(190,210,255,0.45) 0%, transparent 70%)",
    vignette: "radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(0,0,0,0.55) 100%)",
    topShade: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 100%)",
    mannequin: "#3d4452",
    fog: "#232833",
    accent: "#7fa0d8",
  },
  {
    id: "sport",
    label: "Sport",
    emoji: "⚡",
    bg: "linear-gradient(180deg, #dfe7ee 0%, #e9f0f5 25%, #f4f8fb 50%, #e6edf3 75%, #d5dfe8 100%)",
    spot: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.85) 0%, rgba(190,225,255,0.30) 48%, transparent 78%)",
    floorGlow: "radial-gradient(ellipse, rgba(255,255,255,0.90) 0%, rgba(170,215,255,0.40) 50%, transparent 75%)",
    innerGlow: "radial-gradient(ellipse, rgba(210,240,255,0.75) 0%, transparent 70%)",
    vignette: "radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(60,90,120,0.22) 100%)",
    topShade: "linear-gradient(to bottom, rgba(90,120,150,0.18) 0%, transparent 100%)",
    mannequin: "#93a4b3",
    fog: "#e8eef4",
    accent: "#36a7e8",
  },
  {
    id: "punk",
    label: "Punk-Rock",
    emoji: "🎸",
    bg: "linear-gradient(180deg, #0c0a0e 0%, #17101a 25%, #241426 48%, #301a2c 68%, #1c1018 88%, #0e0a0e 100%)",
    spot: "radial-gradient(ellipse at 50% 0%, rgba(255,60,130,0.40) 0%, rgba(180,40,120,0.16) 48%, transparent 78%)",
    floorGlow: "radial-gradient(ellipse, rgba(255,70,140,0.42) 0%, rgba(160,40,110,0.22) 50%, transparent 75%)",
    innerGlow: "radial-gradient(ellipse, rgba(255,120,170,0.40) 0%, transparent 70%)",
    vignette: "radial-gradient(ellipse at 50% 55%, transparent 32%, rgba(0,0,0,0.62) 100%)",
    topShade: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
    mannequin: "#4a2740",
    fog: "#1c1018",
    accent: "#ff4f8b",
  },
  {
    id: "scandi",
    label: "Scandinavian",
    emoji: "🌿",
    bg: "linear-gradient(180deg, #e9e6df 0%, #f2efe8 25%, #faf8f3 50%, #f0ece3 75%, #e3ddd0 100%)",
    spot: "radial-gradient(ellipse at 50% 0%, rgba(255,255,250,0.80) 0%, rgba(235,230,215,0.30) 48%, transparent 78%)",
    floorGlow: "radial-gradient(ellipse, rgba(255,253,245,0.85) 0%, rgba(230,222,205,0.40) 50%, transparent 75%)",
    innerGlow: "radial-gradient(ellipse, rgba(255,255,250,0.65) 0%, transparent 70%)",
    vignette: "radial-gradient(ellipse at 50% 55%, transparent 42%, rgba(120,110,95,0.20) 100%)",
    topShade: "linear-gradient(to bottom, rgba(140,130,115,0.15) 0%, transparent 100%)",
    mannequin: "#b8ad9c",
    fog: "#f0ede6",
    accent: "#cfc4ae",
  },
];

export const getStageTheme = (id: string): StageTheme =>
  STAGE_THEMES.find((t) => t.id === id) ?? STAGE_THEMES[0];
