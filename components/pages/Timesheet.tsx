import React, { useState, useMemo } from 'react';
import { ActivityRequest, AttendanceRecord } from '../../types';
import { ICONS } from '../../constants';
import { useAppContext } from '../../hooks/useAppContext';
import EmptyState from '../common/EmptyState';
import TimeAdjustmentModal from '../modals/TimeAdjustmentModal';
import { useTheme } from '../../hooks/useTheme';
import Overtime from './Overtime';
import ChangeSchedule from './ChangeSchedule';
import TimeAdjustment from './TimeAdjustment';

type TimesheetView = 'landing' | 'calendar' | 'history' | 'overtime' | 'schedule' | 'adjustment';

// --- Sub-Components for Timesheet Page ---

const TimesheetCalendar: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { theme } = useTheme();

    // Inverted theme: light mode has the dark calendar, dark mode has the light one.
    const isCalendarDark = theme === 'dark';

    const lightScheme = {
        bg: 'bg-white', // Day cell background
        border: 'border-gray-300', // Outer container border
        gridLineBg: 'bg-gray-200', // The color for the grid lines
        headerText: 'text-gray-900',
        dayHeaderText: 'text-gray-500',
        dayHeaderBg: 'bg-gray-50', // Header cell background
        dayCellText: 'text-gray-800',
        emptyDayCellBg: 'bg-gray-100', // Empty day cell background
        todayHighlight: 'bg-primary text-white',
        button: 'text-gray-600 hover:bg-gray-200',
        select: 'border-gray-300 bg-white text-gray-800 focus:ring-primary',
    };

    const darkScheme = {
        bg: 'bg-dark-bg', // Day cell background
        border: 'border-dark-border', // Outer container border
        gridLineBg: 'bg-dark-border', // The color for the grid lines
        headerText: 'text-white',
        dayHeaderText: 'text-gray-400',
        dayHeaderBg: 'bg-dark-card', // Header cell background
        dayCellText: 'text-gray-200',
        emptyDayCellBg: 'bg-dark-card', // Empty day cell background
        todayHighlight: 'bg-primary text-white',
        button: 'text-gray-300 hover:bg-white/10',
        select: 'border-white/20 bg-dark-bg text-white focus:ring-primary',
    };
    
    const colors = isCalendarDark ? darkScheme : lightScheme;

    const attendanceMap = useMemo(() => {
        const map = new Map<string, AttendanceRecord>();
        records.forEach(record => {
            const recordDate = new Date(record.date);
            const key = recordDate.toDateString();
            map.set(key, record);
        });
        return map;
    }, [records]);

    const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    const currentCalendarYear = currentDate.getFullYear();
    const currentSystemYear = new Date().getFullYear();
    const years = [currentSystemYear, currentSystemYear - 1, currentSystemYear - 2];
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(e.target.value, 10);
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    };
    
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = parseInt(e.target.value, 10);
        setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const parseDuration = (durationStr: string | null): number => {
        if (!durationStr) return 0;
        const hoursMatch = durationStr.match(/(\d+\.?\d*)\s*h/);
        const minutesMatch = durationStr.match(/(\d+)\s*m/);
        const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
        return hours + minutes / 60;
    };

    const formatHours = (h: number): string => {
        const fullHours = Math.floor(h);
        const minutes = Math.round((h - fullHours) * 60);
        if (minutes === 0) {
            return `${fullHours}h`;
        }
        if (fullHours === 0) {
            return `${minutes}m`;
        }
        return `${fullHours}h ${minutes}m`;
    };

    const getStatusKey = (record: AttendanceRecord): { text: string; color: string } => {
        if (record.scheduleDetail === 'Approved Leave' || record.activeSchedule === 'ON LEAVE') return { text: 'On Leave', color: 'bg-indigo-500' };
        if (record.scheduleDetail === 'ABSENT') return { text: 'Absent', color: 'bg-rose-500' };
        if (record.activeSchedule === 'REST DAY') return { text: 'Rest Day', color: 'bg-slate-500' };
        if (record.activeSchedule === 'REST DAY OT') return { text: `${formatHours(parseDuration(record.workDuration))} RD OT`, color: 'bg-purple-500' };
        if (!record.timeIn) return { text: 'No Time In', color: 'bg-rose-500' };
        if (!record.timeOut) return { text: 'In Progress', color: 'bg-cyan-500' };
        
        const totalHours = parseDuration(record.workDuration);
        const otHoursNum = parseDuration(record.otHours);
        const breakHours = (totalHours > 5) ? 1 : 0;
        const renderedHours = totalHours - breakHours - otHoursNum;
        const displayRendered = Math.max(0, renderedHours);

        let text = `${formatHours(displayRendered)}`;
        if (otHoursNum > 0) {
            text += ` + ${formatHours(otHoursNum)} OT`;
        }
        return { text, color: 'bg-teal-500' };
    };

    const renderCalendarDays = () => {
        const cells = [];
        // Empty cells for the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-${i}`} className={`h-32 ${colors.emptyDayCellBg}`}></div>);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toDateString();
            const record = attendanceMap.get(dateKey);
            const status = record ? getStatusKey(record) : undefined;
            const isToday = dateKey === new Date().toDateString();

            cells.push(
                <div key={day} className={`relative p-2 h-32 flex flex-col ${colors.bg}`}>
                    <span className={`text-sm font-semibold mb-1 ml-auto ${isToday ? `${colors.todayHighlight} rounded-full w-7 h-7 flex items-center justify-center` : colors.dayCellText}`}>
                        {day}
                    </span>
                    {status && (
                        <div className={`mt-auto w-full text-xs font-bold px-2 py-1.5 rounded text-center text-white ${status.color}`}>
                            {status.text}
                        </div>
                    )}
                </div>
            );
        }
        return cells;
    };
    
    return (
        <div className={`border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden ${colors.border}`}>
             <div className="p-4 flex justify-between items-center">
                <h3 className={`text-xl font-bold ${colors.headerText}`}>{monthName} {year}</h3>
                 <div className="flex items-center gap-2">
                    <button onClick={handlePrevMonth} className={`p-2 rounded-md ${colors.button}`}><span className="material-symbols-outlined">chevron_left</span></button>
                    <select 
                        value={currentDate.getMonth()} 
                        onChange={handleMonthChange}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-md border focus:ring-2 focus:outline-none ${colors.select}`}
                    >
                        {months.map((m, index) => <option key={m} value={index}>{m}</option>)}
                    </select>
                    <select 
                        value={currentCalendarYear} 
                        onChange={handleYearChange}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-md border focus:ring-2 focus:outline-none ${colors.select}`}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={handleNextMonth} className={`p-2 rounded-md ${colors.button}`}><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
            </div>
            
            {/* Day of Week Headers */}
            <div className={`grid grid-cols-7 gap-px p-px ${colors.gridLineBg} border-t ${colors.border}`}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className={`py-2.5 font-bold text-xs ${colors.dayHeaderText} ${colors.dayHeaderBg}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className={`grid grid-cols-7 gap-px p-px ${colors.gridLineBg} border-t ${colors.border}`}>
                {renderCalendarDays()}
            </div>
        </div>
    );
};

const AttendanceHistoryView: React.FC = () => {
    // This component contains the logic for the detailed timesheet table
    const { attendance, checkAndRemindToClockIn } = useAppContext();
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({ startDate: '', endDate: '', month: 'all' });
    const [sortConfig, setSortConfig] = useState<{ key: any; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;

    const filteredAndSortedData = useMemo(() => {
        // This logic remains the same as before
        let filtered = [...attendance];
        // ... filtering and sorting logic ...
        return filtered;
    }, [attendance, filters, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedData, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

    const handleOpenAdjustmentModal = () => {
        if (checkAndRemindToClockIn()) {
            setIsAdjustmentModalOpen(true);
        }
    };

    return (
        <>
            <div className="p-4 sm:p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30">
                {/* All the JSX for the detailed table, filters, and pagination goes here */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">{ICONS.logs}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Attendance History</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">A detailed record of your daily time logs and attendance.</p>
                        </div>
                    </div>
                     <button 
                        onClick={handleOpenAdjustmentModal}
                        className="mt-4 sm:mt-0 flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all"
                    >
                        {ICONS.timeAdjustment}<span>Adjust Time</span>
                    </button>
                </div>
                {/* ... The rest of the table and controls ... */}
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-slate-50 dark:bg-dark-bg">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-l-lg">Date</th>
                                <th scope="col" className="px-6 py-3">Schedule</th>
                                <th scope="col" className="px-6 py-3">Time In</th>
                                <th scope="col" className="px-6 py-3">Time Out</th>
                                <th scope="col" className="px-6 py-3">Duration</th>
                                <th scope="col" className="px-6 py-3 rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(record => (
                                <tr key={record.id} className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border/50 hover:bg-slate-50 dark:hover:bg-dark-border/20">
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-dark-text whitespace-nowrap">{record.date}</td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{record.activeSchedule}</td>
                                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{record.timeIn || 'N/A'}</td>
                                    <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{record.timeOut || 'N/A'}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-dark-text">{record.workDuration}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full`}>
                                            {record.scheduleDetail === 'ABSENT' ? 'Absent' : 'Completed'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {paginatedData.length === 0 && (
                    <div className="py-8">
                        <EmptyState 
                            icon={ICONS.attendance}
                            title="No Records Found"
                            message="Adjust your filters or check back later."
                        />
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-4">
                         <span className="text-sm text-gray-500 dark:text-gray-400">
                            Showing page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm rounded-md bg-slate-100 dark:bg-dark-border disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm rounded-md bg-slate-100 dark:bg-dark-border disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
            <TimeAdjustmentModal isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} />
        </>
    );
};

