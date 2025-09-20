import React, { useState, useEffect, useMemo } from 'react';
import { AttendanceRecord, RequestType, OTType } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import BaseModal from './BaseModal';

interface FileOTFromHistoryModalProps {
    record: AttendanceRecord;
    isOpen: boolean;
    onClose: () => void;
}

const FileOTFromHistoryModal: React.FC<FileOTFromHistoryModalProps> = ({ record, isOpen, onClose }) => {
    const { addRequest, showAlert } = useAppContext();
    const [otType, setOtType] = useState<OTType>('Regular OT');
    const [withLunch, setWithLunch] = useState(true);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (record.dayOfWeek === 'Saturday' || record.dayOfWeek === 'Sunday') {
            setOtType('Rest Day OT');
        } else {
            setOtType('Regular OT');
        }
    }, [record.dayOfWeek]);

    const calculatedOT = useMemo(() => {
        if (!record.timeIn || !record.timeOut) return { hours: 0, display: "N/A" };
        const timeInDate = new Date(`${record.date} ${record.timeIn}`);
        const timeOutDate = new Date(`${record.date} ${record.timeOut}`);
        const durationMs = timeOutDate.getTime() - timeInDate.getTime();
        const standardShiftMs = 9 * 60 * 60 * 1000;
        const otMs = Math.max(0, durationMs - standardShiftMs);
        const otHours = otMs / (1000 * 60 * 60);
        return {
            hours: parseFloat(otHours.toFixed(2)),
            display: `${otHours.toFixed(2)} hrs`
        };
    }, [record]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason || calculatedOT.hours <= 0) {
            showAlert('Please provide a reason and ensure calculated OT is positive.', 'Invalid Request');
            return;
        }
        addRequest({
            type: RequestType.Overtime,
            otDate: record.date,
            hours: calculatedOT.hours,
            otType,
            withLunch,
            reason
        });
        showAlert(`Overtime for ${record.date} submitted successfully!`, 'Success');
        onClose();
    };
    
    const commonInputClasses = "w-full p-2.5 border rounded-md bg-slate-100 dark:bg-dark-bg text-gray-800 dark:text-white border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none";

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={`File Overtime for ${record.date}`}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-dark-bg/50">
                <div className="text-center p-3 bg-white dark:bg-dark-card rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time In</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-dark-text">{record.timeIn || 'N/A'}</p>
                </div>
                 <div className="text-center p-3 bg-white dark:bg-dark-card rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Out</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-dark-text">{record.timeOut || 'N/A'}</p>
                </div>
                 <div className="text-center p-3 bg-white dark:bg-dark-card rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Work Duration</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-dark-text">{record.workDuration}</p>
                </div>
                <div className="text-center p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <p className="text-xs text-primary dark:text-cyan-200 font-semibold">CALCULATED OT</p>
                    <p className="font-bold text-lg text-primary dark:text-white">{calculatedOT.display}</p>
                </div>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">OT Type</label>
                    <select value={otType} onChange={e => setOtType(e.target.value as OTType)} className={commonInputClasses}>
                        <option>Regular OT</option>
                        <option>Rest Day OT</option>
                        <option>Holiday OT</option>
                    </select>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                    <label htmlFor="withLunchToggle" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                       With Lunch Break
                    </label>
                     <button
                        type="button"
                        onClick={() => setWithLunch(!withLunch)}
                        className={`${
                            withLunch ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        id="withLunchToggle"
                    >
                        <span className="sr-only">Toggle Lunch Break</span>
                        <span
                            className={`${
                            withLunch ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{withLunch ? "(Standard 1hr break assumed)" : "(No break deduction)"}</span>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Reason</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="Reason for overtime..." className={commonInputClasses}></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 text-white font-semibold rounded-lg shadow-md bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={calculatedOT.hours <= 0}>
                        Submit Request
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default FileOTFromHistoryModal;