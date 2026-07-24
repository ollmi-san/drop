"use client";

import { create } from "zustand";
import {
  tshirt, tank, hoodie, sweater,
  leatherJacket, blazer, denimJacket, coat,
  jeans, cargo, joggers, chinos, skirt,
  dress, floralDress,
  sneaker, boot, jordan, loafer,
  sunglasses, chain, cap, bag,
  svgToDataUri,
} from "../lib/productSvg";

export type Category = "Oberteile" | "Unterteile" | "Kleider" | "Schuhe" | "Jacken" | "Accessoires" | "Hüte" | "Taschen" | "Schmuck" | "Sportswear";
export type Badge = "Top" | "Bottom" | "Shoes" | "Accessory";

export type ItemSource = "owned" | "store" | "web" | "unknown";

export interface WardrobeItem {
  id: string;
  name: string;
  nameEn: string;
  category: Category;
  badge: Badge;
  badgeColor: string;
  imageUrl: string;     // dataURL or blob URL of uploaded photo
  bgFallback: string;   // fallback color if no image
  liked: boolean;
  createdAt: number;
  // Temporary wishlist support: items disappear after expiresAt
  // If undefined → permanent (your real piece)
  expiresAt?: number;
  source?: ItemSource;  // where it came from: owned / store / web
  note?: string;        // optional: store name, URL, comment
}

export type SlotKey = "top" | "bottom" | "shoes" | "accessory";
export type AccessorySubtype = "cap" | "sunglasses" | "chain" | "bag" | "watch" | "belt" | "other";

export const slotForBadge: Record<Badge, SlotKey> = {
  Top: "top",
  Bottom: "bottom",
  Shoes: "shoes",
  Accessory: "accessory",
};

// Auto-detect accessory subtype from name (German + English keywords)
export function detectAccessorySubtype(name: string): AccessorySubtype {
  const n = name.toLowerCase();
  if (/cap|mütze|hat|kappe/.test(n)) return "cap";
  if (/brille|sunglasses|sonnen/.test(n)) return "sunglasses";
  if (/kette|chain|halsband|necklace/.test(n)) return "chain";
  if (/tasche|bag|handtasche|rucksack|backpack/.test(n)) return "bag";
  if (/uhr|watch/.test(n)) return "watch";
  if (/gürtel|belt/.test(n)) return "belt";
  return "other";
}

export interface SavedOutfit {
  id: string;
  name: string;
  date: string;          // formatted date
  itemIds: string[];     // ids of equipped items
  fav: boolean;
  createdAt: number;
}

interface WardrobeStore {
  items: WardrobeItem[];
  outfit: Record<SlotKey, string | null>;
  draggingId: string | null;
  lastDropAt: number;
  savedOutfits: SavedOutfit[];

  addItem: (item: Omit<WardrobeItem, "id" | "createdAt">) => string;
  removeItem: (id: string) => void;
  toggleLike: (id: string) => void;
  renameItem: (id: string, name: string) => void;
  updateItemMeta: (id: string, data: Partial<Pick<WardrobeItem, "name" | "nameEn" | "category" | "badge" | "badgeColor">>) => void;

  setDragging: (id: string | null) => void;
  equipItem: (id: string) => void;
  unequipSlot: (slot: SlotKey) => void;
  clearOutfit: () => void;

  saveCurrentOutfit: (name?: string) => string | null;
  deleteOutfit: (id: string) => void;
  toggleOutfitFav: (id: string) => void;
  loadOutfit: (id: string) => void;

  // Wishlist support — clean up expired items
  cleanupExpired: () => number; // returns count removed
  extendItem: (id: string, addMs: number) => void;
  makePermanent: (id: string) => void;
}

// Seed items with SVG product illustrations (look like e-commerce product photos)
function mk(
  id: string, name: string, nameEn: string, cat: Category, badge: Badge,
  bgColor: string, badgeColor: string, svg: string,
): WardrobeItem {
  return {
    id, name, nameEn, category: cat, badge, badgeColor,
    imageUrl: svgToDataUri(svg),
    bgFallback: bgColor, liked: false, createdAt: 0,
  };
}

