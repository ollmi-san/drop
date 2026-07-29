import { useState } from 'react';
import { Icon, type IconName } from '../ui/Icon';
import { useDropStore } from '../../store/dropStore';

const NAV: { id: string; label: string; icon: IconName }[] = [
  { id: 'schrank',     label: 'Schrank',     icon: 'wardrobe' },
  { id: 'puppen',      label: 'Puppen',      icon: 'mannequin' },
  { id: 'kombinieren', label: 'Kombinieren', icon: 'combine' },
  { id: 'kalender',    label: 'Kalender',    icon: 'calendar' },
  { id: 'favoriten',   label: 'Favoriten',   icon: 'heart' },
  { id: 'mehr',        label: 'Mehr',        icon: 'more' },
];

export function IconSidebar() {
  const [active, setActive] = useState('schrank');
  const setShowFavoritesOnly = useDropStore((s) => s.setShowFavoritesOnly);

  const handleNav = (id: string) => {
    setActive(id);
    setShowFavoritesOnly(id === 'favoriten');
  };

  return (
    <aside className="w-[68px] shrink-0 bg-drop-cream-2 border-r border-black/5 flex flex-col items-center py-4 gap-1">
      {NAV.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            title={item.label}
            className="drop-btn relative w-full flex flex-col items-center gap-1 py-2.5"
          >
            {/* lila Akzent links */}
            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-drop-lila" />}
            <span className={isActive ? 'text-drop-lila' : 'text-drop-ink-3'}>
              <Icon name={item.icon} size={22} />
            </span>
            <span className={`text-[10px] font-medium ${isActive ? 'text-drop-lila' : 'text-drop-ink-3'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
