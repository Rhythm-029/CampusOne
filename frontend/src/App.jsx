import React, { useState } from 'react';
import LandingPage from './features/landing/LandingPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardOverview from './features/dashboard/DashboardOverview';
import RoomCatalogPage from './features/allocation/RoomCatalogPage';
import LostFoundBrowsePage from './features/lostfound/LostFoundBrowsePage';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'portal'
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleEnterPortal = (targetTab = 'dashboard') => {
    setActiveTab(targetTab);
    setView('portal');
  };

  const renderPortalContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'allocation':
        return <RoomCatalogPage />;
      case 'lostfound':
        return <LostFoundBrowsePage />;
      case 'my-bookings':
        return <RoomCatalogPage />;
      case 'my-reports':
        return <LostFoundBrowsePage />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnterPortal={handleEnterPortal} />;
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      <Navbar
        onNavigate={setActiveTab}
        activeTab={activeTab}
        onReturnToLanding={() => setView('landing')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderPortalContent()}
        </main>
      </div>
    </div>
  );
}
