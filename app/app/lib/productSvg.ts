"use client";

// E-commerce-style SVG illustrations of clothing.
// Each function returns a complete SVG string with the product
// centered on a white background. Used as imageUrl in seed items.

const W = 240;
const H = 240;

function shadeStroke(color: string): string {
  // Pick stroke color: dark for light items, slightly darker for everything
  return darken(color, 0.45);
}
function darken(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(c.slice(0, 2), 16) * (1 - amt)));
  const g = Math.max(0, Math.round(parseInt(c.slice(2, 4), 16) * (1 - amt)));
  const b = Math.max(0, Math.round(parseInt(c.slice(4, 6), 16) * (1 - amt)));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function wrap(inner: string, bg = "#ffffff"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    ${inner}
  </svg>`;
}

// ---------- Tops ----------
export function tshirt(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 60 70 L 80 55 L 95 65 Q 120 78 145 65 L 160 55 L 180 70 L 175 105 L 160 100 L 160 195 Q 120 200 80 195 L 80 100 L 65 105 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 95 65 Q 120 78 145 65" fill="none" stroke="${s}" stroke-width="2"/>
  `);
}

export function tank(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 90 70 L 100 55 L 105 60 Q 120 65 135 60 L 140 55 L 150 70 L 150 195 Q 120 200 90 195 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 105 60 Q 120 75 135 60" fill="none" stroke="${s}" stroke-width="2"/>
  `);
}

export function hoodie(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 55 80 L 75 55 Q 95 45 120 50 Q 145 45 165 55 L 185 80 L 178 110 L 162 105 L 162 200 Q 120 205 78 200 L 78 105 L 62 110 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 95 60 Q 120 90 145 60" fill="${darken(color, 0.15)}" stroke="${s}" stroke-width="2"/>
    <line x1="115" y1="78" x2="113" y2="105" stroke="${s}" stroke-width="2"/>
    <line x1="125" y1="78" x2="127" y2="105" stroke="${s}" stroke-width="2"/>
    <rect x="100" y="140" width="40" height="35" rx="3" fill="none" stroke="${s}" stroke-width="2"/>
  `);
}

export function sweater(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 55 80 L 78 60 L 95 70 Q 120 80 145 70 L 162 60 L 185 80 L 178 200 L 162 205 L 162 110 L 78 110 L 78 205 L 62 200 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 95 70 Q 120 84 145 70" fill="none" stroke="${s}" stroke-width="2"/>
    <line x1="78" y1="195" x2="162" y2="195" stroke="${s}" stroke-width="2" stroke-dasharray="4 4"/>
  `);
}

// ---------- Jackets ----------
export function leatherJacket(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 55 75 L 78 55 L 100 70 L 95 195 L 78 200 L 55 195 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <path d="M 185 75 L 162 55 L 140 70 L 145 195 L 162 200 L 185 195 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <path d="M 100 70 L 95 195 L 145 195 L 140 70 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <line x1="120" y1="60" x2="120" y2="195" stroke="${darken(color, 0.5)}" stroke-width="3"/>
    <circle cx="120" cy="65" r="3" fill="${darken(color, 0.5)}"/>
    <circle cx="120" cy="190" r="3" fill="${darken(color, 0.5)}"/>
    <path d="M 95 65 Q 100 75 105 75 L 100 95 Z" fill="${darken(color, 0.2)}" stroke="${s}" stroke-width="1.5"/>
    <path d="M 145 65 Q 140 75 135 75 L 140 95 Z" fill="${darken(color, 0.2)}" stroke="${s}" stroke-width="1.5"/>
  `);
}

export function blazer(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 60 75 L 82 55 L 105 70 L 100 200 L 78 205 L 60 200 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <path d="M 180 75 L 158 55 L 135 70 L 140 200 L 162 205 L 180 200 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <path d="M 105 70 L 120 80 L 100 200 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <path d="M 135 70 L 120 80 L 140 200 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <circle cx="118" cy="110" r="3" fill="${darken(color, 0.4)}"/>
    <circle cx="118" cy="135" r="3" fill="${darken(color, 0.4)}"/>
  `);
}

export function denimJacket(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 55 80 L 78 55 L 100 75 L 100 200 L 78 200 L 55 195 Z" fill="${darken(color, 0.05)}" stroke="${s}" stroke-width="2"/>
    <path d="M 185 80 L 162 55 L 140 75 L 140 200 L 162 200 L 185 195 Z" fill="${darken(color, 0.05)}" stroke="${s}" stroke-width="2"/>
    <path d="M 100 75 L 140 75 L 140 200 L 100 200 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <line x1="120" y1="65" x2="120" y2="200" stroke="${darken(color, 0.4)}" stroke-width="3"/>
    <circle cx="120" cy="80" r="2.5" fill="#cccccc" stroke="${s}"/>
    <circle cx="120" cy="115" r="2.5" fill="#cccccc" stroke="${s}"/>
    <circle cx="120" cy="150" r="2.5" fill="#cccccc" stroke="${s}"/>
    <circle cx="120" cy="185" r="2.5" fill="#cccccc" stroke="${s}"/>
    <rect x="85" y="100" width="20" height="25" fill="none" stroke="${s}" stroke-width="1.5"/>
    <rect x="135" y="100" width="20" height="25" fill="none" stroke="${s}" stroke-width="1.5"/>
  `);
}

