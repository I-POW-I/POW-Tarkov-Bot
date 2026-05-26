/**
 * Interactive Map Component
 *
 * Renders a map with clickable markers for extracts, spawns, bosses, etc.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, LogOut, Target, Skull, Package, Key, Lightbulb, Crosshair, X, ExternalLink
} from 'lucide-react';
import Badge from './ui/Badge';

const MARKER_TYPES = {
  extract: { icon: LogOut, color: '#10b981', label: 'Extract' },
  spawn: { icon: Target, color: '#3b82f6', label: 'Spawn' },
  boss: { icon: Skull, color: '#ef4444', label: 'Boss' },
  loot: { icon: Package, color: '#f59e0b', label: 'Loot' },
  key: { icon: Key, color: '#8b5cf6', label: 'Key' },
  switch: { icon: Lightbulb, color: '#06b6d4', label: 'Switch' },
  task: { icon: Crosshair, color: '#ec4899', label: 'Task' },
};

export default function InteractiveMap({ mapData, markers = [], width = 800, height = 600 }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [activeFilters, setActiveFilters] = useState(Object.keys(MARKER_TYPES));

  // Filter markers by type
  const filteredMarkers = useMemo(() => {
    return markers.filter(m => activeFilters.includes(m.marker_type));
  }, [markers, activeFilters]);

  // Group markers by type for legend
  const markerCounts = useMemo(() => {
    const counts = {};
    markers.forEach(m => {
      counts[m.marker_type] = (counts[m.marker_type] || 0) + 1;
    });
    return counts;
  }, [markers]);

  // Toggle filter
  function toggleFilter(type) {
    setActiveFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  }

  // Select all/none
  function selectAll() {
    setActiveFilters(Object.keys(MARKER_TYPES));
  }

  function selectNone() {
    setActiveFilters([]);
  }

  // Get marker position (normalized 0-100 to pixels)
  function getMarkerPosition(marker) {
    const x = ((marker.x || 50) / 100) * width;
    const y = ((marker.y || 50) / 100) * height;
    return { x, y };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Legend / Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-tertiary)',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-tertiary)', marginRight: 8 }}>Show:</span>
        {Object.entries(MARKER_TYPES).map(([type, config]) => {
          const Icon = config.icon;
          const count = markerCounts[type] || 0;
          const isActive = activeFilters.includes(type);

          return (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? `${config.color}20` : 'var(--bg-secondary)',
                color: isActive ? config.color : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                transition: 'all var(--transition-fast)',
                opacity: count === 0 ? 0.5 : 1,
              }}
            >
              <Icon size={14} />
              {config.label}
              {count > 0 && (
                <span style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  background: isActive ? config.color : 'var(--bg-tertiary)',
                  color: isActive ? 'white' : 'var(--text-tertiary)',
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button onClick={selectAll} className="btn btn-ghost" style={{ fontSize: 11 }}>All</button>
          <button onClick={selectNone} className="btn btn-ghost" style={{ fontSize: 11 }}>None</button>
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: width,
        aspectRatio: `${width}/${height}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-primary)',
        background: '#0a0c10',
      }}>
        {/* Map Image Background */}
        {mapData?.image_url ? (
          <img
            src={mapData.image_url}
            alt={mapData.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 14,
          }}>
            No map image available
          </div>
        )}

        {/* Markers Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          {filteredMarkers.map((marker) => {
            const config = MARKER_TYPES[marker.marker_type] || MARKER_TYPES.extract;
            const Icon = config.icon;
            const pos = getMarkerPosition(marker);
            const isSelected = selectedMarker?.id === marker.id;
            const isHovered = hoveredMarker?.id === marker.id;

            return (
              <div
                key={marker.id}
                style={{
                  position: 'absolute',
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                }}
              >
                {/* Marker */}
                <button
                  onClick={() => setSelectedMarker(marker)}
                  onMouseEnter={() => setHoveredMarker(marker)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  style={{
                    width: isSelected ? 28 : 22,
                    height: isSelected ? 28 : 22,
                    borderRadius: '50%',
                    background: config.color,
                    border: '2px solid white',
                    boxShadow: isSelected ? `0 0 0 4px ${config.color}40` : '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`,
                    zIndex: isSelected ? 100 : 10,
                  }}
                  title={marker.name}
                >
                  <Icon size={isSelected ? 14 : 11} color="white" />
                </button>

                {/* Hover Tooltip */}
                {isHovered && !isSelected && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '100%',
                    transform: 'translateX(-50%)',
                    marginBottom: 8,
                    padding: '6px 10px',
                    background: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    borderRadius: 6,
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}>
                    {marker.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Marker Detail Panel */}
        {selectedMarker && (
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 280,
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            zIndex: 200,
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {(() => {
                  const config = MARKER_TYPES[selectedMarker.marker_type] || MARKER_TYPES.extract;
                  const Icon = config.icon;
                  return <Icon size={16} style={{ color: config.color }} />;
                })()}
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedMarker.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 16 }}>
              <Badge variant={getBadgeVariant(selectedMarker.marker_type)}>
                {MARKER_TYPES[selectedMarker.marker_type]?.label || selectedMarker.marker_type}
              </Badge>

              {selectedMarker.description && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  marginTop: 12,
                  lineHeight: 1.5,
                }}>
                  {selectedMarker.description}
                </p>
              )}

              {/* Coordinates */}
              <div style={{
                marginTop: 12,
                padding: 8,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Position: ({selectedMarker.x?.toFixed(1)}, {selectedMarker.y?.toFixed(1)})
                </div>
              </div>

              {/* Links */}
              {selectedMarker.linked_task_id && (
                <Link
                  to={`/tasks/${selectedMarker.linked_task_id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    fontSize: 12,
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                  }}
                >
                  <Target size={12} />
                  View Related Task
                  <ExternalLink size={10} />
                </Link>
              )}

              {selectedMarker.linked_item_id && (
                <Link
                  to={`/items/${selectedMarker.linked_item_id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 8,
                    fontSize: 12,
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                  }}
                >
                  <Package size={12} />
                  View Related Item
                  <ExternalLink size={10} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-tertiary)',
        fontSize: 11,
        color: 'var(--text-tertiary)',
      }}>
        <span>Showing {filteredMarkers.length} of {markers.length} markers</span>
        <span>Click markers for details</span>
      </div>
    </div>
  );
}

function getBadgeVariant(type) {
  const variants = {
    extract: 'emerald',
    spawn: 'blue',
    boss: 'rose',
    loot: 'amber',
    key: 'purple',
    switch: 'cyan',
    task: 'pink',
  };
  return variants[type] || 'secondary';
}
