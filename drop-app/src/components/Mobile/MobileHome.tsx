import { Icon } from '../ui/Icon';
import { STAGE_THEMES } from '../../data/stageThemes';
import { useDropStore } from '../../store/dropStore';
import type { MobileView } from './MobileBottomNav';

interface MobileHomeProps {
  onNavigate: (view: MobileView) => void;
  onSuggest: () => void;
  onSelectStage: (id: string) => void;
}

// Home-Feed (mobil): emotionaler Einstieg zum Entdecken. Hero + große Karten,
// scrollbar. Bewusst ruhig, viel Weißraum, premium. Keine Fake-/Phase-2-Daten
// (kein Wetter, kein Score) – die Karten führen zu echten Aktionen.
export function MobileHome({ onNavigate, onSuggest, onSelectStage }: MobileHomeProps) {
  const wardrobe = useDropStore((s) => s.wardrobe);
  const recent = [...wardrobe].slice(-3).reverse();

  return (
    <div className="absolute inset-0 overflow-y-auto bg-drop-cream">
      {/* ── Hero ── */}
      <div className="relative h-[46dvh] w-full overflow-hidden">
        <img src="/stage/luxury-boutique.png" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        {/* Scrim für Lesbarkeit auf jedem Hintergrund */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div
          className="absolute inset-x-0 bottom-0 p-6"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
        >
          <h1 className="font-serif font-bold text-4xl text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            DROP.
          </h1>
          <p className="text-white/90 text-base mt-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Entdecke deinen Style.
          </p>
        </div>
      </div>

      {/* ── Karten-Feed ── */}
      <div className="px-4 py-4 space-y-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
        {/* Dein Look – KI-Vorschlag */}
        <button
          onClick={onSuggest}
          className="w-full text-left bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-4 p-5">
            <div className="flex-1">
              <span className="text-[11px] font-semibold tracking-widest text-drop-gold uppercase">Dein Look</span>
              <h3 className="font-serif font-bold text-xl text-drop-ink mt-1 leading-tight">
                Lass dir ein Outfit vorschlagen
              </h3>
              <span className="inline-flex items-center gap-1 text-sm text-drop-ink-2 mt-2 font-medium">
                Jetzt anprobieren <Icon name="chevron-right" size={14} />
              </span>
            </div>
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-drop-lila-soft flex items-center justify-center text-drop-lila">
              <Icon name="sparkle" size={30} />
            </div>
          </div>
        </button>

        {/* Fashion Guide */}
        <button
          onClick={() => onNavigate('styleguide')}
          className="w-full text-left bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 active:scale-[0.99] transition-transform"
        >
          <span className="text-[11px] font-semibold tracking-widest text-drop-gold uppercase">Fashion Guide</span>
          <h3 className="font-serif font-bold text-xl text-drop-ink mt-1 leading-tight">
            5 Essentials für jeden Kleiderschrank
          </h3>
          <span className="inline-flex items-center gap-1 text-sm text-drop-ink-2 mt-2 font-medium">
            Mehr entdecken <Icon name="chevron-right" size={14} />
          </span>
        </button>

        {/* Neueste Teile */}
        <button
          onClick={() => onNavigate('kleiderschrank')}
          className="w-full text-left bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 active:scale-[0.99] transition-transform"
        >
          <span className="text-[11px] font-semibold tracking-widest text-drop-gold uppercase">Neueste Teile</span>
          <h3 className="font-serif font-bold text-xl text-drop-ink mt-1 leading-tight">Deine neuesten Uploads</h3>
          <div className="flex gap-3 mt-3">
            {recent.length === 0 ? (
              <div className="flex items-center gap-3 text-drop-ink-3 text-sm">
                <span className="w-16 h-16 rounded-2xl border border-dashed border-black/15 bg-drop-cream-2/60 flex items-center justify-center">
                  <Icon name="plus" size={20} />
                </span>
                Noch keine Teile – lade dein erstes hoch.
              </div>
            ) : (
              recent.map((item) => (
                <div key={item.id} className="w-16 h-16 rounded-2xl bg-drop-cream-2 border border-black/5 flex items-center justify-center">
                  <img src={item.imageUrl} alt={item.name} className="max-h-[80%] max-w-[80%] object-contain" />
                </div>
              ))
            )}
          </div>
        </button>

        {/* Bühnen auswählen */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5">
          <span className="text-[11px] font-semibold tracking-widest text-drop-gold uppercase">Bühne</span>
          <h3 className="font-serif font-bold text-xl text-drop-ink mt-1 leading-tight">Wähle deine Lieblingsbühne</h3>
          <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar">
            {STAGE_THEMES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className="shrink-0 w-32 active:scale-95 transition-transform"
              >
                <div className="relative h-24 rounded-2xl overflow-hidden border border-black/5">
                  <img src={stage.image} alt={stage.label} className="absolute inset-0 w-full h-full object-cover" />
                  {stage.premium && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] font-bold tracking-wide text-white bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                      PREMIUM
                    </span>
                  )}
                </div>
                <span className="block text-xs font-medium text-drop-ink mt-1.5 text-center truncate">
                  {stage.emoji} {stage.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
