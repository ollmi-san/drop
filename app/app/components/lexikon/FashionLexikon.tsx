"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const LEXIKON: Record<string, string> = {
  "Anchor Piece":    "Das Schlüsselstück eines Outfits — ein Statement-Mantel, eine besondere Hose oder ein auffälliges Oberteil, um das alles andere aufgebaut wird.",
  "Brat":            "Chaotisch-cool, neonfarbig und lässig provokant. Charli-XCX-coded: self-aware, unapologetic, grüne Ästhetik. Party ohne Entschuldigung.",
  "Casualcore":      "Entspannt und alltagstauglich — Hoodies, Jogger, Sneaker. Gemütlich ohne den Eindruck, sich keine Mühe gegeben zu haben.",
  "Clean Girl":      "Minimal, gepflegt, monochrom — wenig Schmuck, neutrale Farben, glattes Haar. Think Hailey Bieber: mühelos perfekt.",
  "Color Blocking":  "Klar voneinander getrennte Farbblöcke in einem Outfit. Kontrastreiche, satte Farben — keine Übergänge, keine Muster.",
  "Dad Cap":         "Leicht gewölbter Baseball-Cap, weich und unstrukturiert. Nostalgisch, low-key stylisch — das Cap deines Vaters als Fashion-Statement.",
  "Fitted Cap":      "Baseball-Cap ohne Verschluss, fest auf den Kopf angepasst. Tief in der Hip-Hop-Kultur verwurzelt, klassisch New Era.",
  "5-Panel Cap":     "Cap aus genau 5 Stoff-Panels, kein Schirm-Verstärkungsband. Besonders flach und minimal — Skater- und Surf-Vibes.",
  "Gorpcore":        "GORP = 'Good Old Raisins and Peanuts' (Trail-Mix). Outdoor-Fashion im Alltag: Fleece, Funktionsjacken, Cargo-Pants, Gore-Tex als Statement.",
  "Mob Wife":        "Dramatisch, opulent, pelz-heavy — Power-Vibes der 90er Mafia-Ästhetik. Goldketten, Maxi-Mäntel, dunkle Farben. Maximalistisch und intentional.",
  "Oversized":       "Kleidung in bewusst größerer Passform als die eigene Größe — locker, lässig, street-inspiriert. Kein Versehen, sondern Kalkül.",
  "Snapback":        "Baseball-Cap mit flachem Schirm und verstellbarem Druckknopf-Riemen hinten. Typisch 90s und Streetwear — die Kappe bleibt immer neu.",
  "Stealth Wealth":  "Teuer, aber unauffällig — keine sichtbaren Logos, perfekte Qualität, neutrale Farben. Quietly luxurious. Die Kenner wissen es.",
  "Trucker Cap":     "Cap mit Netz-Rückseite und hohem, strukturiertem Vorderteil. Ursprünglich Werbe-Cap für LKW-Fahrer, heute Streetwear-Klassiker.",
};

const SORTED_KEYS = Object.keys(LEXIKON).sort();

export default function FashionLexikon() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = SORTED_KEYS.filter((k) =>
    k.toLowerCase().includes(search.toLowerCase()) ||
    LEXIKON[k].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "white", border: "1px solid #E8E2DA" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "#F0EEE8" }}>
        <BookOpen size={18} color="#7B2FBE" />
        <h2 className="font-bold text-base" style={{ color: "#111" }}>Fashion Lexikon</h2>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F0E6FF", color: "#7B2FBE" }}>
          {SORTED_KEYS.length} Begriffe
        </span>
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "#F0EEE8" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F8F5FF", border: "1px solid #EDE5FC" }}>
          <Search size={14} color="#9CA3AF" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Begriff suchen…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#111" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="divide-y" style={{ borderColor: "#F8F5FF" }}>
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: "#9CA3AF" }}>Kein Begriff gefunden für „{search}"</p>
          </div>
        )}
        {filtered.map((term) => (
          <div key={term}>
            <button
              onClick={() => setOpen(open === term ? null : term)}
              className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-purple-50 text-left"
            >
              <span className="font-semibold text-sm" style={{ color: "#111" }}>{term}</span>
              {open === term
                ? <ChevronUp size={16} color="#7B2FBE" />
                : <ChevronDown size={16} color="#9CA3AF" />
              }
            </button>
            {open === term && (
              <div className="px-5 pb-4" style={{ background: "#FDFBFF" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {LEXIKON[term]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
