import { useDropStore } from '../../store/dropStore';
import type { AvatarGender } from '../../types';

export function AvatarSelector() {
  const { avatarGender, setAvatarGender } = useDropStore();

  const opts: { v: AvatarGender; label: string }[] = [
    { v: 'female', label: '♀' },
    { v: 'male',   label: '♂' },
  ];

  return (
    <div
      className="flex gap-1 p-1 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {opts.map(({ v, label }) => (
        <button
          key={v}
          onClick={() => setAvatarGender(v)}
          style={{
            width: 36, height: 32,
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 15,
            transition: 'all 0.18s ease',
            background: avatarGender === v
              ? 'linear-gradient(135deg, #7c6ef5 0%, #5b4fcf 100%)'
              : 'transparent',
            color: avatarGender === v ? '#fff' : 'rgba(240,240,248,0.4)',
            boxShadow: avatarGender === v
              ? '0 2px 10px rgba(124,110,245,0.4)'
              : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
