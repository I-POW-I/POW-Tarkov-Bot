import React from 'react';

export function SkeletonText({ width = '80%' }) {
  return <div className="skeleton skeleton-text" style={{ width }} />;
}

export function SkeletonHeading({ width = '40%' }) {
  return <div className="skeleton skeleton-heading" style={{ width }} />;
}

export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonRow({ columns = 4 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '14px 20px' }}>
          <div className="skeleton" style={{ height: 14, width: i === 0 ? '60%' : '40%' }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(count, 2)}, 1fr)`, gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
          <div className="skeleton" style={{ height: 20, width: 32, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 32, width: 80, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: 60 }} />
        </div>
      ))}
    </div>
  );
}
