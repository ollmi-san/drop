import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'dark' | 'ghost' | 'soft' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-drop-lila text-white shadow-[0_4px_14px_rgba(123,47,190,0.28)]',
  dark:    'bg-[#1A1A22] text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]',
  ghost:   'bg-white/70 text-drop-ink border border-black/10 backdrop-blur-sm',
  soft:    'bg-drop-lila-soft text-drop-lila',
  icon:    'bg-white/80 text-drop-ink border border-black/10 backdrop-blur-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`drop-btn inline-flex items-center justify-center gap-2 rounded-full font-medium ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