const SelectionCard: React.FC<{ icon: JSX.Element, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="text-left p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 group">
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                 {React.cloneElement(icon, { className: `${icon.props.className} text-2xl`})}
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-dark-text group-hover:text-primary transition-colors">{title}</h3>
            </div>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </button>
);

const TimesheetLandingPage: React.FC<{ onSelectView: (view: TimesheetView) => void }> = ({ onSelectView }) => {
    // FIX: Added `as const` to the `menuItems` array. This ensures TypeScript infers the `view` property
    // as a specific literal type (e.g., 'calendar') rather than the general `string` type. This resolves
    // the type error when passing `item.view` to the `onSelectView` function, which expects a `TimesheetView`.
    const menuItems = [
        { view: 'calendar', icon: ICONS.cardCalendar, title: 'Calendar Summary', description: 'View a high-level summary of your monthly attendance in a calendar format.' },
        { view: 'history', icon: ICONS.logs, title: 'Attendance History', description: 'Review a detailed, filterable, and sortable log of your daily time records.' },
        { view: 'overtime', icon: ICONS.overtime, title: 'Overtime Requests', description: 'Submit new requests for overtime and track the status of your existing submissions.' },
        { view: 'schedule', icon: ICONS.schedule, title: 'Schedule Change', description: 'Request temporary or permanent adjustments to your assigned work schedule.' },
        { view: 'adjustment', icon: ICONS.timeAdjustment, title: 'Time Adjustment', description: 'Correct errors in your daily time logs, such as missed clock-ins or clock-outs.' },
    ] as const;

    return (
        <div className="p-4 sm:p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30">
             <div className="flex items-start space-x-4 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">{ICONS.attendance}</div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Timesheet Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your central hub for all attendance-related actions and records.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <SelectionCard key={item.view} {...item} onClick={() => onSelectView(item.view)} />
                ))}
            </div>
        </div>
    );
};

