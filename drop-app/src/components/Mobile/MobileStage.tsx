import { useDropStore } from '../../store/dropStore';
import { getStageTheme, type StageTheme } from '../../data/stageThemes';

// Feste, bühnenunabhängige Avatar-Darstellung auf Mobile: exakt horizontal
// zentriert, Füße auf dem Podest, ~65% der Bühnenhöhe, Kopf mit Abstand.
// Der Avatar ist die Hauptfigur und bleibt in JEDEM Sheet-Zustand sichtbar –
// er skaliert nicht mit dem Sheet. Der Hintergrund wird bewusst zurückgenommen
// (Entsättigung + Vignette + Spotlight), damit der Avatar der kontrastreichste
// Bereich bleibt (Squint-Test).
const MOBILE_AVATAR = {
  bottom: '30%',   // Fußpunkt relativ zur Bühnenhöhe → Füße auf dem Podest
  height: '65%',   // Höhe relativ zur Bühnenhöhe (Ziel 62–68%)
  filter: 'drop-shadow(0 14px 16px rgba(0,0,0,0.34))',
} as const;

export function MobileStage({
  themeId,
  onAvatarTap,
}: {
  themeId: string;
  onAvatarTap?: () => void;
}) {
  const theme: StageTheme = getStageTheme(themeId);
  const avatarGender = useDropStore((s) => s.avatarGender);
  const avatarSrc = avatarGender === 'male' ? '/stage/avatar-male.png' : '/stage/avatar-default.png';

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.backdrop }}>
      {/* Foto-Hintergrund – leicht zurückgenommen, damit der Avatar dominiert */}
      {theme.image && (
        <img
          src={theme.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          style={{ filter: 'saturate(0.86) brightness(0.9)' }}
        />
      )}

      {/* Vignette: dunklere Ränder schieben Poster/Deko in den Hintergrund */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 72% 82% at 50% 40%, transparent 38%, rgba(0,0,0,0.5) 100%)' }}
      />
      {/* Sanftes Spotlight hinter dem Avatar */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 42% 52% at 50% 38%, rgba(255,246,231,0.18) 0%, transparent 68%)' }}
      />

      {/* Kontakt-Schatten unter den Füßen – Avatar steht fest auf der Bühne */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: `calc(${MOBILE_AVATAR.bottom} - 1.4%)`,
          width: '42%',
          height: '2.8%',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.22) 45%, transparent 72%)',
          filter: 'blur(5px)',
        }}
      />

      {/* Dezente Spiegelung auf der Bühne */}
      <img
        src={avatarSrc}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 max-w-none pointer-events-none"
        style={{
          top: `calc(100% - ${MOBILE_AVATAR.bottom})`,
          height: MOBILE_AVATAR.height,
          transform: 'translateX(-50%) scaleY(-1)',
          opacity: 0.09,
          filter: 'blur(1.5px)',
          maskImage: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Avatar – exakt zentriert, Füße auf der Bühne, antippen legt ab */}
      <img
        src={avatarSrc}
        alt="Avatar"
        onClick={onAvatarTap}
        className="absolute left-1/2 -translate-x-1/2 max-w-none cursor-pointer"
        style={{
          bottom: MOBILE_AVATAR.bottom,
          height: MOBILE_AVATAR.height,
          filter: MOBILE_AVATAR.filter,
        }}
      />
    </div>
  );
}
