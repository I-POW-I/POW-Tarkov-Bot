import React from 'react';

export default function Header({ apiStatus }) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tarkov Bot Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              API: <span className={apiStatus === 'online' ? 'text-green-400' : 'text-red-400'}>{apiStatus}</span>
            </span>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
            Sync Data
          </button>
        </div>
      </div>
    </header>
  );
}
