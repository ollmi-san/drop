import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { TopBar, type MainView } from './TopBar';
import { BottomNav } from './BottomNav';
import { WardrobePanel } from '../Wardrobe/WardrobePanel';
import { StagePanel } from '../Stage/StagePanel';
import { MyItemsStrip } from '../Stage/MyItemsStrip';
import { InfoColumn } from '../Stylist/InfoColumn';
import { FashionGuidePanel } from '../Guide/FashionGuidePanel';
import { MobileShell } from '../Mobile/MobileShell';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useDropStore } from '../../store/dropStore';
import { fetchWeather, type WeatherData } from '../../services/weather';
import { buildOutfit } from '../../utils/outfit';
import type { ClothingItem } from '../../types';

export function AppShell() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<MainView>('Bühne');
  const [toast, setToast] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<ClothingItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const wardrobe = useDropStore((s) => s.wardrobe);
  const addClothingItem = useDropStore((s) => s.addClothingItem);
  const placeOnAvatar = useDropStore((s) => s.placeOnAvatar);
  const applyOutfit = useDropStore((s) => s.applyOutfit);
  const saveOutfit = useDropStore((s) => s.saveOutfit);

  // Echte Wetterdaten (Open-Meteo, Berlin) – einmal beim Start laden
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((w) => { if (alive) setWeather(w); })
      .catch(() => { if (alive) setWeatherError(true); });
    return () => { alive = false; };
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  // 1) Hochladen
  const handleUpload = () => fileInputRef.current?.click();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      addClothingItem({ name: file.name.replace(/\.[^.]+$/, ''), category: 'top', imageUrl: reader.result as string });
      notify('Teil hinzugefügt');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 6) Outfit vorschlagen lassen
  const handleSuggest = () => {
    const outfit = buildOutfit(wardrobe);
    if (!outfit.length) return notify('Schrank ist leer');
    applyOutfit(outfit);
    notify('Outfit zusammengestellt');
  };

  // 4) Speichern
  const handleSave = () => {
    saveOutfit(`Outfit ${new Date().toLocaleDateString('de-DE')}`);
    notify('Outfit gespeichert');
  };

  // 2) Drag & Drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const handleDragStart = (e: DragStartEvent) => setDragItem((e.active.data.current?.item as ClothingItem) ?? null);
  const handleDragEnd = (e: DragEndEvent) => {
    setDragItem(null);
    const item = e.active.data.current?.item as ClothingItem | undefined;
    if (item && e.over?.id === 'stage') {
      placeOnAvatar(item);
      notify(`${item.name} angezogen`);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {isMobile ? (
        <MobileShell onUpload={handleUpload} />
      ) : (
      <div className="h-screen w-screen flex flex-col bg-drop-cream overflow-hidden">
        <TopBar active={activeView} onChange={setActiveView} onAdd={handleUpload} />

        <main className="flex-1 flex flex-col min-h-0">
          {activeView === 'Bühne' && (
            <>
              <div className="flex-1 flex min-h-0">
                <section className="flex-[3] min-w-0">
                  <WardrobePanel onUpload={handleUpload} />
                </section>
                <section className="flex-[4.6] min-w-0">
                  <StagePanel
                    onVisualize={handleSuggest}
                    onSave={handleSave}
                    onShare={() => notify('Link kopiert')}
                  />
                </section>
                <section className="flex-[2.4] min-w-0">
                  <InfoColumn
                    weather={weather}
                    weatherError={weatherError}
                    onShowOutfits={() => notify('Noch keine gespeicherten Outfits')}
                  />
                </section>
              </div>
              <MyItemsStrip onUpload={handleUpload} />
            </>
          )}

          {activeView === 'Kleiderschrank' && (
            <section className="flex-1 min-w-0">
              <WardrobePanel onUpload={handleUpload} />
            </section>
          )}

          {activeView === 'Style Guide' && (
            <section className="flex-1 min-w-0">
              <FashionGuidePanel />
            </section>
          )}
        </main>

        <BottomNav onAdd={handleUpload} />
      </div>
      )}

      <DragOverlay dropAnimation={null}>
        {dragItem ? (
          <div className="bg-white rounded-xl border border-black/10 p-2 shadow-lg w-20">
            <img src={dragItem.imageUrl} alt="" className="w-full h-14 object-contain" />
          </div>
        ) : null}
      </DragOverlay>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-drop-ink text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </DndContext>
  );
}
