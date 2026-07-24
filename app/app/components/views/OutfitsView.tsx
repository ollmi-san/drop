"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useWardrobe } from "../../store/useWardrobe";
import { useApp } from "../../store/useApp";

export default function OutfitsView() {
  const items          = useWardrobe((s) => s.items);
  const savedOutfits   = useWardrobe((s) => s.savedOutfits);
  const loadOutfit     = useWardrobe((s) => s.loadOutfit);
  const deleteOutfit   = useWardrobe((s) => s.deleteOutfit);
  const toggleOutfitFav= useWardrobe((s) => s.toggleOutfitFav);
  const setTab         = useApp((s) => s.setTab);

  const [selected, setSelected] = useState<string | null>(savedOutfits[0]?.id ?? null);

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#111" }}>Gespeicherte Outfits</h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          Klicke auf ein Outfit um es auf deinen Avatar zu laden — oder erstelle ein neues.
        </p>

        {savedOutfits.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "white", border: "1px dashed #E8E2DA" }}>
            <p className="text-lg mb-2" style={{ color: "#6B7280" }}>Noch keine Outfits gespeichert</p>
            <p className="text-sm mb-4" style={{ color: "#9CA3AF" }}>Stelle ein Outfit zusammen und klicke auf "Speichern"</p>
            <button onClick={() => setTab("schrank")} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#7B2FBE", color: "white" }}>
              Zum Schrank →
            </button>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {savedOutfits.map((o) => {
              const outfitItems = o.itemIds
                .map((id) => items.find((it) => it.id === id))
                .filter(Boolean) as typeof items;
              const isSelected = selected === o.id;
              return (
                <div key={o.id} className="relative group">
                  <button
                    onClick={() => { setSelected(o.id); loadOutfit(o.id); setTab("schrank"); }}
                    className="w-full relative rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{ background: "white", border: `2px solid ${isSelected ? "#7B2FBE" : "#E8E2DA"}`, textAlign: "left" }}
                  >
                    <div className="aspect-[3/4] flex flex-col items-center justify-center p-3 gap-1.5" style={{ background: "#FAFAF6" }}>
                      {outfitItems.map((it) => (
                        <div key={it.id} className="w-20 h-20 rounded-lg overflow-hidden" style={{ background: "white" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.imageUrl} alt={it.name} className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                    <div className="p-3 flex items-center justify-between" style={{ borderTop: "1px solid #EFE9E0" }}>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#111" }}>{o.name}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{o.date}</p>
                      </div>
                    </div>
                  </button>
                  {/* Fav + Delete actions */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleOutfitFav(o.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition hover:scale-110"
                    style={{ background: "white" }}
                  >
                    <Star size={14} fill={o.fav ? "#F59E0B" : "none"} color={o.fav ? "#F59E0B" : "#9CA3AF"} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(`"${o.name}" löschen?`)) deleteOutfit(o.id); }}
                    className="absolute top-2 right-12 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition"
                    style={{ background: "white" }}
                  >
                    <Trash2 size={13} color="#DC2626" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
