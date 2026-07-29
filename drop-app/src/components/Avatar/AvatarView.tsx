import { useRef, useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDropStore } from '../../store/dropStore';
import { playDropSound } from '../../utils/sounds';
import { getAvatarSrcWithFallback } from '../../utils/avatarAssets';
import type { Category } from '../../types';

// ─── Slot-Konfiguration ────────────────────────────────────────────────────
type SlotCfg = {
  top: string;
  width: string;
  zIndex: number;
  extraTransform?: string;
};

const SLOTS: Record<Category, SlotCfg> = {
  accessory: { top:  '4%', width: '32%', zIndex: 15 },
  top:       { top: '19%', width: '66%', zIndex: 13, extraTransform: 'scaleX(0.87) scaleY(0.96)' },
  bottom:    { top: '47%', width: '70%', zIndex: 12, extraTransform: 'scaleY(1.03)' },
  shoes:     { top: '78%', width: '60%', zIndex: 11, extraTransform: 'scaleY(0.92)' },
};

const RENDER_ORDER: Category[] = ['bottom', 'shoes', 'top', 'accessory'];
const VIEWS = ['front', 'side', 'back'] as const;
const SWIPE_THRESHOLD = 40;

export function AvatarView() {
  const { avatarGender, avatarView, activeOutfit, removeFromAvatar, rotateAvatar } = useDropStore();
  const { isOver, setNodeRef } = useDroppable({ id: 'avatar-drop-zone' });

  // ── Rotation State ─────────────────────────────────────────────────────
  const swipeStartX   = useRef<number | null>(null);
  const lastTriggerX  = useRef<number | null>(null);
  const [swiping, setSwiping]     = useState(false);
  const [goldFlash, setGoldFlash] = useState(false);
  const prevOutfitRef = useRef(activeOutfit);

  const avatarSrc  = getAvatarSrcWithFallback(avatarGender, avatarView);
  const hasClothes = Object.keys(activeOutfit).length > 0;

  // Detect newly placed item → trigger gold flash
  useEffect(() => {
    const prev = prevOutfitRef.current;
    const prevCount = Object.values(prev).filter(Boolean).length;
    const currCount = Object.values(activeOutfit).filter(Boolean).length;
    if (currCount > prevCount) {
      setGoldFlash(true);
      setTimeout(() => setGoldFlash(false), 750);
    }
    prevOutfitRef.current = activeOutfit;
  }, [activeOutfit]);

  // ── Swipe Handlers ────────────────────────────────────────────────────
  function startSwipe(x: number, target: EventTarget | null) {
    if ((target as HTMLElement)?.closest?.('button')) return;
    swipeStartX.current  = x;
    lastTriggerX.current = x;
    setSwiping(true);
  }

  function moveSwipe(x: number) {
    if (swipeStartX.current === null || lastTriggerX.current === null) return;
    const delta = x - lastTriggerX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      rotateAvatar(delta < 0 ? 'next' : 'prev');
      playDropSound();
      lastTriggerX.current = x;
    }
  }

  function endSwipe() {
    swipeStartX.current  = null;
    lastTriggerX.current = null;
    setSwiping(false);
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 12, userSelect: 'none', width: '100%',
    }}>

      {/* ── Avatar Container ─────────────────────────────────────────────── */}
      <div
        ref={setNodeRef}
        onMouseDown={(e) => startSwipe(e.clientX, e.target)}
        onMouseMove={(e) => { if (e.buttons === 1) moveSwipe(e.clientX); }}
        onMouseUp={endSwipe}
        onMouseLeave={endSwipe}
        onTouchStart={(e) => startSwipe(e.touches[0].clientX, e.target)}
        onTouchMove={(e) => moveSwipe(e.touches[0].clientX)}
        onTouchEnd={endSwipe}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 300,
          height: 'clamp(400px, 62vh, 560px)',
          borderRadius: 22,
          overflow: 'hidden',
          cursor: swiping ? 'grabbing' : 'grab',
          touchAction: 'none',
          background: [
            'radial-gradient(ellipse 75% 55% at 50% 22%, rgba(72,60,200,0.26) 0%, rgba(40,32,140,0.10) 50%, transparent 80%)',
            'linear-gradient(180deg, #0c0c1e 0%, #080816 55%, #040410 100%)',
          ].join(', '),
          border: isOver
            ? '1.5px solid rgba(124,110,245,0.75)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isOver
            ? '0 0 0 3px rgba(124,110,245,0.18), 0 20px 60px rgba(0,0,0,0.65)'
            : '0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >

        {/* ── Hintergrund-Silhouette 1 (weiter weg, stärker geblurrt) ── */}
        <img
          src={avatarSrc}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            position: 'absolute',
            left: '15%', top: '2%',
            width: '58%', height: '90%',
            objectFit: 'contain',
            opacity: 0.055,
            filter: 'blur(10px) saturate(0)',
            transform: 'scaleX(-1) scaleY(0.98)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── Hintergrund-Silhouette 2 (weicher, mittig versetzt) ── */}
        <img
          src={avatarSrc}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            position: 'absolute',
            left: '28%', top: '4%',
            width: '48%', height: '86%',
            objectFit: 'contain',
            opacity: 0.035,
            filter: 'blur(18px) saturate(0)',
            transform: 'scaleY(0.96)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── Spotlight Kegel von oben ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '72%', height: '70%',
            background: 'radial-gradient(ellipse 50% 85% at 50% 0%, rgba(190,175,255,0.10) 0%, rgba(130,110,255,0.05) 30%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Volumetrischer Lichtstrahl Mitte ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '28%', height: '85%',
            background: 'linear-gradient(180deg, rgba(160,145,255,0.08) 0%, rgba(120,100,255,0.03) 60%, transparent 100%)',
            clipPath: 'polygon(33% 0%, 67% 0%, 92% 100%, 8% 100%)',
            filter: 'blur(5px)',
            animation: 'beamFlicker 7s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Volumetrischer Lichtstrahl links ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: '28%',
            transform: 'translateX(-50%)',
            width: '18%', height: '65%',
            background: 'linear-gradient(180deg, rgba(130,120,220,0.06) 0%, transparent 100%)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(7px)',
            animation: 'beamFlicker 9s ease-in-out infinite 2.5s',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* ── Rim Light links ── */}
        <div
          style={{
            position: 'absolute',
            left: 0, top: '8%',
            width: '20%', height: '78%',
            background: 'linear-gradient(90deg, rgba(80,70,200,0.25) 0%, rgba(80,70,200,0.08) 60%, transparent 100%)',
            borderRadius: '0 60% 60% 0 / 0 40% 40% 0',
            animation: 'rimPulse 4.5s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* ── Rim Light rechts ── */}
        <div
          style={{
            position: 'absolute',
            right: 0, top: '8%',
            width: '20%', height: '78%',
            background: 'linear-gradient(270deg, rgba(80,70,200,0.20) 0%, rgba(80,70,200,0.06) 60%, transparent 100%)',
            borderRadius: '60% 0 0 60% / 40% 0 0 40%',
            animation: 'rimPulse 4.5s ease-in-out infinite 2.2s',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* ── Nebel / Atmosphäre am Boden ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '6%', left: '5%',
            width: '90%', height: '32%',
            background: 'radial-gradient(ellipse 65% 55% at 50% 85%, rgba(65,55,180,0.14) 0%, rgba(50,40,140,0.06) 50%, transparent 75%)',
            filter: 'blur(12px)',
            animation: 'fogDrift 14s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* ── Bühnenhorizont / Plattform ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '6%', left: '50%',
            transform: 'translateX(-50%)',
            width: '64%', height: 5,
            background: 'linear-gradient(90deg, transparent 0%, rgba(100,88,240,0.30) 25%, rgba(150,135,255,0.55) 50%, rgba(100,88,240,0.30) 75%, transparent 100%)',
            borderRadius: 99,
            filter: 'blur(1.5px)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />

        {/* ── Boden-Reflektion ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5%', left: '50%',
            transform: 'translateX(-50%)',
            width: '52%', height: 28,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,88,230,0.30) 0%, rgba(80,65,200,0.12) 55%, transparent 85%)',
            borderRadius: '50%',
            filter: 'blur(7px)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />

        {/* ── Avatar-Bild (floating animation) ── */}
        <img
          src={avatarSrc}
          alt="Avatar"
          draggable={false}
          className="avatar-float"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 5,
            transition: 'opacity 0.12s ease',
          }}
        />

        {/* ── Kleidungs-Layer ──────────────────────────────────────────── */}
        {RENDER_ORDER.map((category) => {
          const item = activeOutfit[category];
          if (!item) return null;
          const { top, width, zIndex, extraTransform = '' } = SLOTS[category];
          const transform = `translateX(-50%)${extraTransform ? ` ${extraTransform}` : ''}`;
          return (
            <div
              key={`${category}-${item.id}`}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="cloth-layer"
              style={{
                position: 'absolute',
                top, left: '50%',
                transform,
                transformOrigin: 'top center',
                width,
                zIndex: zIndex + 5,
                pointerEvents: 'auto',
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                draggable={false}
                style={{
                  width: '100%', height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.40)) drop-shadow(0 2px 5px rgba(0,0,0,0.24))',
                }}
              />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); removeFromAvatar(category); }}
                style={{
                  position: 'absolute', top: -10, right: -10,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(10,10,22,0.95)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(240,240,248,0.55)',
                  fontSize: 14, fontWeight: 700, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  zIndex: zIndex + 15,
                  transition: 'color 0.12s, border-color 0.12s',
                }}
                title="Entfernen"
              >
                ×
              </button>
            </div>
          );
        })}

        {/* ── Gold Flash bei erfolgreichem Drop ── */}
        {goldFlash && (
          <div
            className="gold-flash"
            style={{
              position: 'absolute', inset: 0, zIndex: 40,
              borderRadius: 22,
              background: 'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(255,215,100,0.22) 0%, rgba(255,180,60,0.08) 55%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Drop-Indikator ── */}
        {isOver && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 30,
            borderRadius: 22,
            background: 'rgba(100,88,220,0.07)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: 20,
            pointerEvents: 'none',
          }}>
            <span style={{
              padding: '6px 18px', borderRadius: 99,
              background: 'rgba(124,110,245,0.90)',
              backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 12, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(124,110,245,0.50)',
              letterSpacing: '0.02em',
            }}>
              Loslassen zum Anziehen
            </span>
          </div>
        )}

        {/* ── Leerer Hinweis ── */}
        {!hasClothes && !isOver && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: 16, pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: 11,
              color: 'rgba(240,240,248,0.22)',
              letterSpacing: '0.04em',
            }}>
              ← Kleidung ziehen →
            </span>
          </div>
        )}
      </div>

      {/* ── Ansicht-Dots ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 9,
          color: 'rgba(240,240,248,0.22)',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}>
          DREHEN
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {VIEWS.map((v) => {
            const active = avatarView === v;
            return (
              <button
                key={v}
                onClick={() => {
                  const cur = VIEWS.indexOf(avatarView);
                  const tgt = VIEWS.indexOf(v);
                  if (tgt === cur) return;
                  rotateAvatar(tgt > cur ? 'next' : 'prev');
                }}
                style={{
                  width: active ? 22 : 6, height: 6,
                  borderRadius: 99,
                  background: active
                    ? 'rgba(124,110,245,0.95)'
                    : 'rgba(255,255,255,0.12)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: active ? '0 0 10px rgba(124,110,245,0.55)' : 'none',
                }}
                title={v === 'front' ? 'Vorne' : v === 'side' ? 'Seite' : 'Hinten'}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
