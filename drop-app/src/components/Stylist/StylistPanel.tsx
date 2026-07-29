import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'clean-everyday',
    title: 'Clean Everyday',
    subtitle: 'Lässig & modern',
    images: ['/wardrobe/tee-white.png', '/wardrobe/jeans-blue.png', '/wardrobe/sneakers-white.png', '/wardrobe/sunglasses.png'],
  },
  {
    id: 'business-casual',
    title: 'Business Casual',
    subtitle: 'Schick & professionell',
    images: ['/wardrobe/blazer-beige.png', '/wardrobe/pants-black.png', '/wardrobe/bag-black.png', '/wardrobe/heels-black.png'],
  },
  {
    id: 'city-chic',
    title: 'City Chic',
    subtitle: 'Stylisch & feminin',
    images: ['/wardrobe/denim-jacket.png', '/wardrobe/skirt-black.png', '/wardrobe/boots-black.png', '/wardrobe/necklace-gold.png'],
  },
];

interface StylistPanelProps {
  onApply?: (suggestion: Suggestion) => void;
  onMore?: () => void;
  onAdjust?: () => void;
  onFeedback?: (kind: 'up' | 'down') => void;
}

export function StylistPanel({ onApply, onMore, onAdjust, onFeedback }: StylistPanelProps) {
  return (
    <div className="h-full m-2 bg-white/80 rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
      {/* ── Kopf ──────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between p-4 pb-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-drop-lila-soft flex items-center justify-center text-drop-lila">
            <Icon name="sparkle" size={15} />
          </span>
          <h2 className="text-lg font-bold tracking-tight">Dein Stylist</h2>
        </div>
        <Button variant="icon" className="w-8 h-8 p-0 rounded-full">
          <Icon name="plus" size={16} />
        </Button>
      </div>

      {/* ── Scrollbereich ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Chat-Bubble */}
        <div className="bg-drop-lila-soft rounded-2xl rounded-tl-md p-3">
          <p className="text-xs text-drop-ink-2 leading-relaxed">
            Hey! Ich habe <span className="font-semibold text-drop-ink">3 Outfits</span> für dich zusammengestellt,
            basierend auf deinem Stil und dem Wetter heute.
          </p>
        </div>

        {/* Wetter-Karte */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-black/5 p-3 shadow-sm">
          <span className="text-drop-gold"><Icon name="sun" size={26} /></span>
          <div>
            <p className="text-sm font-semibold">18°C Sonnig</p>
            <p className="text-[11px] text-drop-ink-3">Berlin, Deutschland</p>
          </div>
        </div>

        {/* Empfohlene Outfits */}
        <p className="text-xs font-semibold text-drop-ink-2 pt-1">Empfohlene Outfits</p>

        {SUGGESTIONS.map((s) => (
          <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl border border-black/5 p-2.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1 w-16 shrink-0">
              {s.images.map((src) => (
                <div key={src} className="bg-drop-cream rounded-md p-0.5">
                  <img src={src} alt="" className="w-full h-6 object-contain" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{s.title}</p>
              <p className="text-[11px] text-drop-ink-3 truncate">{s.subtitle}</p>
            </div>
            <Button
              variant="icon"
              className="w-8 h-8 p-0 rounded-full shrink-0"
              onClick={() => onApply?.(s)}
              aria-label={`${s.title} anziehen`}
            >
              <Icon name="plus" size={15} />
            </Button>
          </div>
        ))}

        <Button variant="ghost" className="w-full py-2.5 text-xs" onClick={onMore}>
          Mehr Vorschläge
        </Button>
      </div>

      {/* ── Fuß ───────────────────────────────────────────────── */}
      <div className="shrink-0 p-4 pt-3 border-t border-black/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-drop-ink-2">Feedback geben</span>
          <div className="flex items-center gap-1.5">
            <Button variant="icon" className="w-8 h-8 p-0 rounded-full" onClick={() => onFeedback?.('up')}>
              <Icon name="thumbs-up" size={14} />
            </Button>
            <Button variant="icon" className="w-8 h-8 p-0 rounded-full" onClick={() => onFeedback?.('down')}>
              <Icon name="thumbs-down" size={14} />
            </Button>
          </div>
        </div>

        <Button variant="primary" onClick={onAdjust} className="w-full py-3 flex-col gap-0.5 rounded-xl">
          <span className="flex items-center gap-2 text-sm font-semibold"><Icon name="sparkle" size={15} /> Outfit anpassen lassen</span>
          <span className="text-[11px] font-normal text-white/70">Für Anlass &amp; Wetter optimieren</span>
        </Button>
      </div>
    </div>
  );
}
