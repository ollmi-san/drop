import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDropStore } from '../../store/dropStore';
import type { ClothingItem } from '../../types';
import { CATEGORY_LABELS } from '../../types';

const CAT_DOT: Record<string, string> = {
  top:       '#9d8fff',
  bottom:    '#6bbfff',
  shoes:     '#ffb86b',
  accessory: '#6bffb8',
};

interface Props {
  item: ClothingItem;
  /** Index in wardrobe grid — used for staggered float animation */
  index?: number;
}

export function ClothingCard({ item, index = 0 }: Props) {
  const { removeClothingItem, activeOutfit } = useDropStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });

  const isOnAvatar = Object.values(activeOutfit).some((i) => i?.id === item.id);

  // Staggered float: every card gets a slightly different phase
  const floatDelay = `${(index % 5) * 0.7}s`;
  const floatDuration = `${3.8 + (index % 3) * 0.6}s`;

  return (
    <div
      ref={setNodeRef}
      className="card-float group"
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.38 : 1,
        zIndex: isDragging ? 999 : undefined,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'grab',
        background: 'rgba(255,255,255,0.028)',
        border: isOnAvatar
          ? '1px solid rgba(124,110,245,0.55)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isOnAvatar
          ? '0 0 14px rgba(124,110,245,0.22), 0 4px 12px rgba(0,0,0,0.35)'
          : '0 4px 14px rgba(0,0,0,0.35)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        position: 'relative',
        animationDelay: floatDelay,
        animationDuration: floatDuration,
      }}
      {...listeners}
      {...attributes}
      onPointerEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLDivElement).style.transform =
            `${CSS.Translate.toString(transform) ?? ''} translateY(-3px)`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = isOnAvatar
            ? '0 0 18px rgba(124,110,245,0.30), 0 8px 20px rgba(0,0,0,0.45)'
            : '0 8px 22px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.09)';
        }
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Bild */}
      <div style={{
        aspectRatio: '1',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.22s ease',
          }}
          className="group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div style={{ padding: '6px 8px 8px' }}>
        <p style={{
          fontSize: 11, fontWeight: 500,
          color: 'rgba(240,240,248,0.80)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: CAT_DOT[item.category],
            display: 'inline-block', flexShrink: 0,
            boxShadow: `0 0 4px ${CAT_DOT[item.category]}88`,
          }} />
          <span style={{ fontSize: 10, color: 'rgba(240,240,248,0.35)' }}>
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>
      </div>

      {/* On-Avatar Indikator */}
      {isOnAvatar && (
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 7, height: 7, borderRadius: '50%',
          background: '#7c6ef5',
          boxShadow: '0 0 8px rgba(124,110,245,0.85)',
        }} />
      )}

      {/* Löschen Button */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); removeClothingItem(item.id); }}
        style={{
          position: 'absolute', top: 6, left: 6,
          width: 22, height: 22, borderRadius: '50%',
          background: 'rgba(10,10,20,0.90)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(240,240,248,0.50)',
          fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.15s, color 0.15s',
        }}
        className="group-hover:opacity-100 hover:!text-red-400"
        title="Löschen"
      >
        ×
      </button>
    </div>
  );
}
