import React from 'react';
import { TrendingUp, Clock, Zap, ChartBar as BarChart3 } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Badge from '../components/ui/Badge';

const commandData = [
  { name: '/item', uses: 8420, pct: 85, color: 'var(--accent-blue)' },
  { name: '/prices', uses: 6350, pct: 65, color: 'var(--accent-emerald)' },
  { name: '/quest', uses: 4200, pct: 45, color: 'var(--accent-cyan)' },
  { name: '/map', uses: 3100, pct: 32, color: 'var(--accent-amber)' },
  { name: '/updates', uses: 1800, pct: 18, color: 'var(--accent-rose)' },
  { name: '/raidtimer', uses: 950, pct: 10, color: 'var(--text-tertiary)' },
];

const responseTimeData = [
  { label: 'Average', value: 145, unit: 'ms', color: 'var(--accent-emerald)' },
  { label: 'P95', value: 380, unit: 'ms', color: 'var(--accent-amber)' },
  { label: 'P99', value: 890, unit: 'ms', color: 'var(--accent-rose)' },
  { label: 'Max', value: 2100, unit: 'ms', color: 'var(--accent-rose)' },
];

const peakHours = [
  { hour: '6am', value: 12 },
  { hour: '8am', value: 28 },
  { hour: '10am', value: 45 },
  { hour: '12pm', value: 62 },
  { hour: '2pm', value: 55 },
  { hour: '4pm', value: 48 },
  { hour: '6pm', value: 72 },
  { hour: '8pm', value: 85 },
  { hour: '10pm', value: 95 },
  { hour: '12am', value: 78 },
  { hour: '2am', value: 42 },
  { hour: '4am', value: 18 },
];

export default function Analytics({ apiUrl }) {
  const maxHourValue = Math.max(...peakHours.map(h => h.value));

  return (
    <div className="page-enter" style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Analytics
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Command usage, performance metrics, and traffic patterns
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {[
          { label: 'Total Commands', value: 24820, icon: Zap, color: 'var(--accent-blue)', bg: 'var(--accent-blue-muted)' },
          { label: 'Active Users', value: 1340, icon: BarChart3, color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-muted)' },
          { label: 'Avg Response', value: 145, suffix: 'ms', icon: Clock, color: 'var(--accent-amber)', bg: 'var(--accent-amber-muted)' },
          { label: 'Uptime', value: 99.8, suffix: '%', decimals: 1, icon: TrendingUp, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-muted)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`stat-card animate-fade-in-up stagger-${i + 1}`}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 2 }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix || ''} decimals={stat.decimals || 0} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card animate-fade-in-up stagger-3" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Command Usage
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {commandData.map(cmd => (
              <div key={cmd.name}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, fontFamily: 'monospace' }}>
                    {cmd.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {cmd.uses.toLocaleString()} uses
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill progress-blue`}
                    style={{
                      width: `${cmd.pct}%`,
                      background: cmd.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in-up stagger-4" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Response Times
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {responseTimeData.map(rt => (
              <div key={rt.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {rt.label}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: rt.color, fontVariantNumeric: 'tabular-nums' }}>
                  {rt.value}<span style={{ fontSize: 12, fontWeight: 500 }}>{rt.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card animate-fade-in-up stagger-5" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Peak Hours
          </h3>
          <Badge variant="blue">Last 24h</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
          {peakHours.map(h => {
            const heightPct = (h.value / maxHourValue) * 100;
            return (
              <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: '100%',
                    height: heightPct,
                    minHeight: 4,
                    borderRadius: '3px 3px 0 0',
                    background: heightPct > 70
                      ? 'linear-gradient(to top, var(--accent-blue), var(--accent-cyan))'
                      : heightPct > 40
                      ? 'var(--accent-blue-muted)'
                      : 'var(--bg-tertiary)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(to top, var(--accent-blue), var(--accent-cyan))';
                  }}
                  onMouseLeave={e => {
                    if (heightPct <= 40) e.currentTarget.style.background = 'var(--bg-tertiary)';
                    else if (heightPct <= 70) e.currentTarget.style.background = 'var(--accent-blue-muted)';
                  }}
                />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{h.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
