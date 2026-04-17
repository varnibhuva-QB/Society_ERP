import React, { useState } from 'react';
import {
  Home,
  Users,
  Bell,
  FileText,
  CreditCard,
  Calendar,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

// Sidebar Component
export const Sidebar = ({ active, onNavigate, userRole = 'member' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['admin', 'chairman'] },
    { id: 'bookings', label: 'Amenity Booking', icon: Calendar },
    { id: 'contacts', label: 'Important Contacts', icon: Phone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden text-gray-900"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-20 border-b border-gray-200 flex items-center px-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              SocietyPro
            </h1>
            <p className="text-xs text-gray-500">Management Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

// Top Navigation Bar
export const Navbar = ({ userName = 'User', userFlat = 'A-101', onProfile, onNotifications }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(false);

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 z-20">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side */}
        <div className="hidden lg:block flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 outline-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Notifications */}
          <button
            onClick={onNotifications}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userFlat}</p>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <button
                  onClick={() => {
                    onProfile?.();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  👤 View Profile
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  ⚙️ Settings
                </button>
                <div className="border-t border-gray-200" />
                <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Bottom Mobile Navigation
export const BottomNav = ({ active, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 lg:hidden">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2
                text-xs font-medium transition-all duration-200
                ${isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Main Layout Wrapper
export const MainLayout = ({ children, active, onNavigate, userName, userFlat, userRole = 'member' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      <Sidebar active={active} onNavigate={onNavigate} userRole={userRole} />
      <div className="flex-1 flex flex-col">
        <Navbar userName={userName} userFlat={userFlat} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  );
};
