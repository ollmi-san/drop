"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useWardrobe, type WardrobeItem } from "../../store/useWardrobe";
import { playDropSound, playClickSound } from "../../lib/soundFx";

interface Suggestion {
  items: WardrobeItem[];
}

function generateSuggestions(items: WardrobeItem[]): Suggestion[] {
  const tops     = items.filter((i) => i.badge === "Top");
  const bottoms  = items.filter((i) => i.badge === "Bottom");
  const shoes    = items.filter((i) => i.badge === "Shoes");
  const accs     = items.filter((i) => i.badge === "Accessory");

  if (tops.length === 0 && bottoms.length === 0) return [];

  function pick<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 3 verschiedene Vorschläge (vermeidet Wiederholung)
  const suggestions: Suggestion[] = [];
  const usedTops = new Set<string>();
  const usedBottoms = new Set<string>();

  for (let attempt = 0; attempt < 20 && suggestions.length < 3; attempt++) {
    const top    = pick(tops.filter(t => !usedTops.has(t.id)));
    const bottom = pick(bottoms.filter(b => !usedBottoms.has(b.id)));
    const shoe   = pick(shoes);
    const acc    = Math.random() > 0.5 ? pick(accs) : null;

    const combo: WardrobeItem[] = [];
    if (top)    { combo.push(top);    usedTops.add(top.id); }
    if (bottom) { combo.push(bottom); usedBottoms.add(bottom.id); }
    if (shoe)   combo.push(shoe);
    if (acc)    combo.push(acc);

    if (combo.length >= 2) suggestions.push({ items: combo });
  }
  return suggestions;
}

export default function StyleSuggestions() {
  const items    = useWardrobe((s) => s.items);
  const equipItem = useWardrobe((s) => s.equipItem);

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => generateSuggestions(items));
  const [spinning, setSpinning] = useState(false);

  const refresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => {
      setSuggestions(generateSuggestions(items));
      setSpinning(false);
      playClickSound();
    }, 320);
  }, [items]);

  function applyAll(suggestion: Suggestion) {
    suggestion.items.forEach((it) => equipItem(it.id));
    playDropSound();
  }

  return (
    <div className="h-full flex flex-col px-4 pt-3 pb-2" style={{ background: "white", borderTop: "1px solid #EBEBF0", borderLeft: "1px solid #EBEBF0" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#111" }}>
          <Sparkles size={14} color="#7B2FBE" />
          Style Vorschläge für dich
        </h3>
        <button
          onClick={refresh}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all hover:bg-purple-50"
          style={{ color: "#7B2FBE" }}
        >
          <RefreshCw size={11} className={spinning ? "animate-spin" : ""} />
          Neu generieren
        </button>
      </div>
      <p className="text-xs mb-2 shrink-0" style={{ color: "#9CA3AF" }}>
        Basierend auf deinen Teilen im Schrank
      </p>

      {suggestions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Füge mindestens 2 Kleidungsstücke hinzu
          </p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="shrink-0 rounded-2xl overflow-hidden flex flex-col"
              style={{
                width: 170,
                background: "white",
                border: "1.5px solid #EEEEF4",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              {/* Items flat-lay */}
              <div className="flex items-center justify-center gap-1.5 p-3 flex-1 flex-wrap">
                {sug.items.map((item, i) => (
                  <span key={item.id} className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ background: "#F5F5F8" }}>
                      {item.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" style={{ padding: 2 }} />
                        : <span style={{ fontSize: 20 }}>👕</span>
                      }
                    </div>
                    {i < sug.items.length - 1 && (
                      <span style={{ fontSize: 10, color: "#D1D5DB", margin: "0 1px" }}>+</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Anziehen-Button */}
              <button
                onClick={() => applyAll(sug)}
                className="w-full py-2.5 font-semibold text-xs transition-opacity hover:opacity-90 active:scale-95 transition-transform"
                style={{ background: "#7B2FBE", color: "white" }}
              >
                Anziehen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
