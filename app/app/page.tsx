"use client";

import { useState } from "react";
import OutfitsView     from "./components/views/OutfitsView";
import InspirationView from "./components/views/InspirationView";
import WardrobePanel   from "./components/wardrobe/WardrobePanel";
import AvatarStage     from "./components/avatar/AvatarStage";
import AIStylistPanel  from "./components/ai/AIStylistPanel";
import { STAGE_THEMES } from "./components/avatar/stageThemes";
import { useApp }      from "./store/useApp";
import { playClickSound } from "./lib/soundFx";

/**
 * Image-as-base layout
 *
 * The mockup PNG (1536×1024, includes ~72px browser chrome at top) is shown
 * as a fixed full-screen background.  Three opaque React panels are overlaid
 * at the exact positions of the corresponding image areas:
 *
 *   ┌── SideNav ──┬── WardrobePanel ──┬── Center Stage ──┬── AI Stylist ──┐
 *   │  (image)    │   (React panel)   │  (React panel)   │  (React panel) │
 *   └─────────────┴───────────────────┴──────────────────┴────────────────┘
 *
 * The TopBar and BottomNav remain as transparent click-zones over the image
 * so the mockup's pixel-perfect design shows through.
 *
 * Chrome-crop maths (so the URL bar in the screenshot stays offscreen):
 *   Image height at width W: H = W × (1024/1536)
 *   Chrome height:           C = W × (72/1536) = 4.6875vw
 *   → top: -4.6875vw  |  height: calc(100vh + 4.6875vw)
 */

// -- Layout constants (% of viewport, post-chrome-crop) -----------------------
// Derived from the 1536×1024 source image (app content = y:72–1024, x:0–1536)

const TOP_H  = "5.04%";   // TopBar height   (48px / 952px of app content)
const BOT_H  = "5.46%";   // BottomNav height (52px / 952px)
const CONT_H = "89.5%";   // Content height   (remaining)

// Column widths (% of viewport width; SideNav image stays as-is)
const COL_SIDE  = "3.6%";   // ~56px of 1536
const COL_WARD  = "21.6%";  // WardrobePanel
const COL_CENT  = "39.2%";  // Center Stage
const COL_AI    = "35.6%";  // AI Stylist (stretches to right edge)

// Tab positions inside TopBar (% of viewport width, approximate)
const TABS: { id: "schrank" | "outfits" | "inspiration" | "stats"; left: string; width: string }[] = [
  { id: "schrank",     left: "35.5%", width: "7.5%" },
  { id: "outfits",     left: "43%",   width: "7.5%" },
  { id: "inspiration", left: "50.5%", width: "9%"   },
  { id: "stats",       left: "59.5%", width: "6%"   },
];

const CHROME_VW = 4.6875; // vw units cropped from top

