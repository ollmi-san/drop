import { useState } from 'react';
import { Drawer } from 'vaul';
import { MobileStage } from './MobileStage';
import { Icon } from '../ui/Icon';
import { useDropStore } from '../../store/dropStore';
import type { ClothingItem } from '../../types';

// Bühnen-Kategorien (gleiche Aufteilung wie im Desktop-Schrank).
const CATS: { label: string; test: (i: ClothingItem) => boolean }[] = [
  { label: 'Alle',        test: () => true },
  { label: 'Oberteile',   test: (i) => i.category === 'top' && !/Blazer|Jacke/i.test(i.name) },
  { label: 'Unterteile',  test: (i) => i.category === 'bottom' },
  { label: 'Outwear',     test: (i) => /Blazer|Jacke/i.test(i.name) },
  { label: 'Schuhe',      test: (i) => i.category === 'shoes' },
  { label: 'Accessoires', test: (i) => i.category === 'accessory' },
];

// Rest / Standard / Voll. Max 0.88, damit Kopf+Schultern+Oberkörper des
// Avatars über bzw. hinter dem Milchglas immer sichtbar bleiben.
const SNAP_POINTS = [0.3, 0.6, 0.88];

interface MobileStageSheetProps {
  themeId: string;
  onUpload: () => void;
  notify: (msg: string) => void;
}

export function MobileStageSheet({ themeId, onUpload, notify }: MobileStageSheetProps) {
  const [snap, setSnap] = useState<number | string | null>(0.3);
  const [activeCat, setActiveCat] = useState(0);

  const wardrobe = useDropStore((s) => s.wardrobe);
  const activeOutfit = useDropStore((s) => s.activeOutfit);
  const placeOnAvatar = useDropStore((s) => s.placeOnAvatar);
  const clearOutfit = useDropStore((s) => s.clearOutfit);
  const avatarGender = useDropStore((s) => s.avatarGender);
  const setAvatarGender = useDropStore((s) => s.setAvatarGender);

  const snapNum = typeof snap === 'number' ? snap : 0.3;
  const expanded = snapNum >= 0.85; // volle Ebene → Grid, sonst horizontaler Streifen

  const activeIds = new Set(
    Object.values(activeOutfit).filter(Boolean).map((i) => (i as ClothingItem).id),
  );
  const items = wardrobe.filter((i) => CATS[activeCat].test(i));

  // Tap-to-Select: Teil antippen → anziehen (ersetzt den gleichen Slot).
  const handleSelect = (item: ClothingItem) => {
    placeOnAvatar(item);
    notify(`${item.name} angezogen`);
  };

  const handleUndress = () => {
    if (activeIds.size === 0) return;
    clearOutfit();
    notify('Ausgezogen');
  };

  const ItemCard = ({ item, large }: { item: ClothingItem; large?: boolean }) => {
    const selected = activeIds.has(item.id);
    return (
      <button
        onClick={() => handleSelect(item)}
        className={`relative shrink-0 rounded-2xl bg-[#fafaf8] border shadow-sm flex items-center justify-center transition-transform active:scale-95 ${
          large ? 'aspect-[3/4] w-full' : 'w-[84px] h-[104px]'
        } ${selected ? 'border-drop-lila ring-2 ring-drop-lila/40' : 'border-black/5'}`}
      >
        <img src={item.imageUrl} alt={item.name} className="max-h-[78%] max-w-[80%] object-contain" />
        {selected && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-drop-lila text-white flex items-center justify-center">
            <Icon name="star" size={11} fill />
          </span>
        )}
        {large && (
          <span className="absolute bottom-1.5 left-2 right-2 text-[11px] text-drop-ink-2 truncate text-left">
            {item.name}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <MobileStage themeId={themeId} onAvatarTap={handleUndress} />

      {/* Kopf über der Bühne: Logo + Avatar-Umschalter */}
      <div
        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        <span className="font-serif font-bold text-lg text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          DROP.
        </span>
        <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full p-0.5">
          {(['female', 'male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setAvatarGender(g)}
              aria-pressed={avatarGender === g}
              className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] ${
                avatarGender === g ? 'bg-white text-drop-ink' : 'text-white/80'
              }`}
            >
              {g === 'female' ? 'Weiblich' : 'Männlich'}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-Sheet mit 3 Snap-Ebenen */}
      <Drawer.Root
        open
        modal={false}
        dismissible={false}
        snapPoints={SNAP_POINTS}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <Drawer.Portal>
          <Drawer.Content
            className="fixed inset-x-0 bottom-0 z-30 h-full max-h-full rounded-t-3xl flex flex-col outline-none shadow-[0_-12px_44px_rgba(0,0,0,0.14)]"
            style={{
              background: 'rgba(244, 238, 229, 0.68)',        // warmes Creme, transluzent
              backdropFilter: 'blur(24px) saturate(1.15)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.15)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 -12px 44px rgba(0,0,0,0.14)',
            }}
          >
            <Drawer.Handle className="!bg-black/20 !w-10 !mt-2.5 !mb-1" />
            <Drawer.Title className="sr-only">Kleiderschrank</Drawer.Title>

            {/* Kategorie-Chips (horizontal scrollbar) */}
            <div className="shrink-0 flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
              {CATS.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setActiveCat(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[40px] ${
                    activeCat === i ? 'bg-drop-ink text-white' : 'bg-black/5 text-drop-ink-2'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="shrink-0 flex items-center justify-between px-4 pt-1 pb-2">
              <span className="text-sm font-bold text-drop-ink">Meine Teile</span>
              <span className="text-[11px] text-drop-ink-3">Antippen zum Anziehen</span>
            </div>

            {/* Inhalt: leer / horizontaler Streifen / volles Grid */}
            <div className="flex-1 overflow-y-auto px-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>
              {wardrobe.length === 0 ? (
                <button
                  onClick={onUpload}
                  className="w-full h-[104px] rounded-2xl border border-dashed border-black/15 bg-white/60 flex flex-col items-center justify-center gap-1 text-drop-ink-3"
                >
                  <span className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
                    <Icon name="plus" size={18} />
                  </span>
                  <span className="text-xs font-medium">Erstes Teil hinzufügen</span>
                </button>
              ) : expanded ? (
                <div className="grid grid-cols-3 gap-3">
                  {items.map((item) => <ItemCard key={item.id} item={item} large />)}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {items.map((item) => <ItemCard key={item.id} item={item} />)}
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
