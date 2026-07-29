import { useState } from 'react';
import { useDropStore } from '../../store/dropStore';
import { playSaveSound } from '../../utils/sounds';

export function OutfitSaver() {
  const { activeOutfit, clearOutfit, saveOutfit } = useDropStore();
  const [naming, setNaming] = useState(false);
  const [name, setName]     = useState('');

  const hasItems = Object.keys(activeOutfit).length > 0;
  if (!hasItems) return null;

  function handleSave() {
    if (!name.trim()) return;
    saveOutfit(name.trim());
    playSaveSound();
    setName(''); setNaming(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {naming ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            autoFocus type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setNaming(false); setName(''); } }}
            placeholder="Outfit benennen…"
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 16,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(124,110,245,0.5)',
              color: '#f0f0f8', fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSave} disabled={!name.trim()}
            className="btn-primary" style={{ padding: '10px 16px', opacity: name.trim() ? 1 : 0.5 }}
          >✓</button>
          <button
            onClick={() => { setNaming(false); setName(''); }}
            className="btn-ghost" style={{ padding: '10px 14px' }}
          >✕</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setNaming(true)} className="btn-primary" style={{ flex: 1 }}>
            Outfit speichern
          </button>
          <button
            onClick={clearOutfit} className="btn-ghost"
            title="Outfit leeren"
            style={{ padding: '10px 14px', fontSize: 16 }}
          >↺</button>
        </div>
      )}
    </div>
  );
}
