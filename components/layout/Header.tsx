import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { ICONS } from '../../constants';
import { User, Notification, ActivityRequest } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

const RssLogoIcon: React.FC = () => (
    <div className="flex items-center justify-center">
        <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rss-green via-primary to-rss-cyan bg-clip-text text-transparent transition-all duration-300">
                Resourcestaff
            </h1>
            {/* Sparkles */}
            <span className="absolute top-0 right-1 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s', animationDuration: '3s' }}></span>
            <span className="absolute bottom-1 left-8 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></span>
            <span className="absolute top-0 left-[35%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}></span>
            <span className="absolute bottom-0 right-10 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.5s', animationDuration: '5s' }}></span>
        </div>
    </div>
);

const NavItem: React.FC<{ text: string; active?: boolean; onClick?: () => void; }> = ({ text, active, onClick }) => (
  <a 
    href="#" 
    onClick={(e) => { e.preventDefault(); onClick?.(); }} 
    className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 flex items-center justify-center text-center leading-tight whitespace-nowrap
      ${active 
        ? 'bg-gradient-to-r from-rss-green to-rss-cyan text-white font-semibold shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/30' 
        : 'text-gray-600 dark:text-gray-400 font-medium hover:bg-slate-100 dark:hover:bg-dark-border/50 hover:text-primary'
      }`
    }
  >
    {text}
  </a>
);


interface HeaderProps {
    user: User;
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
    onViewRequest: (request: ActivityRequest) => void;
}

const Header: React.FC<HeaderProps> = ({ user, activePage, onNavigate, onLogout, onViewRequest }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, activity, showConfirm } = useAppContext();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const mainNavItems = [
      { text: 'Time Log', page: 'Home' },
      { text: 'News Feed', page: 'News Feed' },
      { text: 'Timesheet', page: 'Timesheet' },
      { text: 'Leave', page: 'Leave' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'announcement':
            return React.cloneElement(ICONS.news, { className: `material-symbols-outlined text-lg text-blue-500`});
        case 'request_update':
            return React.cloneElement(ICONS.statRequests, { className: `material-symbols-outlined text-lg text-yellow-500`});
        default:
            return null;
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.type === 'announcement') {
        onNavigate('News Feed');
    } else if (notification.type === 'request_update' && notification.requestId) {
        const requestToView = activity.find(req => req.id === notification.requestId);
        if (requestToView) {
            onViewRequest(requestToView);
        }
    }
    setShowNotifications(false); // Close dropdown after click
  };
  
  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showConfirm('Are you sure you want to logout?', onLogout, 'Logout');
  };


  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border shadow-md shadow-slate-200/50 dark:shadow-black/20 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} className="flex-shrink-0 group transition-transform duration-300 ease-in-out hover:scale-105 active:scale-100">
                <RssLogoIcon />
            </a>

            {/* Desktop Nav & Actions */}
            <div className="hidden md:flex items-center space-x-4">
                <nav className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-dark-bg rounded-xl">
                    {mainNavItems.map((item) => (
                        <NavItem 
                            key={item.text}
                            text={item.text} 
                            active={activePage === item.page} 
                            onClick={() => onNavigate(item.page)}
                        />
                    ))}
                </nav>

                <div className="h-6 w-px bg-slate-200 dark:bg-dark-border"></div>

                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    
                    <div className="relative" ref={notificationsRef}>
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-dark-border/50">
                            {ICONS.notification}
                            {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-cyan-400 rounded-full border-2 border-light-card dark:border-dark-card">
                            </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl z-50 animate-fadeInUp">
                            <div className="flex justify-between items-center p-3 border-b border-light-border dark:border-dark-border">
                                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">Notifications</h4>
                                {unreadCount > 0 && (
                                    <button onClick={markAllNotificationsAsRead} className="text-xs text-primary hover:underline font-semibold">Mark all as read</button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <a 
                                      key={notification.id}
                                      href="#"
                                      onClick={(e) => { e.preventDefault(); handleNotificationClick(notification); }}
                                      className={`block p-3 text-sm border-b border-light-border dark:border-dark-border last:border-b-0 transition-colors hover:bg-slate-100 dark:hover:bg-dark-border/50 ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-border flex items-center justify-center mt-0.5 relative">
                                          {getNotificationIcon(notification.type)}
                                          {!notification.read && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-cyan-400 rounded-full border-2 border-light-card dark:border-dark-card"></span>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.date}</p>
                                        </div>
                                      </div>
                                    </a>
                                ))
                                ) : (
                                <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
                                )}
                            </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="relative" ref={userMenuRef}>
                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="block rounded-full">
                            <img src={user.avatarUrl} alt="User Avatar" className="w-9 h-9 rounded-full" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl py-1 z-50 animate-fadeInUp">
                                <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-dark-text truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Profile'); setShowUserMenu(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10">
                                    {React.cloneElement(ICONS.profile, { className: `${ICONS.profile.props.className} text-xl mr-2`})} <span>My Profile</span>
                                </a>
                                <a href="#" onClick={handleLogoutClick} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10">
                                    {React.cloneElement(ICONS.logout, { className: `${ICONS.logout.props.className} text-xl mr-2`})} <span>Logout</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-slate-100/50 dark:hover:bg-white/10"
                    aria-label="Open menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/60 animate-fadeInUp" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-light-card dark:bg-dark-card shadow-xl flex flex-col animate-fadeInUp">
            <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
              <h2 className="font-bold text-lg text-gray-800 dark:text-dark-text">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              {mainNavItems.map((item) => (
                <a
                  key={item.text}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors duration-200 ${
                    activePage === item.page
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>

            <div className="mt-auto p-4 border-t border-light-border dark:border-dark-border space-y-4">
               <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Profile'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10">
                    {React.cloneElement(ICONS.profile, { className: `${ICONS.profile.props.className} text-xl`})} <span>My Profile</span>
                </a>
                <a href="#" onClick={handleLogoutClick} className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10">
                    {React.cloneElement(ICONS.logout, { className: `${ICONS.logout.props.className} text-xl`})} <span>Logout</span>
                </a>
              <div className="flex justify-between items-center px-4 py-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;