const seedItems: WardrobeItem[] = [
  // Oberteile
  mk("s1",  "Tank Top schwarz",   "Black Tank",       "Oberteile", "Top", "#1a1a1a", "#7C3AED", tank("#222222")),
  mk("s2",  "Weißes T-Shirt",     "White Tee",        "Oberteile", "Top", "#f4f1eb", "#7C3AED", tshirt("#f4f1eb")),
  mk("s3",  "Mint Hoodie",        "Mint Hoodie",      "Oberteile", "Top", "#a5dec5", "#7C3AED", hoodie("#a5dec5")),
  mk("s4",  "Senf Pulli",         "Mustard Sweater",  "Oberteile", "Top", "#d4a017", "#7C3AED", sweater("#d4a017")),
  mk("s5",  "Crop Top rosa",      "Pink Crop",        "Oberteile", "Top", "#f4a8c0", "#7C3AED", tank("#f4a8c0")),

  // Jacken
  mk("s6",  "Lederjacke",         "Leather Jacket",   "Jacken", "Top", "#2a2a2a", "#7C3AED", leatherJacket("#2a2a2a")),
  mk("s7",  "Beige Blazer",       "Beige Blazer",     "Jacken", "Top", "#c9a878", "#7C3AED", blazer("#c9a878")),
  mk("s8",  "Denim Jacke",        "Denim Jacket",     "Jacken", "Top", "#4a82c2", "#7C3AED", denimJacket("#4a82c2")),
  mk("s9",  "Roter Mantel",       "Red Coat",         "Jacken", "Top", "#c0392b", "#7C3AED", coat("#c0392b")),

  // Unterteile
  mk("s10", "Blaue Jeans",        "Blue Jeans",       "Unterteile", "Bottom", "#5a8ec4", "#2563EB", jeans("#5a8ec4")),
  mk("s11", "Cargo Hose olive",   "Olive Cargo",      "Unterteile", "Bottom", "#6b7340", "#2563EB", cargo("#6b7340")),
  mk("s12", "Schwarze Jogger",    "Black Joggers",    "Unterteile", "Bottom", "#1c1c1c", "#2563EB", joggers("#1c1c1c")),
  mk("s13", "Beige Chino",        "Beige Chinos",     "Unterteile", "Bottom", "#d4b886", "#2563EB", chinos("#d4b886")),
  mk("s14", "Bordeaux Rock",      "Burgundy Skirt",   "Unterteile", "Bottom", "#722f37", "#2563EB", skirt("#722f37")),

  // Kleider
  mk("s15", "Schwarzes Kleid",    "Black Dress",      "Kleider", "Bottom", "#222222", "#2563EB", dress("#222222")),
  mk("s16", "Geblümtes Kleid",    "Floral Dress",     "Kleider", "Bottom", "#e08aa3", "#2563EB", floralDress("#e08aa3")),

  // Schuhe
  mk("s17", "Weiße Sneaker",      "White Sneakers",   "Schuhe", "Shoes", "#f0f0f0", "#059669", sneaker("#f5f5f5")),
  mk("s18", "Schwarze Boots",     "Black Boots",      "Schuhe", "Shoes", "#1a1a1a", "#059669", boot("#1a1a1a")),
  mk("s19", "Air Jordan rot",     "Red Jordans",      "Schuhe", "Shoes", "#d33a3a", "#059669", jordan("#d33a3a")),
  mk("s20", "Loafers braun",      "Brown Loafers",    "Schuhe", "Shoes", "#7a4f2c", "#059669", loafer("#7a4f2c")),

  // Accessoires
  mk("s21", "Sonnenbrille",       "Sunglasses",       "Accessoires", "Accessory", "#181818", "#D97706", sunglasses("#181818")),
  mk("s22", "Silberkette",        "Silver Chain",     "Accessoires", "Accessory", "#cccccc", "#D97706", chain("#888888")),
  mk("s23", "Cap schwarz",        "Black Cap",        "Accessoires", "Accessory", "#222222", "#D97706", cap("#222222")),
  mk("s24", "Tasche cognac",      "Cognac Bag",       "Accessoires", "Accessory", "#a05a2c", "#D97706", bag("#a05a2c")),
];

// Initial saved outfits (sample data)
const initialSavedOutfits: SavedOutfit[] = [
  { id: "o1", name: "Mein erstes Outfit", date: "29.04.2026", itemIds: ["s6", "s10", "s17"],          fav: true,  createdAt: 0 },
  { id: "o2", name: "Street Look",        date: "27.04.2026", itemIds: ["s2", "s11", "s17", "s23"],   fav: false, createdAt: 0 },
  { id: "o3", name: "Casual Day",         date: "25.04.2026", itemIds: ["s8", "s10", "s17"],          fav: false, createdAt: 0 },
  { id: "o4", name: "Night Out",          date: "22.04.2026", itemIds: ["s6", "s12", "s18", "s24"],   fav: true,  createdAt: 0 },
  { id: "o5", name: "Summer Vibes",       date: "20.04.2026", itemIds: ["s2", "s10", "s17", "s21"],   fav: false, createdAt: 0 },
  { id: "o6", name: "Office Chic",        date: "18.04.2026", itemIds: ["s7", "s13", "s20"],          fav: false, createdAt: 0 },
];

