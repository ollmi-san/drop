"use client";

import type { WardrobeItem, Category, Badge } from "../store/useWardrobe";

export interface OutfitPiece {
  type: string;        // "Crop Top", "Baggy Jeans", "Sneakers"
  category: Category;
  badge: Badge;
  color: string;       // descriptive: "white", "black", "denim blue"
  colorHex: string;    // for visual swatch
  // Keywords used to match items in user's wardrobe (German + English)
  matchKeywords: string[];
}

export interface CelebrityOutfit {
  id: string;
  celebrity: string;
  avatar: string;       // emoji or initial
  city: string;
  date: string;         // "06.05.2026" — relative
  vibe: string;         // "Y2K Casual"
  vibeColor: string;    // gradient
  pieces: OutfitPiece[];
}

// Sample celebrity outfits — refreshed periodically, in real Phase 2 fetched from API
export const CELEBRITY_OUTFITS: CelebrityOutfit[] = [
  {
    id: "c1",
    celebrity: "Hailey Bieber",
    avatar: "👩‍🎤",
    city: "New York",
    date: "Gestern",
    vibe: "Y2K Coffee Run",
    vibeColor: "linear-gradient(135deg, #f0e3ff, #ffe3f0)",
    pieces: [
      { type: "Crop Top", category: "Oberteile", badge: "Top", color: "weiß", colorHex: "#f5f5f5", matchKeywords: ["crop", "tank", "tee", "top", "weiß", "white"] },
      { type: "Baggy Jeans", category: "Unterteile", badge: "Bottom", color: "hellblau", colorHex: "#7faae0", matchKeywords: ["jeans", "baggy", "blau"] },
      { type: "Sneakers", category: "Schuhe", badge: "Shoes", color: "weiß", colorHex: "#ffffff", matchKeywords: ["sneaker", "weiß", "white"] },
      { type: "Cat-Eye Sonnenbrille", category: "Accessoires", badge: "Accessory", color: "schwarz", colorHex: "#1a1a1a", matchKeywords: ["brille", "sunglasses", "sonnen"] },
    ],
  },
  {
    id: "c2",
    celebrity: "Bella Hadid",
    avatar: "👩",
    city: "Paris",
    date: "Vorgestern",
    vibe: "Off-Duty Street",
    vibeColor: "linear-gradient(135deg, #1a1a1a, #4a4a4a)",
    pieces: [
      { type: "Lederjacke", category: "Jacken", badge: "Top", color: "schwarz", colorHex: "#1a1a1a", matchKeywords: ["leder", "leather", "jacke", "schwarz"] },
      { type: "Cargo Hose", category: "Unterteile", badge: "Bottom", color: "olive", colorHex: "#6b7340", matchKeywords: ["cargo", "hose", "olive"] },
      { type: "Chunky Boots", category: "Schuhe", badge: "Shoes", color: "schwarz", colorHex: "#1a1a1a", matchKeywords: ["boot", "stiefel", "schwarz"] },
      { type: "Mini Tasche", category: "Accessoires", badge: "Accessory", color: "schwarz", colorHex: "#1a1a1a", matchKeywords: ["tasche", "bag"] },
    ],
  },
  {
    id: "c3",
    celebrity: "Zendaya",
    avatar: "👩🏽",
    city: "Los Angeles",
    date: "Vor 3 Tagen",
    vibe: "Elegant Minimal",
    vibeColor: "linear-gradient(135deg, #d4b896, #8b6f47)",
    pieces: [
      { type: "Beige Blazer", category: "Jacken", badge: "Top", color: "beige", colorHex: "#c9a878", matchKeywords: ["blazer", "beige"] },
      { type: "Schwarzes Kleid", category: "Kleider", badge: "Bottom", color: "schwarz", colorHex: "#222222", matchKeywords: ["kleid", "dress", "schwarz"] },
      { type: "Loafer", category: "Schuhe", badge: "Shoes", color: "braun", colorHex: "#7a4f2c", matchKeywords: ["loafer", "braun"] },
      { type: "Goldene Kette", category: "Accessoires", badge: "Accessory", color: "gold", colorHex: "#d4a017", matchKeywords: ["kette", "chain"] },
    ],
  },
  {
    id: "c4",
    celebrity: "Timothée Chalamet",
    avatar: "🧑",
    city: "Mailand",
    date: "Vor 4 Tagen",
    vibe: "Eclectic Soft",
    vibeColor: "linear-gradient(135deg, #f4a8c0, #c0392b)",
    pieces: [
      { type: "Roter Mantel", category: "Jacken", badge: "Top", color: "rot", colorHex: "#c0392b", matchKeywords: ["mantel", "coat", "rot"] },
      { type: "Schwarze Hose", category: "Unterteile", badge: "Bottom", color: "schwarz", colorHex: "#1c1c1c", matchKeywords: ["hose", "schwarz", "jogger"] },
      { type: "Boots", category: "Schuhe", badge: "Shoes", color: "schwarz", colorHex: "#1a1a1a", matchKeywords: ["boot", "schwarz"] },
    ],
  },
  {
    id: "c5",
    celebrity: "Rosalía",
    avatar: "💃",
    city: "Barcelona",
    date: "Vor 5 Tagen",
    vibe: "Urban Edgy",
    vibeColor: "linear-gradient(135deg, #c97a4a, #4a82c2)",
    pieces: [
      { type: "Denim Jacke", category: "Jacken", badge: "Top", color: "blau", colorHex: "#4a82c2", matchKeywords: ["denim", "jeansjacke"] },
      { type: "Mini Rock", category: "Unterteile", badge: "Bottom", color: "burgundy", colorHex: "#722f37", matchKeywords: ["rock", "skirt", "bordeaux"] },
      { type: "Air Jordan", category: "Schuhe", badge: "Shoes", color: "rot", colorHex: "#d33a3a", matchKeywords: ["jordan", "sneaker", "rot"] },
      { type: "Cap", category: "Accessoires", badge: "Accessory", color: "schwarz", colorHex: "#222222", matchKeywords: ["cap", "mütze"] },
    ],
  },
];

