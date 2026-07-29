import { useState } from 'react';
import { Icon, type IconName } from '../ui/Icon';

interface BottomNavProps {
  onAdd?: () => void;
}

const LEFT: { id: string; label: string; icon: IconName }[] = [
  { id: 'home',      label: 'Home',      icon: 'home' },
  { id: 'entdecken', label: 'Entdecken', icon: 'search' },
];
const RIGHT: { id: string; label: string; icon: IconName }[] = [
  { id: 'favoriten', label: 'Favoriten', icon: 'heart' },
  { id: 'profil',    label: 'Profil',    icon: 'profile' },
];

export function BottomNav({ onAdd }: BottomNavProps) {
  const [active, setActive] = useState('home');

  const NavItem = ({ item }: { item: { id: string; label: string; icon: IconName } }) => {
    const isActive = active === item.id;
    return (
      <button
        onClick={() => setActive(item.id)}
        className={`drop-btn flex flex-col items-center gap-1 px-4 py-1 ${
          isActive ? 'text-drop-lila' : 'text-drop-ink-3 hover:text-drop-ink-2'
        }`}
      >
        <Icon name={item.icon} size={20} fill={isActive} />
        <span className="text-[11px] font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="shrink-0 h-[72px] bg-white border-t border-black/5 flex items-center justify-center gap-6 px-6 relative z-20">
      {LEFT.map((item) => <NavItem key={item.id} item={item} />)}

      {/* Zentraler Hinzufügen-Button (erhöht) */}
      <button
        onClick={onAdd}
        aria-label="Teil hinzufügen"
        className="drop-btn -mt-6 w-14 h-14 rounded-full bg-drop-lila text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(123,47,190,0.40)]"
      >
        <Icon name="plus" size={22} />
        <span className="text-[9px] font-semibold mt-0.5">Hinzufügen</span>
      </button>

      {RIGHT.map((item) => <NavItem key={item.id} item={item} />)}
    </nav>
  );
}
