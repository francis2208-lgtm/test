import React, { useState, useEffect } from 'react';
import TimeLog from './TimeLog';
import { useAppContext } from '../../hooks/useAppContext';
import WeatherEffects from '../common/WeatherEffects';

type WeatherType = 'Clear' | 'Clouds' | 'Rain' | 'Stormy';
type TimeOfDay = 'day' | 'night';

const getWeatherForecast = (weather: WeatherType | 'Off', timeOfDay: TimeOfDay): string => {
    if (weather === 'Off') {
        return "Have a productive and wonderful day.";
    }
    if (timeOfDay === 'night') {
        if (weather === 'Clear') return "A clear, starry night. Perfect for stargazing. Low of 13°C.";
        if (weather === 'Rain') return "Rain is expected overnight. Stay dry! Low of 11°C.";
        if (weather === 'Stormy') return "Thunderstorms possible tonight. Stay safe. Low of 10°C.";
        return "A calm, cloudy night. Low of 12°C.";
    } else {
        if (weather === 'Clear') return "Sunny and beautiful. A great day to make an impact. High of 26°C.";
        if (weather === 'Clouds') return "Partly cloudy skies today. High of 24°C.";
        if (weather === 'Rain') return "Showers expected this afternoon. Don't forget an umbrella! High of 21°C.";
        return "Storms are brewing. Be prepared for changing conditions. High of 20°C.";
    }
};

interface WelcomeBannerProps {
    weatherType: WeatherType | 'Off';
    timeOfDay: TimeOfDay;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ weatherType, timeOfDay }) => {
  const { user } = useAppContext();
  const [melbourneTime, setMelbourneTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString('en-AU', {
        timeZone: 'Australia/Melbourne',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setMelbourneTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const weatherForecast = getWeatherForecast(weatherType, timeOfDay);

  return (
    <div className={`relative rounded-xl shadow-2xl shadow-black/30 text-white overflow-hidden ${weatherType === 'Off' ? 'bg-gradient-to-r from-rss-green via-rss-cyan to-blue-500' : 'bg-dark-bg'}`}>
      {weatherType !== 'Off' && (
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
          <WeatherEffects weather={weatherType} timeOfDay={timeOfDay} />
        </>
      )}


      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 flex flex-col text-shadow shadow-black/50">
          <div className="flex-grow flex flex-col justify-center">
            <div>
              <h2 className="text-5xl font-semibold tracking-tight">
                {getGreeting()}, {user.name.split(' ')[0]}!
              </h2>
              <p className="mt-2 text-lg opacity-90">
                {weatherForecast}
              </p>
              <p className="mt-1 text-sm opacity-80">
                Ready to make an impact today?
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="opacity-80">Client:</span>
                  <span className="font-medium">{user.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="opacity-80">Melbourne AU:</span>
                  <span className="font-medium font-sans">{melbourneTime}</span>
              </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <TimeLog />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;