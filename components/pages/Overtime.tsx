import React, { useState } from 'react';
import { ActivityRequest, RequestType } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { STATUS_COLORS, ICONS } from '../../constants';
import FileOTModal from '../modals/FileOTModal';

interface OvertimeProps {
  onViewRequest: (request: ActivityRequest) => void;
}

const OvertimeHistory: React.FC<OvertimeProps> = ({ onViewRequest }) => {
    const { activity } = useAppContext();
    const overtimeRequests = activity.filter(item => item.type === RequestType.Overtime);

    return (
        <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text">History</h2>
            <div className="space-y-2">
                {overtimeRequests.length > 0 ? (
                overtimeRequests.map((item: ActivityRequest) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/50 transition-colors">
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-dark-text">{item.otType || item.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date Filed: {item.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLORS[item.status]}`}>
                        {item.status}
                        </span>
                        <button onClick={() => onViewRequest(item)} className="text-sm font-medium text-primary hover:underline">View</button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 text-center">You have no overtime history.</p>
                )}
            </div>
        </div>
    );
}

const Overtime: React.FC<OvertimeProps> = ({ onViewRequest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { checkAndRemindToClockIn } = useAppContext();

    const handleOpenModal = () => {
        if (checkAndRemindToClockIn()) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className="p-4 sm:p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                     <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">{ICONS.overtime}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Overtime Requests</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Submit and track your overtime hours.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleOpenModal}
                        className="mt-4 sm:mt-0 flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all"
                    >
                        {ICONS.overtime}<span>File New OT</span>
                    </button>
                </div>
            </div>
            
            <OvertimeHistory onViewRequest={onViewRequest} />

            <FileOTModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Overtime;