"use client";

import { useEffect, useRef, useState } from "react";
import {
  RotateCcw, Scan, Zap, Star, Share2, Save,
  Plus, ChevronDown,
} from "lucide-react";
import Avatar3D from "./Avatar3D";
import { getStageTheme, type StageTheme } from "./stageThemes";
import { useWardrobe, detectAccessorySubtype } from "../../store/useWardrobe";
import {
  useApp,
  WEATHER_OPTIONS,
  OCCASION_OPTIONS,
  ACTIVITY_OPTIONS,
} from "../../store/useApp";
import { playDropSound, playClickSound } from "../../lib/soundFx";

export default function AvatarStage({ gender }: { gender: "female" | "male" }) {
  const items             = useWardrobe((s) => s.items);
  const outfit            = useWardrobe((s) => s.outfit);
  const draggingId        = useWardrobe((s) => s.draggingId);
  const lastDropAt        = useWardrobe((s) => s.lastDropAt);
  const equipItem         = useWardrobe((s) => s.equipItem);
  const saveCurrentOutfit = useWardrobe((s) => s.saveCurrentOutfit);

  const puppets          = useApp((s) => s.puppets);
  const currentPuppetId  = useApp((s) => s.currentPuppetId);
  const setCurrentPuppet = useApp((s) => s.setCurrentPuppet);
  const weather          = useApp((s) => s.weather);
  const weatherTemp      = useApp((s) => s.weatherTemp);
  const occasion         = useApp((s) => s.occasion);
  const activity         = useApp((s) => s.activity);
  const stageId          = useApp((s) => s.stageId);

  const [faceIdx, setFaceIdx]         = useState(0);
  const [poseIdx, setPoseIdx]         = useState(0);
  const nudgeRef = useRef<(dir: number) => void>(() => {});
  const [isDragOver, setIsDragOver]   = useState(false);
  const [flashOn, setFlashOn]         = useState(false);
  const [saveModalOpen, setSave]      = useState(false);
  const [outfitName, setOutfitName]   = useState("");
  const [toast, setToast]             = useState<string | null>(null);
  const [showPuppetMenu, setPuppetMenu] = useState(false);
  const [activeMode, setActiveMode]   = useState<"drehen" | "gesicht" | "pose">("drehen");

  const stage         = getStageTheme(stageId);
  const currentPuppet = puppets.find((p) => p.id === currentPuppetId) ?? puppets[0];
  const weatherOpt    = WEATHER_OPTIONS.find((w) => w.value === weather)   ?? WEATHER_OPTIONS[0];
  const occasionOpt   = OCCASION_OPTIONS.find((o) => o.value === occasion) ?? OCCASION_OPTIONS[0];
  const activityOpt   = ACTIVITY_OPTIONS.find((a) => a.value === activity) ?? ACTIVITY_OPTIONS[0];

  useEffect(() => {
    if (lastDropAt === 0) return;
    setFlashOn(true);
    playDropSound();
    const t = setTimeout(() => setFlashOn(false), 600);
    return () => clearTimeout(t);
  }, [lastDropAt]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) equipItem(id);
  }

  function getOutfitItem(id: string | null) {
    if (!id) return null;
    return items.find((it) => it.id === id) ?? null;
  }

  // True once at least one slot is filled
  const hasOutfit = Object.values(outfit).some(Boolean);

  // Outfit-Farben für den 3D-Avatar: dominante Farbe je Teil (bgFallback)
  const accessoryItem = getOutfitItem(outfit.accessory);
  const outfitColors = {
    top:       getOutfitItem(outfit.top)?.bgFallback    ?? null,
    bottom:    getOutfitItem(outfit.bottom)?.bgFallback ?? null,
    shoes:     getOutfitItem(outfit.shoes)?.bgFallback  ?? null,
    accessory: accessoryItem?.bgFallback ?? null,
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: "#ede6d8" }}>
      <ShowroomBg theme={stage} />

      {/* ── Drag-capture overlay ── */}
      {draggingId && (
        <div
          className="absolute inset-0 z-30"
          style={{ pointerEvents: "all" }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-150"
            style={{
              border:     isDragOver ? "2px dashed #7B2FBE" : "2px dashed rgba(123,47,190,0.22)",
              background: isDragOver ? "rgba(123,47,190,0.07)" : "transparent",
            }}
          >
            {isDragOver && (
              <div
                className="px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl"
                style={{ background: "#7B2FBE", color: "white" }}
              >
                ✦ Loslassen → anziehen
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Drop flash ── */}
      {flashOn && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(123,47,190,0.18) 0%, transparent 65%)",
            animation:  "dropFlash 600ms ease-out",
          }}
        />
      )}
      <style jsx>{`
        @keyframes dropFlash { 0%{opacity:0} 20%{opacity:1} 100%{opacity:0} }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div
          className="absolute top-14 left-1/2 z-40 px-4 py-2 rounded-xl text-sm font-medium shadow-lg pointer-events-none"
          style={{ transform: "translateX(-50%)", background: "rgba(17,17,17,0.88)", color: "white" }}
        >
          {toast}
        </div>
      )}

      {/* ── Puppe Selector (top-left) ── */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setPuppetMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background:     "rgba(255,255,255,0.82)",
              backdropFilter: "blur(10px)",
              border:         "1px solid rgba(0,0,0,0.08)",
              boxShadow:      "0 1px 6px rgba(0,0,0,0.08)",
              color:          "#111",
            }}
          >
            {currentPuppet?.name ?? "Puppe 1"}
            <ChevronDown size={11} />
          </button>

          {showPuppetMenu && (
            <div
              className="absolute top-full mt-1 left-0 rounded-xl overflow-hidden shadow-xl z-50"
              style={{ background: "white", border: "1px solid #E8E2DA", minWidth: 140 }}
            >
              {puppets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentPuppet(p.id);
                    setPuppetMenu(false);
                    playClickSound();
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-purple-50 flex items-center justify-between transition-colors"
                  style={{ color: p.id === currentPuppetId ? "#7B2FBE" : "#111" }}
                >
                  {p.name}
                  {p.id === currentPuppetId && <span style={{ color: "#7B2FBE" }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => showToast("Puppen-Verwaltung kommt bald ✦")}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "#7B2FBE",
            color:      "white",
            boxShadow:  "0 2px 8px rgba(123,47,190,0.38)",
          }}
          title="Neue Puppe hinzufügen"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>


      {/* ── Main area: left mode buttons + avatar ── */}
      <div className="flex-1 flex relative min-h-0">

        {/* Left vertical mode buttons — only visible when avatar is shown */}
        {hasOutfit && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
            {([
              { id: "drehen"  as const, icon: RotateCcw, label: "Drehen",  action: () => nudgeRef.current(6) },
              { id: "gesicht" as const, icon: Scan,      label: "Gesicht", action: () => setFaceIdx((f) => (f + 1) % 4) },
              { id: "pose"    as const, icon: Zap,       label: "Pose",    action: () => setPoseIdx((p) => (p + 1) % 4) },
            ]).map(({ id, icon: Icon, label, action }) => {
              const isActive = activeMode === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveMode(id); action(); playClickSound(); }}
                  className="flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                  style={{
                    background:     isActive ? "white"                      : "rgba(255,255,255,0.60)",
                    backdropFilter: "blur(10px)",
                    border:         `1.5px solid ${isActive ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.50)"}`,
                    boxShadow:      isActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                    color:          isActive ? "#7B2FBE" : "#6B7280",
                    minWidth:       46,
                  }}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.2 : 1.7} />
                  <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, lineHeight: 1.2 }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Avatar (when outfit loaded) — 3D-Mannequin, drehbar per Drag ── */}
        {hasOutfit && (
          <div style={{ position: "absolute", inset: 0 }}>
            <Avatar3D
              gender={gender}
              outfitColors={outfitColors}
              accessoryType={accessoryItem ? detectAccessorySubtype(accessoryItem.name) : null}
              nudgeRef={nudgeRef}
              faceIdx={faceIdx}
              poseIdx={poseIdx}
              fogColor={stage.fog}
              accentColor={stage.accent}
            />
          </div>
        )}

        {/* ── Empty state (no outfit) ── */}
        {!hasOutfit && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="font-bold text-xl" style={{ color: "rgba(255,255,255,0.90)", textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}>
                ✦ Virtuelle Anprobe
              </p>
              <p className="text-sm max-w-[200px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", textShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
                Ziehe Kleidung hierher oder lasse die KI ein Outfit für dich erstellen.
              </p>

              {/* Drop zone indicator */}
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-2xl"
                style={{
                  width: 110, height: 110,
                  border: "2px dashed rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Hanger SVG */}
                <svg width="38" height="32" viewBox="0 0 38 32" fill="none" opacity={0.70}>
                  <path d="M19 4 C19 2 21 1 22 2 C23 3 22 5 21 5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M21 5 C21 5 19 8 19 10 C19 10 5 18 2 20 C1 21 2 24 4 24 L34 24 C36 24 37 21 36 20 C33 18 19 10 19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>

              {/* "Outfit visualisieren" button — pointer-events on */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95 pointer-events-auto"
                style={{ background: "#7B2FBE", color: "white", boxShadow: "0 4px 16px rgba(123,47,190,0.45)" }}
                onClick={() => {
                  // Auto-equip a random outfit from wardrobe
                  const tops    = items.filter((i) => i.badge === "Top");
                  const bottoms = items.filter((i) => i.badge === "Bottom");
                  const shoes   = items.filter((i) => i.badge === "Shoes");
                  const pick = <T,>(arr: T[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
                  const t = pick(tops); const b = pick(bottoms); const s = pick(shoes);
                  if (t) equipItem((t as { id: string }).id);
                  if (b) equipItem((b as { id: string }).id);
                  if (s) equipItem((s as { id: string }).id);
                  playDropSound();
                }}
              >
                ✦ Outfit visualisieren
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div className="shrink-0 px-4 pb-3 pt-1 flex flex-col gap-2 relative" style={{ zIndex: 1 }}>

        {/* Context chips: Anlass / Aktivität / Wetter */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <ContextChip emoji={occasionOpt.emoji}  label={occasionOpt.label} />
          <ContextChip emoji={activityOpt.emoji}  label={activityOpt.label} />
          <ContextChip emoji={weatherOpt.emoji}   label={`${weatherTemp}°C ${weatherOpt.label}`} />
        </div>

        {/* Beliebtheit + Stars + Action buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Rating + Beliebtheit */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i <= 4 ? "#F59E0B" : "none"}
                  color={i <= 4 ? "#F59E0B" : "rgba(255,255,255,0.30)"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", fontWeight: 600 }}>4.2</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>· 128 Beliebtheit</span>
          </div>

          {/* Speichern + Teilen */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setOutfitName(""); setSave(true); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "#7B2FBE", color: "white", boxShadow: "0 2px 10px rgba(123,47,190,0.38)" }}
            >
              <Save size={11} strokeWidth={2.5} />
              Speichern
            </button>
            <button
              onClick={() => showToast("Teilen-Funktion kommt bald ✦")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:bg-white/20"
              style={{
                background:     "rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
                border:         "1px solid rgba(255,255,255,0.22)",
                color:          "white",
              }}
            >
              <Share2 size={11} />
              Teilen
            </button>
          </div>
        </div>
      </div>

      {/* ── Save Modal ── */}
      {saveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
          onClick={() => setSave(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "#F0EEF8" }}
            >
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "#111" }}>
                <Save size={15} color="#7B2FBE" /> Outfit speichern
              </h3>
              <button
                onClick={() => setSave(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-1.5">
                {(["top", "bottom", "shoes", "accessory"] as const).map((k) => {
                  const it = getOutfitItem(outfit[k]);
                  return (
                    <div
                      key={k}
                      className="aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: "#F5F5F8", border: "1px solid #EEE" }}
                    >
                      {it?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.imageUrl} alt={it.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span style={{ fontSize: 20, opacity: 0.25 }}>∅</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="Name (optional)"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#E8E2DA" }}
              />
              <button
                onClick={() => {
                  const id = saveCurrentOutfit(outfitName);
                  setSave(false);
                  showToast(id ? "✓ Outfit gespeichert" : "Erst Kleidung anziehen");
                  playDropSound();
                }}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "#7B2FBE", color: "white" }}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Context chip ──────────────────────────────────────────────────────────────
function ContextChip({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background:     "rgba(255,255,255,0.16)",
        backdropFilter: "blur(8px)",
        border:         "1px solid rgba(255,255,255,0.22)",
        color:          "white",
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

// ── Showroom Background — Schichten kommen aus dem Bühnen-Theme ───────────────
function ShowroomBg({ theme }: { theme: StageTheme }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, pointerEvents: "none" }}>

      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: theme.bg }} />

      {/* Spotlight from above */}
      <div className="absolute" style={{
        top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "85%",
        background: theme.spot,
      }} />

      {/* Mannequins — more visible than before */}
      <MannequinSvg style={{ position: "absolute", left: "4%",  bottom: "10%", height: "62%", opacity: 0.38, filter: "blur(7px)"  }} tint={theme.mannequin} />
      <MannequinSvg style={{ position: "absolute", right: "5%", bottom: "12%", height: "56%", opacity: 0.30, filter: "blur(9px)"  }} tint={theme.mannequin} />
      <MannequinSvg style={{ position: "absolute", left: "18%", bottom: "12%", height: "44%", opacity: 0.22, filter: "blur(12px)" }} tint={theme.mannequin} />
      <MannequinSvg style={{ position: "absolute", right: "20%",bottom: "14%", height: "40%", opacity: 0.20, filter: "blur(12px)" }} tint={theme.mannequin} />

      {/* Floor platform — bright oval */}
      <div className="absolute" style={{
        bottom: "5%", left: "50%", transform: "translateX(-50%)",
        width: "78%", height: 80,
        background: theme.floorGlow,
        borderRadius: "50%",
      }} />

      {/* Inner glow under feet */}
      <div className="absolute" style={{
        bottom: "6%", left: "50%", transform: "translateX(-50%)",
        width: "45%", height: 32,
        background: theme.innerGlow,
        borderRadius: "50%",
      }} />

      {/* Edge vignette */}
      <div className="absolute inset-0" style={{ background: theme.vignette }} />

      {/* Top darkening */}
      <div className="absolute inset-x-0 top-0" style={{
        height: "20%",
        background: theme.topShade,
      }} />
    </div>
  );
}

// ── Mannequin SVG silhouette ──────────────────────────────────────────────────
function MannequinSvg({ style, tint }: { style: React.CSSProperties; tint: string }) {
  return (
    <svg viewBox="0 0 70 220" fill={tint} style={{ aspectRatio: "70/220", width: "auto", ...style }}>
      <ellipse cx="35" cy="20" rx="16" ry="18" />
      <rect x="29" y="37" width="12" height="12" rx="4" />
      <path d="M8 49 Q20 44 35 47 Q50 44 62 49 L58 140 Q35 148 12 140 Z" />
      <rect x="2"  y="49" width="11" height="72" rx="5.5" transform="rotate(-4 8 49)" />
      <rect x="57" y="49" width="11" height="72" rx="5.5" transform="rotate(4 62 49)" />
      <rect x="12" y="138" width="46" height="18" rx="9" />
      <rect x="12" y="154" width="20" height="62" rx="10" />
      <rect x="38" y="154" width="20" height="62" rx="10" />
    </svg>
  );
}
