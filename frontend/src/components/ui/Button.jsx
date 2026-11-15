import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon = null,
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variants = {
    primary:
      'bg-forest text-white hover:bg-forest-900 shadow-sm active:translate-y-px',
    secondary:
      'bg-surface text-navy-800 border border-border hover:bg-canvas-alt active:translate-y-px',
    outline:
      'bg-transparent border border-forest text-forest hover:bg-forest-light active:translate-y-px',
    subtle:
      'bg-canvas-alt text-navy-700 hover:bg-border/50 hover:text-navy-900',
    danger:
      'bg-terracotta text-white hover:opacity-90 active:translate-y-px',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

