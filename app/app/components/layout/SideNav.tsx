"use client";

import {
  Shirt, User, Sparkles, Calendar, Heart, MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "../../store/useApp";
import { playClickSound } from "../../lib/soundFx";

const NAV_ITEMS: { id: string; icon: LucideIcon; label: string; tab?: "schrank" | "outfits" | "inspiration" | "stats" }[] = [
  { id: "schrank",     icon: Shirt,          label: "Schrank",     tab: "schrank"     },
  { id: "puppen",      icon: User,           label: "Puppen"                          },
  { id: "kombinieren", icon: Sparkles,       label: "Kombinieren", tab: "inspiration" },
  { id: "kalender",    icon: Calendar,       label: "Kalender",    tab: "outfits"     },
  { id: "favoriten",   icon: Heart,          label: "Favoriten",   tab: "stats"       },
  { id: "mehr",        icon: MoreHorizontal, label: "Mehr"                            },
];

export default function SideNav() {
  const tab    = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);

  function handleClick(item: typeof NAV_ITEMS[number]) {
    if (item.tab) setTab(item.tab);
    playClickSound();
  }

  return (
    <nav
      className="flex flex-col items-center py-3 gap-0.5 shrink-0"
      style={{
        width: 68,
        background: "#111116",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo mark */}
      <div
        className="mb-3 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "#7B2FBE" }}
      >
        <span style={{ color: "white", fontSize: 12, fontWeight: 900, fontFamily: "serif", letterSpacing: "-0.04em" }}>
          D
        </span>
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon     = item.icon;
        const isActive = item.tab ? tab === item.tab : false;

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            title={item.label}
            className="flex flex-col items-center gap-0.5 w-full px-1 py-2 rounded-xl transition-all hover:bg-white/5"
            style={{ color: isActive ? "#A855F7" : "rgba(255,255,255,0.32)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{ background: isActive ? "rgba(123,47,190,0.22)" : "transparent" }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.6} />
            </div>
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, lineHeight: 1, letterSpacing: 0.1 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
