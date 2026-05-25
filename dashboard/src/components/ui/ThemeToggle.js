import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: 13,
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--bg-hover)';
        e.currentTarget.style.borderColor = 'var(--border-secondary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--bg-tertiary)';
        e.currentTarget.style.borderColor = 'var(--border-primary)';
      }}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
