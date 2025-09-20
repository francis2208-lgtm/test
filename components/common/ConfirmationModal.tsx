import React from 'react';
import { ICONS } from '../../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, type, message, onConfirm, onCancel, title }) => {
  if (!isOpen) return null;

  const getTitle = () => {
    if (title) return title;
    return type === 'confirm' ? 'Confirmation Required' : 'Notification';
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeInUp"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl w-full max-w-md animate-fadeInUp"
      >
        <div className="flex justify-between items-center p-5 border-b border-light-border dark:border-dark-border">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{getTitle()}</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close modal">
            {ICONS.close}
          </button>
        </div>

        <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end items-center p-5 bg-slate-50 dark:bg-dark-bg/50 border-t border-light-border dark:border-dark-border rounded-b-xl gap-4">
            {type === 'confirm' && (
                <button 
                    onClick={onCancel} 
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-dark-border dark:text-gray-200 dark:hover:bg-dark-border/80"
                >
                    Cancel
                </button>
            )}
            <button 
                onClick={onConfirm} 
                className="px-5 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-colors"
            >
                {type === 'confirm' ? 'Confirm' : 'OK'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;