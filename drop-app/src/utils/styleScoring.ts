import type { ClothingItem, ItemAttributes, StyleDef } from '../types';

// ── Attribut-Vokabular: Keyword → kanonischer Wert ──────────────────────────
// Erweiterbar. Wird später ergänzt/ersetzt durch echte, beim Upload erfasste Attribute.
const COLOR_KEYWORDS: Record<string, string[]> = {
  schwarz: ['schwarz', 'black'],
  weiss: ['weiss', 'weiß', 'white'],
  beige: ['beige', 'creme', 'crème', 'sand', 'camel', 'ecru', 'nude'],
  grau: ['grau', 'gray', 'grey', 'anthrazit'],
  braun: ['braun', 'brown', 'cognac', 'taupe'],
  blau: ['blau', 'blue', 'navy'],
  gruen: ['grün', 'gruen', 'green', 'oliv', 'khaki'],
  rot: ['rot', 'red', 'bordeaux', 'weinrot', 'burgund'],
  gold: ['gold', 'golden'],
  bunt: ['bunt', 'mehrfarbig', 'print', 'gemustert', 'floral', 'neon'],
};

const MATERIAL_KEYWORDS: Record<string, string[]> = {
  leder: ['leder', 'leather'],
  denim: ['denim', 'jeans'],
  wolle: ['wolle', 'wool', 'merino', 'kaschmir', 'cashmere'],
  baumwolle: ['baumwolle', 'cotton', 'jersey'],
  seide: ['seide', 'silk', 'satin'],
  leinen: ['leinen', 'linen'],
  synthetik: ['nylon', 'polyester', 'synthetik', 'funktions', 'goretex', 'gore-tex'],
  strick: ['strick', 'knit', 'grobstrick'],
};

const CUT_KEYWORDS: Record<string, string[]> = {
  oversized: ['oversize', 'oversized', 'baggy', 'loose'],
  slim: ['slim', 'skinny', 'schmal', 'figurbetont'],
  cropped: ['cropped', 'crop'],
  weit: ['weit', 'wide', 'palazzo', 'flare', 'marlene'],
  tailored: ['tailored', 'tailliert'],
  mini: ['mini'],
  maxi: ['maxi'],
};

// itemType: spezifisch vor allgemein prüfen (erstes Match gewinnt)
const ITEMTYPE_KEYWORDS: [string, string[]][] = [
  ['lederjacke', ['lederjacke', 'bikerjacke', 'motorradjacke']],
  ['blazer', ['blazer', 'sakko']],
  ['mantel', ['mantel', 'coat', 'trench', 'parka']],
  ['jacke', ['jacke', 'jacket', 'windbreaker', 'anorak', 'weste']],
  ['hoodie', ['hoodie', 'kapuzen', 'sweatshirt']],
  ['pullover', ['pullover', 'pulli', 'sweater', 'jumper']],
  ['hemd', ['hemd', 'bluse']],
  ['tee', ['t-shirt', 'tshirt', 'tee', 'shirt', 'top', 'tank']],
  ['kleid', ['kleid', 'dress']],
  ['rock', ['rock', 'skirt']],
  ['jeans', ['jeans']],
  ['shorts', ['shorts', 'short']],
  ['hose', ['hose', 'pants', 'trousers', 'chino', 'leggings']],
  ['anzug', ['anzug', 'suit']],
  ['boots', ['boots', 'stiefel', 'stiefelette']],
  ['sneaker', ['sneaker', 'turnschuh', 'trainer']],
  ['heels', ['heels', 'pumps', 'absatz', 'high heel']],
  ['loafer', ['loafer', 'slipper', 'mokassin']],
  ['sandale', ['sandale', 'sandal']],
  ['cap', ['cap', 'kappe', 'basecap']],
  ['muetze', ['mütze', 'muetze', 'beanie']],
  ['sonnenbrille', ['sonnenbrille', 'sunglasses', 'brille']],
  ['tasche', ['tasche', 'bag', 'shopper', 'clutch']],
  ['kette', ['kette', 'necklace', 'collier']],
  ['guertel', ['gürtel', 'guertel', 'belt']],
];

function matchAll(text: string, table: Record<string, string[]>): string[] {
  const hits: string[] = [];
  for (const [value, keywords] of Object.entries(table)) {
    if (keywords.some((k) => text.includes(k))) hits.push(value);
  }
  return hits;
}

function matchFirst(text: string, table: [string, string[]][]): string | undefined {
  for (const [value, keywords] of table) {
    if (keywords.some((k) => text.includes(k))) return value;
  }
  return undefined;
}

// Variante A: Attribute aus dem Namen ableiten.
export function deriveAttributes(item: ClothingItem): ItemAttributes {
  const text = item.name.toLowerCase();
  return {
    itemType: matchFirst(text, ITEMTYPE_KEYWORDS),
    materials: matchAll(text, MATERIAL_KEYWORDS),
    colors: matchAll(text, COLOR_KEYWORDS),
    cuts: matchAll(text, CUT_KEYWORDS),
  };
}

// Andockpunkt für die Zukunft: echte, gespeicherte Attribute haben Vorrang,
// sonst wird aus dem Namen abgeleitet. Engine/UI bleiben dadurch stabil.
export function resolveAttributes(item: ClothingItem): ItemAttributes {
  return item.attributes ?? deriveAttributes(item);
}

// Additiver, gewichteter Score eines Items für genau einen Style.
// Ein Item erhält so gleichzeitig Punkte in mehreren Styles (Score-Vektor entsteht
// durch Aufruf über alle Styles) — Grundlage des späteren Empfehlungssystems.
export function scoreForStyle(item: ClothingItem, style: StyleDef): number {
  const a = resolveAttributes(item);
  const w = style.weights;
  let score = 0;
  if (a.itemType && w.itemTypes) score += w.itemTypes[a.itemType] ?? 0;
  if (w.materials) for (const m of a.materials ?? []) score += w.materials[m] ?? 0;
  if (w.colors) for (const c of a.colors ?? []) score += w.colors[c] ?? 0;
  if (w.cuts) for (const k of a.cuts ?? []) score += w.cuts[k] ?? 0;
  return score;
}
