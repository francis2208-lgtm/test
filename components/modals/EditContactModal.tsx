import React, { useState } from 'react';
import { User } from '../../types';
import { ICONS } from '../../constants';
import BaseModal from './BaseModal';

interface EditContactModalProps {
    user: User;
    isOpen: boolean;
    onSave: (user: User) => void;
    onClose: () => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ user, isOpen, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState<User>(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedUser);
    };
    
    const commonInputClasses = "w-full p-2.5 border rounded-md bg-slate-100 dark:bg-dark-bg text-gray-800 dark:text-white border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none";

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Contact Details">
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className={commonInputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={editedUser.phone} onChange={handleInputChange} className={commonInputClasses} />
                </div>
            </div>

            <div className="flex justify-end items-center p-5 border-t border-light-border dark:border-dark-border gap-4">
                 <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-dark-border dark:text-gray-200 dark:hover:bg-dark-border/80">Cancel</button>
                 <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-colors flex items-center gap-2">Save Changes</button>
            </div>
        </BaseModal>
    );
};

export default EditContactModal;