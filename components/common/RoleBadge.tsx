import React from 'react';
import { User } from '../../types';
import { ICONS } from '../../constants';

interface RoleBadgeProps {
  role: User['role'];
  team: User['team'];
  size?: 'sm' | 'md';
}

const getRoleInfo = (role: User['role'], team: User['team']) => {
  const teamLowerCase = team.toLowerCase();
  if (role === 'Super Admin') {
      return { text: 'Super Admin', colorClasses: 'bg-yellow-400 text-yellow-900' };
  }
  if (role === 'Supervisor' || teamLowerCase.includes('supervisor')) {
    return { text: 'Supervisor', colorClasses: 'bg-purple-400 text-purple-900' };
  }
  if (role === 'HR/Admin' || teamLowerCase.includes('hr') || teamLowerCase.includes('admin')) {
    return { text: 'Admin', colorClasses: 'bg-red-400 text-red-900' };
  }
  if (teamLowerCase.includes('team leader')) {
    return { text: 'Team Leader', colorClasses: 'bg-black/70 backdrop-blur-sm text-white shadow-lg shadow-black/30 ring-1 ring-inset ring-white/20' };
  }
  return null;
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, team, size = 'md' }) => {
  const roleInfo = getRoleInfo(role, team);

  if (!roleInfo) {
    return null;
  }

  const isAchievement = roleInfo.text === 'Team Leader';

  if (isAchievement) {
    return (
        <div className={`inline-flex items-center gap-x-2 rounded-lg font-bold transition-all hover:brightness-110 ${roleInfo.colorClasses} ${size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}>
            {React.cloneElement(ICONS.premium_badge, { className: `${ICONS.premium_badge.props.className} text-base` })}
            <span>{roleInfo.text}</span>
        </div>
    );
  }

  // Fallback for other roles if needed
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px]' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-block font-semibold rounded-full ring-1 ring-inset whitespace-nowrap ${sizeClasses} ${roleInfo.colorClasses}`}>
      {roleInfo.text}
    </span>
  );
};

export default RoleBadge;