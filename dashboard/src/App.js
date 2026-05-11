import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Prices from './pages/Prices';
import Analytics from './pages/Analytics';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on load
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard apiUrl={API_URL} />;
      case 'settings':
        return <Settings apiUrl={API_URL} />;
      case 'prices':
        return <Prices apiUrl={API_URL} />;
      case 'analytics':
        return <Analytics apiUrl={API_URL} />;
      default:
        return <Dashboard apiUrl={API_URL} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header apiStatus={apiStatus} />
        <main className="flex-1 overflow-auto bg-gray-800 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
