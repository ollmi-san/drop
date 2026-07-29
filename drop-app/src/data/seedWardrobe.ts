import type { Category } from '../types';

export interface SeedItem {
  name: string;
  category: Category;
  imageUrl: string;
  vibe: string;
}

// 16 Demo-Teile, aus dem Mockup drop_interativ.png gecroppt (public/wardrobe/*)
export const SEED_WARDROBE: SeedItem[] = [
  { name: 'Weißes T-Shirt',   category: 'top',       imageUrl: '/wardrobe/tee-white.png',     vibe: 'Clean Girl' },
  { name: 'Schwarzes Top',    category: 'top',       imageUrl: '/wardrobe/tank-black.png',     vibe: 'Minimal' },
  { name: 'Beige Blazer',     category: 'top',       imageUrl: '/wardrobe/blazer-beige.png',   vibe: 'Old Money' },
  { name: 'Jeansjacke',       category: 'top',       imageUrl: '/wardrobe/denim-jacket.png',   vibe: 'Streetwear' },
  { name: 'Blaue Jeans',      category: 'bottom',    imageUrl: '/wardrobe/jeans-blue.png',      vibe: 'Clean Girl' },
  { name: 'Schwarze Hose',    category: 'bottom',    imageUrl: '/wardrobe/pants-black.png',     vibe: 'Minimal' },
  { name: 'Beige Shorts',     category: 'bottom',    imageUrl: '/wardrobe/shorts-beige.png',    vibe: 'Old Money' },
  { name: 'Schwarzer Rock',   category: 'bottom',    imageUrl: '/wardrobe/skirt-black.png',     vibe: 'Mob Wife' },
  { name: 'Schwarze Boots',   category: 'shoes',     imageUrl: '/wardrobe/boots-black.png',     vibe: 'Streetwear' },
  { name: 'Weiße Sneaker',    category: 'shoes',     imageUrl: '/wardrobe/sneakers-white.png',  vibe: 'Clean Girl' },
  { name: 'Beige Loafer',     category: 'shoes',     imageUrl: '/wardrobe/loafers-beige.png',   vibe: 'Old Money' },
  { name: 'Schwarze Heels',   category: 'shoes',     imageUrl: '/wardrobe/heels-black.png',     vibe: 'Mob Wife' },
  { name: 'Schwarze Tasche',  category: 'accessory', imageUrl: '/wardrobe/bag-black.png',       vibe: 'Mob Wife' },
  { name: 'NY Cap',           category: 'accessory', imageUrl: '/wardrobe/cap-ny.png',          vibe: 'Streetwear' },
  { name: 'Sonnenbrille',     category: 'accessory', imageUrl: '/wardrobe/sunglasses.png',      vibe: 'Minimal' },
  { name: 'Goldkette',        category: 'accessory', imageUrl: '/wardrobe/necklace-gold.png',   vibe: 'Old Money' },
];
