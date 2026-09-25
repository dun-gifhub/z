import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface AnimatedCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  isHighScore?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  className = '',
  isHighScore = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isBouncing, setIsBouncing] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const [showHighScoreBanner, setShowHighScoreBanner] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;

    const diff = value - prevValue.current;
    if (diff > 0) {
      setDelta(diff);
      setIsBouncing(true);
      setTimeout(() => setDelta(null), 1200);
      setTimeout(() => setIsBouncing(false), 500);

      if (isHighScore) {
        setShowHighScoreBanner(true);
        setTimeout(() => setShowHighScoreBanner(false), 2000);
      }
    }

    // Number stepper animation over ~400ms
    const start = displayValue;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animateNumber);
    prevValue.current = value;
  }, [value, isHighScore]);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* High score fanfare pop-in */}
      {showHighScoreBanner && (
        <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-lg animate-bounce z-20">
          <Trophy className="w-3 h-3 text-slate-950" />
          <span>KỶ LỤC MỚI!</span>
        </div>
      )}

      {/* Floating Delta Badge (+Points) */}
      {delta !== null && (
        <div className="absolute -top-4 -right-6 font-mono font-black text-xs text-amber-300 pointer-events-none animate-[score-burst_1.2s_ease-out_forwards] z-20 flex items-center gap-0.5">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span>+{delta}</span>
        </div>
      )}

      {label && <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{label}</div>}

      <div
        className={`font-mono font-black transition-transform duration-200 ${
          isBouncing ? 'scale-125 text-amber-300 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : ''
        }`}
      >
        {prefix}
        {displayValue.toLocaleString('vi-VN')}
        {suffix}
      </div>
    </div>
  );
};
