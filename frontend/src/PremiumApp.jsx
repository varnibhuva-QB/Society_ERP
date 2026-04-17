import React, { useState } from 'react';
import { MainLayout, Sidebar, Navbar, BottomNav } from './components/layout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import {
  MembersPage,
  NoticesPage,
  BillingPage,
  BookingsPage,
  ContactsPage,
} from './pages/Pages.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { Toast } from './components/ui.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setToast({
      type: 'success',
      title: 'Welcome!',
      message: `Logged in as ${userData.name}`,
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
    setToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out successfully',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const renderPage = () => {
    const pages = {
      dashboard: <Dashboard />,
      members: <MembersPage />,
      notices: <NoticesPage />,
      billing: <BillingPage />,
      bookings: <BookingsPage />,
      contacts: <ContactsPage />,
      settings: <SettingsPage />,
    };

    return pages[currentPage] || <Dashboard />;
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div>
      <MainLayout
        active={currentPage}
        onNavigate={setCurrentPage}
        userName={user?.name || 'User'}
        userFlat={user?.flatNo || 'N/A'}
        userRole={user?.role || 'member'}
      >
        {renderPage()}
      </MainLayout>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
