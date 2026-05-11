import React, { useState } from 'react';
import axios from 'axios';

export default function Settings({ apiUrl }) {
  const [settings, setSettings] = useState({
    botPrefix: '/',
    autoUpdateInterval: '6',
    maxCacheSize: '1000',
    enableAnalytics: true
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // In production, save to backend
      console.log('Settings saved:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>
      
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-white mb-2">Bot Prefix</label>
          <input
            type="text"
            value={settings.botPrefix}
            onChange={(e) => handleChange('botPrefix', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Auto-Update Interval (hours)</label>
          <input
            type="number"
            value={settings.autoUpdateInterval}
            onChange={(e) => handleChange('autoUpdateInterval', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Max Cache Size</label>
          <input
            type="number"
            value={settings.maxCacheSize}
            onChange={(e) => handleChange('maxCacheSize', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.enableAnalytics}
            onChange={(e) => handleChange('enableAnalytics', e.target.checked)}
            className="mr-3"
          />
          <label className="text-white">Enable Analytics</label>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
