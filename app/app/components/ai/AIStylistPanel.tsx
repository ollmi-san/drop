"use client";

import { useMemo, useState } from "react";
import { RefreshCw, ThumbsUp, ThumbsDown, Sparkles, Wand2, Plus } from "lucide-react";
import { useWardrobe } from "../../store/useWardrobe";
import {
  useApp,
  WEATHER_OPTIONS,
  OCCASION_OPTIONS,
  ACTIVITY_OPTIONS,
} from "../../store/useApp";
import { playClickSound, playDropSound } from "../../lib/soundFx";

interface Suggestion {
  id: string;
  items: ReturnType<typeof useWardrobe.getState>["items"];
  match: number;
}

export default function AIStylistPanel() {
  const items     = useWardrobe((s) => s.items);
  const equipItem = useWardrobe((s) => s.equipItem);
  const weather   = useApp((s) => s.weather);
  const weatherTemp = useApp((s) => s.weatherTemp);
  const occasion  = useApp((s) => s.occasion);
  const activity  = useApp((s) => s.activity);

  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [seed, setSeed]         = useState(0);
  const [toast, setToast]       = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  // ── Outfit anpassen lassen ────────────────────────────────────────────────
  // Scores each item by how many occasion + weather keywords match its name.
  // Equips the highest-scoring top, bottom, shoes (+ best accessory if any).
  function optimizeOutfit() {
    const OCCASION_KW: Record<string, string[]> = {
      buero:    ["blazer", "chino", "hemd", "bluse", "loafer", "formal", "beige", "business", "klassisch"],
      date:     ["kleid", "dress", "heel", "elegant", "schick", "silk", "feminin"],
      freizeit: ["jeans", "sneaker", "hoodie", "casual", "jogger", "comfortable", "relaxed"],
      sport:    ["sneaker", "jogger", "sport", "cargo", "running", "funktional"],
      party:    ["kleid", "dress", "heel", "elegant", "party", "nacht", "schick"],
      shopping: ["jeans", "sneaker", "casual", "comfortable", "boots"],
      uni:      ["jeans", "sneaker", "hoodie", "casual", "rucksack", "basics"],
      festlich: ["kleid", "dress", "heel", "elegant", "anzug", "festlich", "silk"],
    };
    const WEATHER_KW: Record<string, string[]> = {
      sunny: ["tank", "kurz", "shorts", "leicht", "sommer", "t-shirt"],
      warm:  ["tank", "kurz", "shorts", "leicht", "sommer"],
      cloudy:["jeans", "pullover", "sweater", "leicht"],
      rainy: ["jacke", "mantel", "stiefel", "boot", "coat", "jacket"],
      windy: ["jacke", "mantel", "coat", "jacket"],
      snowy: ["mantel", "stiefel", "boot", "coat", "warm", "fleece"],
      cold:  ["mantel", "stiefel", "boot", "coat", "fleece", "pulli", "wolle"],
    };

    const keywords = [
      ...(OCCASION_KW[occasion] ?? []),
      ...(WEATHER_KW[weather]   ?? []),
    ];

    function score(item: { name: string; nameEn: string; category: string }): number {
      const text = `${item.name} ${item.nameEn} ${item.category}`.toLowerCase();
      return keywords.filter((kw) => text.includes(kw)).length;
    }

    const best = <T extends { name: string; nameEn: string; category: string }>(arr: T[]): T | null =>
      arr.length === 0 ? null : arr.reduce((a, b) => (score(b) > score(a) ? b : a));

    const t = best(items.filter((i) => i.badge === "Top"));
    const b = best(items.filter((i) => i.badge === "Bottom"));
    const s = best(items.filter((i) => i.badge === "Shoes"));
    const a = best(items.filter((i) => i.badge === "Accessory"));

    if (t) equipItem(t.id);
    if (b) equipItem(b.id);
    if (s) equipItem(s.id);
    if (a) equipItem(a.id);

    playDropSound();
    showToast(`✦ Outfit für ${occasionOpt.label} · ${weatherOpt.label} optimiert`);
  }

  const suggestions: Suggestion[] = useMemo(() => {
    const tops    = items.filter((i) => i.badge === "Top");
    const bottoms = items.filter((i) => i.badge === "Bottom");
    const shoes   = items.filter((i) => i.badge === "Shoes");
    const accs    = items.filter((i) => i.badge === "Accessory");
    if (tops.length === 0 || bottoms.length === 0) return [];

    const pick = <T,>(arr: T[], offset: number): T | null =>
      arr.length ? arr[(offset + seed) % arr.length] : null;

    const out: Suggestion[] = [];
    for (let i = 0; i < 3; i++) {
      const top    = pick(tops, i);
      const bottom = pick(bottoms, i + 1);
      const shoe   = pick(shoes, i + 2);
      const acc    = accs.length > 0 ? pick(accs, i) : null;
      const combo  = [top, bottom, shoe, acc].filter(Boolean) as typeof items;
      if (combo.length >= 2) {
        out.push({ id: `sug-${i}-${seed}`, items: combo, match: 86 + i * 4 });
      }
    }
    return out;
  }, [items, seed]);

  const weatherOpt  = WEATHER_OPTIONS.find((w) => w.value === weather)   ?? WEATHER_OPTIONS[0];
  const occasionOpt = OCCASION_OPTIONS.find((o) => o.value === occasion) ?? OCCASION_OPTIONS[0];
  const activityOpt = ACTIVITY_OPTIONS.find((a) => a.value === activity) ?? ACTIVITY_OPTIONS[0];

  return (
    <div
      className="flex flex-col overflow-hidden w-full h-full relative"
      style={{ background: "white", borderLeft: "1px solid #EBEBF0" }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="absolute top-14 left-1/2 z-40 px-4 py-2 rounded-xl text-sm font-medium shadow-lg pointer-events-none"
          style={{ transform: "translateX(-50%)", background: "rgba(17,17,17,0.88)", color: "white", whiteSpace: "nowrap" }}
        >
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ borderColor: "#EBEBF0" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} color="#7B2FBE" />
          <span className="font-bold text-sm" style={{ color: "#111" }}>KI Stylist</span>
        </div>
        <button
          onClick={() => { setSeed((s) => s + 1); playClickSound(); }}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors"
          style={{ color: "#7B2FBE" }}
        >
          <RefreshCw size={11} />
          Neu
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* Chat bubble */}
        <div className="px-4 pt-4 pb-3">
          <div
            className="relative p-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
            style={{ background: "#F5F0FF", border: "1px solid #E9D5FF", color: "#374151" }}
          >
            {/* Bubble pointer */}
            <div
              className="absolute -top-2 left-4 w-4 h-4 rotate-45"
              style={{ background: "#F5F0FF", borderTop: "1px solid #E9D5FF", borderLeft: "1px solid #E9D5FF" }}
            />
            {suggestions.length > 0
              ? `Hey! Ich hab ${suggestions.length} Outfits für deinen ${occasionOpt.label}-Tag zusammengestellt — perfekt für ${weatherTemp}°C.`
              : "Lade mind. 3 Kleidungsstücke hoch — dann erstelle ich Outfits speziell für dich."
            }
          </div>
        </div>

        {/* Context chips */}
        <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
          <CtxBadge emoji={weatherOpt.emoji}  label={`${weatherTemp}°C ${weatherOpt.label}`} />
          <CtxBadge emoji={occasionOpt.emoji} label={occasionOpt.label} />
          <CtxBadge emoji={activityOpt.emoji} label={activityOpt.label} />
        </div>

        {/* Vorschläge */}
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold mb-2.5" style={{ color: "#9CA3AF" }}>Vorschläge</p>

          {suggestions.length === 0 ? (
            <div
              className="rounded-xl p-4 text-center text-xs leading-relaxed"
              style={{ background: "#FFF7ED", color: "#92400E", border: "1px solid #FDE68A" }}
            >
              Lade mind. 2 Tops und 1 Bottom hoch — dann erstelle ich Outfit-Vorschläge für dich.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="rounded-2xl overflow-hidden border transition-all hover:border-purple-300 hover:shadow-md group"
                  style={{ borderColor: "#EEEEF4" }}
                >
                  {/* Thumbnails row */}
                  <div className="flex items-center gap-1.5 p-2.5" style={{ background: "#FAFAFA" }}>
                    {sug.items.slice(0, 3).map((it) => (
                      <div
                        key={it.id}
                        className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ background: "#F0EEF8" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-contain"
                          style={{ padding: 2 }}
                        />
                      </div>
                    ))}
                    {/* + Button */}
                    <button
                      onClick={() => showToast("Item hinzufügen kommt bald ✦")}
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all hover:bg-purple-50 ml-auto"
                      style={{ border: "1.5px dashed #D8B4FE", color: "#A855F7" }}
                    >
                      <Plus size={16} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Action bar */}
                  <div
                    className="flex items-center justify-between px-3 py-2"
                    style={{ background: "white", borderTop: "1px solid #F0EEF8" }}
                  >
                    <span style={{ fontSize: 11, color: "#7B2FBE", fontWeight: 700 }}>
                      {sug.match}% Match
                    </span>
                    <button
                      onClick={() => { sug.items.forEach((it) => equipItem(it.id)); playDropSound(); }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: "#7B2FBE", color: "white" }}
                    >
                      Anziehen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mehr Vorschläge */}
        <div className="px-4 pt-1 pb-4">
          <button
            onClick={() => { setSeed((s) => s + 1); playClickSound(); }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all hover:bg-gray-50"
            style={{ borderColor: "#E8E2DA", color: "#6B7280" }}
          >
            <RefreshCw size={12} />
            Mehr Vorschläge
          </button>
        </div>

        {/* Feedback */}
        <div
          className="px-4 pb-4 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "#F0EEF8" }}
        >
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Feedback geben</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setFeedback("up"); playClickSound(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: feedback === "up" ? "#D1FAE5" : "#F3F4F6",
                color:      feedback === "up" ? "#059669" : "#6B7280",
              }}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              onClick={() => { setFeedback("down"); playClickSound(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: feedback === "down" ? "#FEE2E2" : "#F3F4F6",
                color:      feedback === "down" ? "#DC2626" : "#6B7280",
              }}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Outfit anpassen CTA (sticky bottom) ── */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "#EBEBF0" }}>
        <button
          onClick={optimizeOutfit}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7B2FBE 0%, #9B59D4 100%)",
            color:      "white",
            boxShadow:  "0 4px 16px rgba(123,47,190,0.32)",
          }}
        >
          <Wand2 size={15} />
          Outfit anpassen lassen
        </button>
      </div>
    </div>
  );
}

// ── Context badge ─────────────────────────────────────────────────────────────
function CtxBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: "#F5F0FF", border: "1px solid #DDD6FE", color: "#6B21A8" }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}
