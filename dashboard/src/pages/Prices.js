import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { SkeletonRow } from '../components/ui/SkeletonLoader';

const samplePrices = [
  { item: 'Dogtag (Bear)', category: 'Barter', fleaPrice: 2500, traderPrice: 2200, change: 5.2 },
  { item: 'Roler', category: 'Valuable', fleaPrice: 45000, traderPrice: 41500, change: -2.1 },
  { item: 'LEDX', category: 'Medical', fleaPrice: 1200000, traderPrice: 950000, change: 8.7 },
  { item: 'Red Keycard', category: 'Key', fleaPrice: 850000, traderPrice: 0, change: 12.3 },
  { item: 'GPU', category: 'Tech', fleaPrice: 320000, traderPrice: 285000, change: -0.8 },
  { item: 'Flash Drive', category: 'Tech', fleaPrice: 180000, traderPrice: 145000, change: 3.1 },
];

export default function Prices({ apiUrl }) {
  const [priceSearch, setPriceSearch] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!priceSearch.trim()) return;

    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const filtered = samplePrices.filter(p =>
        p.item.toLowerCase().includes(priceSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(priceSearch.toLowerCase())
      );
      setPrices(filtered.length > 0 ? filtered : samplePrices);
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Price Tracker
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Flea market and trader prices with live trends
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
          }} />
          <input
            type="text"
            placeholder="Search items, categories..."
            value={priceSearch}
            onChange={e => setPriceSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: 36 }}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Search size={14} />}
          Search
        </button>
      </form>

      {!searched && !loading && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Search size={40} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>
            Search for item prices
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            Enter an item name or category to get started
          </p>
        </div>
      )}

      {loading && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: 'right' }}>Flea Price</th>
                <th style={{ textAlign: 'right' }}>Trader Price</th>
                <th style={{ textAlign: 'right' }}>Spread</th>
                <th style={{ textAlign: 'right' }}>24h Change</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow columns={5} />
              <SkeletonRow columns={5} />
              <SkeletonRow columns={5} />
            </tbody>
          </table>
        </div>
      )}

      {searched && !loading && (
        <div className="table-container animate-fade-in-up">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ textAlign: 'right' }}>Flea Price</th>
                <th style={{ textAlign: 'right' }}>Trader Price</th>
                <th style={{ textAlign: 'right' }}>Spread</th>
                <th style={{ textAlign: 'right' }}>24h Change</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price, idx) => {
                const spread = price.fleaPrice - price.traderPrice;
                const isPositive = price.change >= 0;
                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{price.item}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{price.category}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        <AnimatedCounter target={price.fleaPrice} suffix=" R" duration={800} />
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {price.traderPrice > 0 ? (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          <AnimatedCounter target={price.traderPrice} suffix=" R" duration={800} />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>--</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {price.traderPrice > 0 ? (
                        <span style={{ color: spread > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 500 }}>
                          +{spread.toLocaleString()} R
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>--</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      }}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(price.change)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
