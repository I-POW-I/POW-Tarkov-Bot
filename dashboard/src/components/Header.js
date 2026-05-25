import React from 'react';
import { RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ apiStatus, onSync }) {
  const { theme, toggleTheme } = useTheme();
  const isOnline = apiStatus === 'online';

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-primary)',
      padding: '0 28px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`status-dot ${isOnline ? 'status-dot-online' : 'status-dot-offline'}`} />
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: isOnline ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          }}>
            API {apiStatus}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onSync}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          <RefreshCw size={14} />
          Sync
        </button>
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}
