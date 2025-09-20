import React, { useState } from 'react';
import { RequestType, LeaveType } from '../../types';
import FileInput from '../common/FileInput';
import { useAppContext } from '../../hooks/useAppContext';
import BaseModal from './BaseModal';

interface FileLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileLeaveModal: React.FC<FileLeaveModalProps> = ({ isOpen, onClose }) => {
    const { addRequest, showAlert } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.Vacation);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const commonInputClasses = "w-full p-2.5 border rounded-md bg-slate-100 dark:bg-dark-border text-gray-800 dark:text-white border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) {
            showAlert('Please fill out all required fields.', 'Missing Information');
            return;
        }
        if (!file) {
            showAlert('A supporting document is mandatory for leave requests.', 'Attachment Required');
            return;
        }
        addRequest({
            type: RequestType.Leave,
            leaveType,
            startDate,
            endDate,
            reason,
            documentUrl: file.name,
        });
        showAlert('Leave request submitted successfully!', 'Success');
        onClose();
    };
    
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="File a Leave Request">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type of Leave</label>
                    <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className={commonInputClasses}>
                        {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className={commonInputClasses}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className={commonInputClasses}/>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Leave</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="Please provide a brief reason..." className={commonInputClasses}></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Approval Document (Mandatory)</label>
                    <FileInput id="file-upload-leave" file={file} setFile={setFile} />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" className="px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 transition-all duration-300 active:scale-95">
                        Submit Request
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default FileLeaveModal;