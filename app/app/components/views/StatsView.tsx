"use client";

import { Shirt, Sparkles, TrendingUp, Heart } from "lucide-react";
import { useWardrobe } from "../../store/useWardrobe";

export default function StatsView() {
  const items = useWardrobe((s) => s.items);
  const liked = items.filter((i) => i.liked).length;

  const byCat = items.reduce<Record<string, number>>((acc, it) => {
    acc[it.category] = (acc[it.category] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Teile im Schrank",    value: items.length, icon: Shirt,      color: "#7B2FBE" },
    { label: "Favoriten",           value: liked,        icon: Heart,      color: "#EF4444" },
    { label: "Outfits erstellt",    value: 5,            icon: Sparkles,   color: "#F59E0B" },
    { label: "Style-Score",         value: "82%",        icon: TrendingUp, color: "#059669" },
  ];

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#111" }}>Stats</h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Dein Style auf einen Blick.</p>

        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl p-5 shadow-sm" style={{ background: "white", border: "1px solid #E8E2DA" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + "22" }}>
                    <Icon size={18} color={s.color} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: "#111" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl p-5 shadow-sm" style={{ background: "white", border: "1px solid #E8E2DA" }}>
          <h2 className="font-bold mb-4" style={{ color: "#111" }}>Kategorien-Verteilung</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(byCat).map(([cat, count]) => {
              const pct = (count / items.length) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: "#111" }}>{cat}</span>
                    <span className="text-sm" style={{ color: "#6B7280" }}>{count}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "#7B2FBE" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
