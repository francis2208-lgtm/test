import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const TimeLog: React.FC = () => {
  const { timeLog, handleClockEvent } = useAppContext();
  const { timeIn, timeOut } = timeLog;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeParts = (date: Date | null, withSeconds = false) => {
    if (!date) {
      const placeholder = withSeconds ? '--:--:--' : '--:--';
      return { time: placeholder, ampm: '--' };
    }
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    if (withSeconds) {
      options.second = '2-digit';
    }
    const timeString = date.toLocaleTimeString('en-US', options);
    const [time, ampm] = timeString.split(' ');
    return { time, ampm };
  };

  const calculateDuration = () => {
    if (!timeIn) return '0h 0m 0s';
    const end = timeOut || new Date();
    const diffMs = end.getTime() - timeIn.getTime();
    if (diffMs < 0) return '0h 0m 0s'; // Sanity check

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const isClockedIn = timeIn && !timeOut;
  const isCycleComplete = !!(timeIn && timeOut);
  
  const mainTimeParts = formatTimeParts(currentTime, true);
  const timeInParts = formatTimeParts(timeIn);
  const timeOutParts = formatTimeParts(timeOut);

  return (
    <div className="h-full flex flex-col justify-between text-white">
      <div className="text-center text-shadow-lg shadow-black/50">
        <div className="flex items-baseline justify-center">
            <p className="text-6xl font-bold font-sans tracking-tight">{mainTimeParts.time}</p>
            <p className="text-2xl font-semibold font-sans ml-2">{mainTimeParts.ampm}</p>
        </div>
        <p className="text-sm opacity-80">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="my-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="backdrop-blur-sm bg-black/20 p-3 rounded-lg border border-white/10">
            <p className="text-xs font-semibold opacity-80 tracking-widest">TIME IN</p>
            <p className="text-2xl font-bold font-sans">
                {timeInParts.time}
                <span className="text-base ml-1 font-sans font-medium">{timeInParts.ampm}</span>
            </p>
          </div>
          <div className="backdrop-blur-sm bg-black/20 p-3 rounded-lg border border-white/10">
            <p className="text-xs font-semibold opacity-80 tracking-widest">TIME OUT</p>
            <p className="text-2xl font-bold font-sans">
                {timeOutParts.time}
                <span className="text-base ml-1 font-sans font-medium">{timeOutParts.ampm}</span>
            </p>
          </div>
        </div>
        
        {timeIn && (
          <div className="text-center backdrop-blur-sm bg-black/20 py-1 px-3 rounded-lg border border-white/10">
              <p className="text-xs font-semibold opacity-80 tracking-widest">WORK DURATION</p>
              <p className={`text-lg font-bold font-sans text-cyan-300 ${isClockedIn ? 'animate-pulse' : ''}`}>{calculateDuration()}</p>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleClockEvent}
          disabled={isCycleComplete}
          className={`w-full py-4 px-4 font-bold text-lg rounded-lg shadow-md transition-all duration-300 transform active:scale-95 hover:-translate-y-1 backdrop-blur-md border ${
            isCycleComplete
              ? 'bg-gray-500/20 border-gray-500/30 cursor-not-allowed'
              : isClockedIn
                ? 'bg-orange-500/30 hover:bg-orange-500/40 border-orange-400/50 text-orange-100'
                : 'bg-primary/20 hover:bg-primary/30 border-primary/40'
          }`}
        >
          {isCycleComplete ? 'Day Complete' : isClockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>
    </div>
  );
};

export default TimeLog;