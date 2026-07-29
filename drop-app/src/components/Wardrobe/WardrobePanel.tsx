import { useEffect, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDropStore } from '../../store/dropStore';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import type { ClothingItem } from '../../types';
import { STYLES, STYLE_SECTIONS, getStyleById } from '../../data/styles';
import { scoreForStyle } from '../../utils/styleScoring';

// Unterkategorien: Zuordnung aktuell über den Namen, später über attributes/Auto-Erkennung.
interface SubChip {
  label: string;
  pattern: RegExp;
}

interface CatChip {
  label: string;
  test: (i: ClothingItem) => boolean;
  subs?: SubChip[];
}

const CATEGORIES: CatChip[] = [
  { label: 'Alle',        test: () => true },
  {
    label: 'Oberteile',
    test: (i) => i.category === 'top' && !/Blazer|Jacke/i.test(i.name),
    subs: [
      { label: 'T-Shirts', pattern: /t-?shirt|tee/i },
      { label: 'Hemden',   pattern: /hemd/i },
      { label: 'Hoodies',  pattern: /hoodie|kapuzen/i },
      { label: 'Pullover', pattern: /pullover|pulli|sweater|strick/i },
      { label: 'Tanktops', pattern: /tank/i },
      { label: 'Blusen',   pattern: /bluse/i },
    ],
  },
  {
    label: 'Unterteile',
    test: (i) => i.category === 'bottom',
    subs: [
      { label: 'Jeans',  pattern: /jeans|denim/i },
      { label: 'Hosen',  pattern: /hose|pants|chino|jogger/i },
      { label: 'Shorts', pattern: /shorts/i },
      { label: 'Röcke',  pattern: /rock|skirt/i },
    ],
  },
  {
    label: 'Outwear',
    test: (i) => /Blazer|Jacke/i.test(i.name),
    subs: [
      { label: 'Jacken', pattern: /jacke|jacket/i },
      { label: 'Blazer', pattern: /blazer/i },
      { label: 'Mäntel', pattern: /mantel|coat/i },
      { label: 'Westen', pattern: /weste|vest/i },
    ],
  },
  {
    label: 'Schuhe',
    test: (i) => i.category === 'shoes',
    subs: [
      { label: 'Sneaker', pattern: /sneaker/i },
      { label: 'Boots',   pattern: /boots|stiefel/i },
      { label: 'Loafer',  pattern: /loafer/i },
      { label: 'Heels',   pattern: /heels|pumps|absatz/i },
    ],
  },
  {
    label: 'Accessoires',
    test: (i) => i.category === 'accessory',
    subs: [
      { label: 'Uhren',           pattern: /uhr|watch/i },
      { label: 'Ketten',          pattern: /kette|necklace/i },
      { label: 'Brillen',         pattern: /brille|sunglass/i },
      { label: 'Ringe',           pattern: /ring/i },
      { label: 'Gürtel',          pattern: /gürtel|guertel|belt/i },
      { label: 'Kopfbedeckungen', pattern: /cap|mütze|muetze|hut|beanie|hat/i },
    ],
  },
];

function categoryLabel(item: ClothingItem): string {
  if (/Blazer|Jacke/i.test(item.name)) return 'Outwear';
  switch (item.category) {
    case 'top': return 'Oberteile';
    case 'bottom': return 'Unterteile';
    case 'shoes': return 'Schuhe';
    case 'accessory': return 'Accessoires';
    default: return '';
  }
}

interface WardrobePanelProps {
  onUpload?: () => void;
}

function ItemCard({ item }: { item: ClothingItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });
  const isFavorite = useDropStore((s) => s.favoriteIds.includes(item.id));
  const toggleFavorite = useDropStore((s) => s.toggleFavorite);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1, height: '160px' }}
      className="relative bg-[#fafaf8] rounded-xl border border-black/5 shadow-sm touch-none p-2"
      {...listeners}
      {...attributes}
    >
      <button
        type="button"
        aria-label={isFavorite ? `${item.name} aus Favoriten entfernen` : `${item.name} zu Favoriten hinzufügen`}
        aria-pressed={isFavorite}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(item.id);
        }}
        className="absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-[1.2]"
      >
        <Icon name="heart" size={15} fill={isFavorite} className={isFavorite ? 'text-red-500' : 'text-drop-ink-2'} />
      </button>

      <img
        src={item.imageUrl}
        alt={item.name}
        className="block mx-auto w-full object-contain pointer-events-none tile-fade-in"
        style={{ height: '120px' }}
      />
      <span className="block mt-1.5 text-center text-[10px] text-drop-ink-3 truncate">{categoryLabel(item)}</span>
    </div>
  );
}

// „Hinzufügen"-Kachel wie im Mockup – letzte Kachel im Grid bzw. Start im leeren Schrank
function AddTile({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="drop-btn h-40 rounded-xl border border-dashed border-black/15 bg-white/60 flex flex-col items-center justify-center gap-1.5 text-drop-ink-3 hover:text-drop-ink-2"
    >
      <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
        <Icon name="plus" size={16} />
      </span>
      <span className="text-[10px] font-medium">Hinzufügen</span>
    </button>
  );
}

