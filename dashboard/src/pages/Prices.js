import React, { useState } from 'react';

export default function Prices({ apiUrl }) {
  const [priceSearch, setPriceSearch] = useState('');
  const [prices, setPrices] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // In production, fetch from API
      setPrices([
        { item: 'Dogtag (Bear)', fleaPrice: 2500, traderPrice: 2200 },
        { item: 'Rolex', fleaPrice: 45000, traderPrice: 41500 }
      ]);
    } catch (error) {
      console.error('Error searching prices:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">💰 Price Tracker</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search item..."
          value={priceSearch}
          onChange={(e) => setPriceSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Search
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="px-6 py-3 text-left text-white">Item</th>
              <th className="px-6 py-3 text-right text-white">Flea Price</th>
              <th className="px-6 py-3 text-right text-white">Trader Price</th>
              <th className="px-6 py-3 text-right text-white">Difference</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4 text-white">{price.item}</td>
                <td className="px-6 py-4 text-right text-white">{price.fleaPrice.toLocaleString()} ₽</td>
                <td className="px-6 py-4 text-right text-white">{price.traderPrice.toLocaleString()} ₽</td>
                <td className="px-6 py-4 text-right text-green-400">+{(price.fleaPrice - price.traderPrice).toLocaleString()} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