export function coat(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 55 75 L 80 50 L 100 65 L 95 215 L 80 220 L 55 215 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <path d="M 185 75 L 160 50 L 140 65 L 145 215 L 160 220 L 185 215 Z" fill="${color}" stroke="${s}" stroke-width="2"/>
    <path d="M 100 65 L 120 75 L 95 215 L 100 215 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <path d="M 140 65 L 120 75 L 145 215 L 140 215 Z" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <circle cx="120" cy="100" r="3" fill="${darken(color, 0.4)}"/>
    <circle cx="120" cy="135" r="3" fill="${darken(color, 0.4)}"/>
    <circle cx="120" cy="170" r="3" fill="${darken(color, 0.4)}"/>
  `);
}

// ---------- Bottoms ----------
export function jeans(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 75 50 L 165 50 L 168 75 L 158 220 L 130 220 L 122 100 L 110 100 L 102 220 L 72 220 L 75 75 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <line x1="120" y1="50" x2="120" y2="100" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="75" y1="60" x2="165" y2="60" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <rect x="82" y="65" width="20" height="22" rx="2" fill="none" stroke="${s}" stroke-width="1.5"/>
    <rect x="138" y="65" width="20" height="22" rx="2" fill="none" stroke="${s}" stroke-width="1.5"/>
  `);
}

export function cargo(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 70 50 L 170 50 L 172 75 L 162 220 L 130 220 L 122 100 L 110 100 L 102 220 L 68 220 L 72 75 Z"
      fill="${color}" stroke="${s}" stroke-width="2"/>
    <line x1="120" y1="50" x2="120" y2="100" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <rect x="62" y="115" width="32" height="40" rx="3" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <rect x="146" y="115" width="32" height="40" rx="3" fill="${darken(color, 0.1)}" stroke="${s}" stroke-width="2"/>
    <line x1="62" y1="135" x2="94" y2="135" stroke="${s}" stroke-width="1"/>
    <line x1="146" y1="135" x2="178" y2="135" stroke="${s}" stroke-width="1"/>
  `);
}

export function joggers(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 80 55 L 160 55 L 165 75 L 155 215 L 132 220 L 124 105 L 116 105 L 108 220 L 85 215 L 75 75 Z"
      fill="${color}" stroke="${s}" stroke-width="2"/>
    <rect x="78" y="55" width="84" height="8" rx="3" fill="${darken(color, 0.2)}" stroke="${s}" stroke-width="1.5"/>
    <line x1="120" y1="63" x2="120" y2="105" stroke="${darken(color, 0.4)}" stroke-width="1.5" stroke-dasharray="3 3"/>
  `);
}

export function chinos(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 78 55 L 162 55 L 165 75 L 155 220 L 130 220 L 122 100 L 118 100 L 110 220 L 85 220 L 75 75 Z"
      fill="${color}" stroke="${s}" stroke-width="2"/>
    <line x1="78" y1="60" x2="162" y2="60" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="120" y1="55" x2="120" y2="100" stroke="${darken(color, 0.3)}" stroke-width="1.5"/>
  `);
}

export function skirt(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 80 70 L 160 70 L 195 200 L 45 200 Z" fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <line x1="80" y1="78" x2="160" y2="78" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="120" y1="80" x2="120" y2="200" stroke="${darken(color, 0.2)}" stroke-width="1" stroke-dasharray="2 4"/>
  `);
}

// ---------- Dresses ----------
export function dress(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 90 60 L 95 50 Q 120 55 145 50 L 150 60 L 145 110 L 175 200 L 65 200 L 95 110 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 95 50 Q 120 60 145 50" fill="none" stroke="${s}" stroke-width="2"/>
    <line x1="100" y1="105" x2="140" y2="105" stroke="${darken(color, 0.3)}" stroke-width="1.5"/>
  `);
}

export function floralDress(color: string): string {
  const s = shadeStroke(color);
  const accent = darken(color, 0.25);
  return wrap(`
    <path d="M 90 60 L 95 50 Q 120 55 145 50 L 150 60 L 145 110 L 175 200 L 65 200 L 95 110 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="100" cy="130" r="4" fill="${accent}"/>
    <circle cx="120" cy="155" r="4" fill="${accent}"/>
    <circle cx="140" cy="135" r="4" fill="${accent}"/>
    <circle cx="85" cy="175" r="4" fill="${accent}"/>
    <circle cx="115" cy="185" r="4" fill="${accent}"/>
    <circle cx="155" cy="180" r="4" fill="${accent}"/>
    <path d="M 95 50 Q 120 60 145 50" fill="none" stroke="${s}" stroke-width="2"/>
  `);
}

// ---------- Shoes ----------
export function sneaker(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 30 130 L 50 100 Q 75 90 100 100 L 140 100 Q 170 105 200 130 L 210 160 L 200 175 L 30 175 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 30 160 L 210 160" stroke="${darken(color, 0.4)}" stroke-width="3"/>
    <line x1="100" y1="105" x2="100" y2="130" stroke="${s}" stroke-width="1.5"/>
    <line x1="120" y1="100" x2="120" y2="125" stroke="${s}" stroke-width="1.5"/>
    <line x1="140" y1="105" x2="140" y2="130" stroke="${s}" stroke-width="1.5"/>
    <ellipse cx="55" cy="115" rx="15" ry="8" fill="${darken(color, 0.2)}" opacity="0.5"/>
  `);
}

