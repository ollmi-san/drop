import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDropStore } from '../../store/dropStore';
import { Icon } from '../ui/Icon';
import type { ClothingItem } from '../../types';

// Kleine ziehbare Teile-Karte für den horizontalen Streifen unter der Bühne.
function StripCard({ item }: { item: ClothingItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `strip-${item.id}`,
    data: { item },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }}
      className="shrink-0 w-[92px] touch-none cursor-grab active:cursor-grabbing"
      {...listeners}
      {...attributes}
    >
      <div className="h-[92px] rounded-xl bg-[#fafaf8] border border-black/5 shadow-sm p-1.5 flex items-center justify-center">
        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain pointer-events-none" />
      </div>
      <span className="block mt-1 text-center text-[11px] text-drop-ink-2 truncate">{item.name}</span>
    </div>
  );
}

interface MyItemsStripProps {
  onUpload?: () => void;
}

export function MyItemsStrip({ onUpload }: MyItemsStripProps) {
  const wardrobe = useDropStore((s) => s.wardrobe);

  return (
    <div className="shrink-0 px-4 pt-2 pb-1">
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-sm font-bold tracking-tight text-drop-ink">Meine Teile</h3>
        <span className="text-[11px] text-drop-ink-3">Ziehe Teile auf die Bühne</span>
      </div>

      {wardrobe.length === 0 ? (
        <div className="flex items-center gap-3 h-[112px]">
          <button
            onClick={onUpload}
            className="drop-btn shrink-0 w-[92px] h-[92px] rounded-xl border border-dashed border-black/15 bg-white/60 flex flex-col items-center justify-center gap-1 text-drop-ink-3 hover:text-drop-ink-2"
          >
            <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
              <Icon name="plus" size={16} />
            </span>
            <span className="text-[10px] font-medium">Hinzufügen</span>
          </button>
          <p className="text-[12px] text-drop-ink-3">
            Dein Schrank ist noch leer – lade dein erstes Teil hoch, dann erscheint es hier.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 overflow-x-auto pb-1">
          {wardrobe.map((item) => (
            <StripCard key={item.id} item={item} />
          ))}
          <button
            onClick={onUpload}
            className="drop-btn shrink-0 w-[92px] h-[92px] rounded-xl border border-dashed border-black/15 bg-white/60 flex flex-col items-center justify-center gap-1 text-drop-ink-3 hover:text-drop-ink-2"
          >
            <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
              <Icon name="plus" size={16} />
            </span>
            <span className="text-[10px] font-medium">Hinzufügen</span>
          </button>
        </div>
      )}
    </div>
  );
}
