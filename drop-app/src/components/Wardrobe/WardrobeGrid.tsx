import { useDropStore } from '../../store/dropStore';
import { ClothingCard } from './ClothingCard';
import { UploadButton } from './UploadButton';

export function WardrobeGrid() {
  const { wardrobe } = useDropStore();

  return (
    <div className="flex flex-col h-full gap-3">

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <span style={{
          fontSize: 10, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(240,240,248,0.35)',
        }}>
          Kleiderschrank
        </span>
        {wardrobe.length > 0 && (
          <span style={{ fontSize: 11, color: 'rgba(240,240,248,0.25)' }}>
            {wardrobe.length} Teile
          </span>
        )}
      </div>

      {/* Upload */}
      <UploadButton />

      {/* Grid / Empty state */}
      {wardrobe.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            border: '1.5px dashed rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, opacity: 0.4,
          }}>
            👕
          </div>
          <p style={{ fontSize: 12, color: 'rgba(240,240,248,0.3)', textAlign: 'center', lineHeight: 1.6 }}>
            Noch keine Kleidung.<br />Lade dein erstes Teil hoch.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            overflowY: 'auto',
            flex: 1,
            paddingRight: 2,
          }}
        >
          {wardrobe.map((item, idx) => (
            <ClothingCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
