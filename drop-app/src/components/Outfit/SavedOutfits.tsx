import { useDropStore } from '../../store/dropStore';

export function SavedOutfits() {
  const { savedOutfits, loadOutfit, deleteOutfit } = useDropStore();
  if (savedOutfits.length === 0) return null;

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
      <p style={{
        fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'rgba(240,240,248,0.3)', marginBottom: 10,
      }}>
        Gespeichert ({savedOutfits.length})
      </p>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {savedOutfits.map((outfit) => {
          const imgs = Object.values(outfit.items).filter(Boolean);
          return (
            <div
              key={outfit.id}
              onClick={() => loadOutfit(outfit.id)}
              className="group"
              style={{
                flexShrink: 0, width: 88,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.15s, transform 0.15s',
              }}
              onPointerEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,110,245,0.45)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onPointerLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.transform = '';
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: 72, background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                {imgs[0] ? (
                  <img src={imgs[0].imageUrl} alt={outfit.name}
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, opacity: 0.3 }}>👔</div>
                )}
                {imgs.length > 1 && (
                  <span style={{
                    position: 'absolute', bottom: 4, right: 4,
                    fontSize: 9, padding: '1px 5px', borderRadius: 99,
                    background: 'rgba(0,0,0,0.65)', color: 'rgba(240,240,248,0.7)',
                  }}>
                    +{imgs.length - 1}
                  </span>
                )}
              </div>

              {/* Name + delete */}
              <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  flex: 1, fontSize: 10, fontWeight: 500,
                  color: 'rgba(240,240,248,0.7)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {outfit.name}
                </span>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); deleteOutfit(outfit.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(240,240,248,0.25)', fontSize: 14, lineHeight: 1,
                    padding: 2, flexShrink: 0,
                    transition: 'color 0.15s',
                  }}
                  className="hover:!text-red-400 opacity-0 group-hover:opacity-100"
                >×</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
