import React, { useState } from 'react';
import { RequestType, OTType } from '../../types';
import FileInput from '../common/FileInput';
import { useAppContext } from '../../hooks/useAppContext';
import BaseModal from './BaseModal';

interface FileOTModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FileOTModal: React.FC<FileOTModalProps> = ({ isOpen, onClose }) => {
    const { addRequest, showAlert } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [otDate, setOtDate] = useState('');
    const [hours, setHours] = useState('');
    const [otType, setOtType] = useState<OTType>('Regular OT');
    const [reason, setReason] = useState('');

    const commonInputClasses = "w-full p-2.5 border rounded-md bg-slate-100 dark:bg-dark-border text-gray-800 dark:text-white border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otDate || !hours || !reason) {
            showAlert('Please fill out all required fields.', 'Missing Information');
            return;
        }
        addRequest({
            type: RequestType.Overtime,
            otDate,
            hours: Number(hours),
            otType,
            reason,
            documentUrl: file ? file.name : undefined
        });
        showAlert('Overtime request submitted successfully!', 'Success');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="File an Overtime Request">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of OT</label>
                    <input type="date" value={otDate} onChange={e => setOtDate(e.target.value)} required className={commonInputClasses}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Hours Worked</label>
                    <input type="number" value={hours} onChange={e => setHours(e.target.value)} required placeholder="e.g., 2" className={commonInputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OT Type</label>
                    <select value={otType} onChange={e => setOtType(e.target.value as OTType)} className={commonInputClasses}>
                        <option>Regular OT</option>
                        <option>Rest Day OT</option>
                        <option>Holiday OT</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="Please provide a brief reason..." className={commonInputClasses}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supporting Document</label>
                    <FileInput id="file-upload-ot" file={file} setFile={setFile} />
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

export default FileOTModal;