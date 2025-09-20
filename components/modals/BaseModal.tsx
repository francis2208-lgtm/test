import React from 'react';
import { ICONS } from '../../constants';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeInUp"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl w-full max-w-lg animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-light-border dark:border-dark-border">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close modal">
            {ICONS.close}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
