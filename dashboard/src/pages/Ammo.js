/**
 * Ammo Page
 *
 * Full ammo chart with filtering by calibre, sorting, and comparison
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, TrendingUp, TrendingDown, ChevronRight, ListFilter as Filter, Import as SortAsc } from 'lucide-react';
import { itemsApi } from '../lib/api';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';

export default function Ammo() {
  const [loading, setLoading] = useState(true);
  const [ammo, setAmmo] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCalibre, setSelectedCalibre] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadAmmo();
  }, []);

  async function loadAmmo() {
    try {
      setLoading(true);
      const response = await itemsApi.search('ammo', { types: ['ammo'] });
      setAmmo(response.data || []);
    } catch (error) {
      console.error('Failed to load ammo:', error);
    } finally {
      setLoading(false);
    }
  }

  // Extract unique calibres
  const calibres = useMemo(() => {
    const c = new Set();
    ammo.forEach(a => {
      const calibre = extractCalibre(a.name);
      if (calibre) c.add(calibre);
    });
    return ['all', ...Array.from(c).sort()];
  }, [ammo]);

  // Filter and sort ammo
  const filteredAmmo = useMemo(() => {
    let filtered = [...ammo];

    if (search) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.short_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCalibre !== 'all') {
      filtered = filtered.filter(a =>
        extractCalibre(a.name) === selectedCalibre
      );
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'price':
          aVal = a.avg_24h_price || a.base_price || 0;
          bVal = b.avg_24h_price || b.base_price || 0;
          break;
        case 'change':
          aVal = a.change_last_48h_percent || 0;
          bVal = b.change_last_48h_percent || 0;
          break;
        default:
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [ammo, search, selectedCalibre, sortBy, sortOrder]);

  // Group by calibre for display
  const groupedAmmo = useMemo(() => {
    const groups = {};
    filteredAmmo.forEach(a => {
      const calibre = extractCalibre(a.name) || 'Other';
      if (!groups[calibre]) groups[calibre] = [];
      groups[calibre].push(a);
    });
    return groups;
  }, [filteredAmmo]);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Ammo Chart
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Complete ammunition database with pricing and filtering
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: '1 1 250px', minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search ammo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Calibre filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
            <select
              value={selectedCalibre}
              onChange={(e) => setSelectedCalibre(e.target.value)}
              className="select"
              style={{ minWidth: 150 }}
            >
              {calibres.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Calibres' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SortAsc size={14} style={{ color: 'var(--text-tertiary)' }} />
            <button
              onClick={() => toggleSort('name')}
              className={`btn ${sortBy === 'name' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12 }}
            >
              Name
            </button>
            <button
              onClick={() => toggleSort('price')}
              className={`btn ${sortBy === 'price' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12 }}
            >
              Price
            </button>
            <button
              onClick={() => toggleSort('change')}
              className={`btn ${sortBy === 'change' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12 }}
            >
              48h Change
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Ammo</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
            {ammo.length}
          </div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Calibres</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
            {calibres.length - 1}
          </div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Filtered</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-primary)' }}>
            {filteredAmmo.length}
          </div>
        </div>
      </div>

      {/* Ammo List by Calibre */}
      {loading ? (
        <SkeletonLoader.CardList count={10} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(groupedAmmo).map(([calibre, items]) => (
            <div key={calibre} className="card" style={{ padding: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid var(--border-primary)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                  <Crosshair size={16} style={{ marginRight: 8, color: 'var(--accent-primary)' }} />
                  {calibre}
                </h3>
                <Badge variant="blue">{items.length} types</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.slice(0, 10).map(item => (
                  <Link
                    key={item.id}
                    to={`/items/${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      textDecoration: 'none',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {item.icon_url && (
                        <img
                          src={item.icon_url}
                          alt={item.name}
                          style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
                        />
                      )}
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>
                          {item.short_name || item.name}
                        </div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {(item.avg_24h_price || item.base_price || 0).toLocaleString()} ₽
                        </div>
                        {item.change_last_48h_percent !== undefined && item.change_last_48h_percent !== null && (
                          <div style={{
                            fontSize: 12,
                            color: item.change_last_48h_percent >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 2,
                          }}>
                            {item.change_last_48h_percent >= 0 ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}
                            {Math.abs(item.change_last_48h_percent).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </Link>
                ))}

                {items.length > 10 && (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      +{items.length - 10} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredAmmo.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Crosshair size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No ammo found matching your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to extract calibre from ammo name
function extractCalibre(name) {
  if (!name) return null;

  const patterns = [
    /^(\d+\.?\d*x\d+mm)/i,
    /^(\d+mm)/i,
    /^(\d+\/\d+)/i,
    /^(12 gauge)/i,
  ];

  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) return match[1];
  }

  return name.split(' ')[0];
}
