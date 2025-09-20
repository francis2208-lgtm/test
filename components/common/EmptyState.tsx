import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <div className="text-center p-12 bg-slate-50 dark:bg-dark-border/20 rounded-xl border-2 border-dashed border-light-border dark:border-dark-border/50">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-200 dark:bg-dark-border/50 rounded-full text-primary animate-subtlePulse">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-dark-text">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
