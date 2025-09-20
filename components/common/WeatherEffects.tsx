import React, { useState, useEffect, useRef } from 'react';

type WeatherType = 'Clear' | 'Clouds' | 'Rain' | 'Stormy';
type TimeOfDay = 'day' | 'night';
type TransitionHint = 'rise' | 'set';

interface WeatherEffectsProps {
  weather: WeatherType;
  timeOfDay: TimeOfDay;
}

const RainDrop: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute top-[-50px] w-0.5 h-12 bg-gradient-to-b from-transparent to-white/30 animate-fall"
    style={style}
  />
);

const Rain: React.FC = () => {
  const drops = React.useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
        },
      })),
    [],
  );

  return (
    <div className="absolute inset-0">
      {drops.map((drop) => (
        <RainDrop key={drop.id} style={drop.style} />
      ))}
    </div>
  );
};

const Cloud: React.FC<{ style: React.CSSProperties; className?: string; isStormy: boolean; }> = ({ style, className, isStormy }) => (
    <div className={`absolute animate-drift ${className}`} style={style}>
        <div className="relative w-[250px] h-[80px] filter blur-md">
            {/* Main cloud body */}
            <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full ${isStormy ? 'bg-gradient-to-t from-slate-700/40 to-slate-800/20' : 'bg-gradient-to-t from-white/20 to-white/5'}`}></div>
            {/* Additional puffs for complexity */}
            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full ${isStormy ? 'bg-gradient-to-t from-slate-600/30 to-slate-800/20' : 'bg-gradient-to-t from-white/10 to-white/5'}`}></div>
            <div className={`absolute -top-4 -left-12 w-40 h-40 rounded-full ${isStormy ? 'bg-gradient-to-t from-slate-600/40 to-slate-800/20' : 'bg-gradient-to-t from-white/15 to-white/5'}`}></div>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${isStormy ? 'bg-gradient-to-t from-slate-600/30 to-slate-800/20' : 'bg-gradient-to-t from-white/10 to-white/5'}`}></div>
        </div>
    </div>
);


const Clouds: React.FC<{isStormy?: boolean}> = ({ isStormy = false }) => {
  const cloudLayers = React.useMemo(() => [
    // Far background layer (slower, smaller, more transparent)
    { style: { top: '10%', transform: 'scale(0.5)', animationDuration: '120s', left: '-250px', opacity: 0.6 } },
    { style: { top: '25%', transform: 'scale(0.4)', animationDuration: '150s', animationDelay: '-30s', right: '-250px', opacity: 0.5 } },
    
    // Mid-ground layer
    { style: { top: '5%', transform: 'scale(0.7)', animationDuration: '90s', animationDelay: '-10s', left: '10%' } },
    { style: { top: '30%', transform: 'scale(0.6)', animationDuration: '100s', animationDelay: '-50s', left: '60%' } },
    { style: { top: '50%', transform: 'scale(0.8)', animationDuration: '80s', animationDelay: '-70s', left: '5%' } },
    
    // Near background layer
    { style: { bottom: '20%', transform: 'scale(0.9)', animationDuration: '70s', animationDelay: '-20s', right: '50%' } },
    { style: { bottom: '5%', transform: 'scale(0.8)', animationDuration: '75s', animationDelay: '-40s', left: '-200px' } },
    
    // Foreground layer (faster, larger, less transparent)
    { style: { top: '40%', transform: 'scale(1)', animationDuration: '60s', animationDelay: '-5s', left: '20%' } },
    { style: { top: '60%', transform: 'scale(1.1)', animationDuration: '55s', animationDelay: '-25s', right: '10%', opacity: 0.9 } },
    { style: { bottom: '-10%', transform: 'scale(1.2)', animationDuration: '50s', animationDelay: '-15s', left: '40%', opacity: 0.8 } },
  ], []);

  return (
    <>
      {cloudLayers.map((layer, index) => (
        <Cloud key={index} style={layer.style} isStormy={isStormy} />
      ))}
    </>
  );
};

const Lightning: React.FC = () => (
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 animate-lightning z-20 pointer-events-none"></div>
);

const Sun: React.FC<{ animationClass?: string }> = ({ animationClass }) => (
    <div className={`absolute top-[-5%] left-[10%] w-48 h-48 animate-weatherPulse ${animationClass || ''}`}>
        {/* Sun Rays / Lens Flare */}
        <div className="absolute inset-0 animate-spin">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-200/0 via-yellow-200/80 to-yellow-200/0"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-200/0 via-yellow-200/80 to-yellow-200/0 transform rotate-45"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-200/0 via-yellow-200/80 to-yellow-200/0 transform rotate-90"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-200/0 via-yellow-200/80 to-yellow-200/0 transform -rotate-45"></div>
        </div>
        {/* Sun Orb */}
        <div className="absolute inset-8 rounded-full bg-gradient-radial from-yellow-300 to-yellow-500 shadow-[0_0_60px_20px_rgba(252,211,77,0.7),inset_0_0_20px_0_rgba(255,255,255,0.5)]"></div>
    </div>
);

const Moon: React.FC<{ animationClass?: string }> = ({ animationClass }) => (
    <div className={`absolute top-[-5%] left-[10%] w-32 h-32 animate-weatherPulse ${animationClass || ''}`}>
        {/* Waning Crescent Shape */}
        <div className="w-full h-full rounded-full bg-slate-200 shadow-[inset_-10px_5px_0_0_rgba(255,255,255,0.9),0_0_20px_5px_rgba(240,246,252,0.3)] transform -rotate-45"></div>
    </div>
);

const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute bg-white rounded-full animate-twinkle" style={style} />
);

const Starfield: React.FC = () => {
  const stars = React.useMemo(() => Array.from({ length: 150 }, (_, i) => {
    const size = Math.random() * 1.5 + 0.5;
    return {
      id: i,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${2 + Math.random() * 6}s`,
      },
    };
  }), []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {stars.map(star => <Star key={star.id} style={star.style} />)}
    </div>
  );
};

