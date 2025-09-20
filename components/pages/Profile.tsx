import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ICONS } from '../../constants';
import { User } from '../../types';
import RoleBadge from '../common/RoleBadge';
import EditContactModal from '../modals/EditContactModal';

const InfoItem: React.FC<{icon: JSX.Element; label: string; value: string;}> = ({ icon, label, value }) => (
    <div className="bg-slate-50 dark:bg-dark-border/40 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-slate-100 dark:hover:bg-dark-border/60 hover:shadow-lg">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
            {React.cloneElement(icon, { className: `${icon.props.className} text-2xl` })}
        </div>
        <div>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
             <p className="font-semibold text-gray-800 dark:text-dark-text text-base truncate">{value}</p>
        </div>
    </div>
);

const Profile: React.FC = () => {
    const { user, updateProfile } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveProfile = (updatedUser: User) => {
        // Pass null for avatar since it's not editable in this modal
        updateProfile(updatedUser, null);
        setIsModalOpen(false);
    };

    const calculateTenure = (hireDateStr: string): string => {
        const hireDate = new Date(hireDateStr);
        if (isNaN(hireDate.getTime())) return '';
        const today = new Date();

        let years = today.getFullYear() - hireDate.getFullYear();
        let months = today.getMonth() - hireDate.getMonth();
        
        if (today.getDate() < hireDate.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years === 0 && months === 0) {
            const days = Math.floor((today.getTime() - hireDate.getTime()) / (1000 * 3600 * 24));
            if (days < 1) return '(Joined Today)';
            if (days < 30) return `(${days} day${days > 1 ? 's' : ''})`;
        }
        
        let tenureString = '';
        if (years > 0) {
            tenureString += `${years} year${years > 1 ? 's' : ''}`;
        }
        if (months > 0) {
            if (tenureString) {
                tenureString += ' and ';
            }
            tenureString += `${months} month${months > 1 ? 's' : ''}`;
        }

        if (!tenureString) return '';

        return `(${tenureString})`;
    };
    
    const tenure = calculateTenure(user.hireDate);
    
    return (
        <>
            <div className="space-y-8 animate-fadeInUp">
                {/* Top Banner (ID Card style) */}
                <div className="bg-gradient-to-r from-green-700 via-cyan-600 to-indigo-800 rounded-xl shadow-2xl p-8 md:p-10 text-white bg-[length:200%_auto] animate-background-pan">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <img src={user.avatarUrl} alt="User Avatar" className="w-48 h-48 rounded-full border-4 border-white dark:border-black shadow-lg object-cover flex-shrink-0" />
                        <div className="w-full text-center sm:text-left">
                            <div className="flex items-center gap-x-4 justify-center sm:justify-start flex-wrap">
                                <h2 className="text-5xl font-extrabold">{user.name}</h2>
                                <RoleBadge role={user.role} team={user.team} />
                            </div>
                            <p className="text-2xl font-medium mt-1">Student Support - Marker/Assessor</p>
                             <div className="mt-6 flex flex-col items-center sm:items-start gap-4">
                                <div className="inline-flex items-center gap-4 rounded-lg bg-black/20 px-4 py-2 ring-1 ring-inset ring-white/30">
                                    <div className="flex items-center gap-2">
                                        {React.cloneElement(ICONS.badge, { className: `${ICONS.badge.props.className} text-lg opacity-80` })}
                                        <span className="text-sm font-semibold">Employee ID</span>
                                    </div>
                                    <div className="w-px h-6 bg-white/30"></div>
                                    <span className="text-lg font-bold">{user.employeeId}</span>
                                </div>
                                <p className="text-base opacity-90">
                                    With Resourcestaff since {user.hireDate} {tenure && <span className="font-semibold">{tenure}</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">Professional & Contact Details</h3>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm bg-slate-700 text-white hover:bg-slate-800 dark:bg-rss-green dark:text-white dark:hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            {React.cloneElement(ICONS.profile, { className: `${ICONS.profile.props.className} text-base` })}
                            <span>Edit Contact Details</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem icon={ICONS.team} label="Team" value={user.team} />
                        <InfoItem icon={ICONS.employment} label="Client" value={user.clientName} />
                        <InfoItem icon={ICONS.status} label="Employment Status" value={user.status} />
                        <InfoItem icon={ICONS.email} label="Email Address" value={user.email} />
                        <InfoItem icon={ICONS.phone} label="Phone Number" value={user.phone} />
                    </div>
                </div>
            </div>

            <EditContactModal user={user} isOpen={isModalOpen} onSave={handleSaveProfile} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Profile;