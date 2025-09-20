import React from 'react';
import StatCard from './StatCard';
import WelcomeBanner from './WelcomeBanner';
import RecentActivity from './RecentActivity';
import Announcements from './Announcements';
import { ActivityRequest } from '../../types';
import { ICONS } from '../../constants';
import { useAppContext } from '../../hooks/useAppContext';
import WeatherEffects from '../common/WeatherEffects';
import Footer from './Footer';

// Types for weather effects
type WeatherType = 'Clear' | 'Clouds' | 'Rain' | 'Stormy' | 'Off';
type TimeOfDay = 'day' | 'night';

// A smaller, dedicated card to showcase a single weather effect
const WeatherShowcaseCard: React.FC<{ weather: WeatherType; timeOfDay: TimeOfDay; title: string; onClick: () => void; isActive: boolean; }> = ({ weather, timeOfDay, title, onClick, isActive }) => {
  return (
    <button 
      onClick={onClick} 
      className={`relative text-left w-full rounded-xl shadow-lg text-white overflow-hidden h-48 flex flex-col justify-end p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-dark-card' : 'ring-2 ring-transparent'} ${weather === 'Off' ? 'bg-gradient-to-r from-rss-green via-rss-cyan to-blue-500' : 'bg-dark-bg'}`}
      aria-label={`Select weather: ${title}`}
    >
        {weather !== 'Off' && (
            <>
                {/* Waving Aurora Layers */}
                <div className="absolute inset-0 z-0 mix-blend-lighten animate-aurora">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500 to-transparent"></div>
                </div>
                <div className="absolute inset-0 z-0 mix-blend-lighten animate-auroraSlow">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-transparent"></div>
                </div>
                
                {/* Night Dimmer */}
                {timeOfDay === 'night' && <div className="absolute inset-0 bg-black/40 z-0"></div>}
                
                {/* Dynamic Weather Effects */}
                <WeatherEffects weather={weather} timeOfDay={timeOfDay} />
            </>
        )}

      <div className="relative z-10 text-shadow shadow-black/50">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-90 capitalize">{weather === 'Off' ? 'Simple Gradient' : timeOfDay}</p>
      </div>
    </button>
  );
};


interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewRequest: (request: ActivityRequest) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onViewRequest }) => {
  const { activity, getActiveWeather, setActiveWeather, showWeatherShowcase, setShowWeatherShowcase, calculateNextPayday } = useAppContext();
  const pendingRequests = activity.filter(a => a.status === 'Pending');
  const { weather, timeOfDay } = getActiveWeather();
  const { date: paydayDate, daysRemaining } = calculateNextPayday();

  const paydayUnitText = daysRemaining === 0 
    ? "Today is payday!" 
    : `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining`;

  const weatherEffectsToShow: { weather: WeatherType; timeOfDay: TimeOfDay; title: string }[] = [
    { weather: 'Clear', timeOfDay: 'day', title: 'Clear Day' },
    { weather: 'Clear', timeOfDay: 'night', title: 'Starry Night' },
    { weather: 'Clouds', timeOfDay: 'day', title: 'Cloudy with Sun' },
    { weather: 'Clouds', timeOfDay: 'night', title: 'Cloudy Night' },
    { weather: 'Rain', timeOfDay: 'night', title: 'Moonlit Rain' },
    { weather: 'Stormy', timeOfDay: 'night', title: 'Stormy Night' },
    { weather: 'Off', timeOfDay: 'day', title: 'Effects Off'},
  ];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner weatherType={weather} timeOfDay={timeOfDay} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Available Leave" value="2.75" unit="days" color="green" icon={ICONS.statLeave} />
        <StatCard 
          title="Upcoming Payday" 
          value={paydayDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} 
          unit={paydayUnitText} 
          color="blue" 
          icon={ICONS.statPayday} 
        />
        <StatCard title="Pending Requests" value={String(pendingRequests.length)} unit={pendingRequests.length > 0 ? pendingRequests[0].type : 'No pending requests'} color="yellow" icon={ICONS.statRequests} />
        <StatCard title="Schedule Today" value="06:00 - 05:00" unit="Changed (Sep 16-17)" color="purple" icon={ICONS.statSchedule} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity onViewRequest={onViewRequest} />
          </div>
          <Announcements onNavigate={onNavigate} />
      </div>


      {showWeatherShowcase && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeInUp" onClick={() => setShowWeatherShowcase(false)}>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-xl w-full max-w-4xl p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => setShowWeatherShowcase(false)}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 rounded-full bg-slate-100 dark:bg-dark-bg"
                    aria-label="Close weather showcase"
                >
                    {ICONS.close}
                </button>
                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-dark-text">Weather Effects Showcase</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select an effect to see it in the welcome banner. Press 'W' to toggle this view.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weatherEffectsToShow.map(effect => (
                        <WeatherShowcaseCard 
                            key={effect.title} 
                            {...effect} 
                            isActive={weather === effect.weather && (effect.weather === 'Off' || timeOfDay === effect.timeOfDay)}
                            onClick={() => setActiveWeather({ weather: effect.weather, timeOfDay: effect.timeOfDay })}
                        />
                    ))}
                </div>
            </div>
        </div>
      )}
      
      <Footer />

    </div>
  );
};

export default Dashboard;