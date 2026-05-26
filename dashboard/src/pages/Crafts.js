/**
 * Crafts Page
 *
 * Crafting recipes with profit calculator
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Factory, TrendingUp, TrendingDown, Clock, ChevronRight, ListFilter as Filter, Package } from 'lucide-react';
import { hideoutApi } from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

export default function Crafts() {
  const [loading, setLoading] = useState(true);
  const [crafts, setCrafts] = useState([]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [minProfit, setMinProfit] = useState(0);
  const [sortBy, setSortBy] = useState('profit');

  useEffect(() => {
    loadCrafts();
  }, []);

  async function loadCrafts() {
    try {
      setLoading(true);
      const response = await hideoutApi.getProfitableCrafts();
      setCrafts(response.data || []);
    } catch (error) {
      console.error('Failed to load crafts:', error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique stations
  const stations = useMemo(() => {
    const s = new Set(crafts.map(c => c.station_name).filter(Boolean));
    return ['all', ...Array.from(s).sort()];
  }, [crafts]);

  // Filter and sort crafts
  const filteredCrafts = useMemo(() => {
    let filtered = [...crafts];

    if (selectedStation !== 'all') {
      filtered = filtered.filter(c => c.station_name === selectedStation);
    }

    if (minProfit > 0) {
      filtered = filtered.filter(c => (c.profit || 0) >= minProfit);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'profit':
          return (b.profit || 0) - (a.profit || 0);
        case 'profit_per_hour':
          return (b.profit_per_hour || 0) - (a.profit_per_hour || 0);
        case 'profit_percent':
          return (b.profit_percent || 0) - (a.profit_percent || 0);
        default:
          return (b.profit || 0) - (a.profit || 0);
      }
    });

    return filtered;
  }, [crafts, selectedStation, minProfit, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    const profitable = filteredCrafts.filter(c => (c.profit || 0) > 0);
    const avgProfit = profitable.length > 0
      ? Math.round(profitable.reduce((sum, c) => sum + (c.profit || 0), 0) / profitable.length)
      : 0;

    return {
      total: filteredCrafts.length,
      profitable: profitable.length,
      avgProfit,
      bestProfit: profitable.length > 0 ? Math.max(...profitable.map(c => c.profit || 0)) : 0,
    };
  }, [filteredCrafts]);

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Craft Profitability
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Find the most profitable crafting recipes based on current flea market prices
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Station filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="select"
              style={{ minWidth: 150 }}
            >
              {stations.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Stations' : s}</option>
              ))}
            </select>
          </div>

          {/* Min profit filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={14} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="number"
              placeholder="Min profit..."
              value={minProfit || ''}
              onChange={(e) => setMinProfit(parseInt(e.target.value) || 0)}
              className="input"
              style={{ width: 120 }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>₽</span>
          </div>

          {/* Sort buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Sort by:</span>
            {[
              { key: 'profit', label: 'Total Profit' },
              { key: 'profit_per_hour', label: '/Hour' },
              { key: 'profit_percent', label: '% Return' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`btn ${sortBy === key ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 11 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Crafts</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>{stats.total}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Profitable</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-emerald)' }}>{stats.profitable}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Avg Profit</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.avgProfit.toLocaleString()}₽
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Best Profit</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-emerald)' }}>
            {stats.bestProfit.toLocaleString()}₽
          </div>
        </div>
      </div>

      {/* Crafts List */}
      {loading ? (
        <SkeletonLoader.CardList count={10} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredCrafts.slice(0, 50).map((craft, index) => (
            <div
              key={craft.id || index}
              className="card"
              style={{
                padding: 16,
                background: craft.profit > 0 ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                border: craft.profit > 0 ? '1px solid var(--border-primary)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {craft.reward_item?.icon_url && (
                    <img
                      src={craft.reward_item.icon_url}
                      alt={craft.reward_item.name}
                      style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'contain' }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {craft.reward_item?.name || craft.reward_items?.[0]?.item?.name || 'Unknown Item'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Factory size={12} />
                      {craft.station_name}
                      <Badge variant="blue">Lvl {craft.level_required || 1}</Badge>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: craft.profit > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 4,
                  }}>
                    {craft.profit > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {craft.profit > 0 ? '+' : ''}{craft.profit?.toLocaleString()}₽
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {craft.profit_percent?.toFixed(1)}% return
                  </div>
                </div>
              </div>

              {/* Cost and Reward breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>Cost</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-rose)' }}>
                    {craft.cost_price?.toLocaleString()}₽
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {craft.required_items?.length || 0} items required
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>Revenue</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-emerald)' }}>
                    {craft.reward_price?.toLocaleString()}₽
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {craft.reward_items?.length || 0} item(s) output
                  </div>
                </div>
              </div>

              {/* Duration and profit per hour */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: 12 }}>
                  <Clock size={12} />
                  {craft.duration_hours || 1}h
                  {craft.profit_per_hour > 0 && (
                    <Badge variant="amber">{craft.profit_per_hour?.toLocaleString()}₽/h</Badge>
                  )}
                </div>

                <Link
                  to={`/hideout/${craft.station_id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                  }}
                >
                  View Station <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}

          {filteredCrafts.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Package size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No crafts found matching your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
