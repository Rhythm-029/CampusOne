import React from 'react';

export default function Card({ children, className = '', hover = false, onClick = null }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl border border-border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all ${
        hover ? 'hover:border-sand hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

