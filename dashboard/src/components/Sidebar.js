import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'prices', label: '💰 Prices', icon: '💰' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">🎮 Tarkov Bot</h2>
      </div>
      <nav className="space-y-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full text-left px-4 py-3 rounded transition ${
              currentPage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