export function boot(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 70 60 L 145 60 L 150 130 L 195 145 L 200 175 L 60 175 L 60 145 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 60 165 L 200 165" stroke="${darken(color, 0.5)}" stroke-width="3"/>
    <line x1="90" y1="75" x2="115" y2="80" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="90" y1="95" x2="115" y2="100" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <line x1="90" y1="115" x2="115" y2="120" stroke="${darken(color, 0.4)}" stroke-width="2"/>
    <circle cx="90" cy="75" r="2" fill="#cccccc"/>
    <circle cx="115" cy="80" r="2" fill="#cccccc"/>
    <circle cx="90" cy="95" r="2" fill="#cccccc"/>
    <circle cx="115" cy="100" r="2" fill="#cccccc"/>
  `);
}

export function jordan(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 35 130 L 60 95 Q 90 88 120 95 L 165 95 Q 195 105 210 135 L 215 165 L 200 180 L 35 180 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 60 95 L 70 130 L 165 130 L 165 95" fill="${darken(color, 0.15)}" stroke="${s}" stroke-width="2"/>
    <path d="M 35 165 L 215 165" stroke="${darken(color, 0.5)}" stroke-width="3.5"/>
    <ellipse cx="180" cy="125" rx="22" ry="14" fill="${darken(color, 0.3)}" opacity="0.6"/>
  `);
}

export function loafer(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 40 135 Q 60 110 90 105 L 160 105 Q 195 110 205 140 L 200 170 L 45 170 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 110 110 Q 120 122 130 110" fill="none" stroke="${s}" stroke-width="2"/>
    <rect x="115" y="115" width="10" height="3" fill="${darken(color, 0.3)}"/>
    <path d="M 45 160 L 200 160" stroke="${darken(color, 0.4)}" stroke-width="2"/>
  `);
}

// ---------- Accessories ----------
export function sunglasses(color: string = "#1a1a1a"): string {
  const s = shadeStroke(color);
  return wrap(`
    <ellipse cx="80" cy="120" rx="35" ry="28" fill="${color}" stroke="${s}" stroke-width="2"/>
    <ellipse cx="160" cy="120" rx="35" ry="28" fill="${color}" stroke="${s}" stroke-width="2"/>
    <line x1="115" y1="115" x2="125" y2="115" stroke="${s}" stroke-width="3"/>
    <line x1="45" y1="105" x2="30" y2="95" stroke="${s}" stroke-width="3"/>
    <line x1="195" y1="105" x2="210" y2="95" stroke="${s}" stroke-width="3"/>
    <ellipse cx="68" cy="108" rx="10" ry="6" fill="#ffffff" opacity="0.3"/>
    <ellipse cx="148" cy="108" rx="10" ry="6" fill="#ffffff" opacity="0.3"/>
  `);
}

export function chain(color: string): string {
  return wrap(`
    <path d="M 60 80 Q 120 90 180 80" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="60" cy="80" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="80" cy="92" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="100" cy="98" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="120" cy="100" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="140" cy="98" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="160" cy="92" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <ellipse cx="180" cy="80" rx="8" ry="6" fill="none" stroke="${color}" stroke-width="3"/>
    <circle cx="120" cy="135" r="14" fill="none" stroke="${color}" stroke-width="3"/>
    <circle cx="120" cy="135" r="6" fill="${color}"/>
  `);
}

export function cap(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 60 130 Q 60 80 120 80 Q 180 80 180 130 L 175 145 L 65 145 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="120" cy="145" rx="100" ry="12" fill="${darken(color, 0.2)}" stroke="${s}" stroke-width="2"/>
    <circle cx="120" cy="100" r="5" fill="${darken(color, 0.3)}" stroke="${s}" stroke-width="1.5"/>
  `);
}

export function bag(color: string): string {
  const s = shadeStroke(color);
  return wrap(`
    <path d="M 80 70 Q 120 55 160 70" fill="none" stroke="${darken(color, 0.4)}" stroke-width="4"/>
    <path d="M 60 90 L 180 90 L 175 195 Q 120 200 65 195 Z"
      fill="${color}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="105" y="110" width="30" height="20" rx="3" fill="${darken(color, 0.15)}" stroke="${s}" stroke-width="1.5"/>
    <circle cx="120" cy="120" r="3" fill="${darken(color, 0.4)}"/>
  `);
}

// ---------- Helper: convert SVG string to data URI ----------
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
