import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span className="material-symbols-outlined">dark_mode</span>
      ) : (
        <span className="material-symbols-outlined">light_mode</span>
      )}
    </button>
  );
};

export default ThemeToggle;