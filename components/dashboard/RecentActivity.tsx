import React from 'react';
import { ActivityRequest } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { STATUS_COLORS } from '../../constants';

interface RecentActivityProps {
  onViewRequest: (request: ActivityRequest) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ onViewRequest }) => {
  const { activity } = useAppContext();

  return (
    <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 h-full">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-shadow dark:shadow-black/50 dark:text-white">Recent Activity</h3>
      
      <div className="space-y-0">
        {activity.slice(0, 4).map((item: ActivityRequest, index: number) => (
          <div key={item.id} className={`flex items-center justify-between p-3.5 ${index < 3 ? 'border-b border-light-border dark:border-dark-border/50' : ''}`}>
            <div>
              <p className="font-semibold text-sm text-gray-800 dark:text-white">{item.type}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLORS[item.status]}`}>
                {item.status}
              </span>
              <button onClick={() => onViewRequest(item)} className="text-sm font-medium text-primary hover:underline">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;