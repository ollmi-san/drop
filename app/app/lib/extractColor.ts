"use client";

/**
 * Extract the dominant non-background color from an image dataURL.
 * Samples pixels in a grid, ignores near-white (background) and near-transparent.
 * Returns a hex color like "#3b5a8c".
 */
export function extractDominantColor(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 64; // small for speed
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("#888888");
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const buckets: Record<string, { count: number; r: number; g: number; b: number }> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 200) continue;                       // skip transparent
        if (r > 240 && g > 240 && b > 240) continue; // skip white background
        if (r < 15 && g < 15 && b < 15) continue;    // skip pure black

        // Quantize to reduce buckets
        const qr = r >> 4, qg = g >> 4, qb = b >> 4;
        const key = `${qr},${qg},${qb}`;
        if (!buckets[key]) buckets[key] = { count: 0, r: 0, g: 0, b: 0 };
        buckets[key].count++;
        buckets[key].r += r;
        buckets[key].g += g;
        buckets[key].b += b;
      }

      let best: { count: number; r: number; g: number; b: number } | null = null;
      for (const k in buckets) {
        if (!best || buckets[k].count > best.count) best = buckets[k];
      }
      if (!best || best.count === 0) return resolve("#888888");

      const r = Math.round(best.r / best.count);
      const g = Math.round(best.g / best.count);
      const b = Math.round(best.b / best.count);
      const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      resolve(hex);
    };
    img.onerror = () => resolve("#888888");
    img.src = dataUrl;
  });
}