export const useWardrobe = create<WardrobeStore>((set, get) => ({
  items: seedItems,
  outfit: { top: null, bottom: null, shoes: null, accessory: null },
  draggingId: null,
  lastDropAt: 0,
  savedOutfits: initialSavedOutfits,

  addItem: (item) => {
    const id = `i_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      items: [{ ...item, id, createdAt: Date.now() }, ...state.items],
    }));
    return id;
  },
  removeItem: (id) =>
    set((state) => {
      const newOutfit = { ...state.outfit };
      (Object.keys(newOutfit) as SlotKey[]).forEach((k) => {
        if (newOutfit[k] === id) newOutfit[k] = null;
      });
      return {
        items: state.items.filter((it) => it.id !== id),
        outfit: newOutfit,
      };
    }),
  toggleLike: (id) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, liked: !it.liked } : it
      ),
    })),
  renameItem: (id, name) =>
    set((state) => ({
      items: state.items.map((it) => (it.id === id ? { ...it, name } : it)),
    })),
  updateItemMeta: (id, data) =>
    set((state) => ({
      items: state.items.map((it) => it.id === id ? { ...it, ...data } : it),
    })),

  setDragging: (id) => set({ draggingId: id }),
  equipItem: (id) => {
    const item = get().items.find((it) => it.id === id);
    if (!item) return;
    const slot = slotForBadge[item.badge];
    set((state) => ({
      outfit: { ...state.outfit, [slot]: id },
      draggingId: null,
      lastDropAt: Date.now(),
    }));
  },
  unequipSlot: (slot) =>
    set((state) => ({ outfit: { ...state.outfit, [slot]: null } })),
  clearOutfit: () =>
    set({ outfit: { top: null, bottom: null, shoes: null, accessory: null } }),

  saveCurrentOutfit: (name) => {
    const outfit = get().outfit;
    const ids = (Object.values(outfit).filter(Boolean) as string[]);
    if (ids.length === 0) return null;
    const id = `o_${Date.now()}`;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    const newOutfit: SavedOutfit = {
      id,
      name: name?.trim() || `Outfit ${get().savedOutfits.length + 1}`,
      date: dateStr,
      itemIds: ids,
      fav: false,
      createdAt: Date.now(),
    };
    set((s) => ({ savedOutfits: [newOutfit, ...s.savedOutfits] }));
    return id;
  },
  deleteOutfit: (id) =>
    set((s) => ({ savedOutfits: s.savedOutfits.filter((o) => o.id !== id) })),
  toggleOutfitFav: (id) =>
    set((s) => ({
      savedOutfits: s.savedOutfits.map((o) =>
        o.id === id ? { ...o, fav: !o.fav } : o
      ),
    })),
  loadOutfit: (id) => {
    const o = get().savedOutfits.find((x) => x.id === id);
    if (!o) return;
    const newOutfit: Record<SlotKey, string | null> = { top: null, bottom: null, shoes: null, accessory: null };
    for (const itemId of o.itemIds) {
      const item = get().items.find((it) => it.id === itemId);
      if (item) newOutfit[slotForBadge[item.badge]] = itemId;
    }
    set({ outfit: newOutfit, lastDropAt: Date.now() });
  },

  cleanupExpired: () => {
    const now = Date.now();
    const before = get().items.length;
    set((state) => {
      const stillValid = state.items.filter(
        (it) => !it.expiresAt || it.expiresAt > now
      );
      // Also unequip any expired items from current outfit
      const newOutfit = { ...state.outfit };
      (Object.keys(newOutfit) as SlotKey[]).forEach((k) => {
        const equippedId = newOutfit[k];
        if (equippedId && !stillValid.find((it) => it.id === equippedId)) {
          newOutfit[k] = null;
        }
      });
      return { items: stillValid, outfit: newOutfit };
    });
    return before - get().items.length;
  },

  extendItem: (id, addMs) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id && it.expiresAt
          ? { ...it, expiresAt: it.expiresAt + addMs }
          : it
      ),
    })),

  makePermanent: (id) =>
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, expiresAt: undefined, source: "owned" } : it
      ),
    })),
}));

// Helpers — get badge style for a category
export function categoryToBadge(cat: Category): { badge: Badge; color: string } {
  switch (cat) {
    case "Oberteile": return { badge: "Top",       color: "#7C3AED" };
    case "Jacken":    return { badge: "Top",       color: "#7C3AED" };
    case "Unterteile":return { badge: "Bottom",    color: "#2563EB" };
    case "Kleider":   return { badge: "Bottom",    color: "#2563EB" };
    case "Schuhe":    return { badge: "Shoes",     color: "#059669" };
    case "Accessoires": return { badge: "Accessory", color: "#D97706" };
    case "Hüte":        return { badge: "Accessory", color: "#D97706" };
    case "Taschen":     return { badge: "Accessory", color: "#D97706" };
    case "Schmuck":     return { badge: "Accessory", color: "#D97706" };
    case "Sportswear":  return { badge: "Top",       color: "#7C3AED" };
  }
}
