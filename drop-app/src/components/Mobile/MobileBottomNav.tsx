import { Icon, type IconName } from '../ui/Icon';

export type MobileView = 'home' | 'kleiderschrank' | 'buehne' | 'styleguide' | 'profil';

const ITEMS: { id: MobileView; label: string; icon: IconName }[] = [
  { id: 'home',           label: 'Home',          icon: 'home' },
  { id: 'kleiderschrank', label: 'Kleiderschrank', icon: 'wardrobe' },
  { id: 'buehne',         label: 'Bühne',         icon: 'mannequin' },
  { id: 'styleguide',     label: 'Style Guide',   icon: 'book' },
  { id: 'profil',         label: 'Profil',        icon: 'profile' },
];

interface MobileBottomNavProps {
  active: MobileView;
  onChange: (view: MobileView) => void;
}

// Apple-ähnliche Tab-Bar. Safe-Area unten wird über padding-bottom berücksichtigt.
export function MobileBottomNav({ active, onChange }: MobileBottomNavProps) {
  return (
    <nav
      className="shrink-0 bg-white/95 backdrop-blur-md border-t border-black/5 flex items-stretch justify-around px-1 pt-1.5"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
    >
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] flex-1 rounded-xl transition-colors ${
              isActive ? 'text-drop-ink' : 'text-drop-ink-3'
            }`}
          >
            <Icon name={item.icon} size={22} fill={isActive && item.id === 'profil' ? false : isActive} />
            <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
