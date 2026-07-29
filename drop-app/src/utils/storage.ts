import type { AvatarGender, ClothingItem, SavedOutfit } from '../types';

const KEYS = {
  wardrobe: 'drop_wardrobe',
  savedOutfits: 'drop_saved_outfits',
  avatarGender: 'drop_avatar_gender',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage voll – älteste Bilder werden nicht gespeichert.', e);
  }
}

export const storage = {
  loadWardrobe: (): ClothingItem[] => load<ClothingItem[]>(KEYS.wardrobe, []),
  saveWardrobe: (items: ClothingItem[]) => save(KEYS.wardrobe, items),

  loadSavedOutfits: (): SavedOutfit[] => load<SavedOutfit[]>(KEYS.savedOutfits, []),
  saveSavedOutfits: (outfits: SavedOutfit[]) => save(KEYS.savedOutfits, outfits),

  loadAvatarGender: (): AvatarGender => load<AvatarGender>(KEYS.avatarGender, 'female'),
  saveAvatarGender: (gender: AvatarGender) => save(KEYS.avatarGender, gender),
};
