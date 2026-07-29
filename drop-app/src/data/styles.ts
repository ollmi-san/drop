import type { StyleDef, StyleSectionId } from '../types';

// Reihenfolge + Beschriftung der Style-Guide-Sektionen
export const STYLE_SECTIONS: { id: StyleSectionId; label: string }[] = [
  { id: 'core', label: 'Core Style' },
  { id: 'mood', label: 'Mood & Scene' },
  { id: 'activity', label: 'Activity & Anlass' },
];

// Style-Katalog. Erweiterbar: ein neuer Style = ein weiterer Eintrag.
// Engine und UI iterieren ausschließlich dieses Array — kein weiterer Codeeingriff nötig.
export const STYLES: StyleDef[] = [
  // ── Core Style ──────────────────────────────────────────────
  {
    id: 'clean-girl', label: 'Clean Girl', section: 'core',
    description: 'Reduziert, frisch, mühelos elegant – helle Töne und klare Basics.',
    weights: {
      colors: { weiss: 3, beige: 2 }, materials: { baumwolle: 2, denim: 1 },
      cuts: { slim: 1, tailored: 1 }, itemTypes: { tee: 2, jeans: 1, sneaker: 1, hemd: 1 },
    },
  },
  {
    id: 'old-money', label: 'Old Money', section: 'core',
    description: 'Zeitlos und hochwertig – gedeckte Farben, edle Stoffe, dezenter Luxus.',
    weights: {
      colors: { beige: 3, braun: 2, weiss: 1 }, materials: { wolle: 3, seide: 2, leinen: 2, leder: 1 },
      itemTypes: { blazer: 3, mantel: 2, loafer: 2, hemd: 1 },
    },
  },
  {
    id: 'minimal', label: 'Minimal', section: 'core',
    description: 'Klare Linien, neutrale Töne, kein Lärm – Form vor Dekoration.',
    weights: {
      colors: { schwarz: 2, weiss: 2, grau: 2, beige: 1 }, materials: { baumwolle: 1, wolle: 1 },
      cuts: { slim: 1, tailored: 1 }, itemTypes: { tee: 1, hose: 1, mantel: 1 },
    },
  },
  {
    id: 'streetwear', label: 'Streetwear', section: 'core',
    description: 'Urban und locker – Oversize, Sneaker und Statement-Teile.',
    weights: {
      colors: { schwarz: 1, bunt: 1 }, materials: { denim: 2, leder: 1, synthetik: 1 },
      cuts: { oversized: 3, weit: 2 }, itemTypes: { hoodie: 3, sneaker: 3, cap: 2, tee: 1, jeans: 1, lederjacke: 1 },
    },
  },
  {
    id: 'grunge', label: 'Grunge', section: 'core',
    description: 'Rau und dunkel, bewusst nachlässig – Leder, Denim, Grobstrick.',
    weights: {
      colors: { schwarz: 2, braun: 1 }, materials: { denim: 2, leder: 2, strick: 1 },
      cuts: { oversized: 2 }, itemTypes: { lederjacke: 2, hemd: 2, boots: 2, pullover: 1 },
    },
  },

  // ── Mood & Scene ────────────────────────────────────────────
  {
    id: 'mob-wife', label: 'Mob Wife', section: 'mood',
    description: 'Opulent und glamourös-dunkel – schwere Stoffe, Gold, große Silhouetten.',
    weights: {
      colors: { schwarz: 3, gold: 2, braun: 1 }, materials: { leder: 3, seide: 2, wolle: 1 },
      itemTypes: { mantel: 3, heels: 2, tasche: 2, kette: 2 },
    },
  },
  {
    id: 'berghain', label: 'Berghain', section: 'mood',
    description: 'Komplett schwarz, technisch, nachttauglich – nichts glänzt außer Lack.',
    weights: {
      colors: { schwarz: 4, grau: 1 }, materials: { leder: 2, synthetik: 2 },
      cuts: { oversized: 2 }, itemTypes: { boots: 2, jacke: 2, hoodie: 1, lederjacke: 1 },
    },
  },
  {
    id: 'rock', label: 'Rock', section: 'mood',
    description: 'Leder, Schwarz und Bühnen-Attitüde – laut, ohne es zu sagen.',
    weights: {
      colors: { schwarz: 3 }, materials: { leder: 3, denim: 2 },
      itemTypes: { lederjacke: 3, boots: 2, tee: 1 },
    },
  },
  {
    id: 'moto', label: 'Moto Rider', section: 'mood',
    description: 'Funktional und robust – Biker-Leder, Schnallen, schwere Boots.',
    weights: {
      colors: { schwarz: 2, braun: 1 }, materials: { leder: 4, synthetik: 1 },
      itemTypes: { lederjacke: 4, boots: 3, jacke: 1 },
    },
  },
  {
    id: 'punk', label: 'Punk', section: 'mood',
    description: 'Kantig und rebellisch – Schwarz dominiert, Nieten, harte Kanten.',
    weights: {
      colors: { schwarz: 3, rot: 1 }, materials: { leder: 3, denim: 1 },
      itemTypes: { lederjacke: 3, boots: 3, jacke: 1 },
    },
  },

  // ── Activity & Anlass ───────────────────────────────────────
  {
    id: 'business', label: 'Business', section: 'activity',
    description: 'Seriös und strukturiert – Blazer, Anzug, gedeckte Farben.',
    weights: {
      colors: { grau: 2, schwarz: 1, beige: 1 }, materials: { wolle: 3, baumwolle: 1 },
      cuts: { tailored: 3 }, itemTypes: { blazer: 3, anzug: 3, hemd: 2, hose: 2, loafer: 1, heels: 1 },
    },
  },
  {
    id: 'sport', label: 'Sport & Gym', section: 'activity',
    description: 'Bewegungsfreundlich und leicht – sportliche Schnitte, Sneaker.',
    weights: {
      materials: { synthetik: 3, baumwolle: 1 }, cuts: { oversized: 1, slim: 1 },
      itemTypes: { sneaker: 3, hoodie: 2, shorts: 2, tee: 1 },
    },
  },
  {
    id: 'date-night', label: 'Date Night', section: 'activity',
    description: 'Feminin und edel, abendtauglich – Kleid, Heels, ein Hauch Glamour.',
    weights: {
      colors: { schwarz: 2, rot: 2, gold: 1 }, materials: { seide: 3, leder: 1 },
      cuts: { mini: 2, tailored: 1 }, itemTypes: { kleid: 3, heels: 3, rock: 1, tasche: 1 },
    },
  },
  {
    id: 'festival', label: 'Festival', section: 'activity',
    description: 'Frei und auffällig – Denim, kurze Schnitte, viel Sonne.',
    weights: {
      colors: { bunt: 2, braun: 1 }, materials: { denim: 1, synthetik: 1 },
      cuts: { cropped: 2, mini: 1 }, itemTypes: { shorts: 2, boots: 1, sonnenbrille: 2, tee: 1 },
    },
  },
  {
    id: 'casual', label: 'Casual', section: 'activity',
    description: 'Bequem und unkompliziert – Jeans, Tee, Sneaker für jeden Tag.',
    weights: {
      colors: { blau: 1, beige: 1, grau: 1 }, materials: { denim: 2, baumwolle: 2 },
      cuts: { slim: 1, weit: 1 }, itemTypes: { jeans: 2, tee: 2, sneaker: 2, hoodie: 1, hemd: 1 },
    },
  },
];

export function getStyleById(id: string | null | undefined): StyleDef | undefined {
  return id ? STYLES.find((s) => s.id === id) : undefined;
}
