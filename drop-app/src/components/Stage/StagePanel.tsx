import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDropStore } from '../../store/dropStore';
import { Button } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { STAGE_THEMES, getStageTheme, AVATAR_LAYOUT } from '../../data/stageThemes';
import type { ClothingItem, OutfitSlot } from '../../types';

function SlotCard({
  item,
  slot,
  onRemove,
  className = '',
  style,
}: {
  item: ClothingItem;
  slot: OutfitSlot;
  onRemove: (slot: OutfitSlot) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative bg-white/85 backdrop-blur-sm rounded-xl p-2 shadow-sm w-32 ${className}`}
      style={style}
    >
      <button
        type="button"
        aria-label={`${item.name} entfernen`}
        onClick={() => onRemove(slot)}
        className="absolute -top-2 -right-2 z-30 w-6 h-6 rounded-full bg-white shadow-md ring-1 ring-black/10 flex items-center justify-center text-drop-ink-2 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Icon name="x" size={13} />
      </button>
      <img src={item.imageUrl} alt={item.name} className="w-full h-20 object-contain" />
    </div>
  );
}

// Vertikale Werkzeugleiste – aktuell presentational (Funktionen folgen später).
function ToolButton({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="drop-btn w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm flex items-center justify-center text-drop-ink-2"
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

interface StagePanelProps {
  onVisualize?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function StagePanel({ onVisualize, onSave, onShare }: StagePanelProps) {
  const activeOutfit = useDropStore((s) => s.activeOutfit);
  const removeFromAvatar = useDropStore((s) => s.removeFromAvatar);
  const { setNodeRef, isOver } = useDroppable({ id: 'stage' });

  const [themeId, setThemeId] = useState(STAGE_THEMES[0].id);
  const theme = getStageTheme(themeId);
  const cycleTheme = (dir: 1 | -1) => {
    const idx = STAGE_THEMES.findIndex((t) => t.id === themeId);
    const next = (idx + dir + STAGE_THEMES.length) % STAGE_THEMES.length;
    setThemeId(STAGE_THEMES[next].id);
  };

  const hasOutfit = Boolean(
    activeOutfit.top || activeOutfit.jacket || activeOutfit.bottom || activeOutfit.shoes || activeOutfit.accessory,
  );

  // Figur-Anker: gilt für Model, Bodenschatten und Spiegelung gemeinsam
  // Feste Werte für alle Bühnen – Avatar-Größe/-Position bleibt beim Wechsel konstant
  const modelBottom = AVATAR_LAYOUT.bottom;
  const modelHeight = AVATAR_LAYOUT.height;

  // Weiblich: hochauflösendes Render (avatar-default). Männlich: Platzhalter
  // aus dem Layout-Mockup extrahiert, bis das eigene Männer-Render kommt.
  const avatarGender = useDropStore((s) => s.avatarGender);
  const avatarSrc = avatarGender === 'male' ? '/stage/avatar-male.png' : '/stage/avatar-default.png';

  return (
    <div className="relative h-full m-2 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
      {/* ── Bühne (Foto-Render; CSS-Kulisse als Fallback) ─────── */}
      <div className="absolute inset-0" style={{ background: theme.backdrop }} />
      <div className="absolute bottom-0 inset-x-0 h-1/3" style={{ background: theme.floor }} />

      {theme.image ? (
        <>
          {/* Bühne füllt den Container immer komplett (cover, mittig) –
              seitlicher Beschnitt ist gewollt, kein Letterboxing */}
          <img
            src={theme.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
          {/* Bodenkontakt: weicher elliptischer Schatten unter den Füßen */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              bottom: `calc(${modelBottom} - 1.6%)`,
              width: '24%',
              height: '3.2%',
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 45%, transparent 72%)',
              filter: 'blur(4px)',
            }}
          />
          {/* Dezente Spiegelung der Figur auf der Plattform */}
          <img
            src={avatarSrc}
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 max-w-none pointer-events-none"
            style={{
              top: `calc(100% - ${modelBottom})`,
              height: modelHeight,
              maxHeight: '75%',
              transform: 'translateX(-50%) scaleY(-1)',
              opacity: 0.1,
              filter: 'blur(1.5px)',
              maskImage: 'linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.9) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          {/* Dieselbe Figur auf jeder Bühne – später Ziel der Fashn.ai-Anprobe.
              Größe relativ zum Container: skaliert responsiv, Füße auf
              Podest-Höhe, Kopf behält oben immer Abstand (maxHeight-Deckel).
              modelTint tönt die Figur passend zur Lichtstimmung der Bühne. */}
          <img
            src={avatarSrc}
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 max-w-none pointer-events-none"
            style={{
              bottom: modelBottom,
              height: modelHeight,
              maxHeight: '75%',
              filter: `blur(0.3px) ${AVATAR_LAYOUT.filter}`,
            }}
          />
        </>
      ) : (
        <>
          {/* Hintergrund-Figuren – bewusst verschwommen, nur Atmosphäre (Briefing) */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[
              { left: '10%', bottom: '32%', height: 150, opacity: 0.42 },
              { left: '20%', bottom: '34%', height: 122, opacity: 0.32 },
              { left: '75%', bottom: '33%', height: 142, opacity: 0.38 },
              { left: '87%', bottom: '31%', height: 116, opacity: 0.28 },
            ].map((f, i) => (
              <div key={i} className="absolute blur-[9px]" style={{ left: f.left, bottom: f.bottom, opacity: f.opacity }}>
                <div className="mx-auto rounded-full" style={{ width: 22, height: 22, background: '#6e6455' }} />
                <div className="rounded-[45%] mt-0.5" style={{ width: 42, height: f.height, background: '#6e6455' }} />
              </div>
            ))}
          </div>

          {/* Lichtkegel von der Decke + Lichtinsel am Boden */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[74%] h-[58%] pointer-events-none opacity-60"
            style={{
              background: 'linear-gradient(180deg, rgba(252,247,236,0.9) 0%, rgba(252,247,236,0) 80%)',
              clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0% 100%)',
            }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: theme.glow }} />
        </>
      )}

      {/* ── Kopf: Theme-Auswahl ───────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between p-3">
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1 pl-1.5 border border-black/5 shadow-sm">
          <button onClick={() => cycleTheme(-1)} aria-label="Vorheriges Theme" className="drop-btn p-1 rounded-full text-drop-ink-2">
            <Icon name="chevron-left" size={15} />
          </button>
          <span className="text-xs font-semibold text-drop-ink px-1 whitespace-nowrap">
            {theme.emoji && <span className="mr-1">{theme.emoji}</span>}
            {theme.label}
          </span>
          {theme.premium && (
            <span className="text-[8px] font-bold tracking-wider text-drop-lila bg-drop-lila-soft rounded-full px-1.5 py-0.5 whitespace-nowrap">
              PREMIUM
            </span>
          )}
          <button onClick={() => cycleTheme(1)} aria-label="Nächstes Theme" className="drop-btn p-1 rounded-full text-drop-ink-2">
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
      </div>

      {/* ── Werkzeugleiste rechts ─────────────────────────────── */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-1.5">
        <ToolButton icon="camera" label="Foto aufnehmen" />
        <ToolButton icon="bookmark" label="Outfit speichern" onClick={onSave} />
        <ToolButton icon="share" label="Teilen" onClick={onShare} />
        <ToolButton icon="sun" label="Licht" />
        <ToolButton icon="maximize" label="Vollbild" />
      </div>

      {/* ── Bühnenfläche: Drop-Zone / Outfit ──────────────────── */}
      <div
        ref={setNodeRef}
        className={`absolute inset-x-0 top-16 bottom-24 z-10 flex items-center justify-center px-6 transition-colors ${
          isOver ? 'bg-drop-lila/15' : ''
        }`}
      >
        {/* Deutliches Drop-Feedback beim Drüberziehen */}
        {isOver && (
          <div className="absolute inset-4 z-20 rounded-3xl border-2 border-dashed border-drop-lila flex items-center justify-center pointer-events-none">
            <span className="bg-drop-lila text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
              Loslassen zum Anziehen
            </span>
          </div>
        )}
        {hasOutfit ? (
          <div className="flex flex-col items-center gap-3">
            {(activeOutfit.top || activeOutfit.jacket) && (
              <div className="relative w-32" style={{ height: activeOutfit.top && activeOutfit.jacket ? '116px' : 'auto' }}>
                {activeOutfit.top && (
                  <SlotCard item={activeOutfit.top} slot="top" onRemove={removeFromAvatar} className="z-10" />
                )}
                {activeOutfit.jacket && (
                  <SlotCard
                    item={activeOutfit.jacket}
                    slot="jacket"
                    onRemove={removeFromAvatar}
                    className={activeOutfit.top ? 'absolute top-0 left-0 z-20' : ''}
                    style={activeOutfit.top ? { transform: 'translate(16px, 16px)' } : undefined}
                  />
                )}
              </div>
            )}
            {activeOutfit.bottom && <SlotCard item={activeOutfit.bottom} slot="bottom" onRemove={removeFromAvatar} />}
            {activeOutfit.shoes && <SlotCard item={activeOutfit.shoes} slot="shoes" onRemove={removeFromAvatar} />}
            {activeOutfit.accessory && <SlotCard item={activeOutfit.accessory} slot="accessory" onRemove={removeFromAvatar} />}
          </div>
        ) : theme.image ? (
          /* Foto-Bühne: kein permanenter Banner – die Bühne spricht für sich.
             Der Drag-Hinweis steht im leeren Schrank links. */
          null
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-center mb-5">
              <p className={`text-sm font-semibold ${theme.dark ? 'text-white/90' : 'text-drop-ink/80'}`}>
                Deine Bühne ist bereit
              </p>
              <p className={`text-[11px] mt-1 max-w-[230px] ${theme.dark ? 'text-white/60' : 'text-drop-ink-2'}`}>
                Zieh Teile aus dem Schrank hierher oder lass dir ein Outfit vorschlagen.
              </p>
            </div>
            {/* Erhöhtes rundes Podest wie im Mockup (kein Avatar) */}
            <div className="relative mt-2">
              <div className="absolute left-1/2 -translate-x-1/2 top-[92px] w-80 h-9 rounded-[50%] bg-black/25 blur-lg" />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-4 w-72 h-[88px] rounded-[50%]"
                style={{ background: theme.podiumSide ?? 'rgba(0,0,0,0.18)' }}
              />
              <div
                className="relative w-72 h-[88px] rounded-[50%] flex items-center justify-center transition-shadow"
                style={{
                  background: theme.podium,
                  boxShadow: isOver
                    ? '0 0 0 4px rgba(123,47,190,0.35), inset 0 6px 18px rgba(255,255,255,0.55), inset 0 -10px 22px rgba(0,0,0,0.12)'
                    : 'inset 0 6px 18px rgba(255,255,255,0.55), inset 0 -10px 22px rgba(0,0,0,0.12)',
                }}
              >
                <span className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-drop-lila shadow-sm">
                  <Icon name="sparkle" size={22} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Fuß: eine klare Hauptaktion (KI stellt einen Look zusammen) ── */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="primary"
            className="justify-center py-3 px-6 text-sm shadow-lg"
            onClick={onVisualize}
          >
            <Icon name={hasOutfit ? 'shuffle' : 'sparkle'} size={16} />
            {hasOutfit ? 'Neuer Look' : 'Outfit vorschlagen'}
          </Button>
          {hasOutfit && (
            <Button
              variant="soft"
              className="justify-center py-3 px-4 text-sm"
              onClick={onSave}
            >
              <Icon name="bookmark" size={16} /> Speichern
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