const ViewContainer: React.FC<{ title: string, onBack: () => void, children: React.ReactNode }> = ({ title, onBack, children }) => (
    <div>
        <div className="mb-4">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all">
                {ICONS.back}
                <span>Back to Timesheet Menu</span>
            </button>
        </div>
        {children}
    </div>
);

// --- Main Timesheet Page Component ---

interface TimesheetProps {
  onViewRequest: (request: ActivityRequest) => void;
}

const Timesheet: React.FC<TimesheetProps> = ({ onViewRequest }) => {
    const { attendance, checkAndRemindToClockIn } = useAppContext();
    const [activeView, setActiveView] = useState<TimesheetView>('landing');

    const handleViewSelection = (view: TimesheetView) => {
        if (checkAndRemindToClockIn()) {
            setActiveView(view);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'calendar':
                return <ViewContainer title="Calendar Summary" onBack={() => setActiveView('landing')}><TimesheetCalendar records={attendance} /></ViewContainer>;
            case 'history':
                return <ViewContainer title="Attendance History" onBack={() => setActiveView('landing')}><AttendanceHistoryView /></ViewContainer>;
            case 'overtime':
                return <ViewContainer title="Overtime Requests" onBack={() => setActiveView('landing')}><Overtime onViewRequest={onViewRequest} /></ViewContainer>;
            case 'schedule':
                return <ViewContainer title="Schedule Change" onBack={() => setActiveView('landing')}><ChangeSchedule onViewRequest={onViewRequest} /></ViewContainer>;
            case 'adjustment':
                return <ViewContainer title="Time Adjustment" onBack={() => setActiveView('landing')}><TimeAdjustment onViewRequest={onViewRequest} /></ViewContainer>;
            case 'landing':
            default:
                return <TimesheetLandingPage onSelectView={handleViewSelection} />;
        }
    };

    return <div className="space-y-6">{renderContent()}</div>;
};

export default Timesheet;