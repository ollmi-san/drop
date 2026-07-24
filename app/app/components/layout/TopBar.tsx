"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useApp, type ActiveTab } from "../../store/useApp";
import { playClickSound } from "../../lib/soundFx";

const TABS: { key: ActiveTab; label: string }[] = [
  { key: "schrank",     label: "Schrank"     },
  { key: "outfits",     label: "Outfits"     },
  { key: "inspiration", label: "Inspiration" },
  { key: "stats",       label: "Stats"       },
];

export default function TopBar() {
  const tab          = useApp((s) => s.tab);
  const setTab       = useApp((s) => s.setTab);
  const soundEnabled = useApp((s) => s.soundEnabled);
  const toggleSound  = useApp((s) => s.toggleSound);

  return (
    <header
      className="flex items-center justify-between px-4 h-12 shrink-0"
      style={{ background: "#0d0d12", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 w-36">
        <span
          className="text-xl font-black select-none"
          style={{ fontFamily: "serif", color: "white", letterSpacing: "-0.04em" }}
        >
          DROP
        </span>
      </div>

      {/* Center tabs */}
      <nav
        className="flex items-center gap-0.5 rounded-full px-1 py-1"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); playClickSound(); }}
            className="px-4 py-1 rounded-full text-sm font-semibold transition-all"
            style={{
              background: tab === t.key ? "white"                        : "transparent",
              color:      tab === t.key ? "#111"                         : "rgba(255,255,255,0.45)",
              boxShadow:  tab === t.key ? "0 1px 4px rgba(0,0,0,0.18)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Sound toggle */}
      <div className="flex items-center justify-end w-36">
        <button
          onClick={toggleSound}
          className="p-2 rounded-full transition-colors"
          style={{ color: "rgba(255,255,255,0.38)" }}
          title={soundEnabled ? "Sound aus" : "Sound an"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </header>
  );
}
