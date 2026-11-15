import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    available: 'bg-forest-light text-forest border border-forest/20',
    found: 'bg-forest-light text-forest border border-forest/20',
    booked: 'bg-sand-light text-navy-800 border border-sand/40',
    lost: 'bg-terracotta-light text-terracotta border border-terracotta/20',
    neutral: 'bg-canvas-alt text-navy-500 border border-border',
    default: 'bg-canvas-alt text-navy-700 border border-border',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}

