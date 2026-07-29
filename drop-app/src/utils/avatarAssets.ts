import type { AvatarGender, AvatarView } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR ASSETS
//
// Tausch-Anleitung für echte PNG-Avatare:
//
//  1. Lege deine Dateien unter /public/avatars/ ab:
//       avatar-female-front.png
//       avatar-female-side.png
//       avatar-female-back.png
//       avatar-male-front.png
//       avatar-male-side.png
//       avatar-male-back.png
//
//  2. Ändere EXTENSION unten von 'svg' auf 'png'
//
//  Das war's. Keine weiteren Änderungen nötig.
// ─────────────────────────────────────────────────────────────────────────────

const EXTENSION = 'svg'; // ← hier auf 'png' wechseln wenn echte Fotos vorhanden

export function getAvatarSrc(gender: AvatarGender, view: AvatarView): string {
  return `/avatars/avatar-${gender}-${view}.${EXTENSION}`;
}

// Falls du für eine Ansicht noch kein Bild hast, kannst du hier Fallbacks setzen:
export const AVATAR_FALLBACKS: Partial<Record<`${AvatarGender}-${AvatarView}`, string>> = {
  // 'female-side': '/avatars/avatar-female-front.png',  // Beispiel
};

export function getAvatarSrcWithFallback(gender: AvatarGender, view: AvatarView): string {
  const key = `${gender}-${view}` as `${AvatarGender}-${AvatarView}`;
  return AVATAR_FALLBACKS[key] ?? getAvatarSrc(gender, view);
}
