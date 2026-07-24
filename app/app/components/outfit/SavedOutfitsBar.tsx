"use client";

import { Star, ChevronRight } from "lucide-react";
import { useWardrobe } from "../../store/useWardrobe";
import { useApp } from "../../store/useApp";
import { playClickSound, playDropSound } from "../../lib/soundFx";

export default function SavedOutfitsBar() {
  const items         = useWardrobe((s) => s.items);
  const savedOutfits  = useWardrobe((s) => s.savedOutfits);
  const outfit        = useWardrobe((s) => s.outfit);
  const loadOutfit    = useWardrobe((s) => s.loadOutfit);
  const toggleFav     = useWardrobe((s) => s.toggleOutfitFav);
  const setTab        = useApp((s) => s.setTab);

  function getItem(id: string | null) {
    if (!id) return null;
    return items.find((it) => it.id === id) ?? null;
  }

  // Welches Outfit ist aktuell geladen?
  function isActive(outfitId: string): boolean {
    const saved = savedOutfits.find((o) => o.id === outfitId);
    if (!saved) return false;
    return saved.itemIds.every((id) => Object.values(outfit).includes(id));
  }

  return (
    <div className="h-full flex flex-col px-4 pt-3 pb-2" style={{ background: "white", borderTop: "1px solid #EBEBF0" }}>
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-sm font-bold" style={{ color: "#111" }}>Gespeicherte Outfits</h3>
        <button
          onClick={() => { setTab("outfits"); playClickSound(); }}
          className="flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "#7B2FBE" }}
        >
          Alle <ChevronRight size={12} />
        </button>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs" style={{ color: "#9CA3AF" }}>Noch keine Outfits gespeichert</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: "none" }}>
          {savedOutfits.map((saved) => {
            const active = isActive(saved.id);
            // Bis zu 4 Items des Outfits
            const outfitItems = saved.itemIds.slice(0, 4).map(getItem).filter(Boolean);

            return (
              <button
                key={saved.id}
                onClick={() => { loadOutfit(saved.id); playDropSound(); }}
                className="flex flex-col gap-1.5 shrink-0 rounded-2xl p-2 transition-all hover:scale-[1.02] active:scale-95 text-left"
                style={{
                  width: 116,
                  background: "white",
                  border: `2px solid ${active ? "#7B2FBE" : "#EEEEF4"}`,
                  boxShadow: active ? "0 2px 12px rgba(123,47,190,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {/* Thumbnail grid */}
                <div className="grid grid-cols-2 gap-1" style={{ height: 70 }}>
                  {[0, 1, 2, 3].map((i) => {
                    const item = outfitItems[i];
                    return (
                      <div key={i} className="rounded-lg overflow-hidden flex items-center justify-center"
                        style={{ background: "#F5F5F8" }}>
                        {item?.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={item.imageUrl} alt="" className="w-full h-full object-contain" style={{ padding: 2 }} />
                          : <span style={{ fontSize: 14, opacity: 0.2 }}>—</span>
                        }
                      </div>
                    );
                  })}
                </div>

                {/* Name + Date */}
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="font-semibold truncate" style={{ fontSize: 10, color: "#111", lineHeight: 1.3 }}>
                      {saved.name || "Outfit"}
                    </p>
                    <p style={{ fontSize: 9, color: "#9CA3AF" }}>
                      {new Date(saved.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(saved.id); playClickSound(); }}
                    className="shrink-0 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={13}
                      fill={saved.fav ? "#F59E0B" : "none"}
                      color={saved.fav ? "#F59E0B" : "#D1D5DB"}
                    />
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
