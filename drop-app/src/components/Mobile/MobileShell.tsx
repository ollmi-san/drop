import { useRef, useState } from 'react';
import { MobileStageSheet } from './MobileStageSheet';
import { MobileHome } from './MobileHome';
import { MobileBottomNav, type MobileView } from './MobileBottomNav';
import { WardrobePanel } from '../Wardrobe/WardrobePanel';
import { FashionGuidePanel } from '../Guide/FashionGuidePanel';
import { STAGE_THEMES } from '../../data/stageThemes';
import { useDropStore } from '../../store/dropStore';
import { buildOutfit } from '../../utils/outfit';

interface MobileShellProps {
  onUpload: () => void;
}

// Mobiles Layout (< 768px). Nutzt dieselben Daten/Store/Panels wie Desktop,
// nur Layout + Navigation sind auf Smartphone ausgelegt.
export function MobileShell({ onUpload }: MobileShellProps) {
  const [view, setView] = useState<MobileView>('buehne');
  const [stageId, setStageId] = useState(STAGE_THEMES[0].id);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const wardrobe = useDropStore((s) => s.wardrobe);
  const applyOutfit = useDropStore((s) => s.applyOutfit);

  const notify = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  const handleSuggest = () => {
    const outfit = buildOutfit(wardrobe);
    if (!outfit.length) {
      setView('buehne');
      notify('Lade erst ein paar Teile hoch');
      return;
    }
    applyOutfit(outfit);
    setView('buehne');
    notify('Outfit zusammengestellt');
  };

  const handleSelectStage = (id: string) => {
    setStageId(id);
    setView('buehne');
  };

  return (
    <div className="flex flex-col bg-drop-cream" style={{ height: '100dvh' }}>
      <main className="flex-1 relative min-h-0 overflow-hidden">
        {/* ── Home: Entdecken-Feed ── */}
        {view === 'home' && (
          <MobileHome onNavigate={setView} onSuggest={handleSuggest} onSelectStage={handleSelectStage} />
        )}

        {/* ── Bühne: Foto-Bühne + 3-Ebenen-Sheet ── */}
        {view === 'buehne' && (
          <MobileStageSheet themeId={stageId} onUpload={onUpload} notify={notify} />
        )}

        {/* ── Kleiderschrank: bestehendes Panel über volle Breite ── */}
        {view === 'kleiderschrank' && (
          <div className="absolute inset-0">
            <WardrobePanel onUpload={onUpload} />
          </div>
        )}

        {/* ── Style Guide: bestehendes Panel ── */}
        {view === 'styleguide' && (
          <div className="absolute inset-0">
            <FashionGuidePanel />
          </div>
        )}

        {/* ── Profil: folgt später ── */}
        {view === 'profil' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
            <span className="font-serif font-bold text-3xl text-drop-ink">DROP.</span>
            <p className="text-sm text-drop-ink-3">Dein Profil kommt in Kürze.</p>
          </div>
        )}

        {toast && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[60] bg-drop-ink text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg pointer-events-none">
            {toast}
          </div>
        )}
      </main>

      <div className="relative z-50">
        <MobileBottomNav active={view} onChange={setView} />
      </div>
    </div>
  );
}
