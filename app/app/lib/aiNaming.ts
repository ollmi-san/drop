"use client";

import type { Category } from "../store/useWardrobe";

export interface AINameSuggestion {
  name: string;       // German
  nameEn: string;     // English
  category: Category;
  confidence: number; // 0..1
}

/**
 * Stub for Claude API call.
 * In Schritt 3 phase 2 (when ANTHROPIC_API_KEY is set) this will be replaced with
 * a real call to /api/ai/name that sends the image to claude-sonnet-4-5
 * with vision and gets back a structured JSON response.
 *
 * For now: random plausible name based on dummy heuristics so the upload flow
 * can be tested end-to-end.
 */
export async function suggestNameForImage(imageDataUrl: string): Promise<AINameSuggestion> {
  // Simulate network delay so the loading state is visible
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  // Try the real API first if we're in production AND a key is configured.
  // The backend route returns 503 if no key is set, in which case we fall
  // through to the local stub.
  try {
    const res = await fetch("/api/ai/name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.name && data?.category) return data as AINameSuggestion;
    }
  } catch {
    // ignore — fall through to stub
  }

  // Local stub — pick something plausible
  const stubs: AINameSuggestion[] = [
    { name: "Schwarzes T-Shirt",  nameEn: "Black T-Shirt",   category: "Oberteile",   confidence: 0.78 },
    { name: "Blaue Jeans",        nameEn: "Blue Jeans",      category: "Unterteile",  confidence: 0.84 },
    { name: "Weiße Sneaker",      nameEn: "White Sneakers",  category: "Schuhe",      confidence: 0.72 },
    { name: "Schwarze Tasche",    nameEn: "Black Bag",       category: "Accessoires", confidence: 0.69 },
    { name: "Beige Pullover",     nameEn: "Beige Sweater",   category: "Oberteile",   confidence: 0.81 },
    { name: "Cargo Hose",         nameEn: "Cargo Pants",     category: "Unterteile",  confidence: 0.76 },
    { name: "Lederjacke",         nameEn: "Leather Jacket",  category: "Jacken",      confidence: 0.88 },
    { name: "Sonnenbrille",       nameEn: "Sunglasses",      category: "Accessoires", confidence: 0.91 },
  ];
  return stubs[Math.floor(Math.random() * stubs.length)];
}
