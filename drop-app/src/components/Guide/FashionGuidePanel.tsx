import { useState } from 'react';
import { Icon, type IconName } from '../ui/Icon';

const TABS = ['Lexikon', 'Anchor Fit', 'Index'] as const;

interface GuideCard {
  icon: IconName;
  title: string;
  text: string;
}

const CARDS: GuideCard[] = [
  { icon: 'anchor',   title: 'Anchor Fit',       text: 'Ein ruhiges Basis-Teil, um das herum du das ganze Outfit aufbaust.' },
  { icon: 'layers',   title: 'Layering',         text: 'Mehrere Schichten kombinieren – für Tiefe, Wärme und Charakter.' },
  { icon: 'diamond',  title: 'Statement Piece',  text: 'Ein auffälliges Teil, das den Look trägt. Davon bewusst nur eines.' },
  { icon: 'wardrobe', title: 'Capsule Wardrobe', text: 'Wenige, gut kombinierbare Teile statt eines vollen Schranks.' },
  { icon: 'palette',  title: 'Color Blocking',   text: 'Klare, kräftige Farbflächen gezielt gegeneinander setzen.' },
];

export function FashionGuidePanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Lexikon');

  return (
    <div className="h-full m-2 bg-white/80 rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
      {/* ── Kopf ──────────────────────────────────────────────── */}
      <div className="shrink-0 p-4 pb-3 border-b border-black/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-full bg-drop-cream-3 flex items-center justify-center text-drop-gold">
            <Icon name="book" size={14} />
          </span>
          <h2 className="text-lg font-bold tracking-tight">Fashion Guide</h2>
        </div>
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`drop-btn px-2.5 py-1 rounded-full text-[11px] font-medium ${
                tab === t ? 'bg-drop-ink text-white' : 'bg-black/5 text-drop-ink-2'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inhalt je Tab ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {tab === 'Lexikon' &&
          CARDS.map((c) => (
            <div key={c.title} className="flex items-start gap-3 bg-white rounded-xl border border-black/5 p-3 shadow-sm">
              <span className="w-9 h-9 shrink-0 rounded-lg bg-drop-cream-2 flex items-center justify-center text-drop-gold">
                <Icon name={c.icon} size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{c.title}</span>
                <span className="block text-[11px] text-drop-ink-3 leading-relaxed mt-0.5">{c.text}</span>
              </span>
            </div>
          ))}

        {tab === 'Anchor Fit' && (
          <>
            <div className="bg-white rounded-xl border border-black/5 p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-drop-gold"><Icon name="anchor" size={16} /></span>
                <span className="text-sm font-semibold">Das Ankerteil</span>
              </div>
              <p className="text-[11px] text-drop-ink-3 leading-relaxed">
                Ein ruhiges Basis-Teil, um das herum du das ganze Outfit aufbaust –
                etwa ein weißes Shirt oder eine dunkle Jeans.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-black/5 p-3 shadow-sm">
              <span className="block text-sm font-semibold mb-1.5">So gehst du vor</span>
              <ol className="space-y-1.5 text-[11px] text-drop-ink-3 leading-relaxed list-decimal list-inside">
                <li>Wähle ein neutrales Teil als Anker.</li>
                <li>Baue Farben und Layer darum auf.</li>
                <li>Setze höchstens ein Statement Piece dazu.</li>
              </ol>
            </div>
            <div className="bg-drop-lila-soft rounded-xl p-3">
              <p className="text-[11px] text-drop-ink-2 leading-relaxed">
                Später markiert dein KI Stylist Ankerteile direkt im Schrank:
                „Dieses Shirt funktioniert als Ankerteil."
              </p>
            </div>
          </>
        )}

        {tab === 'Index' &&
          [...CARDS]
            .sort((a, b) => a.title.localeCompare(b.title, 'de'))
            .map((c) => (
              <div key={c.title} className="flex items-center gap-2.5 bg-white rounded-xl border border-black/5 px-3 py-2 shadow-sm">
                <span className="text-drop-gold"><Icon name={c.icon} size={14} /></span>
                <span className="text-xs font-medium">{c.title}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
