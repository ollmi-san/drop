import { useState, useRef } from 'react';
import { useDropStore } from '../../store/dropStore';
import { playUploadSound } from '../../utils/sounds';
import type { Category } from '../../types';
import { CATEGORY_LABELS } from '../../types';

const CATEGORIES: Category[] = ['top', 'bottom', 'shoes', 'accessory'];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadButton() {
  const { addClothingItem } = useDropStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal]       = useState(false);
  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [category, setCategory] = useState<Category>('top');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setName(f.name.replace(/\.[^.]+$/, ''));
    setPreview(URL.createObjectURL(f));
    setModal(true);
  }

  async function handleSave() {
    if (!file) return;
    setLoading(true);
    try {
      addClothingItem({ name: name || file.name, category, imageUrl: await fileToBase64(file) });
      playUploadSound();
      close();
    } finally { setLoading(false); }
  }

  function close() {
    setModal(false); setPreview(null); setFile(null);
    setName(''); setCategory('top');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <>
      {/* Upload-Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 16,
          border: '1.5px dashed rgba(124,110,245,0.35)',
          background: 'rgba(124,110,245,0.06)',
          color: 'rgba(124,110,245,0.75)',
          fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.15s ease',
        }}
        onPointerEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = 'rgba(124,110,245,0.7)';
          el.style.color = '#7c6ef5';
          el.style.background = 'rgba(124,110,245,0.10)';
        }}
        onPointerLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = 'rgba(124,110,245,0.35)';
          el.style.color = 'rgba(124,110,245,0.75)';
          el.style.background = 'rgba(124,110,245,0.06)';
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
        Kleidung hochladen
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 360,
              borderRadius: 24,
              background: 'linear-gradient(180deg, #151525 0%, #0e0e1c 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(124,110,245,0.1)',
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f8', marginBottom: 20 }}>
              Teil hinzufügen
            </h2>

            {/* Preview */}
            {preview && (
              <div style={{
                marginBottom: 16,
                display: 'flex', justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 16, padding: 12,
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <img src={preview} alt="Vorschau"
                     style={{ maxHeight: 140, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, color: 'rgba(240,240,248,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Name
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Weißes T-Shirt"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0f0f8', fontSize: 13,
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(124,110,245,0.6)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Kategorie */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 10, color: 'rgba(240,240,248,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Kategorie
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '9px 12px', borderRadius: 14,
                      border: '1px solid',
                      borderColor: category === cat ? 'rgba(124,110,245,0.7)' : 'rgba(255,255,255,0.08)',
                      background: category === cat
                        ? 'linear-gradient(135deg, rgba(124,110,245,0.25) 0%, rgba(91,79,207,0.15) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      color: category === cat ? '#c4b8ff' : 'rgba(240,240,248,0.4)',
                      fontSize: 12, fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={close} className="btn-ghost" style={{ flex: 1 }}>
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
                style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Wird gespeichert…' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
