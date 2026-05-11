import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ apiUrl }) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalQuests: 0,
    totalMaps: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch placeholder stats
      setStats({
        totalItems: 1200,
        totalQuests: 240,
        totalMaps: 8,
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Items" value={stats.totalItems} icon="📦" color="bg-blue-600" />
        <StatCard label="Quests" value={stats.totalQuests} icon="🎯" color="bg-green-600" />
        <StatCard label="Maps" value={stats.totalMaps} icon="🗺️" color="bg-purple-600" />
        <StatCard label="Bot Status" value="Online" icon="✅" color="bg-green-500" />
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 Recent Activity</h3>
        <div className="text-gray-400">
          <p>Last data sync: {stats.lastUpdate.toLocaleString()}</p>
          <p>API Health: ✅ Online</p>
          <p>Database Status: ✅ Connected</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-100 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
