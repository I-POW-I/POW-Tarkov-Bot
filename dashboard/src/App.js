import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Prices from './pages/Prices';
import Analytics from './pages/Analytics';
import Ammo from './pages/Ammo';
import Crafts from './pages/Crafts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
      setApiStatus('online');
    } catch {
      setApiStatus('offline');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPageKey(prev => prev + 1);
  };

  const handleSync = () => {
    checkApiHealth();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard apiUrl={API_URL} />;
      case 'prices': return <Prices apiUrl={API_URL} />;
      case 'analytics': return <Analytics apiUrl={API_URL} />;
      case 'ammo': return <Ammo apiUrl={API_URL} />;
      case 'crafts': return <Crafts apiUrl={API_URL} />;
      case 'settings': return <Settings apiUrl={API_URL} />;
      default: return <Dashboard apiUrl={API_URL} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      <Sidebar currentPage={currentPage} setCurrentPage={handlePageChange} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header apiStatus={apiStatus} onSync={handleSync} />
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: 28,
          background: 'var(--bg-primary)',
        }}>
          <div key={pageKey}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
