import { Icon, type IconName } from '../ui/Icon';
import { useDropStore } from '../../store/dropStore';
import type { AvatarGender } from '../../types';

const GENDER_LABELS: Record<AvatarGender, string> = {
  female: 'Weiblich',
  male: 'Männlich',
};

// Hauptbereiche laut Redesign-Mockup. Community/Shop = Phase 2, noch nicht hier.
const VIEWS = ['Bühne', 'Kleiderschrank', 'Style Guide'] as const;
export type MainView = (typeof VIEWS)[number];

const VIEW_ICONS: Record<MainView, IconName> = {
  Bühne: 'sparkle',
  Kleiderschrank: 'wardrobe',
  'Style Guide': 'book',
};

interface TopBarProps {
  active: MainView;
  onChange: (view: MainView) => void;
  onAdd?: () => void;
}

export function TopBar({ active, onChange, onAdd }: TopBarProps) {
  const avatarGender = useDropStore((s) => s.avatarGender);
  const setAvatarGender = useDropStore((s) => s.setAvatarGender);

  return (
    <header className="h-16 bg-drop-cream text-drop-ink border-b border-black/5 flex items-center gap-4 px-5 shrink-0 z-30">
      {/* Links: Logo + Tagline */}
      <div className="flex items-baseline gap-2.5 select-none">
        <span className="font-serif font-bold tracking-tight text-xl">DROP</span>
        <span className="hidden lg:inline text-[10px] font-semibold tracking-[0.18em] text-drop-ink-3">
          DRESS YOUR STORY
        </span>
      </div>

      {/* Mitte: Hauptbereiche */}
      <nav className="flex-1 flex items-center justify-center gap-1.5">
        {VIEWS.map((view) => (
          <button
            key={view}
            onClick={() => onChange(view)}
            className={`drop-btn flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide ${
              active === view
                ? 'bg-white text-drop-ink shadow-sm ring-1 ring-black/5'
                : 'text-drop-ink-3 hover:text-drop-ink'
            }`}
          >
            <Icon name={VIEW_ICONS[view]} size={16} />
            {view}
          </button>
        ))}
      </nav>

      {/* Rechts: Avatar-Toggle + Suche + Glocke + Hinzufügen + Profil */}
      <div className="flex items-center gap-2.5">
        {/* Weiblich/Männlich – wechselt nur den Avatar, der Schrank bleibt gleich */}
        <div className="flex items-center bg-black/5 rounded-full p-0.5">
          {(['female', 'male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setAvatarGender(g)}
              aria-pressed={avatarGender === g}
              className={`drop-btn px-3 py-1 rounded-full text-xs font-medium ${
                avatarGender === g
                  ? 'bg-white text-drop-ink shadow-sm ring-1 ring-black/5'
                  : 'text-drop-ink-2 hover:text-drop-ink'
              }`}
            >
              {GENDER_LABELS[g]}
            </button>
          ))}
        </div>
        <button className="drop-btn p-2 rounded-full text-drop-ink-2 hover:text-drop-ink" aria-label="Suche">
          <Icon name="search" size={18} />
        </button>
        <button className="drop-btn p-2 rounded-full text-drop-ink-2 hover:text-drop-ink" aria-label="Benachrichtigungen">
          <Icon name="bell" size={19} />
        </button>
        <button
          onClick={onAdd}
          className="drop-btn w-9 h-9 rounded-full bg-drop-ink text-white flex items-center justify-center shadow-sm"
          aria-label="Teil hinzufügen"
        >
          <Icon name="plus" size={17} />
        </button>
        <button
          className="drop-btn w-9 h-9 rounded-full bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center text-drop-ink-2"
          aria-label="Profil"
        >
          <Icon name="profile" size={17} />
        </button>
      </div>
    </header>
  );
}
