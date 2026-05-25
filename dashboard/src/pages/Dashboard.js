import React, { useState, useEffect } from 'react';
import { Package, Target, Map, Activity, Clock, Database, Wifi, RefreshCw } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Badge from '../components/ui/Badge';
import { SkeletonStats } from '../components/ui/SkeletonLoader';

export default function Dashboard({ apiUrl }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalQuests: 0,
    totalMaps: 0,
    lastUpdate: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalItems: 1247,
        totalQuests: 236,
        totalMaps: 8,
        lastUpdate: new Date(),
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'var(--accent-blue)', bgColor: 'var(--accent-blue-muted)', trend: '+12 this week' },
    { label: 'Active Quests', value: stats.totalQuests, icon: Target, color: 'var(--accent-emerald)', bgColor: 'var(--accent-emerald-muted)', trend: '+3 this week' },
    { label: 'Maps', value: stats.totalMaps, icon: Map, color: 'var(--accent-cyan)', bgColor: 'var(--accent-cyan-muted)', trend: 'Up to date' },
    { label: 'Bot Uptime', value: 99.8, icon: Activity, color: 'var(--accent-emerald)', bgColor: 'var(--accent-emerald-muted)', suffix: '%', decimals: 1, trend: 'Last 30 days' },
  ];

  const activityItems = [
    { icon: RefreshCw, text: 'Price data synced', time: '2 min ago', color: 'var(--accent-blue)' },
    { icon: Database, text: 'Items database updated', time: '1 hour ago', color: 'var(--accent-emerald)' },
    { icon: Wifi, text: 'API health check passed', time: '5 min ago', color: 'var(--accent-emerald)' },
    { icon: Clock, text: 'Quest data refreshed', time: '3 hours ago', color: 'var(--accent-amber)' },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Overview
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Real-time status and metrics for your Tarkov Bot
        </p>
      </div>

      {loading ? (
        <SkeletonStats count={4} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}>
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`stat-card animate-fade-in-up stagger-${i + 1}`}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <Badge variant={stat.trend.includes('Up') || stat.trend.includes('99') ? 'emerald' : 'blue'}>
                    {stat.trend}
                  </Badge>
                </div>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix || ''}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}>
        <div className="card animate-fade-in-up stagger-4" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activityItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.text}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card animate-fade-in-up stagger-5" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Discord Bot', status: 'Online', variant: 'emerald' },
              { label: 'API Server', status: 'Healthy', variant: 'emerald' },
              { label: 'Database', status: 'Connected', variant: 'emerald' },
              { label: 'Data Sync', status: stats.lastUpdate ? 'Active' : 'Pending', variant: stats.lastUpdate ? 'emerald' : 'amber' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                <Badge variant={item.variant} dot>{item.status}</Badge>
              </div>
            ))}
          </div>
          {stats.lastUpdate && (
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-tertiary)' }}>
              Last sync: {stats.lastUpdate.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
