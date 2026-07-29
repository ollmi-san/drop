import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import type { WeatherData } from '../../services/weather';

// Style-DNA – noch ohne Daten (leerer Schrank), daher 0 %.
const DNA = [
  { label: 'Streetwear', color: '#7B2FBE' },
  { label: 'Minimal',    color: '#C9A86A' },
  { label: 'Sportswear', color: '#3FA79E' },
  { label: 'Techwear',   color: '#4B5563' },
  { label: 'Sonstige',   color: '#B8AE9E' },
];

interface InfoColumnProps {
  weather: WeatherData | null;
  weatherError?: boolean;
  onShowOutfits?: () => void;
}

export function InfoColumn({ weather, weatherError, onShowOutfits }: InfoColumnProps) {
  return (
    <div className="h-full m-2 flex flex-col gap-3 overflow-y-auto pr-0.5">
      {/* ── KI Stylist (Herzstück der Spalte, wie im Mockup) ──── */}
      <section className="bg-white/80 rounded-2xl border border-black/5 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-7 h-7 rounded-full bg-drop-lila-soft flex items-center justify-center text-drop-lila">
            <Icon name="sparkle" size={14} />
          </span>
          <h3 className="text-sm font-bold tracking-tight">KI Stylist</h3>
        </div>
        {/* Sprechblase – die KI erklärt, statt nur zu zählen */}
        <div className="rounded-2xl rounded-tl-md bg-drop-lila-soft/60 p-3">
          <p className="text-[11px] text-drop-ink-2 leading-relaxed">
            Hey! Lade deine ersten Teile hoch – ich stelle dir daraus Outfits zusammen,
            passend zu deinem Stil und dem Wetter.
          </p>
        </div>
        {/* Vorschläge: leere Slots, bis echte Outfits entstehen (keine Fake-Daten) */}
        <div className="mt-3">
          <div className="text-[11px] font-semibold text-drop-ink-3 mb-1.5">Vorschläge</div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl border border-dashed border-black/10 bg-drop-cream-2/60 flex items-center justify-center text-drop-ink-3/50"
              >
                <Icon name="sparkle" size={14} />
              </div>
            ))}
          </div>
        </div>
        <Button variant="soft" className="w-full mt-3 py-2.5 text-xs" onClick={onShowOutfits}>
          <Icon name="sparkle" size={13} /> Outfits anzeigen
        </Button>
      </section>

      {/* ── Wetter (echte Daten via Open-Meteo) ──────────────── */}
      <section className="bg-white/80 rounded-2xl border border-black/5 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-drop-ink-3">
            <Icon name="sun" size={13} /> {weather?.city ?? 'Berlin, DE'}
          </span>
          <span className="text-[10px] text-drop-ink-3">Heute</span>
        </div>

        {weather ? (
          <>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-drop-gold"><Icon name={weather.icon} size={40} /></span>
              <div>
                <div className="text-3xl font-bold leading-none">{weather.temp}°</div>
                <div className="text-xs text-drop-ink-2 mt-0.5">{weather.condition}</div>
              </div>
              <div className="ml-auto text-right text-[11px] text-drop-ink-3 leading-relaxed">
                <div>H: {weather.high}°</div>
                <div>T: {weather.low}°</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="flex items-center gap-1 bg-drop-cream-2 rounded-full px-2.5 py-1 text-[11px] text-drop-ink-2">
                <Icon name="wind" size={13} /> {weather.wind} km/h
              </span>
              <span className="flex items-center gap-1 bg-drop-cream-2 rounded-full px-2.5 py-1 text-[11px] text-drop-ink-2">
                <Icon name="sun" size={13} /> UV {weather.uv}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-black/5 pt-3">
              {weather.forecast.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1 text-drop-ink-2">
                  <span className="text-[11px] font-medium">{d.day}</span>
                  <span className="text-drop-gold"><Icon name={d.icon} size={18} /></span>
                  <span className="text-[10px] text-drop-ink-3">{d.high}° / {d.low}°</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-3 text-[11px] text-drop-ink-3">
            {weatherError ? 'Wetterdaten sind gerade nicht verfügbar.' : 'Wetter wird geladen…'}
          </p>
        )}
      </section>

      {/* ── Style DNA ────────────────────────────────────────── */}
      <section className="bg-white/80 rounded-2xl border border-black/5 shadow-sm p-4">
        <h3 className="text-sm font-bold tracking-tight mb-3">Style DNA</h3>
        <div className="flex items-center gap-4">
          <div
            className="relative w-20 h-20 shrink-0 rounded-full"
            style={{ background: 'conic-gradient(#e7ddcd 0deg 360deg)' }}
          >
            <div className="absolute inset-[10px] rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-semibold text-drop-ink-3">0%</span>
            </div>
          </div>
          <ul className="flex-1 space-y-1.5">
            {DNA.map((d) => (
              <li key={d.label} className="flex items-center gap-2 text-[11px] text-drop-ink-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="flex-1">{d.label}</span>
                <span className="text-drop-ink-3">0%</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-[11px] text-drop-ink-3">Deine Style-DNA entsteht, sobald du Teile hinzufügst.</p>
      </section>

      {/* ── Fashion-Tipp ─────────────────────────────────────── */}
      <section className="bg-drop-lila-soft rounded-2xl p-4">
        <div className="flex items-center gap-1.5 text-drop-lila font-semibold text-xs mb-1">
          <Icon name="lightbulb" size={14} /> Fashion-Tipp
        </div>
        <p className="text-[11px] text-drop-ink-2 leading-relaxed">
          Ein neutrales Basis-Teil – weißes Shirt, dunkle Hose – ist der Anker für fast jedes Outfit. Starte damit deinen Schrank.
        </p>
      </section>
    </div>
  );
}
