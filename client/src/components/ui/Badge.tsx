import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'gold' | 'outline' | 'kanji';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: 'bg-manga-surface border border-manga-border text-manga-text',
    accent: 'bg-manga-accent text-white font-semibold shadow-glow-red',
    gold: 'bg-manga-gold/10 border border-manga-gold text-manga-gold font-semibold',
    outline: 'border border-white/20 text-manga-muted hover:border-white/40',
    kanji: 'bg-black border border-manga-accent text-manga-accent font-hindi font-bold tracking-wider',
    hindi: 'bg-black border border-manga-accent text-manga-accent font-hindi font-bold tracking-wider',
  }[variant as string] || 'bg-manga-surface border border-manga-border text-manga-text';

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider font-mono transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
