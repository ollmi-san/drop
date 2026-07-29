export type Category = 'top' | 'bottom' | 'shoes' | 'accessory';

export type AvatarGender = 'female' | 'male';

export type AvatarView = 'front' | 'side' | 'back';

// Strukturierte Style-Attribute eines Teils. Aktuell zur Laufzeit aus dem Namen
// abgeleitet (siehe utils/styleScoring); später direkt beim Upload befüllbar.
export interface ItemAttributes {
  itemType?: string;
  materials?: string[];
  colors?: string[];
  cuts?: string[];
}

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
  createdAt: number;
  vibe?: string;
  // Andockpunkt für echte Attribute. Hat in der Scoring-Engine Vorrang vor der Ableitung.
  attributes?: ItemAttributes;
}

export type OutfitSlot = 'top' | 'jacket' | 'bottom' | 'shoes' | 'accessory';

export interface ActiveOutfit {
  top?: ClothingItem;
  jacket?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  accessory?: ClothingItem;
}

export interface SavedOutfit {
  id: string;
  name: string;
  items: ActiveOutfit;
  avatarGender: AvatarGender;
  savedAt: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  top: 'Oberteil',
  bottom: 'Hose',
  shoes: 'Schuhe',
  accessory: 'Accessoire',
};

export const VIEW_ORDER: AvatarView[] = ['front', 'side', 'back'];

// ── Style Guide ─────────────────────────────────────────────────────────────
export type StyleSectionId = 'core' | 'mood' | 'activity';

export interface StyleWeights {
  itemTypes?: Record<string, number>;
  materials?: Record<string, number>;
  colors?: Record<string, number>;
  cuts?: Record<string, number>;
}

export interface StyleDef {
  id: string;
  label: string;
  section: StyleSectionId;
  description: string;
  weights: StyleWeights;
}
