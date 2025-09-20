import React from 'react';

interface AnnouncementsProps {
  onNavigate: (page: string) => void;
}

const mockAnnouncements = [
    { id: 1, title: "Upcoming Holiday: National Heroes Day", date: "Aug 26, 2025" },
    { id: 2, title: "Q3 Performance Review Schedule", date: "Aug 22, 2025" },
    { id: 3, title: "New Health Insurance Partner", date: "Aug 20, 2025" },
];

const Announcements: React.FC<AnnouncementsProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-shadow dark:shadow-black/50 dark:text-white">Company Announcements</h3>
        <button onClick={() => onNavigate('News Feed')} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {mockAnnouncements.map(item => (
          <div key={item.id} className="p-3 rounded-lg bg-slate-100 dark:bg-dark-bg">
            <p className="font-semibold text-sm text-gray-800 dark:text-dark-text">{item.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;