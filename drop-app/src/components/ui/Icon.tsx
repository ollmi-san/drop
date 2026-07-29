// Kompakte Inline-SVG-Icons (Feather/Lucide-Stil, stroke = currentColor)
type IconName =
  | 'wardrobe' | 'mannequin' | 'combine' | 'calendar' | 'heart' | 'more'
  | 'bell' | 'home' | 'community' | 'inbox' | 'shop' | 'profile'
  | 'rotate' | 'face' | 'pose' | 'search' | 'filter' | 'diamond'
  | 'plus' | 'star' | 'share' | 'bookmark' | 'chevron-down' | 'sparkle'
  | 'sun' | 'briefcase' | 'bike' | 'thumbs-up' | 'thumbs-down' | 'x' | 'upload' | 'hanger'
  | 'menu' | 'cloud' | 'cloud-sun' | 'rain' | 'snow' | 'storm' | 'wind' | 'camera' | 'maximize'
  | 'chevron-left' | 'chevron-right' | 'shuffle' | 'layers' | 'book'
  | 'anchor' | 'palette' | 'lightbulb';

const PATHS: Record<IconName, string> = {
  wardrobe:    'M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.1a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.3-2.2z',
  mannequin:   'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 22v-1a6 6 0 0 1 12 0v1M9 14h6',
  combine:     'M12 3l1.4 4.1L17.5 8.5 13.4 9.9 12 14l-1.4-4.1L6.5 8.5l4.1-1.4zM18 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
  calendar:    'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  heart:       'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
  more:        'M5 12h.01M12 12h.01M19 12h.01',
  bell:        'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
  home:        'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  community:   'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  inbox:       'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z',
  shop:        'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  profile:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  rotate:      'M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16',
  face:        'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  pose:        'M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 6v8M12 14l-4 7M12 14l4 7M6 9l6 2 6-2',
  search:      'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  filter:      'M4 6h16M7 12h10M10 18h4',
  diamond:     'M12 2 22 12 12 22 2 12z',
  plus:        'M12 5v14M5 12h14',
  star:        'M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z',
  share:       'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v14',
  bookmark:    'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  'chevron-down': 'M6 9l6 6 6-6',
  sparkle:     'M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z',
  sun:         'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  briefcase:   'M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  bike:        'M5.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 14.5 9 8h5l3.5 6.5M9 8l2 6.5h7',
  'thumbs-up': 'M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM7 11l4-8a2 2 0 0 1 2 2v3h5a2 2 0 0 1 2 2.3l-1.3 6A2 2 0 0 1 16.7 20H7',
  'thumbs-down':'M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1zM17 13l-4 8a2 2 0 0 1-2-2v-3H6a2 2 0 0 1-2-2.3l1.3-6A2 2 0 0 1 7.3 4H17',
  x:           'M18 6 6 18M6 6l12 12',
  upload:      'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  hanger:      'M12 8 V5.6 a1.7 1.7 0 1 0 -1.7 -1.7 M12 8 L4 14 L20 14 Z',
  menu:        'M3 6h18M3 12h18M3 18h18',
  cloud:       'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z',
  'cloud-sun': 'M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4M15.9 12a4 4 0 0 0-7.6-1.6M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z',
  rain:        'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M16 14v6M8 14v6M12 16v6',
  snow:        'M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01',
  storm:       'M6 16.3A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97M13 12l-3 5h4l-3 5',
  wind:        'M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2',
  camera:      'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  maximize:    'M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3',
  'chevron-left':  'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  shuffle:     'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  layers:      'M12 2 2 7l10 5 10-5z M2 12l10 5 10-5 M2 17l10 5 10-5',
  book:        'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  anchor:      'M12 22V8M5 12H2a10 10 0 0 0 20 0h-3M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  palette:     'M12 22a10 10 0 1 1 0-20 8 8 0 0 1 0 16h-1.5a1.5 1.5 0 0 0-1 2.6c.3.3.5.7.5 1.4M7.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16.5 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  lightbulb:   'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z',
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: boolean;
}

export function Icon({ name, size = 20, className = '', strokeWidth = 1.8, fill = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export type { IconName };
