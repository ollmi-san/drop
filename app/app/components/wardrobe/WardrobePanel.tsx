"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Plus, Trash2, ArrowUpDown, X } from "lucide-react";
import ClothingCard from "./ClothingCard";
import UploadModal from "./UploadModal";
import VibeFilter, { vibeScore } from "./VibeFilter";
import { useWardrobe, categoryToBadge, type Category } from "../../store/useWardrobe";
import { suggestNameForImage } from "../../lib/aiNaming";
import { playClickSound, playDropSound } from "../../lib/soundFx";

type FilterCategory = "Alle" | "Wishlist" | Category;
const CATEGORIES: { key: FilterCategory; emoji: string }[] = [
  { key: "Alle",        emoji: "🧺" },
  { key: "Wishlist",    emoji: "⏳" },
  { key: "Oberteile",   emoji: "👕" },
  { key: "Unterteile",  emoji: "👖" },
  { key: "Kleider",     emoji: "👗" },
  { key: "Schuhe",      emoji: "👟" },
  { key: "Jacken",      emoji: "🧥" },
  { key: "Accessoires", emoji: "💍" },
  { key: "Hüte",        emoji: "🧢" },
  { key: "Taschen",     emoji: "👜" },
  { key: "Schmuck",     emoji: "✨" },
  { key: "Sportswear",  emoji: "🏃" },
];

type SortMode = "neueste" | "favoriten" | "name";

