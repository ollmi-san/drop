// Fashion Stages — final GENAU 3 Bühnen (Renders: mockups/stages/, 1024×1536,
// volle Auflösung in public/stage/). „premium" ist aktuell reine Anzeige;
// die echte Freischaltung kommt mit Accounts (Supabase, Phase 2).
export interface StageTheme {
  id: string;
  label: string;
  emoji?: string;      // kleines Symbol im Theme-Umschalter
  premium?: boolean;   // Premium-Welt (Anzeige-Badge)
  dark?: boolean;      // dunkle Bühne → helle Hinweistexte (CSS-Fallback)
  backdrop: string;    // Wand / Hintergrund (CSS-Fallback)
  floor: string;       // Boden (CSS-Fallback)
  podium: string;      // Podest-Deckfläche (CSS-Fallback)
  podiumSide?: string; // Podest-Seitenkante (CSS-Fallback)
  glow: string;        // Lichtakzente (CSS-Fallback)
  image?: string;      // Foto-Render als Bühne (ersetzt die CSS-Kulisse)
}

// Feste, bühnenunabhängige Avatar-Darstellung: Größe, Fußpunkt und Optik sind
// auf JEDER Bühne identisch — nur der Hintergrund wechselt. Bewusst kompakt
// gehalten, damit die Bühnen-Atmosphäre gut sichtbar bleibt (Balance
// Avatar ↔ Hintergrund). Zentral hier definiert; Desktop & Mobile lesen dieselben Werte.
export const AVATAR_LAYOUT = {
  bottom: '24%',                                    // Fußpunkt relativ zur Container-Höhe
  height: '54%',                                    // Höhe relativ zur Container-Höhe
  filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.30))', // einheitliche Optik, keine bühnenabhängige Tönung
} as const;

export const STAGE_THEMES: StageTheme[] = [
  {
    id: 'myroom',
    label: 'My Room',
    emoji: '🛏️',
    dark: true,
    image: '/stage/my-room.png',
    backdrop: 'linear-gradient(180deg, #3a3128 0%, #4a3f33 46%, #5a4c3c 100%)',
    floor: 'linear-gradient(180deg, #4a3a28 0%, #33281b 100%)',
    podium: 'radial-gradient(ellipse at 50% 30%, #8a7560 0%, #6e5c46 58%, #52432f 100%)',
    podiumSide: 'linear-gradient(180deg, #40331f 0%, #2a2014 100%)',
    glow: 'radial-gradient(ellipse 64% 42% at 50% 0%, rgba(255,210,150,0.35) 0%, rgba(255,210,150,0) 68%)',
  },
  {
    id: 'luxury',
    label: 'Luxury Boutique',
    emoji: '👑',
    image: '/stage/luxury-boutique.png',
    backdrop: 'linear-gradient(180deg, #d8c9ae 0%, #c9b494 46%, #a8916c 100%)',
    floor: 'linear-gradient(180deg, #b09a76 0%, #8f7a57 100%)',
    podium: 'radial-gradient(ellipse at 50% 30%, #eedfc2 0%, #d9c49d 58%, #bda478 100%)',
    podiumSide: 'linear-gradient(180deg, #a8916c 0%, #8a7452 100%)',
    glow: 'radial-gradient(ellipse 64% 42% at 50% 0%, rgba(255,236,196,0.85) 0%, rgba(255,236,196,0) 68%)',
  },
  {
    id: 'loft',
    label: 'Berlin Loft',
    emoji: '🧱',
    premium: true,
    dark: true,
    image: '/stage/berlin-loft.png',
    backdrop: 'linear-gradient(180deg, #241a14 0%, #33261c 46%, #45362a 100%)',
    floor: 'linear-gradient(180deg, #3a2d22 0%, #271d15 100%)',
    podium: 'radial-gradient(ellipse at 50% 30%, #5c4a3a 0%, #47382b 58%, #33281e 100%)',
    podiumSide: 'linear-gradient(180deg, #2e2319 0%, #1e1710 100%)',
    glow: 'radial-gradient(ellipse 64% 42% at 50% 0%, rgba(255,120,160,0.30) 0%, rgba(255,120,160,0) 68%)',
  },
];

export const getStageTheme = (id: string): StageTheme =>
  STAGE_THEMES.find((t) => t.id === id) ?? STAGE_THEMES[0];

// Auto-Switch: Anlass → Bühne. Standard → My Room, Date/Edel → Luxury Boutique,
// Party/Ausgehen → Berlin Loft. Andockpunkt für die kommende Anlass-Auswahl —
// eine Anlass-UI existiert in dieser App noch nicht, der Lookup wartet hier.
export const STAGE_FOR_OCCASION: Record<string, string> = {
  standard: 'myroom',
  date: 'luxury',
  edel: 'luxury',
  party: 'loft',
  ausgehen: 'loft',
};
