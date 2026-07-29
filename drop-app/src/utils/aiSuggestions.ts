import type { ClothingItem, ActiveOutfit } from '../types';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSuggestion(wardrobe: ClothingItem[]): ActiveOutfit | null {
  const tops = wardrobe.filter((i) => i.category === 'top');
  const bottoms = wardrobe.filter((i) => i.category === 'bottom');

  if (tops.length === 0 || bottoms.length === 0) return null;

  const shoes = wardrobe.filter((i) => i.category === 'shoes');
  const accessories = wardrobe.filter((i) => i.category === 'accessory');

  return {
    top: pickRandom(tops),
    bottom: pickRandom(bottoms),
    ...(shoes.length > 0 && { shoes: pickRandom(shoes) }),
    ...(accessories.length > 0 && { accessory: pickRandom(accessories) }),
  };
}
