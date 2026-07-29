import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { ClothingItem, ActiveOutfit, SavedOutfit, AvatarGender, AvatarView, OutfitSlot } from '../types';
import { storage } from '../utils/storage';
import { VIEW_ORDER } from '../types';

// Jacken/Blazer bekommen einen eigenen Slot, damit sie das Oberteil nicht überschreiben
function slotForItem(item: ClothingItem): OutfitSlot {
  if (/Blazer|Jacke/i.test(item.name)) return 'jacket';
  return item.category;
}

interface DropState {
  wardrobe: ClothingItem[];
  activeOutfit: ActiveOutfit;
  savedOutfits: SavedOutfit[];
  avatarGender: AvatarGender;
  avatarView: AvatarView;
  favoriteIds: string[];
  showFavoritesOnly: boolean;

  toggleFavorite: (id: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  removeClothingItem: (id: string) => void;
  placeOnAvatar: (item: ClothingItem) => void;
  applyOutfit: (items: ClothingItem[]) => void;
  removeFromAvatar: (slot: OutfitSlot) => void;
  clearOutfit: () => void;
  saveOutfit: (name: string) => void;
  loadOutfit: (id: string) => void;
  deleteOutfit: (id: string) => void;
  setAvatarGender: (gender: AvatarGender) => void;
  rotateAvatar: (direction: 'next' | 'prev') => void;
}

export const useDropStore = create<DropState>((set, get) => ({
  wardrobe: storage.loadWardrobe(),
  activeOutfit: {},
  savedOutfits: storage.loadSavedOutfits(),
  avatarGender: storage.loadAvatarGender(),
  avatarView: 'front',
  favoriteIds: [],
  showFavoritesOnly: false,

  toggleFavorite: (id) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(id)
        ? state.favoriteIds.filter((f) => f !== id)
        : [...state.favoriteIds, id],
    })),

  setShowFavoritesOnly: (value) => set({ showFavoritesOnly: value }),

  addClothingItem: (item) => {
    const newItem: ClothingItem = { ...item, id: nanoid(), createdAt: Date.now() };
    const wardrobe = [...get().wardrobe, newItem];
    storage.saveWardrobe(wardrobe);
    set({ wardrobe });
  },

  removeClothingItem: (id) => {
    const wardrobe = get().wardrobe.filter((i) => i.id !== id);
    storage.saveWardrobe(wardrobe);
    const activeOutfit = { ...get().activeOutfit };
    for (const key of Object.keys(activeOutfit) as OutfitSlot[]) {
      if (activeOutfit[key]?.id === id) delete activeOutfit[key];
    }
    set({ wardrobe, activeOutfit });
  },

  placeOnAvatar: (item) => {
    set((state) => ({ activeOutfit: { ...state.activeOutfit, [slotForItem(item)]: item } }));
  },

  applyOutfit: (items) => {
    const outfit: ActiveOutfit = {};
    for (const it of items) outfit[slotForItem(it)] = it;
    set({ activeOutfit: outfit });
  },

  removeFromAvatar: (slot) => {
    set((state) => {
      const outfit = { ...state.activeOutfit };
      delete outfit[slot];
      return { activeOutfit: outfit };
    });
  },

  clearOutfit: () => set({ activeOutfit: {} }),

  saveOutfit: (name) => {
    const { activeOutfit, avatarGender, savedOutfits } = get();
    const outfit: SavedOutfit = {
      id: nanoid(),
      name,
      items: { ...activeOutfit },
      avatarGender,
      savedAt: Date.now(),
    };
    const updated = [outfit, ...savedOutfits];
    storage.saveSavedOutfits(updated);
    set({ savedOutfits: updated });
  },

  loadOutfit: (id) => {
    const outfit = get().savedOutfits.find((o) => o.id === id);
    if (outfit) set({ activeOutfit: { ...outfit.items }, avatarGender: outfit.avatarGender });
  },

  deleteOutfit: (id) => {
    const savedOutfits = get().savedOutfits.filter((o) => o.id !== id);
    storage.saveSavedOutfits(savedOutfits);
    set({ savedOutfits });
  },

  setAvatarGender: (gender) => {
    storage.saveAvatarGender(gender);
    set({ avatarGender: gender });
  },

  rotateAvatar: (direction) => {
    const current = get().avatarView;
    const idx = VIEW_ORDER.indexOf(current);
    const next = direction === 'next'
      ? VIEW_ORDER[(idx + 1) % VIEW_ORDER.length]
      : VIEW_ORDER[(idx - 1 + VIEW_ORDER.length) % VIEW_ORDER.length];
    set({ avatarView: next });
  },
}));