export function WardrobePanel({ onUpload }: WardrobePanelProps) {
  const wardrobe = useDropStore((s) => s.wardrobe);
  const favoriteIds = useDropStore((s) => s.favoriteIds);
  const showFavoritesOnly = useDropStore((s) => s.showFavoritesOnly);
  const setShowFavoritesOnly = useDropStore((s) => s.setShowFavoritesOnly);
  const [activeCat, setActiveCat] = useState(0);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeStyle = getStyleById(activeStyleId);

  // Schrank beim Laden immer ganz oben starten (keine wiederhergestellte Scrollposition)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const subs = CATEGORIES[activeCat].subs;
  const activeSubChip = subs?.find((s) => s.label === activeSub) ?? null;
  const q = query.trim().toLowerCase();
  const base = wardrobe.filter(
    (i) =>
      CATEGORIES[activeCat].test(i) &&
      (!activeSubChip || activeSubChip.pattern.test(i.name)) &&
      (!q || i.name.toLowerCase().includes(q)) &&
      (!showFavoritesOnly || favoriteIds.includes(i.id)),
  );

  // Style Guide = Filter + Ranking (keine reine Sortierung):
  // nur Teile mit Score > 0, bestes zuerst.
  const filtered = activeStyle
    ? base
        .map((i) => ({ item: i, score: scoreForStyle(i, activeStyle) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item)
    : base;

  return (
    <div className="relative h-full m-2 bg-white/80 rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
      {/* ── Kopf (fix) ──────────────────────────────────────────── */}
      <div className="shrink-0 p-4 pb-3 border-b border-black/5">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold tracking-tight">Mein Schrank</h2>
          <span className="text-[11px] text-drop-ink-3 bg-black/5 rounded-full px-2 py-0.5">
            {wardrobe.length} {wardrobe.length === 1 ? 'Teil' : 'Teile'}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-black/5 rounded-full px-3 py-2">
            <span className="text-drop-ink-3 shrink-0"><Icon name="search" size={15} /></span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche in deinem Schrank..."
              className="flex-1 min-w-0 bg-transparent text-xs text-drop-ink outline-none placeholder:text-drop-ink-3"
            />
          </div>
          <button className="drop-btn p-2 rounded-full bg-black/5 text-drop-ink-2" aria-label="Filter">
            <Icon name="filter" size={15} />
          </button>
        </div>

        {/* Kategorie-Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              onClick={() => {
                setActiveCat(i);
                setActiveSub(null);
                if (i === 0) setShowFavoritesOnly(false);
              }}
              className={`drop-btn px-2.5 py-1 rounded-full text-[11px] font-medium ${
                activeCat === i ? 'bg-drop-ink text-white' : 'bg-black/5 text-drop-ink-2'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Unterkategorien der gewählten Hauptkategorie (erst nach Klick sichtbar) */}
        {subs && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {subs.map((s) => (
              <button
                key={s.label}
                onClick={() => setActiveSub(activeSub === s.label ? null : s.label)}
                className={`drop-btn px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  activeSub === s.label
                    ? 'bg-drop-ink text-white'
                    : 'bg-white ring-1 ring-black/10 text-drop-ink-2'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Style Guide: Auslöser + aktiver Style */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setGuideOpen(true)}
            className="drop-btn flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-drop-lila-soft text-drop-lila"
          >
            <Icon name="sparkle" size={12} /> Style Guide
          </button>
          {activeStyle && (
            <button
              onClick={() => setActiveStyleId(null)}
              aria-label={`Style „${activeStyle.label}" zurücksetzen`}
              className="drop-btn flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-drop-lila text-white"
            >
              {activeStyle.label}
              <Icon name="x" size={12} />
            </button>
          )}
        </div>

        {/* Beschreibung des aktiven Styles */}
        {activeStyle && (
          <p className="mt-2 text-[11px] leading-relaxed text-drop-ink-3">{activeStyle.description}</p>
        )}
      </div>

      {/* ── Grid (scrollt) ──────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
        {wardrobe.length === 0 ? (
          <div>
            <div className="grid grid-cols-4 gap-2.5">
              <AddTile onClick={onUpload} />
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl border border-dashed border-black/10 bg-[#fafaf8]/70" />
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-drop-ink-3">
              Dein Schrank ist noch leer – lade dein erstes Teil hoch.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-drop-ink-3 text-sm px-6">
            {showFavoritesOnly
              ? 'Noch keine Favoriten. Klicke auf das Herz um Teile zu speichern.'
              : 'Keine Teile in dieser Auswahl'}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
            <AddTile onClick={onUpload} />
          </div>
        )}
      </div>

      {/* ── Fuß (fix): Hinzufügen / Upload ──────────────────────── */}
      <div className="shrink-0 p-3 pt-0 flex gap-2">
        <Button variant="dark" className="flex-1 justify-center py-2.5 text-xs" onClick={onUpload}>
          <Icon name="plus" size={14} /> Teil hinzufügen
        </Button>
        <Button variant="ghost" className="px-4 py-2.5 text-xs" onClick={onUpload}>
          <Icon name="upload" size={14} /> Upload
        </Button>
      </div>

      {/* ── Style-Guide-Overlay ─────────────────────────────────── */}
      {guideOpen && (
        <div className="absolute inset-0 z-30 flex flex-col rounded-2xl bg-white/95 backdrop-blur-sm">
          <div className="shrink-0 flex items-center justify-between p-4 border-b border-black/5">
            <div>
              <h3 className="text-base font-bold tracking-tight">Style Guide</h3>
              <p className="text-[11px] text-drop-ink-3">Wähle einen Style – dein Schrank wird passend gefiltert &amp; sortiert.</p>
            </div>
            <button
              onClick={() => setGuideOpen(false)}
              aria-label="Style Guide schließen"
              className="drop-btn p-1.5 rounded-lg text-drop-ink-2 hover:bg-black/5"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {STYLE_SECTIONS.map((section) => (
              <div key={section.id}>
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-drop-ink-3">{section.label}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.filter((s) => s.section === section.id).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveStyleId(s.id);
                        setGuideOpen(false);
                      }}
                      className={`drop-btn px-3 py-1.5 rounded-full text-xs font-medium ${
                        activeStyleId === s.id ? 'bg-drop-lila text-white' : 'bg-drop-lila-soft text-drop-lila'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
