import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }[size];

  const variantClasses = {
    primary:
      'bg-manga-accent text-white font-bold uppercase tracking-wider hover:bg-manga-accentGlow active:translate-y-0.5 shadow-panel-accent transition-all',
    secondary:
      'bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 active:translate-y-0.5 shadow-panel transition-all',
    outline:
      'border border-manga-border hover:border-white text-manga-text font-medium hover:bg-white/5 active:translate-y-0.5 transition-all',
    danger:
      'bg-red-950/50 border border-red-500 text-red-200 hover:bg-red-900/60 transition-all',
    ghost:
      'text-manga-muted hover:text-white hover:bg-white/5 transition-all',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 select-none font-mono focus:outline-none focus:ring-2 focus:ring-manga-accent focus:ring-offset-2 focus:ring-offset-manga-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
