import type { Category, ClothingItem } from '../types';

function pickRandom<T>(arr: T[]): T | undefined {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

// Stellt aus dem Schrank je ein zufälliges Teil pro Kategorie zu einem Outfit
// zusammen. Von Desktop (StagePanel-Aktion) und Mobile (Home/KI-Stylist) genutzt.
export function buildOutfit(wardrobe: ClothingItem[]): ClothingItem[] {
  const byCat = (c: Category) => wardrobe.filter((i) => i.category === c);
  return [
    pickRandom(byCat('top')),
    pickRandom(byCat('bottom')),
    pickRandom(byCat('shoes')),
    pickRandom(byCat('accessory')),
  ].filter(Boolean) as ClothingItem[];
}
