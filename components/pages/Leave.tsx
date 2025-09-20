import React, { useState } from 'react';
import { ActivityRequest, RequestType, LeaveType } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { STATUS_COLORS, ICONS } from '../../constants';
import FileLeaveModal from '../modals/FileLeaveModal';

// --- LeaveHistory Component ---
interface LeaveHistoryProps {
  onViewRequest: (request: ActivityRequest) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onViewRequest }) => {
    const { activity } = useAppContext();
    const leaveRequests = activity.filter(item => item.type === RequestType.Leave);

    return(
        <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-dark-text">Leave History</h2>
            <div className="space-y-2">
                {leaveRequests.length > 0 ? (
                leaveRequests.map((item: ActivityRequest) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/50 transition-colors">
                    <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-dark-text">{item.leaveType || item.type}</p>
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
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 text-center">You have no leave history.</p>
                )}
            </div>
        </div>
    );
}

// --- LeaveCredits Component ---
interface LeaveBalance {
    type: LeaveType;
    balance: number;
    icon: keyof typeof ICONS;
    color: 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'slate';
    colorHex: string;
}

const leaveBalances: LeaveBalance[] = [
    { type: LeaveType.Sick, balance: 5.5, icon: 'sick', color: 'blue', colorHex: '#3b82f6' },
    { type: LeaveType.Vacation, balance: 2.8, icon: 'vacation', color: 'green', colorHex: '#22c55e' },
    { type: LeaveType.Paternity, balance: 7.0, icon: 'paternity', color: 'purple', colorHex: '#a855f7' },
    { type: LeaveType.Maternity, balance: 90.0, icon: 'maternity', color: 'pink', colorHex: '#ec4899' },
    { type: LeaveType.SoloParent, balance: 3.0, icon: 'soloParent', color: 'orange', colorHex: '#f97316' },
    { type: LeaveType.Bereavement, balance: 2.0, icon: 'bereavement', color: 'slate', colorHex: '#475569' },
];

const colorClasses = {
  blue: { bg: 'bg-blue-500' },
  green: { bg: 'bg-green-500' },
  purple: { bg: 'bg-purple-500' },
  pink: { bg: 'bg-pink-500' },
  orange: { bg: 'bg-orange-500' },
  slate: { bg: 'bg-slate-600' },
};

const LeaveCreditCard: React.FC<LeaveBalance> = ({ type, balance, icon, color, colorHex }) => {
    const classes = colorClasses[color];
    const iconEl = ICONS[icon];

    return (
        <div className="p-6 bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${classes.bg} opacity-10 dark:opacity-20 blur-2xl`}></div>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${classes.bg} text-white shadow-lg`} style={{boxShadow: `0 8px 20px -5px ${colorHex}`}}>
                {/* FIX: The `as React.ReactElement` cast caused a type error. Removing it and
                correctly merging the className props fixes the type issue and a bug where
                the icon's base class was being overwritten, preventing it from rendering. */}
                {React.cloneElement(iconEl, { className: `${iconEl.props.className} text-3xl` })}
            </div>
            <p className="font-semibold text-gray-800 dark:text-dark-text">{type}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-dark-text mt-1">{balance.toFixed(1)} <span className="text-base font-medium text-gray-500 dark:text-gray-400">days</span></p>
        </div>
    );
};

const LeaveCredits: React.FC = () => {
    const totalAvailable = leaveBalances.reduce((sum, item) => sum + item.balance, 0);

    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden">
            <div className="p-6 bg-slate-50 dark:bg-dark-bg/50 border-b border-light-border dark:border-dark-border flex justify-between items-start flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-300 flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Leave Credits 2025</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your available leave balances</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-bg p-3 rounded-lg text-center shadow-md border border-light-border dark:border-dark-border flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Available</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{totalAvailable.toFixed(1)} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">days</span></p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {leaveBalances.map(leave => (
                        <LeaveCreditCard key={leave.type} {...leave} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main Leave Page Component ---
interface LeaveProps {
  onViewRequest: (request: ActivityRequest) => void;
}

const Leave: React.FC<LeaveProps> = ({ onViewRequest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { checkAndRemindToClockIn } = useAppContext();

    const handleOpenFileLeaveModal = () => {
        if (checkAndRemindToClockIn()) {
            setIsModalOpen(true);
        }
    };

  return (
    <>
        <div className="p-4 sm:p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                 <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">{ICONS.leave}</div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Leave Management</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review your leave credits and submit new requests.</p>
                    </div>
                </div>
                <button 
                    onClick={handleOpenFileLeaveModal}
                    className="mt-4 sm:mt-0 flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all"
                >
                    {ICONS.leave}<span>File New Leave</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <LeaveCredits />
            </div>
            <div className="lg:col-span-1">
                <LeaveHistory onViewRequest={onViewRequest} />
            </div>
        </div>

        <FileLeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Leave;