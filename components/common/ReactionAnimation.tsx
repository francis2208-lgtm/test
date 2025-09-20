import React, { useEffect, useMemo } from 'react';
import { ReactionType } from '../../types';
import { ICONS } from '../../constants';

// Internal Confetti component, as it's only used here.
const ConfettiParticle: React.FC<{ style: React.CSSProperties, color: string }> = ({ style, color }) => (
    <div className={`absolute w-2 h-2 animate-confetti-shoot`} style={{ ...style, backgroundColor: color, borderRadius: Math.random() > 0.5 ? '50%' : '0' }} />
);

const ConfettiExplosion = () => {
    const particles = useMemo(() => {
        const colors = ['#4DD5E1', '#59bd7b', '#fde047', '#f472b6', '#818cf8'];
        return Array.from({ length: 30 }, (_, i) => {
            const angle = Math.random() * 360;
            const distance = Math.random() * 40 + 40;
            const duration = Math.random() * 0.5 + 0.8;
            return {
                id: i,
                color: colors[i % colors.length],
                style: {
                    '--angle': `${angle}deg`,
                    '--distance': `${distance}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${Math.random() * 0.1}s`,
                } as React.CSSProperties,
            };
        });
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map(p => <ConfettiParticle key={p.id} style={p.style} color={p.color} />)}
        </div>
    );
};

interface ReactionAnimationProps {
  reaction: ReactionType;
  onAnimationEnd: () => void;
}

const ReactionAnimation: React.FC<ReactionAnimationProps> = ({ reaction, onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, reaction === 'celebrate' ? 2000 : 800);
    return () => clearTimeout(timer);
  }, [reaction, onAnimationEnd]);

  if (reaction === 'celebrate') {
    return <ConfettiExplosion />;
  }

  const iconMap: { [key in Exclude<ReactionType, 'celebrate'>]: JSX.Element } = {
    like: ICONS.like,
    support: ICONS.support,
  };

  const animationClassMap: { [key in Exclude<ReactionType, 'celebrate'>]: string } = {
    like: 'animate-like-pop text-blue-500',
    support: 'animate-heart-beat text-red-500',
  };

  const icon = iconMap[reaction as Exclude<ReactionType, 'celebrate'>];
  const animationClass = animationClassMap[reaction as Exclude<ReactionType, 'celebrate'>];
  
  if (!icon) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className={animationClass}>
        {React.cloneElement(icon, {
          className: `${icon.props.className} !text-4xl`,
        })}
      </div>
    </div>
  );
};

export default ReactionAnimation;