export default function WardrobePanel() {
  const items           = useWardrobe((s) => s.items);
  const addItem         = useWardrobe((s) => s.addItem);
  const updateItemMeta  = useWardrobe((s) => s.updateItemMeta);
  const removeItem      = useWardrobe((s) => s.removeItem);
  const clearOutfit     = useWardrobe((s) => s.clearOutfit);
  const equipItem       = useWardrobe((s) => s.equipItem);
  const cleanupExpired  = useWardrobe((s) => s.cleanupExpired);
  const makePermanent   = useWardrobe((s) => s.makePermanent);

  const [activeCategory, setActiveCategory] = useState<FilterCategory>("Alle");
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sortMode, setSortMode]     = useState<SortMode>("neueste");
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);

  // Direct upload handler — item appears immediately, AI naming runs in background
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";                       // reset so same file can be re-selected

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // 1. Add placeholder immediately → card appears in grid at once
      const id = addItem({
        name:        "Wird analysiert…",
        nameEn:      "Analyzing…",
        category:    "Oberteile",
        badge:       "Top",
        badgeColor:  "#7C3AED",
        imageUrl:    dataUrl,
        bgFallback:  "#f5f3ff",
        liked:       false,
        source:      "owned",
      });

      // 2. AI naming in background — updates name + category when done
      try {
        const s = await suggestNameForImage(dataUrl);
        const { badge, color } = categoryToBadge(s.category);
        updateItemMeta(id, {
          name:       s.name,
          nameEn:     s.nameEn,
          category:   s.category,
          badge,
          badgeColor: color,
        });
      } catch {
        updateItemMeta(id, { name: file.name.replace(/\.[^.]+$/, "") });
      }

      playDropSound();
    };
    reader.readAsDataURL(file);
  }

  // Close settings on outside click
  useEffect(() => {
    if (!showSettings) return;
    function onDoc(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showSettings]);

  // Auto-cleanup expired wishlist items every minute (and on mount)
  useEffect(() => {
    const tick = () => {
      const removed = cleanupExpired();
      if (removed > 0) console.log(`Wishlist auto-cleanup: ${removed} items removed`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [cleanupExpired]);

  let filtered = items.filter((item) => {
    let matchCat;
    if (activeCategory === "Alle")          matchCat = true;
    else if (activeCategory === "Wishlist") matchCat = !!item.expiresAt;
    else                                    matchCat = item.category === activeCategory;
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortMode === "favoriten") {
    filtered = [...filtered].sort((a, b) => Number(b.liked) - Number(a.liked));
  } else if (sortMode === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }

  // Vibe: Matching-Items nach oben sortieren
  if (activeVibe) {
    filtered = [...filtered].sort((a, b) => {
      const sa = vibeScore(a.name, a.nameEn, activeVibe);
      const sb = vibeScore(b.name, b.nameEn, activeVibe);
      return sb - sa;
    });
  }

  return (
    <>
      <div
        className="flex flex-col border-r overflow-hidden w-full"
        style={{ background: "white", borderColor: "#E8E2DA" }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "#E8E2DA" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: "#111" }}>
              Mein Schrank
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch(""); }}
                title="Suche"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                style={{ background: showSearch ? "#F0EBF8" : "transparent" }}
              >
                <Search size={15} color={showSearch ? "#7B2FBE" : "#6B7280"} />
              </button>

              {/* Settings dropdown */}
              <div ref={settingsRef} className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Einstellungen"
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  style={{ background: showSettings ? "#F0EBF8" : "transparent" }}
                >
                  <SlidersHorizontal size={15} color={showSettings ? "#7B2FBE" : "#6B7280"} />
                </button>
                {showSettings && (
                  <div
                    className="absolute right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-50"
                    style={{ background: "white", border: "1px solid #E8E2DA", width: 220 }}
                  >
                    <div className="px-3 py-2 border-b text-xs font-semibold" style={{ color: "#6B7280", borderColor: "#E8E2DA" }}>
                      <ArrowUpDown size={11} className="inline mr-1" /> Sortierung
                    </div>
                    {[
                      { key: "neueste" as const,   label: "Neueste zuerst" },
                      { key: "favoriten" as const, label: "Favoriten oben" },
                      { key: "name" as const,      label: "Name A–Z" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortMode(opt.key); setShowSettings(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-purple-50 transition-colors text-left"
                        style={{ color: "#111" }}
                      >
                        {opt.label}
                        {sortMode === opt.key && <span style={{ color: "#7B2FBE" }}>✓</span>}
                      </button>
                    ))}
                    <div className="px-3 py-2 border-t border-b text-xs font-semibold" style={{ color: "#6B7280", borderColor: "#E8E2DA" }}>
                      Aktionen
                    </div>
                    <button
                      onClick={() => { clearOutfit(); setShowSettings(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 transition-colors text-left"
                      style={{ color: "#DC2626" }}
                    >
                      <Trash2 size={13} />
                      Outfit zurücksetzen
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#7B2FBE", color: "white" }}
              >
                <Plus size={13} strokeWidth={3} />
                Hochladen
              </button>
              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {showSearch && (
            <div className="relative mb-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suche... / Search..."
                className="w-full px-3 py-2 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#E8E2DA" }}
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  <X size={12} color="#9CA3AF" />
                </button>
              )}
            </div>
          )}

          {/* Category Chips — horizontal scroll */}
          <div
            className="flex gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none", paddingBottom: 2 }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const isWishlist = cat.key === "Wishlist";
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isActive
                      ? (isWishlist ? "#92400E" : "#111")
                      : (isWishlist ? "#FEF3C7" : "#F5F3FF"),
                    color: isActive
                      ? "white"
                      : (isWishlist ? "#92400E" : "#6B21A8"),
                    border: `1.5px solid ${isActive
                      ? (isWishlist ? "#92400E" : "#111")
                      : (isWishlist ? "#FCD34D" : "#DDD6FE")}`,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{cat.emoji}</span>
                  {cat.key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vibe Filter */}
        <div className="px-3 pt-2.5 pb-1 border-b" style={{ borderColor: "#F0EEE8" }}>
          <VibeFilter activeVibe={activeVibe} onSelect={setActiveVibe} />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeCategory === "Wishlist" && filtered.length > 0 && (
            <div className="mb-3 p-2.5 rounded-lg text-xs leading-relaxed" style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FCD34D" }}>
              ⏳ <strong>Probier-Modus.</strong> Diese Teile gehören dir noch nicht — du kannst sie testen.
              Klick aufs Item für Kaufen / Verwerfen Optionen. Nach Ablauf werden sie automatisch entfernt.
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center" style={{ color: "#9CA3AF" }}>
              <span style={{ fontSize: 32 }}>{activeCategory === "Wishlist" ? "⏳" : "👕"}</span>
              <p className="text-sm font-medium">
                {activeCategory === "Wishlist" ? "Wishlist ist leer" : "Nichts gefunden"}
              </p>
              <p className="text-xs">
                {activeCategory === "Wishlist"
                  ? "Lade ein Foto hoch und wähle 1/7/30 Tage testen"
                  : "Lade dein erstes Teil hoch!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {filtered.map((item) => {
                const hasVibe = activeVibe ? vibeScore(item.name, item.nameEn, activeVibe) > 0 : false;
                return (
                  <div key={item.id} className="relative">
                    <CardWithActions
                      id={item.id}
                      onDelete={removeItem}
                      onMakePermanent={makePermanent}
                    />
                    {hasVibe && (
                      <div
                        className="absolute bottom-1 left-1 right-1 flex items-center justify-center py-0.5 rounded-md text-[9px] font-bold z-10 pointer-events-none"
                        style={{ background: "rgba(123,47,190,0.88)", color: "white", letterSpacing: 0.3 }}
                      >
                        {activeVibe}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-3 border-t" style={{ borderColor: "#E8E2DA" }}>
          <button
            onClick={() => {
              if (items.length < 3) { alert("Lade mind. 3 Teile hoch um Vorschläge zu erhalten."); return; }
              // Generate random complete outfit from available items
              const tops    = items.filter(i => i.badge === "Top");
              const bottoms = items.filter(i => i.badge === "Bottom");
              const shoes   = items.filter(i => i.badge === "Shoes");
              const accs    = items.filter(i => i.badge === "Accessory");
              const pick = <T,>(arr: T[]): T | null => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
              const t = pick(tops); const b = pick(bottoms); const s = pick(shoes); const a = pick(accs);
              if (t) equipItem(t.id);
              if (b) equipItem(b.id);
              if (s) equipItem(s.id);
              if (a) equipItem(a.id);
              playDropSound();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#111", color: "white" }}
          >
            <Sparkles size={15} />
            Outfit vorschlagen lassen
          </button>

          <div className="mt-2 p-2.5 rounded-lg text-xs" style={{ background: "#F0EBF8", color: "#7B2FBE" }}>
            <span className="font-semibold">✦ Tipp der KI</span>
            <br />
            {items.length < 3 && "Lade mind. 3 Teile hoch — dann hab ich was zum Kombinieren."}
            {items.length >= 3 && items.length < 6 && "Da geht was ✦ — noch ein paar Teile und ich erstelle Outfits."}
            {items.length >= 6 && `Du hast ${items.length} Teile — Outfit-Vorschläge sind aktiv!`}
          </div>
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}

// Wrapper with delete + (for wishlist items) "Kaufen/Verwerfen"
function CardWithActions({
  id,
  onDelete,
  onMakePermanent,
}: {
  id: string;
  onDelete: (id: string) => void;
  onMakePermanent: (id: string) => void;
}) {
  const item = useWardrobe((s) => s.items.find((i) => i.id === id));
  if (!item) return null;
  const isWishlist = !!item.expiresAt;
  return (
    <div className="relative group">
      <ClothingCard item={item} />

      {/* Wishlist actions overlay — appears on hover */}
      {isWishlist && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-1 opacity-0 group-hover:opacity-100 transition-all"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`"${item.name}" gekauft? Dann wird's permanent in deinem Schrank.`)) {
                onMakePermanent(id);
              }
            }}
            className="w-full py-1 rounded-md text-[10px] font-bold transition"
            style={{ background: "#22C55E", color: "white" }}
          >
            ✓ Gekauft
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`"${item.name}" verwerfen?`)) onDelete(id);
            }}
            className="w-full py-1 rounded-md text-[10px] font-bold transition"
            style={{ background: "#DC2626", color: "white" }}
          >
            ✕ Verwerfen
          </button>
        </div>
      )}

      {/* Permanent items: small delete on hover */}
      {!isWishlist && (
        <button
          onClick={(e) => { e.stopPropagation(); if (confirm(`"${item.name}" wirklich löschen?`)) onDelete(id); }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
          style={{ background: "white", border: "1px solid #E8E2DA" }}
          title="Löschen"
        >
          <X size={11} color="#DC2626" />
        </button>
      )}
    </div>
  );
}