const Meteor: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div 
        className="absolute h-[1px] w-64 animate-meteor-shower"
        style={style}
    >
        <div 
            className="w-full h-full rounded-full"
            style={{ 
                // This gradient creates a single, cohesive streak of light with a bright head that fades smoothly.
                background: 'linear-gradient(to right, white, transparent)',
                filter: 'drop-shadow(0 0 6px white)' // A glow effect for a more ethereal look.
            }}
        />
    </div>
);

const MeteorShower: React.FC = () => {
    const meteors = React.useMemo(() => Array.from({ length: 8 }, (_, i) => { // Fewer meteors for a subtler effect
        const startTop = -10 + Math.random() * 50; // Start in the upper half of the screen
        const startLeft = 100 + Math.random() * 20; // Start off-screen to the right
        const angle = 225 + (Math.random() * 20 - 10); // Angle toward bottom-left
        const travelDistance = 1500 + Math.random() * 500; // Ensure they cross the screen

        return {
            id: i,
            style: {
                top: `${startTop}%`,
                left: `${startLeft}%`,
                animationDelay: `${Math.random() * 15}s`, // More spread out
                animationDuration: `${4 + Math.random() * 4}s`, // Slower and more varied duration
                '--meteor-angle': `${angle}deg`,
                '--meteor-distance': `${travelDistance}px`,
            } as React.CSSProperties
        }
    }), []);
    return (
        <div className="absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
             {meteors.map(m => <Meteor key={m.id} style={m.style} />)}
        </div>
    );
};


const WeatherLayer: React.FC<WeatherEffectsProps & { transitionHint?: TransitionHint }> = ({ weather, timeOfDay, transitionHint }) => {
    const animationClass = transitionHint === 'rise' ? 'animate-celestialRise' : transitionHint === 'set' ? 'animate-celestialSet' : '';
    return (
        <>
            {timeOfDay === 'night' && <Starfield />}
            {(() => {
                switch (weather) {
                case 'Rain':
                    return (
                    <>
                        {timeOfDay === 'night' && <Moon animationClass={animationClass} />}
                        <Rain />
                    </>
                    );
                case 'Stormy':
                    return (
                    <>
                        <Clouds isStormy={true} />
                        <Rain />
                        <Lightning />
                    </>
                    );
                case 'Clouds':
                    return (
                    <>
                        <Clouds />
                        {timeOfDay === 'day' && <Sun animationClass={animationClass} />}
                        {timeOfDay === 'night' && (
                            <>
                                <Moon animationClass={animationClass} />
                                <MeteorShower />
                            </>
                        )}
                    </>
                    );
                case 'Clear':
                    if (timeOfDay === 'day') {
                        return <Sun animationClass={animationClass} />;
                    }
                    if (timeOfDay === 'night') {
                        return (
                          <>
                            <Moon animationClass={animationClass} />
                            <MeteorShower />
                          </>
                        );
                    }
                    return null;
                default:
                    return null;
                }
            })()}
        </>
    );
};

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weather, timeOfDay }) => {
    interface Effect {
        key: string;
        weather: WeatherType;
        timeOfDay: TimeOfDay;
        transitionHint?: TransitionHint;
    }
    
    const transitionDuration = 1500; // Corresponds to animation duration in tailwind.config
    const isInitialMount = useRef(true);

    const [effects, setEffects] = useState<Effect[]>([{ key: `${weather}-${timeOfDay}`, weather, timeOfDay }]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const oldEffect = effects[0];
        const timeOfDayChanged = oldEffect.timeOfDay !== timeOfDay;

        let incomingHint: TransitionHint | undefined;
        let outgoingHint: TransitionHint | undefined;

        if (timeOfDayChanged) {
            incomingHint = 'rise';
            outgoingHint = 'set';
        }
        
        setEffects(prevEffects => {
            const updatedOldEffect = { ...prevEffects[0], transitionHint: outgoingHint };
            const newEffect = { key: `${weather}-${timeOfDay}-${Date.now()}`, weather, timeOfDay, transitionHint: incomingHint };
            // Place new effect first, then the updated old effect.
            return [newEffect, updatedOldEffect];
        });

        const timer = setTimeout(() => {
            // After the transition, keep only the current (new) effect and clear its animation hint
            // to prevent it from re-running on a simple weather change.
            setEffects(prevEffects => {
                const finalEffect = { ...prevEffects[0], transitionHint: undefined };
                return [finalEffect];
            });
        }, transitionDuration);

        return () => clearTimeout(timer);

    }, [weather, timeOfDay]);


  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {effects.map((effect, index) => (
            <div
                key={effect.key}
                className={`absolute inset-0 ${index === 0 ? 'animate-weatherFadeIn' : 'animate-weatherFadeOut'}`}
            >
                <WeatherLayer 
                    weather={effect.weather} 
                    timeOfDay={effect.timeOfDay} 
                    transitionHint={effect.transitionHint}
                />
            </div>
        ))}
    </div>
  );
};

export default WeatherEffects;