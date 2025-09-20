import React, { useState } from 'react';
import { ICONS } from '../../constants';

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const RssLogoIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
    <div className="flex items-center justify-center h-20 transition-all duration-300">
        <img src="/rss-logo.png" alt="RSS Logo" className={`transition-all duration-300 ${isExpanded ? 'h-10' : 'h-9'}`} />
    </div>
);

const NavItem: React.FC<{ icon: React.ReactElement<any>; text: string; active?: boolean; isExpanded: boolean; onClick?: () => void; }> = ({ icon, text, active, isExpanded, onClick }) => (
  <a 
    href="#" 
    onClick={(e) => { e.preventDefault(); onClick?.(); }} 
    className={`relative flex items-center p-3 my-1 rounded-md transition-all duration-200 group ${active ? 'bg-primary/10 dark:bg-primary/10 text-primary dark:text-white dark:shadow-lg dark:shadow-primary/20' : 'text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-white'}`}
  >
    {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full shadow-lg shadow-primary/50 animate-glow-pulse"></span>}
    {React.cloneElement(icon, { className: `${icon.props.className} transition-transform duration-200 group-hover:scale-110`})}
    <span className={`ml-4 font-semibold transition-all duration-200 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 overflow-hidden'}`}>{text}</span>
    {!isExpanded && (
        <span className="absolute left-full ml-3 w-max px-2 py-1 bg-light-card dark:bg-dark-card text-gray-800 dark:text-white text-xs rounded-md shadow-md dark:shadow-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            {text}
        </span>
    )}
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
      { icon: ICONS.dashboard, text: 'Home' },
      { icon: ICONS.news, text: 'News Feed' },
      { icon: ICONS.attendance, text: 'Attendance History' },
      { icon: ICONS.overtime, text: 'Overtime' },
      { icon: ICONS.leave, text: 'Leave' },
      { icon: ICONS.timeAdjustment, text: 'Request Time Adjustment'},
      { icon: ICONS.profile, text: 'Profile'}
    ];

    return (
        <aside 
            className={`relative flex flex-col bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border shadow-lg dark:shadow-2xl dark:shadow-black/30 transition-all duration-300 ease-in-out z-20 ${isExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <RssLogoIcon isExpanded={isExpanded} />
            <div className="h-full flex flex-col">
              <nav className="flex-1 px-3 py-4">
                {navItems.map((item) => (
                  <NavItem 
                    key={item.text}
                    icon={item.icon} 
                    text={item.text} 
                    active={activePage === item.text} 
                    isExpanded={isExpanded}
                    onClick={() => onNavigate(item.text)}
                  />
                ))}
              </nav>

              <div className="px-3 py-4 mt-auto border-t border-light-border dark:border-dark-border">
                  <NavItem 
                    icon={ICONS.logout} 
                    text="Logout" 
                    isExpanded={isExpanded} 
                    onClick={onLogout}
                  />
              </div>
            </div>
        </aside>
    );
};

export default Sidebar;