"use client";

import { useState } from "react";
import { Home, Users, Inbox, ShoppingBag, UserCircle, X } from "lucide-react";
import { useApp } from "../../store/useApp";
import { playClickSound } from "../../lib/soundFx";

const items = [
  { id: "home",      icon: Home,        label: "Home",      desc: "Zurück zum Schrank — Avatar anziehen" },
  { id: "community", icon: Users,       label: "Community", desc: "Folge anderen DROP-Usern, sieh ihre Outfits, like + kommentiere." },
  { id: "inbox",     icon: Inbox,       label: "Inbox",     desc: "KI-Outfit-Vorschläge der Woche, Match-Notifications, Direktnachrichten." },
  { id: "shop",      icon: ShoppingBag, label: "Shop",      desc: "Vinted, Zalando, Amazon Affiliate — kaufe Teile direkt aus deiner Match-Liste." },
  { id: "profil",    icon: UserCircle,  label: "Profil",    desc: "Account, Einstellungen, Premium-Status, Datenschutz." },
];

export default function BottomNav() {
  const setTab = useApp((s) => s.setTab);
  const [active, setActive] = useState("home");
  const [modal, setModal]   = useState<{ id: string; label: string; desc: string } | null>(null);

  return (
    <>
      <nav
        className="flex items-center justify-around px-4 shrink-0 border-t"
        style={{ height: 56, background: "white", borderColor: "#E8E2DA" }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                playClickSound();
                if (item.id === "home") {
                  setTab("schrank");
                } else {
                  setModal({ id: item.id, label: item.label, desc: item.desc });
                }
              }}
              className="flex flex-col items-center gap-0.5 px-4 py-1 transition-all hover:scale-105"
              style={{ color: isActive ? "#7B2FBE" : "#9CA3AF" }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: "white" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E8E2DA" }}>
              <h3 className="text-base font-bold" style={{ color: "#111" }}>{modal.label}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-full hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>{modal.desc}</p>
              <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: "#FFF7ED", color: "#92400E" }}>
                <span className="font-semibold">⏳ In Phase 2</span> — diese Funktion kommt mit den nächsten Updates.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
