import React from 'react';
import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import NewsFeed from '../pages/NewsFeed';
import Leave from '../pages/Leave';
import Timesheet from '../pages/Timesheet';
import Profile from '../pages/Profile';
import RequestDetails from '../pages/RequestDetails';
import { ActivityRequest } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import StarfieldCanvas from '../common/StarfieldCanvas';
import { useTheme } from '../../hooks/useTheme';

const MainLayout: React.FC = () => {
  const { 
    user, 
    logout, 
    checkAndRemindToClockIn,
    activePage,
    viewingRequest,
    navigateTo,
    setViewingRequest,
  } = useAppContext();
  const { theme } = useTheme();

  const handleViewRequest = (request: ActivityRequest) => {
    if (checkAndRemindToClockIn()) {
      setViewingRequest(request);
    }
  };

  const handleBackToList = () => {
    setViewingRequest(null);
  };
  
  const handleNavigate = (page: string) => {
    // Only remind if navigating away from home and the action isn't blocked.
    if (page !== 'Home' && page !== activePage) {
       if (!checkAndRemindToClockIn()) {
         return; // Stop navigation if reminder was shown
       }
    }
    navigateTo(page);
  };

  const renderContent = () => {
    if (viewingRequest) {
      return <RequestDetails request={viewingRequest} onBack={handleBackToList} />;
    }

    switch (activePage) {
      case 'Home':
        return <Dashboard 
                  onNavigate={handleNavigate}
                  onViewRequest={handleViewRequest} 
                />;
      case 'News Feed':
        return <NewsFeed />;
      case 'Timesheet':
        return <Timesheet onViewRequest={handleViewRequest} />;
      case 'Leave':
        return <Leave onViewRequest={handleViewRequest} />;
      case 'Profile':
        return <Profile />;
      default:
        return <Dashboard 
                  onNavigate={handleNavigate}
                  onViewRequest={handleViewRequest} 
                />;
    }
  };
  
  const contentKey = viewingRequest ? `request-${viewingRequest.id}` : activePage;

  return (
    <div className="min-h-screen">
      {theme === 'dark' && <StarfieldCanvas />}
      {theme === 'light' && (
        <div 
          className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-white via-slate-50 to-gray-200 animate-background-pan"
          style={{ backgroundSize: '400% 400%' }}
        ></div>
      )}
      <Header 
        user={user} 
        activePage={viewingRequest ? 'Request Details' : activePage} 
        onNavigate={handleNavigate} 
        onLogout={logout}
        onViewRequest={handleViewRequest}
      />
      <main className="p-4 md:p-6">
        <div key={contentKey} className="animate-fadeInUp">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;