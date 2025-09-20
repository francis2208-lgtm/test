import React, { useState } from 'react';
import { RequestType } from '../../types';
import FileInput from '../common/FileInput';
import { useAppContext } from '../../hooks/useAppContext';
import BaseModal from './BaseModal';

interface TimeAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TimeAdjustmentModal: React.FC<TimeAdjustmentModalProps> = ({ isOpen, onClose }) => {
    const { addRequest, showAlert } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [adjustmentDate, setAdjustmentDate] = useState('');
    const [correctTimeIn, setCorrectTimeIn] = useState('');
    const [correctTimeOut, setCorrectTimeOut] = useState('');
    const [reason, setReason] = useState('');

    const commonInputClasses = "w-full p-2.5 border rounded-md bg-slate-100 dark:bg-dark-border text-gray-800 dark:text-white border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustmentDate || !correctTimeIn || !correctTimeOut || !reason) {
            showAlert('Please fill out all required fields.', 'Missing Information');
            return;
        }
        addRequest({
            type: RequestType.TimeAdjustment,
            adjustmentDate,
            correctTimeIn,
            correctTimeOut,
            reason,
            documentUrl: file ? file.name : undefined,
        });
        showAlert('Time adjustment request submitted successfully!', 'Success');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="File Time Adjustment Request">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Adjustment</label>
                    <input type="date" value={adjustmentDate} onChange={e => setAdjustmentDate(e.target.value)} required className={commonInputClasses}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Time In</label>
                        <input type="time" value={correctTimeIn} onChange={e => setCorrectTimeIn(e.target.value)} required className={commonInputClasses}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Time Out</label>
                        <input type="time" value={correctTimeOut} onChange={e => setCorrectTimeOut(e.target.value)} required className={commonInputClasses}/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Adjustment</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="e.g., Forgot to clock in/out, technical issue..." className={commonInputClasses}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proof/Supporting Document</label>
                    <FileInput id="file-upload-ta-modal" file={file} setFile={setFile} />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 transition-all duration-300 active:scale-95">
                        Submit Request
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}

export default TimeAdjustmentModal;