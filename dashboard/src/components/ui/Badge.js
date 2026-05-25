import React from 'react';

const variants = {
  blue: 'badge-blue',
  emerald: 'badge-emerald',
  amber: 'badge-amber',
  rose: 'badge-rose',
};

export default function Badge({ variant = 'blue', children, dot = false }) {
  return (
    <span className={`badge ${variants[variant] || 'badge-blue'}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
