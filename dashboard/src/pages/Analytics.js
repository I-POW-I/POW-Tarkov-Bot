import React from 'react';

export default function Analytics({ apiUrl }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">📈 Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Command Usage</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-sm">/item</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">/prices</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">/quest</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
          <div className="space-y-2 text-gray-400">
            <p>Average: <span className="text-green-400">145ms</span></p>
            <p>P95: <span className="text-green-400">380ms</span></p>
            <p>Max: <span className="text-yellow-400">2.1s</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
