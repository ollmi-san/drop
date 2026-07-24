"use client";

import { X } from "lucide-react";

export const VIBES: Record<string, { keywords: string[]; emoji: string; color: string }> = {
  "Clean Girl":     { keywords: ["crop", "weiß", "beige", "creme", "tank", "basic", "white", "linen", "minimal", "neutral", "weiss"], emoji: "🤍", color: "#F0E6FF" },
  "Mob Wife":       { keywords: ["pelz", "leo", "gold", "chain", "maxi", "fur", "dramatic", "silk", "bold", "kette", "mantel"],        emoji: "🖤", color: "#1a1a1a" },
  "Gorpcore":       { keywords: ["fleece", "cargo", "vest", "outdoor", "hiking", "functional", "parka", "utility", "weste"],            emoji: "🏔️", color: "#2D5016" },
  "Stealth Wealth": { keywords: ["beige", "cashmere", "blazer", "neutral", "quiet", "minimal", "loafer", "trench", "kaschmir"],         emoji: "💎", color: "#8B7355" },
  "Brat":           { keywords: ["crop", "grün", "green", "halter", "mini", "party", "neon", "bold", "brat", "gelb"],                   emoji: "💚", color: "#86B22D" },
  "Casualcore":     { keywords: ["hoodie", "jogger", "sneaker", "comfortable", "relaxed", "everyday", "sweat", "jogging"],              emoji: "🛋️", color: "#5B7FA6" },
};

export function vibeScore(name: string, nameEn: string, vibe: string): number {
  const text = (name + " " + nameEn).toLowerCase();
  return VIBES[vibe].keywords.filter((kw) => text.includes(kw)).length;
}

interface Props {
  activeVibe: string | null;
  onSelect: (vibe: string | null) => void;
}

export default function VibeFilter({ activeVibe, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0" style={{ scrollbarWidth: "none" }}>
      <span className="text-xs font-semibold shrink-0" style={{ color: "#9CA3AF" }}>Vibe:</span>
      {Object.entries(VIBES).map(([vibe, meta]) => {
        const isActive = activeVibe === vibe;
        const isMobWife = vibe === "Mob Wife";
        return (
          <button
            key={vibe}
            onClick={() => onSelect(isActive ? null : vibe)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 hover:scale-105 active:scale-95"
            style={{
              background: isActive
                ? (isMobWife ? "#1a1a1a" : meta.color)
                : "white",
              color: isActive
                ? (isMobWife ? "white" : meta.color === "#F0E6FF" ? "#7B2FBE" : meta.color === "#86B22D" ? "#3d5410" : meta.color === "#5B7FA6" ? "#1e3a5a" : meta.color === "#8B7355" ? "#3d2f1a" : meta.color === "#2D5016" ? "#e8f5d0" : "white")
                : "#6B7280",
              border: isActive
                ? `2px solid ${isMobWife ? "#1a1a1a" : meta.color}`
                : "1.5px solid #E8E8EE",
              boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          >
            <span>{meta.emoji}</span>
            <span>{vibe}</span>
            {isActive && (
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.15)", fontSize: 10 }}
              >
                <X size={9} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
