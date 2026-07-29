import { useState } from 'react';
import { useDropStore } from '../../store/dropStore';
import { generateSuggestion } from '../../utils/aiSuggestions';

export function AISuggestions() {
  const { wardrobe, placeOnAvatar } = useDropStore();
  const [suggestion, setSuggestion] = useState<ReturnType<typeof generateSuggestion>>(null);
  const [open, setOpen] = useState(false);

  const canSuggest = wardrobe.some((i) => i.category === 'top')
                  && wardrobe.some((i) => i.category === 'bottom');
  if (!canSuggest) return null;

  function handleSuggest() {
    setSuggestion(generateSuggestion(wardrobe));
    setOpen(true);
  }

  function handleApply() {
    if (!suggestion) return;
    Object.values(suggestion).forEach((item) => { if (item) placeOnAvatar(item); });
    setOpen(false);
  }

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
      <button
        onClick={handleSuggest}
        style={{
          width: '100%', padding: '9px 16px',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          color: 'rgba(240,240,248,0.45)',
          fontSize: 12, fontWeight: 500,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.15s',
        }}
        onPointerEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = '#c4b8ff';
          el.style.borderColor = 'rgba(124,110,245,0.35)';
          el.style.background = 'rgba(124,110,245,0.06)';
        }}
        onPointerLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.color = 'rgba(240,240,248,0.45)';
          el.style.borderColor = 'rgba(255,255,255,0.08)';
          el.style.background = 'rgba(255,255,255,0.02)';
        }}
      >
        <span style={{ fontSize: 13 }}>✦</span> Outfit vorschlagen
      </button>

      {open && suggestion && (
        <div style={{
          marginTop: 10, padding: 14, borderRadius: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,248,0.3)', marginBottom: 10 }}>
            Vorschlag
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {Object.values(suggestion).filter(Boolean).map((item) => item && (
              <div key={item.id} style={{
                width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                flexShrink: 0,
              }}>
                <img src={item.imageUrl} alt={item.name}
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleApply} className="btn-primary" style={{ flex: 1, padding: '8px 12px', fontSize: 12 }}>
              Anziehen
            </button>
            <button onClick={handleSuggest} className="btn-ghost" style={{ padding: '8px 12px', fontSize: 14 }} title="Anderer Vorschlag">↻</button>
            <button onClick={() => setOpen(false)} className="btn-ghost" style={{ padding: '8px 12px', fontSize: 14 }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
