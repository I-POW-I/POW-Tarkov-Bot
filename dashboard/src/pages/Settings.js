import React, { useState } from 'react';
import { Save, RotateCcw, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings({ apiUrl }) {
  const [settings, setSettings] = useState({
    botPrefix: '/',
    autoUpdateInterval: '6',
    maxCacheSize: '1000',
    enableAnalytics: true,
    enablePriceAlerts: true,
  });
  const [saved, setSaved] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({
      botPrefix: '/',
      autoUpdateInterval: '6',
      maxCacheSize: '1000',
      enableAnalytics: true,
      enablePriceAlerts: true,
    });
    setSaved(false);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Settings
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Configure bot behavior and preferences
        </p>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
          Appearance
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-tertiary)',
        }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>Theme</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
              Switch between light and dark mode
            </div>
          </div>
          <div
            className={`toggle ${theme === 'dark' ? '' : 'active'}`}
            onClick={toggleTheme}
          >
            <div className="toggle-knob" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
          Bot Configuration
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}>
              Bot Prefix
            </label>
            <input
              type="text"
              value={settings.botPrefix}
              onChange={e => handleChange('botPrefix', e.target.value)}
              className="input"
              style={{ maxWidth: 120 }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}>
              Auto-Update Interval (hours)
            </label>
            <input
              type="number"
              value={settings.autoUpdateInterval}
              onChange={e => handleChange('autoUpdateInterval', e.target.value)}
              className="input"
              style={{ maxWidth: 120 }}
              min="1"
              max="24"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}>
              Max Cache Size
            </label>
            <input
              type="number"
              value={settings.maxCacheSize}
              onChange={e => handleChange('maxCacheSize', e.target.value)}
              className="input"
              style={{ maxWidth: 160 }}
              min="100"
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
          Features
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { key: 'enableAnalytics', label: 'Analytics', desc: 'Track command usage and performance metrics' },
            { key: 'enablePriceAlerts', label: 'Price Alerts', desc: 'Send notifications for significant price changes' },
          ].map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div
                className={`toggle ${settings[item.key] ? 'active' : ''}`}
                onClick={() => handleChange(item.key, !settings[item.key])}
              >
                <div className="toggle-knob" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save Settings'}
        </button>
        <button onClick={handleReset} className="btn btn-ghost">
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}