export default function Home() {
  const tab      = useApp((s) => s.tab);
  const setTab   = useApp((s) => s.setTab);
  const gender   = useApp((s) => s.gender);
  const stageId  = useApp((s) => s.stageId);
  const setStage = useApp((s) => s.setStage);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0d0d12" }}>

      {/* ── Base image (browser chrome shifted above viewport) ─────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/drop_interaktiv.png"
        alt=""
        aria-hidden
        style={{
          position:   "absolute",
          top:        `calc(-${CHROME_VW}vw)`,
          left:       0,
          width:      "100vw",
          height:     `calc(100vh + ${CHROME_VW}vw)`,
          objectFit:  "fill",
          pointerEvents: "none",
          zIndex:     0,
          userSelect: "none",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          SCHRANK TAB — panels overlay the image at their exact positions
         ══════════════════════════════════════════════════════════════════════ */}
      {tab === "schrank" && (
        <>
          {/* WardrobePanel -------------------------------------------------- */}
          <div style={{
            position: "absolute",
            left:     COL_SIDE,
            top:      TOP_H,
            width:    COL_WARD,
            height:   CONT_H,
            zIndex:   5,
            overflow: "hidden",
          }}>
            <WardrobePanel />
          </div>

          {/* AvatarStage ---------------------------------------------------- */}
          <div style={{
            position: "absolute",
            left:     `calc(${COL_SIDE} + ${COL_WARD})`,
            top:      TOP_H,
            width:    COL_CENT,
            height:   CONT_H,
            zIndex:   5,
            overflow: "hidden",
          }}>
            <AvatarStage gender={gender} />
          </div>

          {/* AIStylistPanel ------------------------------------------------- */}
          <div style={{
            position: "absolute",
            left:     `calc(${COL_SIDE} + ${COL_WARD} + ${COL_CENT})`,
            top:      TOP_H,
            width:    COL_AI,
            height:   CONT_H,
            zIndex:   5,
            overflow: "hidden",
          }}>
            <AIStylistPanel />
          </div>

          {/* TopBar transparent click-zones --------------------------------- */}
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-label={t.id}
              style={{
                position:   "absolute",
                left:       t.left,
                top:        0,
                width:      t.width,
                height:     TOP_H,
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                zIndex:     20,
                // Subtle active glow so user gets click feedback
                borderRadius: 12,
              }}
            />
          ))}

          {/* „Fashion Stage"-Pill im Mockup-Bild: Klick-Zone + Bühnen-Menü --- */}
          {/* Liegt über den Tab-Zonen (zIndex 21), die diesen Bereich überlappen */}
          <button
            onClick={() => { setStageMenuOpen((v) => !v); playClickSound(); }}
            aria-label="Bühne wechseln"
            title="Bühne wechseln"
            style={{
              position:     "absolute",
              left:         "39%",
              top:          0,
              width:        "10.5%",
              height:       TOP_H,
              background:   "transparent",
              border:       "none",
              cursor:       "pointer",
              zIndex:       21,
              borderRadius: 12,
            }}
          />
          {stageMenuOpen && (
            <div style={{
              position:     "absolute",
              left:         "39%",
              top:          TOP_H,
              zIndex:       30,
              background:   "white",
              border:       "1px solid #E8E2DA",
              borderRadius: 12,
              overflow:     "hidden",
              boxShadow:    "0 8px 30px rgba(0,0,0,0.18)",
              minWidth:     170,
            }}>
              {STAGE_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setStage(t.id);
                    setStageMenuOpen(false);
                    playClickSound();
                  }}
                  style={{
                    display:        "flex",
                    width:          "100%",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    gap:            8,
                    padding:        "9px 14px",
                    border:         "none",
                    cursor:         "pointer",
                    background:     "transparent",
                    fontSize:       13,
                    fontWeight:     600,
                    color:          t.id === stageId ? "#7B2FBE" : "#111",
                  }}
                >
                  <span>{t.emoji} {t.label}</span>
                  {t.id === stageId && <span style={{ color: "#7B2FBE" }}>✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* BottomNav transparent click-zones ----------------------------- */}
          {(["schrank", "outfits", "inspiration", "stats"] as const).map((t, i) => (
            <button
              key={`bn-${t}`}
              onClick={() => setTab(t)}
              aria-label={t}
              style={{
                position:   "absolute",
                left:       `${i * 25}%`,
                bottom:     0,
                width:      "25%",
                height:     BOT_H,
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                zIndex:     20,
              }}
            />
          ))}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          OTHER TABS — full-screen overlay with its own header
         ══════════════════════════════════════════════════════════════════════ */}
      {tab !== "schrank" && (
        <div style={{
          position:   "absolute",
          inset:      0,
          zIndex:     10,
          background: "#0d0d12",
          display:    "flex",
          flexDirection: "column",
        }}>
          {/* Mini TopBar */}
          <div style={{
            height:       52,
            display:      "flex",
            alignItems:   "center",
            padding:      "0 20px",
            gap:          8,
            flexShrink:   0,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#7B2FBE", letterSpacing: -0.5 }}>
              DROP.
            </span>
            <div style={{ flex: 1 }} />
            {(["schrank", "outfits", "inspiration", "stats"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding:      "5px 14px",
                  borderRadius: 20,
                  border:       "none",
                  cursor:       "pointer",
                  background:   tab === t ? "#7B2FBE" : "rgba(255,255,255,0.06)",
                  color:        tab === t ? "white"   : "rgba(255,255,255,0.45)",
                  fontSize:     13,
                  fontWeight:   600,
                }}
              >
                {t === "schrank" ? "Schrank" : t === "outfits" ? "Outfits" : t === "inspiration" ? "Inspiration" : "Stats"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {tab === "outfits"     && <OutfitsView />}
            {tab === "inspiration" && <InspirationView />}
            {tab === "stats"       && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.30)" }}>
                  <p style={{ fontSize: 36, marginBottom: 8 }}>📊</p>
                  <p style={{ fontWeight: 600 }}>Stats</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>Kommt bald ✦</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
