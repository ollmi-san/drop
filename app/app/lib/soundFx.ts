"use client";

// Programmatic "drop" sound using Web Audio API
// No external file = no adblocker problems, instant playback
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

/**
 * Short whoosh-pop sound when an item lands in the wardrobe.
 * Two oscillators: a downward whoosh (sine) + a soft click (square).
 */
export function playDropSound(volume = 0.25) {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Whoosh — sine wave sliding down
  const whoosh = ctx.createOscillator();
  whoosh.type = "sine";
  whoosh.frequency.setValueAtTime(800, now);
  whoosh.frequency.exponentialRampToValueAtTime(180, now + 0.18);

  const whooshGain = ctx.createGain();
  whooshGain.gain.setValueAtTime(volume * 0.7, now);
  whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  whoosh.connect(whooshGain).connect(ctx.destination);
  whoosh.start(now);
  whoosh.stop(now + 0.25);

  // Pop — short triangle blip at the end
  const pop = ctx.createOscillator();
  pop.type = "triangle";
  pop.frequency.setValueAtTime(220, now + 0.16);
  pop.frequency.exponentialRampToValueAtTime(440, now + 0.22);

  const popGain = ctx.createGain();
  popGain.gain.setValueAtTime(0, now);
  popGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.17);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  pop.connect(popGain).connect(ctx.destination);
  pop.start(now + 0.16);
  pop.stop(now + 0.3);
}

/** Soft click for UI feedback */
export function playClickSound(volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

  const g = ctx.createGain();
  g.gain.setValueAtTime(volume, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(g).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}
