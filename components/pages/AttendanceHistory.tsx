import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../../types';
import { ICONS } from '../../constants';
import { useAppContext } from '../../hooks/useAppContext';
import EmptyState from '../common/EmptyState';
import FileOTFromHistoryModal from '../modals/FileOTFromHistoryModal';

const statusStyles: { [key in AttendanceRecord['otStatus']]: { border: string; button: string } } = {
    Eligible: { border: 'border-blue-500', button: 'bg-primary hover:brightness-110 text-white' },
    Submitted: { border: 'border-yellow-500', button: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    Expired: { border: 'border-red-500', button: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
    None: { border: 'border-slate-400', button: 'bg-slate-200 text-gray-700 dark:bg-white/10 dark:text-gray-300' },
};


const LogEntryCard: React.FC<{ record: AttendanceRecord, onFileOT: (record: AttendanceRecord) => void }> = ({ record, onFileOT }) => {
    const styles = statusStyles[record.otStatus];

    const ActionButton = () => {
        const baseClasses = "w-full text-center flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold transition-colors text-sm";
        switch (record.otStatus) {
            case 'Eligible':
                return (
                    <button onClick={() => onFileOT(record)} className={`${baseClasses} ${styles.button}`}>
                        {React.cloneElement(ICONS.otEligible, { className: `${ICONS.otEligible.props.className} text-base` })}
                        <span>File OT</span>
                    </button>
                );
            case 'Submitted':
                return (
                    <div className={`${baseClasses} ${styles.button}`}>
                        {React.cloneElement(ICONS.otSubmitted, { className: `${ICONS.otSubmitted.props.className} text-base` })}
                        <span>Submitted</span>
                    </div>
                );
            case 'Expired':
                return (
                    <div className={`${baseClasses} ${styles.button}`}>
                        {React.cloneElement(ICONS.otExpired, { className: `${ICONS.otExpired.props.className} text-base` })}
                        <span>Expired</span>
                    </div>
                );
            default:
                 return <div className={`w-full text-center px-3 py-2.5 rounded-lg font-semibold text-sm ${styles.button}`}>No OT</div>;
        }
    };

    return (
        <div className={`flex items-center bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-md dark:shadow-lg dark:shadow-black/30 my-3 border-l-4 ${styles.border} transition-shadow duration-300 dark:hover:shadow-[0_0_15px_-3px_rgba(77,213,225,0.4)]`}>
            <div className="grid grid-cols-12 items-center w-full p-3 gap-3 text-sm">
                <div className="col-span-12 sm:col-span-6 md:col-span-2 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                       <div className="w-10 h-10 bg-blue-100 dark:bg-gradient-radial dark:from-blue-500/20 dark:to-transparent rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">{ICONS.cardCalendar}</div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 dark:text-dark-text">{record.date}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{record.dayOfWeek}</p>
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-2">
                    <p className="font-semibold text-gray-800 dark:text-dark-text">{record.activeSchedule}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{record.scheduleDetail}</p>
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 flex items-center space-x-2 text-green-500 dark:text-green-300">
                    {ICONS.cardTimeIn}
                    <p className="font-sans font-semibold text-gray-700 dark:text-gray-200">{record.timeIn || '--:--:--'}</p>
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 flex items-center space-x-2 text-red-500 dark:text-red-300">
                    {ICONS.cardTimeOut}
                     <p className="font-sans font-semibold text-gray-700 dark:text-gray-200">{record.timeOut || '--:--:--'}</p>
                </div>
                 <div className="col-span-12 sm:col-span-6 md:col-span-2 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-gradient-radial dark:from-purple-500/20 dark:to-transparent rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300">{ICONS.cardDuration}</div>
                    </div>
                    <div>
                        <p className="font-bold text-base text-gray-800 dark:text-dark-text">{record.workDuration}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{record.workDurationBreakdown}</p>
                        {record.otHours && <p className="text-xs font-semibold text-green-600 dark:text-green-400">{record.otHours}</p>}
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-2 text-xs">
                   <ActionButton />
                </div>
            </div>
        </div>
    );
};

type SortKey = 'date' | 'timeIn' | 'timeOut';
type SortDirection = 'asc' | 'desc';

const AttendanceHistory: React.FC = () => {
    const { attendance } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

    const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 'All' });
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const resetFilters = () => {
        setFilters({ startDate: '', endDate: '', status: 'All' });
        setSortConfig({ key: 'date', direction: 'desc' });
        setCurrentPage(1);
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = [...attendance];

        // Date range filtering
        if (filters.startDate) {
            filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.endDate));
        }

        // Status filtering
        if (filters.status !== 'All') {
            filtered = filtered.filter(item => item.otStatus === filters.status);
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else { // timeIn or timeOut
                // Handle nulls by pushing them to the bottom
                if (!a[sortConfig.key]) return 1;
                if (!b[sortConfig.key]) return -1;
                
                const timeA = new Date(`${a.date} ${a[sortConfig.key]}`).getTime();
                const timeB = new Date(`${b.date} ${b[sortConfig.key]}`).getTime();
                return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
            }
        });

        return filtered;
    }, [attendance, filters, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedData, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

    const handleFileOT = (record: AttendanceRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const commonInputClasses = "p-2 border rounded-md bg-light-card dark:bg-dark-bg border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:outline-none text-sm";
    
    const SortableHeader: React.FC<{ sortKey: SortKey, children: React.ReactNode, className?: string }> = ({ sortKey, children, className }) => (
        <button onClick={() => handleSort(sortKey)} className={`flex items-center text-gray-600 dark:text-gray-300 font-semibold hover:text-primary transition-colors ${className}`}>
            {children}
            {sortConfig.key === sortKey && (
                <span className="ml-1">
                    {sortConfig.direction === 'asc' ? ICONS.sortAsc : ICONS.sortDesc}
                </span>
            )}
        </button>
    );

    const TableHeader = () => (
        <div className="hidden md:grid grid-cols-12 items-center w-full px-4 py-2 text-xs bg-slate-100 dark:bg-dark-bg rounded-t-lg">
            <div className="col-span-2"><SortableHeader sortKey="date">{React.cloneElement(ICONS.headerDate, {className: `${ICONS.headerDate.props.className} text-base mr-2`})} DATE & DAY</SortableHeader></div>
            <div className="col-span-2 flex items-center">{React.cloneElement(ICONS.headerSchedule, {className: `${ICONS.headerSchedule.props.className} text-base mr-2`})} ACTIVE SCHEDULE</div>
            <div className="col-span-2"><SortableHeader sortKey="timeIn">{React.cloneElement(ICONS.headerTime, {className: `${ICONS.headerTime.props.className} text-base mr-2`})} TIME IN</SortableHeader></div>
            <div className="col-span-2"><SortableHeader sortKey="timeOut">{React.cloneElement(ICONS.headerTime, {className: `${ICONS.headerTime.props.className} text-base mr-2`})} TIME OUT</SortableHeader></div>
            <div className="col-span-2 flex items-center">{React.cloneElement(ICONS.headerSchedule, {className: `${ICONS.headerSchedule.props.className} text-base mr-2`})} WORK DURATION</div>
            <div className="col-span-2 flex items-center">{React.cloneElement(ICONS.headerAction, {className: `${ICONS.headerAction.props.className} text-base mr-2`})} ACTION</div>
        </div>
    );

  return (
    <>
        <div className="p-4 sm:p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30">
            <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 bg-primary/10 dark:bg-gradient-radial dark:from-primary/20 dark:to-transparent rounded-lg text-primary">
                    {ICONS.logs}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Attendance History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Review, filter, and sort your time logs. Submit overtime requests for eligible entries.</p>
                </div>
            </div>

             <div className="flex flex-wrap gap-4 items-center mb-4 p-3 bg-slate-100 dark:bg-dark-bg rounded-lg">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">From:</label>
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className={commonInputClasses} />
                </div>
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">To:</label>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className={commonInputClasses} />
                </div>
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className={commonInputClasses}>
                        <option value="All">All</option>
                        <option value="Eligible">Eligible</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Expired">Expired</option>
                        <option value="None">None</option>
                    </select>
                </div>
                <button onClick={resetFilters} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300" aria-label="Reset filters">
                    {ICONS.reset}
                </button>
            </div>
            
            <TableHeader />
            <div>
                {paginatedData.length > 0 ? (
                    paginatedData.map(record => (
                        <LogEntryCard key={record.id} record={record} onFileOT={handleFileOT} />
                    ))
                ) : (
                    <div className="py-8">
                        <EmptyState 
                            icon={React.cloneElement(ICONS.attendance, { className: `${ICONS.attendance.props.className} text-3xl` })} 
                            title="No Records Found"
                            message="Adjust your filters or check back later."
                        />
                    </div>
                )}
            </div>

             {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-white/10 disabled:opacity-50">Prev</button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-white/10 disabled:opacity-50">Next</button>
                </div>
            )}

        </div>
        {selectedRecord && <FileOTFromHistoryModal record={selectedRecord} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  );
};

export default AttendanceHistory;