export interface MatchResult {
  piece: OutfitPiece;
  match: WardrobeItem | null;  // best match from user's wardrobe
  matchScore: number;          // 0..1
}

/**
 * For a celebrity outfit, find the best match for each piece in the user's wardrobe.
 * Returns: array of { piece, match (or null), matchScore }
 */
export function matchOutfitToWardrobe(
  pieces: OutfitPiece[],
  wardrobe: WardrobeItem[]
): MatchResult[] {
  return pieces.map((piece) => {
    // Filter to same category first
    const sameCategory = wardrobe.filter(
      (it) => it.category === piece.category || it.badge === piece.badge
    );
    if (sameCategory.length === 0) {
      return { piece, match: null, matchScore: 0 };
    }

    // Score by keyword matches in name + color similarity
    let best: { item: WardrobeItem; score: number } | null = null;
    for (const item of sameCategory) {
      const nameLower = (item.name + " " + item.nameEn).toLowerCase();
      const keywordHits = piece.matchKeywords.filter((kw) =>
        nameLower.includes(kw.toLowerCase())
      ).length;

      // Color similarity (simple RGB distance)
      const colorScore = colorSimilarity(piece.colorHex, item.bgFallback);

      const score = keywordHits * 0.3 + colorScore * 0.7;
      if (!best || score > best.score) {
        best = { item, score };
      }
    }
    return {
      piece,
      match: best && best.score > 0.4 ? best.item : null,
      matchScore: best?.score ?? 0,
    };
  });
}

function colorSimilarity(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;
  const dist = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
  // Normalize: 0 = identical, ~441 = max distance (white→black)
  return Math.max(0, 1 - dist / 200);
}
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length !== 6) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
