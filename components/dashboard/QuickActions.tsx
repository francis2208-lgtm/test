import React from 'react';
import { ICONS } from '../../constants';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

interface ActionListItemProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionListItem: React.FC<ActionListItemProps> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center p-3 -mx-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-200 w-full text-left group"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
      {icon}
    </div>
    <div className="ml-4 flex-grow">
      <p className="font-bold text-gray-800 dark:text-dark-text">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
  </button>
);


const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      page: "Overtime",
      icon: ICONS.overtime,
      title: "File Overtime",
      description: "Submit your OT hours for approval."
    },
    {
      page: "Leave",
      icon: ICONS.leave,
      title: "File Leave",
      description: "Request for vacation or sick leave."
    },
    {
      page: "Request Time Adjustment",
      icon: ICONS.timeAdjustment,
      title: "Adjust Time",
      description: "Correct a missed clock in or out."
    }
  ];

  return (
    <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 h-full">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-shadow dark:shadow-black/50 dark:text-white">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map(action => (
          <ActionListItem
            key={action.page}
            icon={action.icon}
            title={action.title}
            description={action.description}
            onClick={() => onNavigate(action.page)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
