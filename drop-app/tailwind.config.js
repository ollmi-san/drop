/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        drop: {
          bg:           '#050508',
          'bg-2':       '#08080f',
          surface:      '#0e0e1a',
          card:         '#13131f',
          'card-2':     '#1a1a2a',
          border:       '#ffffff12',
          'border-2':   '#ffffff1e',
          accent:       '#7c6ef5',
          'accent-2':   '#5b4fcf',
          'accent-glow':'#7c6ef533',
          text:         '#f0f0f8',
          'text-2':     '#c8c8de',
          muted:        '#5a5a78',

          // ── Neues Light-Theme (cremeweiß / gold / lila) ──
          cream:        '#FAF7F2',
          'cream-2':    '#F2ECE1',
          'cream-3':    '#E9E0D2',
          gold:         '#C9A86A',
          'gold-soft':  '#E6D6B8',
          lila:         '#7B2FBE',
          'lila-dark':  '#6325A0',
          'lila-soft':  '#F1E7FB',
          ink:          '#1C1A22',
          'ink-2':      '#6B6770',
          'ink-3':      '#9B96A2',
          topbar:       '#0E0E12',
          line:         '#00000010',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm':  '0 0 20px rgba(124,110,245,0.15)',
        'glow':     '0 0 40px rgba(124,110,245,0.20)',
        'glow-lg':  '0 0 80px rgba(124,110,245,0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
