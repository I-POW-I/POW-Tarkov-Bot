import React from 'react';
import { LayoutDashboard, DollarSign, ChartBar as BarChart3, Settings, Crosshair } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prices', label: 'Prices', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, setCurrentPage, collapsed = false }) {
  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--transition-base)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10,
      }}>
        <Crosshair size={24} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
        {!collapsed && (
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}>
            Tarkov Bot
          </span>
        )}
      </div>

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                background: active ? 'var(--accent-blue-muted)' : 'transparent',
                color: active ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                transition: 'all var(--transition-fast)',
                marginBottom: 2,
                position: 'relative',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  borderRadius: '0 3px 3px 0',
                  background: 'var(--accent-blue)',
                }} />
              )}
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: collapsed ? '16px 0' : '16px 20px',
        borderTop: '1px solid var(--border-primary)',
        textAlign: collapsed ? 'center' : 'left',
      }}>
        {!collapsed && (
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>v1.0.0</span>
        )}
      </div>
    </aside>
  );
}
