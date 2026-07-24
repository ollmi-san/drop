"use client";

import { Sparkles, Check, X, ShoppingBag, MapPin, Calendar, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useWardrobe } from "../../store/useWardrobe";
import { useApp } from "../../store/useApp";
import { CELEBRITY_OUTFITS, matchOutfitToWardrobe, type CelebrityOutfit, type MatchResult } from "../../lib/celebrities";
import { playClickSound, playDropSound } from "../../lib/soundFx";
import FashionLexikon from "../lexikon/FashionLexikon";

export default function InspirationView() {
  const items     = useWardrobe((s) => s.items);
  const equipItem = useWardrobe((s) => s.equipItem);
  const setTab    = useApp((s) => s.setTab);

  const [view, setView] = useState<"promis" | "trends" | "lexikon">("promis");
  const [selectedId, setSelectedId] = useState<string>(CELEBRITY_OUTFITS[0].id);

  const selected = CELEBRITY_OUTFITS.find((c) => c.id === selectedId)!;
  const matches: MatchResult[] = useMemo(
    () => matchOutfitToWardrobe(selected.pieces, items),
    [selected, items]
  );

  const matchCount   = matches.filter((m) => m.match).length;
  const totalPieces  = matches.length;
  const matchPercent = Math.round((matchCount / totalPieces) * 100);
  const missing      = matches.filter((m) => !m.match);

  function applyMatches() {
    matches.forEach((m) => { if (m.match) equipItem(m.match.id); });
    playDropSound();
    setTab("schrank");
  }

  return (
    <div className="flex-1 overflow-auto p-8" style={{ background: "#FAF6F0" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} color="#7B2FBE" />
          <h1 className="text-2xl font-bold" style={{ color: "#111" }}>Inspiration</h1>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          Sieh was Promis tragen — und welche Teile davon du schon hast.
        </p>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setView("promis"); playClickSound(); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: view === "promis" ? "#111" : "white",
              color: view === "promis" ? "white" : "#6B7280",
              border: "1px solid #E8E2DA",
            }}
          >
            ⭐ Promi-Looks
          </button>
          <button
            onClick={() => { setView("trends"); playClickSound(); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: view === "trends" ? "#111" : "white",
              color: view === "trends" ? "white" : "#6B7280",
              border: "1px solid #E8E2DA",
            }}
          >
            🔥 Was ist angesagt
          </button>
          <button
            onClick={() => { setView("lexikon"); playClickSound(); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: view === "lexikon" ? "#111" : "white",
              color: view === "lexikon" ? "white" : "#6B7280",
              border: "1px solid #E8E2DA",
            }}
          >
            📖 Fashion Lexikon
          </button>
        </div>

        {view === "promis" && (
          <div className="grid gap-6" style={{ gridTemplateColumns: "320px 1fr" }}>
            {/* Left: celebrity list */}
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>
                Aktuelle Looks
              </p>
              {CELEBRITY_OUTFITS.map((c) => (
                <CelebrityCard
                  key={c.id}
                  celeb={c}
                  selected={c.id === selectedId}
                  matchPct={Math.round(
                    (matchOutfitToWardrobe(c.pieces, items).filter(m => m.match).length / c.pieces.length) * 100
                  )}
                  onClick={() => { setSelectedId(c.id); playClickSound(); }}
                />
              ))}
              <button className="text-xs mt-2 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all hover:bg-purple-50"
                style={{ color: "#7B2FBE", border: "1px dashed #7B2FBE40" }}>
                <RefreshCw size={11} /> Mehr Promis laden (Phase 2)
              </button>
            </div>

            {/* Right: match details for selected celebrity */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "white", border: "1px solid #E8E2DA" }}>
              {/* Hero header */}
              <div className="p-6" style={{ background: selected.vibeColor }}>
                <div className="flex items-start justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">{selected.vibe}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
                      {selected.celebrity}
                    </h2>
                    <div className="flex items-center gap-3 text-xs opacity-90">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {selected.city}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {selected.date}</span>
                    </div>
                  </div>
                  <div className="text-5xl">{selected.avatar}</div>
                </div>
              </div>

              {/* Match summary */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: matchPercent >= 75 ? "#D1FAE5" : matchPercent >= 40 ? "#FEF3C7" : "#FEE2E2" }}>
                <div>
                  <p className="text-2xl font-bold" style={{ color: matchPercent >= 75 ? "#059669" : matchPercent >= 40 ? "#D97706" : "#DC2626" }}>
                    {matchPercent}%
                  </p>
                  <p className="text-xs font-medium" style={{ color: "#374151" }}>
                    {matchCount}/{totalPieces} Teile in deinem Schrank
                  </p>
                </div>
                {matchCount > 0 && (
                  <button
                    onClick={applyMatches}
                    className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:opacity-90 transition"
                    style={{ background: "#7B2FBE", color: "white" }}
                  >
                    <Sparkles size={13} className="inline mr-1" /> Look anziehen
                  </button>
                )}
              </div>

              {/* Pieces breakdown */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                  Outfit-Bestandteile
                </p>
                <div className="flex flex-col gap-2">
                  {matches.map((m, idx) => (
                    <PieceRow key={idx} match={m} />
                  ))}
                </div>

                {/* Missing items */}
                {missing.length > 0 && (
                  <div className="mt-5 rounded-xl p-4" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold" style={{ color: "#92400E" }}>
                        ⚠ Was dir noch fehlt ({missing.length})
                      </p>
                    </div>
                    <ul className="text-xs space-y-1 mb-3" style={{ color: "#92400E" }}>
                      {missing.map((m, i) => (
                        <li key={i}>• {m.piece.type} ({m.piece.color})</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => alert("Shopping-Integration kommt in Phase 2: Vinted, Zalando, Amazon Affiliate.")}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: "#92400E", color: "white" }}
                    >
                      <ShoppingBag size={12} /> Fehlende Teile shoppen (Phase 2)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "trends"  && <TrendsTab />}
        {view === "lexikon" && (
          <div className="max-w-2xl">
            <FashionLexikon />
          </div>
        )}
      </div>
    </div>
  );
}

function CelebrityCard({ celeb, selected, matchPct, onClick }: { celeb: CelebrityOutfit; selected: boolean; matchPct: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] text-left"
      style={{
        background: "white",
        border: `2px solid ${selected ? "#7B2FBE" : "#E8E2DA"}`,
        boxShadow: selected ? "0 2px 8px rgba(123,47,190,0.15)" : "none",
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl"
        style={{ background: celeb.vibeColor }}
      >
        {celeb.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: "#111" }}>{celeb.celebrity}</p>
        <p className="text-xs truncate" style={{ color: "#6B7280" }}>{celeb.vibe}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{celeb.date} · {celeb.city}</p>
      </div>
      <div
        className="text-xs font-bold px-2 py-1 rounded-full shrink-0"
        style={{
          background: matchPct >= 75 ? "#D1FAE5" : matchPct >= 40 ? "#FEF3C7" : "#FEE2E2",
          color:      matchPct >= 75 ? "#059669" : matchPct >= 40 ? "#D97706" : "#DC2626",
        }}
      >
        {matchPct}%
      </div>
    </button>
  );
}

function PieceRow({ match }: { match: MatchResult }) {
  const has = !!match.match;
  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-xl transition"
      style={{
        background: has ? "#F0FDF4" : "#FEF2F2",
        border: `1px solid ${has ? "#86EFAC" : "#FECACA"}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: has ? "#22C55E" : "#EF4444", color: "white" }}
      >
        {has ? <Check size={16} /> : <X size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: has ? "#065F46" : "#7F1D1D" }}>
          {match.piece.type}
        </p>
        <p className="text-xs truncate" style={{ color: has ? "#047857" : "#991B1B" }}>
          {has
            ? `Match: ${match.match!.name} (${Math.round(match.matchScore * 100)}%)`
            : `${match.piece.color} — fehlt im Schrank`}
        </p>
      </div>
      <div
        className="w-6 h-6 rounded-md shrink-0"
        style={{ background: match.piece.colorHex, border: "1px solid rgba(0,0,0,0.1)" }}
        title={match.piece.color}
      />
      {has && match.match!.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={match.match!.imageUrl} alt="" className="w-10 h-10 rounded-md object-contain shrink-0" style={{ background: "white" }} />
      )}
    </div>
  );
}

// ---------- Trends Tab ----------
const TRENDS = [
  { id: "t1", name: "Y2K Revival",     desc: "Crop Tops, Baggy Jeans, Cat-Eye Sonnenbrillen — ähnlich wie 2003.",  hashtag: "#y2krevival",     gradient: "linear-gradient(135deg, #ffb6d9, #b6d6ff)" },
  { id: "t2", name: "Quiet Luxury",    desc: "Cream, beige, black. Keine Logos. Schöne Stoffe, klare Schnitte.",   hashtag: "#quietluxury",    gradient: "linear-gradient(135deg, #f5e8d3, #c9a878)" },
  { id: "t3", name: "Coastal Grandma", desc: "Lockere Leinen-Pieces, Strickjacken, breite Hüte, Pastell.",         hashtag: "#coastalgrandma", gradient: "linear-gradient(135deg, #c8e6f0, #f0e3c8)" },
  { id: "t4", name: "Mob Wife",        desc: "Pelzmäntel, Goldketten, dunkles Make-up, übertriebene Eleganz.",     hashtag: "#mobwife",        gradient: "linear-gradient(135deg, #2c1810, #6b2c2c)" },
  { id: "t5", name: "Berlin Tech",     desc: "Cargo, Tech-Wear, Sneakers, schwarz auf schwarz, dystopisch chic.",  hashtag: "#technowear",     gradient: "linear-gradient(135deg, #1a1a1a, #2563eb)" },
  { id: "t6", name: "Soft Boy",        desc: "Pastellpullover, Loafers, Statement-Schmuck, lockere Hose.",         hashtag: "#softboy",        gradient: "linear-gradient(135deg, #f4a8c0, #a5dec5)" },
];

function TrendsTab() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {TRENDS.map((t) => (
        <div key={t.id} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
          style={{ background: t.gradient, aspectRatio: "16/11" }}>
          <div className="h-full flex flex-col justify-end p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)" }}>
            <h3 className="text-white font-bold text-lg mb-1">{t.name}</h3>
            <p className="text-white text-xs opacity-90 mb-2 leading-relaxed">{t.desc}</p>
            <span className="text-white text-xs font-semibold opacity-80">{t.hashtag}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
