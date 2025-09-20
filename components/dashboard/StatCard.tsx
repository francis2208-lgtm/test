import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
  // FIX: Changed type from React.ReactElement to JSX.Element.
  // The previous type `React.ReactElement` was too generic for `React.cloneElement`
  // to safely add a `className` prop. `JSX.Element` is an alias for
  // `React.ReactElement<any, any>` which resolves this type error.
  icon: JSX.Element;
}

const colorClasses = {
  green: {
    text: 'text-green-700 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconText: 'text-green-600 dark:text-green-300',
  },
  blue: {
    text: 'text-blue-700 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconText: 'text-blue-600 dark:text-blue-300',
  },
  yellow: {
    text: 'text-yellow-700 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconText: 'text-yellow-600 dark:text-yellow-300',
  },
  purple: {
    text: 'text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconText: 'text-purple-600 dark:text-purple-300',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, color, icon }) => {
  const classes = colorClasses[color];

  return (
    <div className="p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${classes.iconBg} ${classes.iconText}`}>
        {React.cloneElement(icon, { className: `${icon.props.className} text-xl` })}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-dark-text leading-tight">{value}</p>
        <p className={`text-xs font-medium ${classes.text}`}>{unit}</p>
      </div>
    </div>
  );
};

export default StatCard;
